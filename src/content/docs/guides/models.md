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

## 国际主流模型（仅限企业开发测试）

:::caution[使用范围与数据说明]
GPT、Claude、Grok 及生图系列模型**仅面向经审核的企业客户开放，用于内部开发、测试与调试**，不得用于面向中国境内公众的终端产品服务。

网关通过阿里云 CDN 就近边缘节点加速接入，**仅作无状态中转、不落盘对话内容，仅记录必要元数据（时间、模型、Token 计数、耗时与费用），承诺不用于任何模型训练**。接入前请确认符合[服务条款](https://ai.bozzii.com/user-agreement)与[隐私政策](https://ai.bozzii.com/privacy-policy)，请勿传输依法或依合同受限的数据。
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
| `claude-fable-5-1` / `claude-fable-5-2` | Anthropic | ✅ | ✅ | ✅ | 创意与长文本写作（`fable-5-2` 建议走 Claude Code） |
| `gemini-4-argon` / `gemini-4-carbon` / `gemini-4-hydrogen` / `gemini-4-neon` | Google | ✅ | ✅ | ✅ | Gemini 4 系列对话与推理模型 |
| `gemini-3.8-flash` | Google | ✅ | ✅ | ✅ | 轻量高速版本 |
| `grok-4.6` / `grok-4.7` | xAI | ✅ | ✅ | ✅ | 支持推理输出 |

生图模型清单与调用方式请见 [图像生成](/guides/images/)。部分固定日期快照（如 `deepseek-v4.1-flash-1017`）及按分组开放的专用模型（如 `jev-latest`、异步视频模型 `MiniMax-H3`）以当前令牌调用 `GET /v1/models` 的实际返回为准。

---

## 计费规则与用量查询

1. **结算汇率与单价**：账户余额按人民币（CNY）展示与结算，固定换算汇率为 **`1 USD = ¥7.30`**；各模型最新单价可在控制台 [模型定价](https://ai.bozzii.com/pricing) 实时查看。
2. **推理思考 Token**：推理模型（如 `deepseek-v4-pro`、`claude-opus-5-5`、`gpt-6.2-*`、`grok-4.7`、`hy4-flash`）的思考过程 Token 与最终输出 Token 统一按**输出单价**计费。
3. **Prompt Cache（提示词缓存）**：
   - **缓存读取（Cache Read）**：按模型官方折扣计费，通常为输入单价的 **`0.1x ~ 0.25x`**（开启长上下文稳定前缀可显著降本）。
   - **缓存写入（Cache Write）**：OpenAI 系列与 `hy4-flash` 按 **`1.0x`** 标准输入单价计费（不额外加价）；Anthropic 系列遵循官方 **`1.25x`（5 分钟 TTL）/ `2.0x`（1 小时 TTL）** 规则。
4. **长上下文阶梯与谷时优惠**：
   - 支持超长上下文的模型按官方阈值分段计价（如 `>128K`、`>200K` 或 `>272K` 阶梯）。
   - **DeepSeek 谷时半价**：北京时间每日 **`00:30 ~ 08:30`** 调用 DeepSeek 系列自动享受官方谷时优惠价。
5. **生图与异步任务计费**：生图模型按分辨率/质量档位或按张保底计费；已开放视频能力的分组按异步任务计费。
6. **报错退款与中断结算**：
   - **首 Token 前失败（4xx / 5xx）**：网关自动回滚预扣额度，**实扣 `¥0.00`**。
   - **流式传输中途客户端主动断开**：仅按中断前已实际生成的 Token 结算，不按 `max_tokens` 全额扣费。
7. **逐笔明细核对**：登录控制台 [https://ai.bozzii.com/usage-logs/common](https://ai.bozzii.com/usage-logs/common) 可查看每笔请求的 `Request ID`、输入/输出/缓存 Token、耗时与扣费明细。
8. **成本优化建议**：
   - 简单分类、提取与日常对话优先选用 `deepseek-v4.1-flash`、`mimo-v2.6-flash`、`glm-5.3-flash`。
   - 长对话与 Agent 场景保持 System Prompt 与工具定义前缀稳定，以充分触发 Prompt Cache 折扣。
   - 仅在复杂推理任务上使用 `deepseek-v4-pro` 或高阶模型，并合理设置 `max_tokens`。
