---
title: 模型清单与计费说明
description: 铂子 API 当前在线模型、协议兼容性矩阵、计费规则与合规使用范围。
---

:::note[动态同步提示]
模型列表会随上游调度动态调整，接入前请始终通过 `GET /v1/models` 获取最新列表，避免在生产代码中硬编码已下线模型。以下清单基于 **2026-11-22** 网关实测校准。
:::

## 国产主力模型（可用于生产环境）

面向中国境内公众提供服务时，请接入方自行完成所需业务备案与合规审查。

| 模型 ID | 厂商 / 系列 | Chat | Responses | Messages | 典型定位与说明 |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `deepseek-v4.1-flash` | DeepSeek | ✅ | ✅ | ❌ 500 | **日常首选**，约 2 秒响应，支持 Tool Calling |
| `deepseek-v4-pro` | DeepSeek | ✅ | ✅ | ❌ 500 | **复杂推理主力**，先思考后回答，`max_tokens` 建议 ≥ 256 |
| `glm-5.3` | 智谱 GLM | ✅ | ✅ | ✅ | 综合均衡，**支持多模态识图**与 Messages 协议 |
| `glm-5.3-flash` | 智谱 GLM | ✅ | ✅ | ✅ | 轻量高速版本，适合流式对话与 Claude Code 备选 |
| `hy4` | 混元 | ✅ | ✅ | ✅ | 通用对话与推理，三协议全兼容 |
| `hy4-flash` | 混元 | ✅ | ✅ | ✅ | 快速版，支持 Messages 与思考输出 |
| `mimo-v2.6-flash` | 小米 MiMo | ✅ | ✅ | ✅ | 约 2.5~3.5 秒响应，三协议全兼容、支持 Tool Calling |
| `mimo-v2.6-pro` | 小米 MiMo | ✅ | ✅ | ✅ | 加强版，约 2.4 秒响应，三协议全兼容 |

---

## 海外模型（仅限企业开发测试）

:::caution[使用范围与数据出境说明]
海外模型（GPT、Claude、Grok 及生图系列）**不对个人用户开放，仅限经审核的企业客户用于内部开发、测试和调试**，不得用于面向终端用户或中国境内公众的产品服务。请求将经由境外链路处理，接入前请确认符合[服务条款](https://ai.bozzii.com/user-agreement)与[隐私政策](https://ai.bozzii.com/privacy-policy)，且不得传输依法或依合同禁止出境的数据。
:::

### 文本与推理模型

| 模型 ID | 系列 | Chat | Responses | Messages | 说明 |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `gpt-6.2-sol` / `gpt-6.2-astra` | OpenAI | ✅ | ✅ | ✅ | 最新 6.2 系列，约 3~5 秒响应 |
| `gpt-6.1-sol` / `gpt-6.1-terra` | OpenAI | ✅ | ✅ | ✅ | 约 3~4 秒响应 |
| `gpt-6-luna` / `gpt-6-astra` | OpenAI | ✅ | ✅ | ✅ | 约 3 秒响应 |
| `claude-sonnet-5-5` | Anthropic | ✅ | ✅ | ✅ | 通用编码与主力对话，**支持 SDK / curl 直接调用及 Claude Code** |
| `claude-opus-5-5` | Anthropic | ✅ | ✅ | ✅ | 高阶推理与复杂工程任务 |
| `claude-haiku-5-5` | Anthropic | ✅ | ✅ | ✅ | 高并发轻量版本，约 3 秒响应 |
| `claude-fable-5-1` | Anthropic | ✅ | ✅ | ✅ | 创意与长文本写作 |
| `grok-4.6` / `grok-4.7` | xAI | ✅ | ✅ | ✅ | 支持推理输出 |

生图模型清单与调用方式请见 [图像生成](/guides/images/)。

---

## 计费与用量查询

1. **计费方式**：平台按每次请求实际消耗的 `input_tokens` 与 `output_tokens`（含推理模型的思考 Token）或按次/按张（生图模型）从账户余额中扣费。
2. **查看实时倍率与余额**：登录控制台 [https://ai.bozzii.com](https://ai.bozzii.com) → **模型价格 / 消费日志**，可查看各模型的当前单价倍率与逐笔请求扣费明细。
3. **成本优化建议**：
   - 简单分类、提取与日常对话优先选用 `deepseek-v4.1-flash`、`mimo-v2.6-flash`、`glm-5.3-flash`。
   - 仅在需要深度思考的任务上使用 `deepseek-v4-pro` 或高阶推理模型，并合理设置 `max_tokens`。
   - 连续多轮对话请合理裁剪历史消息长度，避免重复发送过长上下文。
