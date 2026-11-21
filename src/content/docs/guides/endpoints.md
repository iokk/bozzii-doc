---
title: 接口与协议总览
description: 铂子 API 支持的接口端点、协议格式与当前能力边界。
---

网关地址统一为 `https://api.bozzii.com`。

## 支持的接口

| 接口路径 | 方法 | 状态 | 说明 |
| :--- | :--- | :--- | :--- |
| `/v1/models` | `GET` | ✅ 可用 | 查询当前可用模型及每个模型支持的协议类型（`supported_endpoint_types`） |
| `/v1/chat/completions` | `POST` | ✅ 可用 | OpenAI 标准对话接口，支持流式（SSE）、多模态识图与 Tool Calling |
| `/v1/responses` | `POST` | ✅ 可用 | OpenAI Responses 协议，非 OpenAI 模型也可通过网关协议转换调用 |
| `/v1/messages` | `POST` | ✅ 可用 | Anthropic Messages 协议，支持流式与 Tool Calling（详见[模型清单](/guides/models/)兼容性说明） |
| `/v1/images/generations` | `POST` | ✅ 可用 | 图像生成接口（GPT Image 系列，仅限企业开发测试） |

## 暂未开放的接口

以下端点当前未启用或无挂载模型，请勿在生产代码中依赖：

| 接口路径 | 状态 | 说明 |
| :--- | :--- | :--- |
| `/v1/completions` | ❌ 404 | 请使用 `/v1/chat/completions` |
| `/v1/embeddings` | ❌ 404 | 暂不提供向量嵌入服务 |
| `/v1/audio/*` | ❌ 503 | 暂不提供语音转写与合成 |
| `/v1/videos`、`/v1/video/generations` | ❌ 未启用 | 当前无在线视频生成渠道 |
| `/v1/moderations`、`/v1/rerank`、`/v1/batches` | ❌ 未启用 | 暂不提供 |

## 协议快速对比

### 1. Chat Completions（通用首选）

几乎所有文本模型都支持该协议，生态工具兼容性最好。

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-5.3",
    "messages": [
      {"role": "system", "content": "你是一个专业的技术顾问"},
      {"role": "user", "content": "用三句话总结 HTTP/2 的优势"}
    ],
    "max_tokens": 512,
    "temperature": 0.7
  }'
```

### 2. Anthropic Messages

适合 Anthropic SDK 与 Claude Code。`max_tokens` 为必填参数。

```bash
curl https://api.bozzii.com/v1/messages \
  -H "x-api-key: sk-你的令牌" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-5.3",
    "max_tokens": 512,
    "messages": [
      {"role": "user", "content": "用三句话总结 HTTP/2 的优势"}
    ]
  }'
```

### 3. OpenAI Responses

语法更简洁，适合新版 OpenAI SDK：

```bash
curl https://api.bozzii.com/v1/responses \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4.1-flash",
    "input": "用三句话总结 HTTP/2 的优势"
  }'
```
