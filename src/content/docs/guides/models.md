---
title: 模型清单
description: 当前可用的文本与生图模型及各协议支持情况。
---

:::caution
模型列表由后台随时调整，短短几小时内就可能上线或下线模型。接入前请先 `GET /v1/models` 确认，不要写死模型名。
:::

## 国产文本模型

| 模型 | Chat | Messages | Responses | 备注 |
|---|---|---|---|---|
| `deepseek-v4-pro` | ✅ | ✅ | ✅ | 带推理，`max_tokens` 太小会得到空 `content` |
| `deepseek-v4-flash` | ✅ | ✅ | ✅ | 响应较快；带推理 |
| `deepseek-v4.1-flash` | ✅ | ✅ | ✅ | 响应较快；带推理 |
| `glm-5.3` | ✅ | ✅ | ✅ | |
| `glm-5.3-flash` | ✅ | ✅ | ✅ | |

## 海外模型（仅限开发测试）

:::danger[使用范围限制]
海外模型不主动向用户提供，不对个人用户开放，仅供经审核的企业用于**内部开发、测试和调试**。不得使用这些模型向终端用户或中国境内公众提供服务，也不得接入面向公众的产品。请求会经由境外链路处理，详见[隐私政策](https://ai.bozzii.com/privacy.html)和[服务条款](https://ai.bozzii.com/terms.html)。海外模型可能因上游政策调整而随时中断。
:::

| 模型 | Chat | Messages | Responses | 备注 |
|---|---|---|---|---|
| `claude-fable-5` | ✅ | ✅ | ✅ | 拒绝非默认 temperature/top_p |
| `claude-fable-5-1` | ✅ | ✅ | ✅ | |
| `claude-sonnet-5` | ✅ | ✅ | ✅ | |
| `claude-sonnet-5-5` | ✅ | ✅ | ✅ | 拒绝非默认 temperature/top_p |
| `claude-opus-5` | ✅ | ✅ | ✅ | |
| `claude-opus-5-5` | ✅ | ✅ | ✅ | |
| `claude-opus-4-8` | ✅ | ✅ | ✅ | 拒绝非默认 temperature/top_p |
| `gpt-6-astra` | ✅ | ❌ 403 | ✅ | 不能用于 Anthropic SDK 和 Claude Code |
| `gpt-6.1-sol` | ✅ | ❌ 403 | ✅ | 不能用于 Anthropic SDK 和 Claude Code |
| `kimi-k3` | ✅ | ✅ | ✅ | 响应偏慢；支持识图，小字识别不准。按内部规则归入受限组 |

## 生图模型（仅限开发测试）

以下生图模型同样适用上述使用范围限制。

| 模型 | 调用方式 | 状态 |
|---|---|---|
| `gpt-image-2.5-flare` | `POST /v1/images/generations` | ✅ 耗时约 28 秒，偶发超时 |
| `gemini-3-pro-image`、`gemini-3-pro-image-preview` | Gemini 原生 `:generateContent`，或 Chat 非流式 | ✅ 耗时约 13～15 秒，返回图片链接 |
| `gpt-image-2.5-sunburst` | `POST /v1/images/generations` | ❌ 超时，暂不可用 |

## 已下线

`gpt-6-sol`、`gpt-6-luna`、`gemini-3.1-flash-image`、`gemini-3.1-flash-image-preview`。调用返回 503 `无可用渠道`，请勿再使用。
