---
title: Base URL 与鉴权
description: 什么时候加 /v1，支持哪些鉴权头。
---

## Base URL 要不要加 `/v1`

网关只认 `/v1/...` 开头的路径。**没有 `/v1` 的路径不会报 404，而是返回网站首页 HTML（HTTP 200）**，容易被误判为成功。

| 客户端 / 场景 | Base URL | 最终请求路径 |
|---|---|---|
| Claude Code（`ANTHROPIC_BASE_URL`） | `https://api.bozzii.com`（不加） | 自动拼 `/v1/messages` |
| Anthropic 官方 SDK | `https://api.bozzii.com`（不加） | 自动拼 `/v1/messages` |
| OpenAI 官方 SDK、Cherry Studio、NextChat、LobeChat 等 | `https://api.bozzii.com/v1`（加） | 拼 `/chat/completions` |
| 直接 curl | 写完整路径 | `https://api.bozzii.com/v1/xxx` |
| Gemini 原生 | `https://api.bozzii.com` | `/v1beta/models/{model}:generateContent` |

:::caution
Claude Code 配成带 `/v1` 的地址时，请求变成 `/v1/v1/messages`（404），报错文案是 “There's an issue with the selected model…”，具有误导性，真实原因是 Base URL 多了 `/v1`。
:::

## 鉴权方式

| 协议 | 请求头 |
|---|---|
| OpenAI 风格 | `Authorization: Bearer sk-xxxx` |
| Anthropic 风格 | `x-api-key: sk-xxxx` 加 `anthropic-version: 2023-06-01`（也可用 Bearer） |
| Gemini 原生 | `x-goog-api-key: sk-xxxx` 或 `?key=sk-xxxx` |

`Authorization` 与 `x-api-key` 两种写法在各协议下都可以使用。
