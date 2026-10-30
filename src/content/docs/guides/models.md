---
title: 模型清单
description: 当前可用的文本与生图模型及各协议支持情况。
---

:::caution
模型列表由后台随时调整，短短几小时内就可能上线或下线模型。接入前请先 `GET /v1/models` 确认，不要写死模型名。
:::

## 文本模型

| 模型 | Chat | Messages | Responses | 备注 |
|---|---|---|---|---|
| `claude-fable-5`、`claude-fable-5-1` | ✅ | ✅ | ✅ | `claude-fable-5` 拒绝非默认 temperature/top_p |
| `claude-sonnet-5` | ✅ | ✅ | ✅ | |
| `claude-sonnet-5-5` | ✅ | ✅ | ✅ | 拒绝非默认 temperature/top_p |
| `claude-opus-5`、`claude-opus-5-5` | ✅ | ✅ | ✅ | |
| `claude-opus-4-8` | ✅ | ✅ | ✅ | 拒绝非默认 temperature/top_p |
| `deepseek-v4-pro`、`deepseek-v4-flash`、`deepseek-v4.1-flash` | ✅ | ✅ | ✅ | 响应较快；带推理，`max_tokens` 太小会得到空 `content` |
| `glm-5.3`、`glm-5.3-flash` | ✅ | ✅ | ✅ | |
| `kimi-k3` | ✅ | ✅ | ✅ | 响应偏慢；支持识图，小字识别不准 |
| `gpt-6-astra`、`gpt-6.1-sol` | ✅ | ❌ 403 | ✅ | 不能用于 Anthropic SDK 和 Claude Code |

## 生图模型

| 模型 | 调用方式 | 状态 |
|---|---|---|
| `gpt-image-2.5-flare` | `POST /v1/images/generations` | ✅ 耗时约 28 秒，偶发超时 |
| `gemini-3-pro-image`、`gemini-3-pro-image-preview` | Gemini 原生 `:generateContent`，或 Chat 非流式 | ✅ 耗时约 13～15 秒，返回图片链接 |
| `gpt-image-2.5-sunburst` | `POST /v1/images/generations` | ❌ 超时，暂不可用 |

## 已下线

`gpt-6-sol`、`gpt-6-luna`、`gemini-3.1-flash-image`、`gemini-3.1-flash-image-preview`。调用返回 503 `无可用渠道`，请勿再使用。
