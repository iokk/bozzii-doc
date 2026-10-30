---
title: 常见错误
description: 错误现象与对应处理。
---

| 现象 | 原因 | 处理 |
|---|---|---|
| HTTP 200 但返回 HTML | Base URL 少了 `/v1` | 补上 `/v1`，并检查响应的 `content-type` |
| `503 … 无可用渠道` | 该模型已被下线 | 重新 `GET /v1/models`，换用在线模型 |
| `403 … does not allow /v1/messages` | 该模型的 Messages 接口被禁用 | 改走 Chat 或 Responses |
| `400 … does not support non-default temperature` | 部分 Claude 模型限制采样参数 | temperature、top_p 留空或设为 1 |
| `502 Upstream access forbidden`（Claude 系） | 请求使用了 `Python-urllib/*` 默认 User-Agent | 改用官方 SDK，或把 UA 设为 `curl/8.x` |
| `403 All available accounts exhausted` | 并发过高，账号池耗尽 | 降低并发，做重试与退避 |
| `524` | 非流式请求超过约 30 秒 | 长文本改用流式；生图做重试，超时设 60 秒以上 |
| `content` 为空，`finish_reason` 为 `length` | 推理模型把额度用在了思考上 | 调大 `max_tokens` |
| Claude Code 报 “There's an issue with the selected model” | Base URL 多了 `/v1` | 改为 `https://api.bozzii.com` |
