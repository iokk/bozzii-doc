---
title: 接口一览
description: 已支持与不支持的接口清单。
---

状态说明：✅ 可用　❓ 路由存在但未充分验证　❌ 不可用。

| 接口 | 状态 | 备注 |
|---|---|---|
| `GET /v1/models`、`GET /v1/models/{id}` | ✅ | Bearer 返回 OpenAI 风格（含 `supported_endpoint_types`）；带 `x-api-key` 与 `anthropic-version` 返回 Anthropic 风格 |
| `POST /v1/chat/completions` | ✅ | 支持 `stream: true`，所有文本模型可用 |
| `POST /v1/responses` | ✅ | 所有文本模型可用，非 OpenAI 模型也能走 |
| `POST /v1/messages` | ✅ | 支持流式。`gpt-6-astra`、`gpt-6.1-sol` 除外（403） |
| `GET /v1beta/models`、`POST /v1beta/models/{m}:generateContent` | ✅ | Gemini 原生，用于生图模型 |
| `POST /v1/images/generations` | ✅ 部分 | 仅 `gpt-image-*` |
| `POST /v1/images/edits` | ❓ | 仅验证到参数校验，未实际出图 |
| `/v1/files` | ❓ | 未深入测试 |
| `POST /v1/completions` | ❌ | 404 |
| `POST /v1/messages/count_tokens` | ❌ | 404 |
| `POST /v1/embeddings` | ❌ | 404 |
| `/v1/batches`、`/v1/videos`、`/v1/video/generations` | ❌ | 不可用，无视频模型 |
| `/v1/audio/*`、`/v1/moderations`、`/v1/rerank` | ❌ | 未挂模型，返回 503 |
| `POST /v1/responses/compact` | ❌ | 503 |

:::note
路径里没有 `/v1` 的 `/chat/completions`、`/messages`、`/responses` 返回的是前端页面 HTML，不是 API。
:::
