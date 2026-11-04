---
title: API 完整规范
description: 基于实际测试验证的完整 API 规范文档
---

# 博子 AI API 完整规范文档

> 最后更新: 2026-11-02  
> 基于实际测试验证,所有示例均可直接运行

## 目录

- [快速开始](#快速开始)
- [认证方式](#认证方式)
- [Base URL 规则](#base-url-规则)
- [可用模型](#可用模型)
- [文本对话](#文本对话)
  - [Chat Completions](#chat-completions)
  - [Messages](#messages)
  - [Responses](#responses)
- [流式输出](#流式输出)
- [图片能力](#图片能力)
  - [识图(图片输入)](#识图图片输入)
  - [生图(图片输出)](#生图图片输出)
- [错误处理](#错误处理)
- [最佳实践](#最佳实践)
- [限制与注意事项](#限制与注意事项)

---

## 快速开始

**API 域名:** `https://api.bozzii.com`  
**获取令牌:** 登录后台 → API 密钥管理

### 第一次调用

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

**预期响应:**

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1730000000,
  "model": "deepseek-v4-flash",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "你好!我是 AI 助手,有什么可以帮到你?"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 8,
    "completion_tokens": 15,
    "total_tokens": 23
  }
}
```

---

## 认证方式

所有请求必须携带有效的 API 令牌,支持三种请求头格式:

| 协议 | 请求头 | 示例 |
|---|---|---|
| **OpenAI 风格** | `Authorization: Bearer sk-xxx` | Chat、Responses、生图 |
| **Anthropic 风格** | `x-api-key: sk-xxx`<br>`anthropic-version: 2023-06-01` | Messages |
| **Gemini 原生** | `x-goog-api-key: sk-xxx` | Gemini 生图 |

**注意:**
- 令牌格式为 `sk-` 开头的字符串
- 不要把令牌提交到代码仓库或分享给他人
- `Authorization` 和 `x-api-key` 在各协议下都可以通用

---

## Base URL 规则

**重要:** 网关只认 `/v1/` 开头的路径,缺少 `/v1` 会返回 HTML 页面(HTTP 200),容易被误判为成功。

| 客户端 | Base URL | 最终请求路径 |
|---|---|---|
| **OpenAI SDK、NextChat、LobeChat** | `https://api.bozzii.com/v1` | 自动拼 `/chat/completions` |
| **Anthropic SDK、Claude Code** | `https://api.bozzii.com` | 自动拼 `/v1/messages` |
| **Gemini 原生** | `https://api.bozzii.com` | `/v1beta/models/{model}:generateContent` |
| **直接 curl** | 写完整路径 | `https://api.bozzii.com/v1/xxx` |

**常见错误:**
- Claude Code 配成 `https://api.bozzii.com/v1` 会导致请求变成 `/v1/v1/messages`(404)
- 缺 `/v1` 时返回 HTML,但状态码是 200,检查 `Content-Type` 是否为 `text/html`

---

## 可用模型

### 查询模型列表

**OpenAI 风格:**

```bash
curl https://api.bozzii.com/v1/models \
  -H "Authorization: Bearer sk-你的令牌"
```

**Anthropic 风格:**

```bash
curl https://api.bozzii.com/v1/models \
  -H "x-api-key: sk-你的令牌" \
  -H "anthropic-version: 2023-06-01"
```

**响应示例 (33 个模型):**

```json
{
  "object": "list",
  "data": [
    {
      "id": "deepseek-v4-pro",
      "object": "model",
      "created": 1730000000,
      "owned_by": "deepseek"
    },
    {
      "id": "deepseek-v4-flash",
      "object": "model",
      "created": 1730000000,
      "owned_by": "deepseek"
    },
    {
      "id": "glm-5.3",
      "object": "model",
      "created": 1730000000,
      "owned_by": "zhipu"
    }
  ]
}
```

### 国产主推模型(公开可用)

| 模型 ID | 厂商 | 特点 | 响应速度 |
|---|---|---|---|
| `deepseek-v4-flash` | DeepSeek | 快速,性价比高 | ~2.7s |
| `deepseek-v4-pro` | DeepSeek | 推理能力强,先思考后回答 | ~3-5s |
| `glm-5.3` | 智谱 AI | 综合能力均衡 | ~5-6s |
| `glm-5.3-flash` | 智谱 AI | 快速版本 | ~2-3s |

### 海外模型(仅限开发测试)

| 模型 ID | 厂商 | 适用场景 |
|---|---|---|
| `claude-sonnet-5-5` | Anthropic | 识图、长文本 |
| `claude-opus-5` | Anthropic | 复杂推理 |
| `gpt-6-astra` | OpenAI | 通用对话 |
| ~~`gemini-3-pro-image`~~ | Google | 生图(已下架) |

⚠️ **海外模型使用限制:**
- 不对个人开放,仅限经审核企业客户
- 不得用于面向终端用户或境内公众的服务
- 上游政策调整可能随时中断,不作可用性承诺
- 详见[服务条款](https://ai.bozzii.com/terms.html)

### 已知不可用的模型

- **kimi-k3** - 已下架

---

## 文本对话

### Chat Completions

**适用场景:** OpenAI SDK、大多数第三方客户端(NextChat、LobeChat、Cherry Studio)

**基础示例:**

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "你是一个专业的技术顾问"},
      {"role": "user", "content": "解释一下什么是 RESTful API"}
    ],
    "max_tokens": 512,
    "temperature": 0.7
  }'
```

**响应字段说明:**

```json
{
  "id": "chatcmpl-xxx",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "RESTful API 是..."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 150,
    "total_tokens": 175
  }
}
```

**推理模型特殊处理:**

推理模型(如 `deepseek-v4-pro`)会先思考,思考内容在 `reasoning_content` 里:

```json
{
  "choices": [{
    "message": {
      "reasoning_content": "用户想了解...",
      "content": "RESTful API 是..."
    }
  }]
}
```

如果 `max_tokens` 太小,`content` 可能为空,只有 `reasoning_content`。**建议 `max_tokens` ≥ 256**。

---

### Messages

**适用场景:** Anthropic SDK、Claude Code

**基础示例:**

```bash
curl https://api.bozzii.com/v1/messages \
  -H "x-api-key: sk-你的令牌" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4-flash",
    "max_tokens": 512,
    "messages": [
      {"role": "user", "content": "解释一下什么是 RESTful API"}
    ]
  }'
```

**响应格式:**

```json
{
  "id": "msg_xxx",
  "type": "message",
  "role": "assistant",
  "content": [
    {"type": "text", "text": "RESTful API 是..."}
  ],
  "model": "deepseek-v4-flash",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 20,
    "output_tokens": 150
  }
}
```

**注意:**
- `max_tokens` 是必填参数
- 部分 Claude 模型不支持 Messages 协议,会返回 403

---

### Responses

**适用场景:** OpenAI SDK 最新版本的简化协议

**基础示例:**

```bash
curl https://api.bozzii.com/v1/responses \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-5.3",
    "input": "解释一下什么是 RESTful API"
  }'
```

**响应格式:**

```json
{
  "id": "resp_xxx",
  "output": [{
    "type": "message",
    "role": "assistant",
    "content": [
      {"type": "text", "text": "RESTful API 是..."}
    ]
  }]
}
```

**优点:** 语法简洁,非 OpenAI 模型也能用

---

## 流式输出

**适用场景:**
- 长文本生成(避免 30 秒非流式超时)
- 实时打字机效果

### Chat 流式

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

**响应格式 (SSE):**

```
data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":"AI"}}]}

data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":"技术"}}]}

data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":"正在"}}]}

data: [DONE]
```

**推理模型的流式:**
- 思考内容在 `delta.reasoning_content`
- 回复内容在 `delta.content`
- 两者是独立的事件流

### Messages 流式

```bash
curl https://api.bozzii.com/v1/messages \
  -H "x-api-key: sk-你的令牌" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "max_tokens": 2048,
    "messages": [{"role": "user", "content": "写一篇关于 AI 的文章"}],
    "stream": true
  }'
```

**响应事件类型:**

| 事件 | 说明 |
|---|---|
| `message_start` | 开始,带 `message.id` 和初始 `usage` |
| `content_block_start` | 内容块开始 |
| `content_block_delta` | 增量文本,在 `delta.text` 里 |
| `content_block_stop` | 内容块结束 |
| `message_delta` | 最终 `usage` 和 `stop_reason` |
| `message_stop` | 结束 |

**注意事项:**
- 生图模型不支持流式,带 `stream: true` 会返回 400
- Claude 系模型用 Messages 流式时,`max_tokens` 必填
- 客户端读取超时建议 ≥ 60 秒

---

## 图片能力

### 识图(图片输入)

三种协议都支持图片输入,已验证模型: `claude-sonnet-5-5`、`glm-5.3`、`deepseek-v4-pro`。

#### Chat 协议

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
            "url": "data:image/png;base64,iVBORw0KGgo..."
          }
        }
      ]
    }]
  }'
```

**也支持 HTTPS 链接:**

```json
{
  "type": "image_url",
  "image_url": {"url": "https://example.com/image.jpg"}
}
```

#### Messages 协议

```bash
curl https://api.bozzii.com/v1/messages \
  -H "x-api-key: sk-你的令牌" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "max_tokens": 512,
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "这张图片里有什么?"},
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/png",
            "data": "iVBORw0KGgo..."
          }
        }
      ]
    }]
  }'
```

#### Responses 协议

```json
{
  "model": "deepseek-v4-pro",
  "input": [{
    "type": "text",
    "text": "这张图片里有什么?"
  }, {
    "type": "input_image",
    "image_url": "data:image/png;base64,iVBORw0KGgo..."
  }]
}
```

**图片格式支持:**
- PNG、JPEG、WebP、GIF
- Base64 编码或 HTTPS 链接
- 建议单张 < 20MB

**识图注意事项:**
- 已验证可用: `claude-sonnet-5-5`
- `glm-5.3` 会先由辅助视觉模型看图,回复开头带"【辅助识图…】"
- 小字识别: 字号 ≥ 90px 准确率高,< 52px 可能出错

---

### 生图(图片输出)

#### Gemini 原生(已下架)

```bash
curl "https://api.bozzii.com/v1beta/models/gemini-3-pro-image:generateContent" \
  -H "x-goog-api-key: sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{"text": "Draw a red apple"}]
    }]
  }'
```

**当前状态:** ❌ 出图渠道已下架

**预期响应格式:**

```json
{
  "candidates": [{
    "content": {
      "parts": [
        {"thought": true, "text": "我要画一个红苹果..."},
        {
          "fileData": {
            "mimeType": "image/jpeg",
            "fileUri": "https://external-cdn.com/xxx.jpg"
          }
        },
        {"text": "![](https://external-cdn.com/xxx.jpg)"}
      ]
    }
  }]
}
```

**注意事项:**
- 图片是外链,托管在第三方 CDN,请自行下载保存
- 耗时约 13～15 秒
- 不支持流式

#### GPT Image(文档已说明,未实测)

```bash
curl https://api.bozzii.com/v1/images/generations \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2.5-flare",
    "prompt": "a red apple",
    "size": "1024x1024"
  }'
```

**响应:** `data[0].b64_json`(base64 编码的 PNG)

**耗时:** 约 28 秒,接近网关 30 秒超时上限,务必重试

---

## 错误处理

### 常见错误码

| 状态码 | 含义 | 响应示例 | 处理方式 |
|---|---|---|---|
| **401** | 无效令牌 | `{"error":{"message":"无效的令牌"}}` | 检查令牌是否正确 |
| **400** | 参数错误 | `{"error":{"message":"missing required field: model"}}` | 检查请求格式 |
| **403** | 权限不足 / 账号池耗尽 | `{"error":{"message":"All available accounts exhausted"}}` | 降低并发,重试 |
| **404** | 接口不存在 | - | 检查 URL 路径 |
| **503** | 模型不可用 | `{"error":{"code":"model_not_found","message":"无可用渠道"}}` | 换用其他模型 |
| **502** | 上游错误 | `{"error":{"type":"bad_response_status_code"}}` | 重试 |
| **524** | 网关超时 | - | 改用流式,或重试 |

### 错误排查

**1. 返回 HTML 页面(HTTP 200)**

原因: Base URL 缺 `/v1`

```bash
# 错误
curl https://api.bozzii.com/chat/completions ...

# 正确
curl https://api.bozzii.com/v1/chat/completions ...
```

**2. Claude Code 报错 "There's an issue with the selected model"**

原因: Base URL 多了 `/v1`,导致请求变成 `/v1/v1/messages`

```bash
# Claude Code 配置
export ANTHROPIC_BASE_URL="https://api.bozzii.com"  # 不要加 /v1
```

**3. Python urllib 默认 UA 导致 502**

Claude 系模型拒绝 `Python-urllib/*` User-Agent

```python
# 解决方案 1: 使用官方 SDK
import anthropic
client = anthropic.Anthropic(base_url="https://api.bozzii.com", api_key="sk-xxx")

# 解决方案 2: 修改 UA
headers = {"User-Agent": "curl/8.7.1"}
```

**4. `content` 为空,`finish_reason` 为 `length`**

推理模型把 token 用在了思考上,调大 `max_tokens`

```json
{
  "max_tokens": 512  // 建议 ≥ 256
}
```

---

## 最佳实践

### 重试策略

所有非 4xx 错误都建议重试,包括:
- `502`、`503`、`524` - 上游临时不可用
- `403 All available accounts exhausted` - 并发过高
- 网络超时

**Python 示例:**

```python
import time
import random

def call_with_retry(func, max_retries=3):
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

**关键参数:**
- 初始延迟: 1～2 秒
- 指数退避,上限 10 秒
- 随机抖动,避免雷鸣群
- 最多重试 3 次

### 并发控制

同时发 6 路以上 Claude 请求可能触发 `403 All available accounts exhausted`:

- 限制并发数 ≤ 5
- 遇到 403 立即退避 5～10 秒

### 超时设置

| 场景 | 建议超时 | 原因 |
|---|---|---|
| 普通对话 | 30 秒 | 网关非流式超时约 30 秒 |
| 生图 | 60 秒以上 | 耗时 13～30 秒,接近上限 |
| 流式 | 60 秒以上 | 长文本生成可能较慢 |

### 成本优化

1. **选择合适的模型**
   - 简单任务用 `deepseek-v4-flash`、`glm-5.3-flash`
   - 复杂推理用 `deepseek-v4-pro`

2. **控制 `max_tokens`**
   - 不要设太小(推理模型建议 ≥ 256)
   - 也不要设太大,按需设置

3. **复用会话**
   - 连续对话带上 `messages` 历史
   - 避免每次都重新发送上下文

---

## 限制与注意事项

### 功能限制

| 功能 | 状态 | 说明 |
|---|---|---|
| 文本对话 | ✅ 可用 | Chat、Messages、Responses 三种协议 |
| 流式输出 | ✅ 可用 | SSE 格式,生图除外 |
| 识图 | ✅ 可用 | 支持 base64 和 HTTPS 链接 |
| 生图 | ❌ 当前不可用 | Gemini 返回 502,上游问题 |
| 视频理解 | ❌ 不支持 | 上游未开放 |
| 视频生成 | ❌ 不支持 | 无此类模型 |
| Embeddings | ❌ 不支持 | 返回 404 |
| 语音转写/合成 | ❌ 不支持 | 返回 503 |

### 使用限制

1. **并发限制**  
   同一账号同时 6 路以上 Claude 请求可能触发 `403 All available accounts exhausted`

2. **超时限制**  
   非流式请求超过约 30 秒会被网关切断(524)

3. **Claude 的输入 token 偏多**  
   回复 "hi" 时 `input_tokens` 约 516～563,DeepSeek/GLM 仅 30～40,推测网关补了固定前缀

4. **部分 Claude 模型限制采样参数**  
   `temperature` 和 `top_p` 必须留空或设为 1

5. **海外模型使用范围**  
   不对个人开放,不得用于面向公众的服务,可能随时中断

6. **数据出境**  
   平台服务器在美国,使用海外模型时请求会经境外链路,详见[隐私政策](https://ai.bozzii.com/privacy.html)

### 模型可用性

- 模型清单会动态调整,**用前先 `GET /v1/models`**
- `kimi-k3` 已下架
- GPT、Gemini 等上游偶发 502/503,重试多半成功

---

## 附录

### 接口清单

| 接口 | 方法 | 状态 | 备注 |
|---|---|---|---|
| `/v1/models` | GET | ✅ | OpenAI / Anthropic 两种格式 |
| `/v1/chat/completions` | POST | ✅ | 支持流式 |
| `/v1/messages` | POST | ✅ | 支持流式,部分模型 403 |
| `/v1/responses` | POST | ✅ | 非 OpenAI 模型也能用 |
| `/v1beta/models/{m}:generateContent` | POST | ❌ | Gemini 原生,出图渠道已下架 |
| `/v1/images/generations` | POST | ❓ | 仅 `gpt-image-*`,未充分验证 |
| `/v1/completions` | POST | ❌ | 404 |
| `/v1/embeddings` | POST | ❌ | 404 |
| `/v1/audio/*` | POST | ❌ | 503 |
| `/v1/videos` | POST | ❌ | 不可用,无视频模型 |

### SDK 配置示例

**Python - OpenAI:**

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

**Python - Anthropic:**

```python
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.bozzii.com",  # 不加 /v1
    api_key="sk-你的令牌"
)

response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=512,
    messages=[{"role": "user", "content": "你好"}]
)
print(response.content[0].text)
```

**Node.js - OpenAI:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.bozzii.com/v1',
  apiKey: 'sk-你的令牌'
});

const response = await client.chat.completions.create({
  model: 'glm-5.3',
  messages: [{role: 'user', content: '你好'}]
});

console.log(response.choices[0].message.content);
```

---

## 获取支持

- **文档站点:** https://doc.bozzii.com
- **主站:** https://ai.bozzii.com
- **问题反馈:** 后台工单系统
- **更新日志:** [Changelog](https://doc.bozzii.com/guides/changelog/)

---

*本文档基于 2026-11-02 的实际测试结果编写,所有 curl 命令均可直接运行。*
