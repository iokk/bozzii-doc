---
title: Base URL 与鉴权
description: 正确配置各 SDK 与客户端的 Base URL（是否带 /v1）及认证请求头。
---

## Base URL 要不要加 `/v1`

铂子 API 网关的所有接口路径均以 `/v1/` 开头。不同客户端对路径的拼接规则不同，**请按工具类型填写**：

| 客户端 / SDK | Base URL 填写值 | SDK 自动拼接后的实际路径 |
| :--- | :--- | :--- |
| OpenAI 官方 SDK（Python / Node.js） | `https://api.bozzii.com/v1` | `/v1/chat/completions`、`/v1/responses` |
| Cherry Studio、NextChat、LobeChat 等 | `https://api.bozzii.com/v1` | `/v1/chat/completions` |
| Anthropic 官方 SDK | `https://api.bozzii.com`（**不加 `/v1`**） | `/v1/messages` |
| Claude Code（`ANTHROPIC_BASE_URL`） | `https://api.bozzii.com`（**不加 `/v1`**） | `/v1/messages` |
| `curl` 或原生 HTTP 请求 | 写完整接口路径 | `https://api.bozzii.com/v1/...` |

:::caution[常见排错：返回 HTTP 200 却是 HTML]
1. **缺少 `/v1`**：如果请求打到 `https://api.bozzii.com/chat/completions`，网关会回落到前端页面并返回 **HTTP 200 HTML**，极易在代码里被误判为请求成功。请检查响应头 `Content-Type` 是否为 `application/json`。
2. **多了 `/v1`**：如果 Claude Code 或 Anthropic SDK 配成了 `https://api.bozzii.com/v1`，实际请求会变成 `/v1/v1/messages`（404），Claude Code 会提示误导性的 `"There’s an issue with the selected model..."`。
:::

## 鉴权方式

所有 API 请求必须携带有效令牌，支持以下请求头：

| 协议风格 | 请求头写法 | 说明 |
| :--- | :--- | :--- |
| OpenAI 风格 | `Authorization: Bearer sk-你的令牌` | 适用于 Chat Completions、Responses、Images、Models |
| Anthropic 风格 | `x-api-key: sk-你的令牌`<br/>`anthropic-version: 2023-06-01` | 适用于 Anthropic Messages 协议（也兼容 `Authorization: Bearer`） |

:::tip[User-Agent 提示]
使用脚本语言直接发起 HTTP 请求时，请使用官方 SDK 或设置标准 `User-Agent`（例如 `curl/8.7.1`），避免部分语言默认 UA（如 `Python-urllib/*`）被上游 WAF 拦截。
:::
