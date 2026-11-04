---
title: 快速参考
description: 最常用的接口调用示例
---

# 博子 AI API 快速参考

> 最常用的接口调用示例,可直接复制运行

## 基础信息

- **域名**: `https://api.bozzii.com`
- **令牌格式**: `sk-` 开头
- **获取令牌**: 登录后台 → API 密钥管理

---

## 快速开始

### 1. 查看可用模型

```bash
curl https://api.bozzii.com/v1/models \
  -H "Authorization: Bearer sk-你的令牌"
```

### 2. 第一次对话(推荐)

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [{"role": "user", "content": "你好"}],
    "max_tokens": 256
  }'
```

---

## 推荐模型(国产)

| 模型 ID | 特点 | 实测耗时 | 用途 |
|---|---|---|---|
| `deepseek-v4-flash` | 快速,性价比高 | 约 3～4 秒 | 日常对话 |
| `deepseek-v4.1-flash` | 带推理,速度接近 flash | 约 4 秒 | 需要简单推理的日常任务 |
| `deepseek-v4-pro` | 推理能力强 | 约 5 秒 | 复杂推理,`max_tokens` ≥ 256 |
| `glm-5.3` | 综合能力均衡,支持识图 | 约 5 秒 | 通用场景、看图 |
| `glm-5.3-flash` | 快速版本 | 约 4 秒 | 简单任务、流式对话 |

---

## 常用场景

### 普通对话

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "你是一个专业的技术顾问"},
      {"role": "user", "content": "解释一下什么是 Docker"}
    ],
    "max_tokens": 512
  }'
```

### 流式输出(打字机效果)

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-5.3-flash",
    "messages": [{"role": "user", "content": "写一篇关于 AI 的文章"}],
    "stream": true
  }'
```

### 识图(看图说话)

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-5.3",
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "这张图片里有什么?"},
        {
          "type": "image_url",
          "image_url": {
            "url": "https://example.com/image.jpg"
          }
        }
      ]
    }],
    "max_tokens": 512
  }'
```

**或使用 base64:**

```json
{
  "type": "image_url",
  "image_url": {
    "url": "data:image/png;base64,iVBORw0KGgo..."
  }
}
```

---

## Python SDK

### OpenAI SDK(推荐)

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.bozzii.com/v1",  # 要加 /v1
    api_key="sk-你的令牌"
)

response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[{"role": "user", "content": "你好"}]
)

print(response.choices[0].message.content)
```

### 流式输出

```python
stream = client.chat.completions.create(
    model="glm-5.3-flash",
    messages=[{"role": "user", "content": "写一篇关于 AI 的文章"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

### Anthropic SDK

国内模型也能走 Anthropic Messages 协议,下面用 DeepSeek 演示。Claude 系列目前只服务 Claude Code,直调会被拒绝。

```python
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.bozzii.com",  # 不加 /v1
    api_key="sk-你的令牌"
)

response = client.messages.create(
    model="deepseek-v4-flash",
    max_tokens=512,
    messages=[{"role": "user", "content": "你好"}]
)

print(response.content[0].text)
```

---

## JavaScript/Node.js

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.bozzii.com/v1',
  apiKey: 'sk-你的令牌'
});

const response = await client.chat.completions.create({
  model: 'deepseek-v4-flash',
  messages: [{role: 'user', content: '你好'}]
});

console.log(response.choices[0].message.content);
```

---

## 常见错误

### 返回 HTML 页面

**原因**: Base URL 缺 `/v1`

```bash
# ❌ 错误
curl https://api.bozzii.com/chat/completions ...

# ✅ 正确
curl https://api.bozzii.com/v1/chat/completions ...
```

### 401 无效令牌

检查:
1. 令牌是否以 `sk-` 开头
2. 是否复制完整
3. 是否过期或被删除

### 503 模型不可用

```json
{"error":{"code":"model_not_found","message":"无可用渠道"}}
```

换用其他模型,或稍后重试。

### 403 只允许 Claude Code

```json
{"error":{"message":"This group is restricted to Claude Code clients (/v1/messages only)"}}
```

Claude 系列只能通过 Claude Code 调用。改用国产模型,或按[Claude Code](/guides/claude-code/)配置。

### content 为空

推理模型(`deepseek-v4-pro`)把 token 用在了思考上:

```json
{
  "max_tokens": 512  // 建议 ≥ 256
}
```

---

## 客户端配置

### Claude Code

```bash
export ANTHROPIC_BASE_URL="https://api.bozzii.com"  # 不加 /v1
export ANTHROPIC_API_KEY="sk-你的令牌"
```

### NextChat / LobeChat

- Base URL: `https://api.bozzii.com/v1`
- API Key: `sk-你的令牌`
- 模型: `deepseek-v4-flash`

### Cherry Studio

- 接口地址: `https://api.bozzii.com/v1`
- API 密钥: `sk-你的令牌`
- 模型列表会自动拉取

---

## 限制说明

1. **超时**: 非流式约 30 秒,流式建议 60 秒以上,GPT Image 约 22～24 秒
2. **推理模型**: `max_tokens` 建议 ≥ 256,否则 `content` 可能为空
3. **海外模型**: 仅限开发测试,不可面向公众
4. **Claude 系列**: 只服务 Claude Code 客户端,curl 和 SDK 直调会返回 403/503
5. **视频**: 渠道未启用,见[视频接口说明](/guides/video/)

---

## 获取帮助

- 完整文档: https://doc.bozzii.com
- API 规范: https://doc.bozzii.com/api-specification/
- 主站: https://ai.bozzii.com

---

**提示**: 所有示例中的 `sk-你的令牌` 请替换成真实令牌
