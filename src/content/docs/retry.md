---
title: 重试与错误处理
description: 重试策略、并发控制、特定场景处理
---

# 重试与错误处理

## 推荐的重试策略

### 指数退避 + 随机抖动

```python
import time
import random
from openai import OpenAI, APIError

client = OpenAI(
    base_url="https://api.bozzii.com/v1",
    api_key="sk-uQm9LJn9rDqfvE073hMpytXHJcO4UzXE5lMjYL0gyBlgVFaa"
)

def call_api_with_retry(model, messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages
            )
            return response
        except APIError as e:
            if attempt == max_retries - 1:
                raise
            
            # 指数退避: 1s, 2s, 4s, 8s...
            base_delay = 2 ** attempt
            # 随机抖动: ±30%
            jitter = base_delay * 0.3 * (2 * random.random() - 1)
            delay = base_delay + jitter
            
            print(f"请求失败,{delay:.1f}秒后重试...")
            time.sleep(delay)

# 使用示例
response = call_api_with_retry(
    model="deepseek-v3",
    messages=[{"role": "user", "content": "你好"}]
)
```

### 按错误类型区分处理

```python
from openai import APIError, RateLimitError, APIConnectionError

def call_api_smart_retry(model, messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(
                model=model,
                messages=messages
            )
        except RateLimitError:
            # 限流错误:等待更长时间
            delay = 5 * (2 ** attempt) + random.uniform(0, 3)
            print(f"触发限流,{delay:.1f}秒后重试...")
            time.sleep(delay)
        except APIConnectionError:
            # 网络错误:快速重试
            delay = 0.5 + random.uniform(0, 0.5)
            print(f"网络错误,{delay:.1f}秒后重试...")
            time.sleep(delay)
        except APIError as e:
            # 其他错误:检查状态码
            if e.status_code in [502, 503, 504]:
                # 服务端错误:可以重试
                delay = 2 ** attempt + random.uniform(0, 1)
                time.sleep(delay)
            else:
                # 客户端错误(400, 401, 404):不重试
                raise
```

## 并发控制

### 限制并发数

```python
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(
    base_url="https://api.bozzii.com/v1",
    api_key="sk-uQm9LJn9rDqfvE073hMpytXHJcO4UzXE5lMjYL0gyBlgVFaa"
)

# 信号量限制并发数
semaphore = asyncio.Semaphore(5)  # 最多5个并发请求

async def call_with_limit(prompt):
    async with semaphore:
        response = await client.chat.completions.create(
            model="deepseek-v3",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content

# 批量处理
async def batch_process(prompts):
    tasks = [call_with_limit(p) for p in prompts]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return results

# 使用示例
prompts = ["问题1", "问题2", "问题3", "问题4", "问题5", "问题6"]
results = asyncio.run(batch_process(prompts))
```

### 速率限制

```python
from time import time, sleep

class RateLimiter:
    def __init__(self, max_requests, time_window):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
    
    def wait_if_needed(self):
        now = time()
        # 清理时间窗口外的记录
        self.requests = [t for t in self.requests if now - t < self.time_window]
        
        if len(self.requests) >= self.max_requests:
            # 需要等待
            sleep_time = self.time_window - (now - self.requests[0]) + 0.1
            print(f"达到速率限制,等待 {sleep_time:.1f} 秒...")
            sleep(sleep_time)
            self.requests.pop(0)
        
        self.requests.append(now)

# 使用示例:每分钟最多60个请求
limiter = RateLimiter(max_requests=60, time_window=60)

for prompt in prompts:
    limiter.wait_if_needed()
    response = client.chat.completions.create(
        model="deepseek-v3",
        messages=[{"role": "user", "content": prompt}]
    )
```

## 特定场景处理

### 生图请求

生图通常比文本慢(10-30秒),需要:
1. 设置更长的超时时间
2. 失败后不要立即重试(可能仍在处理)

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.bozzii.com/v1",
    api_key="sk-uQm9LJn9rDqfvE073hMpytXHJcO4UzXE5lMjYL0gyBlgVFaa",
    timeout=60.0  # 60秒超时
)

def generate_image_with_retry(prompt, max_retries=2):
    for attempt in range(max_retries):
        try:
            response = client.images.generate(
                model="gpt-image",
                prompt=prompt,
                n=1,
                size="1024x1024"
            )
            return response.data[0].url
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            # 生图失败后等待更长时间
            delay = 10 + random.uniform(0, 5)
            print(f"生图失败,{delay:.1f}秒后重试...")
            time.sleep(delay)
```

### 长文本输入

输入 token 过多可能触发 `context_length_exceeded`:

```python
def count_tokens_approx(text):
    # 粗略估算:中文约1.5字/token,英文约0.75词/token
    return len(text) // 2

def truncate_context(messages, max_tokens=4000):
    # 保留系统消息和最近的对话
    system_msgs = [m for m in messages if m['role'] == 'system']
    other_msgs = [m for m in messages if m['role'] != 'system']
    
    # 从最新消息开始累计
    kept_msgs = []
    token_count = 0
    for msg in reversed(other_msgs):
        msg_tokens = count_tokens_approx(msg['content'])
        if token_count + msg_tokens > max_tokens:
            break
        kept_msgs.insert(0, msg)
        token_count += msg_tokens
    
    return system_msgs + kept_msgs

# 使用示例
safe_messages = truncate_context(long_conversation, max_tokens=3500)
response = client.chat.completions.create(
    model="deepseek-v3",
    messages=safe_messages
)
```

### 账号池耗尽

高峰期可能遇到 `"无可用渠道"` 错误:

```python
def call_with_fallback(messages, models=["deepseek-v3", "glm-4-flashx"]):
    for model in models:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages
            )
            return response
        except APIError as e:
            if "无可用渠道" in str(e) and model != models[-1]:
                print(f"{model} 不可用,尝试 {models[models.index(model)+1]}")
                continue
            raise
```

## 错误日志记录

```python
import logging
from datetime import datetime

logging.basicConfig(
    filename=f'api_errors_{datetime.now().strftime("%Y%m%d")}.log',
    level=logging.ERROR,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def call_with_logging(model, messages):
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages
        )
        return response
    except Exception as e:
        logging.error(f"Model: {model}, Error: {str(e)}, Messages: {messages}")
        raise
```

## 最佳实践总结

1. **默认重试 2-3 次**,使用指数退避 + 随机抖动
2. **区分错误类型**:
   - 429/502/503 → 可以重试
   - 400/401/404 → 不要重试,检查参数
3. **限制并发**:避免同时发送大量请求
4. **生图请求**:设置更长超时(60s),失败后等待更久
5. **长文本**:提前截断,避免 `context_length_exceeded`
6. **记录日志**:保存失败请求的详细信息,便于排查

## 相关文档

- [错误码说明](/guides/errors)
- [流式输出](/streaming)
- [API 完整规范](/api-specification)
