---
title: 重试与错误处理
description: 如何应对网络超时、上游错误和并发限制。
---

## 基本策略

所有非 4xx 错误都建议重试,包括:

- `502`、`503`、`524`:上游临时不可用或网关超时
- `403 All available accounts exhausted`:并发过高,账号池耗尽
- 网络超时、连接中断

## 重试参数建议

```python
import time
import random

def call_api_with_retry(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            # 指数退避 + 随机抖动
            wait = min(2 ** attempt + random.uniform(0, 1), 10)
            time.sleep(wait)
```

**关键点:**

- **初始延迟** 1～2 秒起步
- **指数退避**,但上限设 10 秒,避免过长等待
- **随机抖动**,避免多个客户端同时重试形成雷鸣群
- **最多重试 3 次**,失败后向上层报告

## 特定场景

### 生图任务

生图耗时 13～30 秒,接近网关超时上限:

- **客户端读取超时**设为 **60 秒以上**
- 遇到 `524` 一定重试,大概率成功
- 非流式请求超过 30 秒会被网关切断

### 并发控制

同时发 6 路以上 Claude 请求可能触发 `403 All available accounts exhausted`:

- **限制并发数** ≤ 5
- 用信号量或队列控制
- 遇到 403 立即退避 5～10 秒

### 长文本任务

- **用流式**避免 30 秒非流式超时
- 客户端读取超时设为 60 秒以上
- `max_tokens` 不要设太小,推理模型建议 ≥ 256

## 不要重试的情况

- `400`:参数错误,重试无意义,检查请求格式
- `401`、`403`(非账号池耗尽):鉴权或权限问题,检查令牌
- `404`:接口不存在,检查 URL 与协议
- `429`:触发限流(如有),按 `Retry-After` 响应头等待

## 日志与监控

建议记录:

- 请求 ID(响应头 `x-request-id`,如有)
- 模型名、耗时、状态码
- 重试次数与最终结果

上游偶发错误是常态,良好的重试策略可以把成功率从 95% 提升到 99.5% 以上。
