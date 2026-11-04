---
title: 模型清单
description: 当前可用的文本、生图模型，以及各协议的实测结果。
---

:::caution
模型列表由后台随时调整，短短几小时内就可能上线或下线模型。接入前请先 `GET /v1/models` 确认，不要写死模型名。

本页结果来自 2026-11-04 的实测。“Chat”指 `POST /v1/chat/completions`，“Messages”指 `POST /v1/messages`。
:::

## 国产文本模型

可用于生产环境。面向公众提供服务时，请自行完成所需备案。

| 模型 | Chat | Messages | 实测耗时 | 备注 |
|---|---|---|---|---|
| `deepseek-v4-pro` | ✅ | ✅ | 约 5 秒 | 带推理，`max_tokens` 太小会得到空 `content` |
| `deepseek-v4-flash` | ✅ | ✅ | 约 3～4 秒 | 响应快，推荐日常使用 |
| `deepseek-v4.1-flash` | ✅ | ✅ | 约 4 秒 | 带推理 |
| `deepseek-flash` | ✅ | ❌ 502 | 约 3 秒 | 只能走 Chat |
| `glm-5.3` | ✅ | ✅ | 约 5 秒 | 支持识图 |
| `glm-5.3-flash` | ✅ | ✅ | 约 4 秒 | 流式首字约 2.7 秒 |

## 海外模型（仅限开发测试）

:::danger[使用范围限制]
海外模型不主动向用户提供，不对个人用户开放，仅供经审核的企业用于**内部开发、测试和调试**。不得使用这些模型向终端用户或中国境内公众提供服务，也不得接入面向公众的产品。请求会经由境外链路处理，详见[隐私政策](https://ai.bozzii.com/privacy.html)和[服务条款](https://ai.bozzii.com/terms.html)。海外模型可能因上游政策调整而随时中断。
:::

### GPT 系列

| 模型 | Chat | Messages | 实测耗时 |
|---|---|---|---|
| `gpt-6-luna` | ✅ | ✅ | 约 3 秒 |
| `gpt-5.6-sol` | ✅ | ✅ | 约 3 秒 |
| `gpt-6-astra` | ✅ | ✅ | 约 7～9 秒 |
| `gpt-6.1-sol` | ✅ | ✅ | 约 8 秒 |
| `gpt-6.1-terra` | ✅ | ✅ | 约 7～9 秒 |

### Claude 系列

:::note[只能通过 Claude Code 使用]
Claude 系列目前限制为只服务 Claude Code 客户端。用 curl、OpenAI SDK 或 Anthropic SDK 直接调用会被拒绝：Chat 返回 `403 This group is restricted to Claude Code clients`，Messages 返回 `503 No available accounts`。配置方法见 [Claude Code](/guides/claude-code/)。
:::

| 模型 | 当前状态 |
|---|---|
| `claude-sonnet-5-5`、`claude-opus-5`、`claude-opus-5-5`、`claude-fable-5`、`claude-fable-5-1` | 仅限 Claude Code 客户端 |
| `claude-sonnet-5`、`claude-opus-4-8` | ❌ 503 无可用渠道 |

## 生图模型（仅限开发测试）

以下模型同样适用海外模型的使用范围限制。

| 模型 | 调用方式 | 实测结果 |
|---|---|---|
| `gpt-image-2.5-flare` | `POST /v1/images/generations` | ✅ 约 24 秒，返回 `b64_json` |
| `gpt-image-2` | `POST /v1/images/generations` | ✅ 约 22 秒，返回图片链接 `url` |
| `nano-banana-2.1`、`nano-banana-pro` | `POST /v1/chat/completions`（非流式） | ⚠️ 约 50 秒以上，图片以 base64 嵌在 `content` 的 markdown 里，响应体 1～2 MB，容易超时或读取中断 |
| `gpt-image-2.5-sunburst` | `POST /v1/images/generations` | ❌ 响应读取中断，暂不可用 |

调用示例见[生图](/guides/images/)。

## 当前不可用

列表里能看到，但实测调用失败，请勿使用：

| 模型 | 实测结果 |
|---|---|
| `grok-4.6`、`grok-4.7` | ❌ 502 上游错误 |
| `MiniMax-H3` | ❌ 404，网关路由错误 |
| `doubao-seedance-*`、`seedance-2.5`（视频） | ❌ 无可用渠道，见[视频接口说明](/guides/video/) |

## 已下架

`kimi-k3`、`gemini-3-pro-image`、`gemini-3-pro-image-preview`、`gpt-6-sol`、`gemini-3.1-flash-image`、`gemini-3.1-flash-image-preview`。调用会返回 503 `无可用渠道`。
