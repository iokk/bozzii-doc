---
title: 注意事项
description: 使用前需要了解的限制。
---

1. **User-Agent 限制**：Claude 系模型拒绝 `Python-urllib/*`（502）。用 Python 脚本直调时，请使用官方 SDK，或把 UA 改成 `curl/8.x`。其他模型不受影响。
2. **采样参数**：`claude-sonnet-5-5`、`claude-fable-5`、`claude-opus-4-8` 拒绝非默认的 `temperature` 和 `top_p`（值为 1 可以）。`claude-opus-5`、`claude-sonnet-5` 及其他厂商模型不受限。
3. **并发要克制**：同时发起 6 路 Claude 请求时，曾出现 403 `All available accounts exhausted`。批量任务请做重试与退避。
4. **Claude 的输入 token 偏多**：回复 “hi” 时 Claude 的 `input_tokens` 约 516～563，DeepSeek、GLM 仅 30～40，推测网关补了固定前缀。这部分计入用量，评估成本时要考虑。
5. **非流式超时**：非流式请求超过约 30 秒会得到 `524`。生图耗时普遍 13～30 秒，务必重试；长文本任务用流式。
6. **推理模型的 `max_tokens`**：`deepseek-v4-pro` 等会先思考，`max_tokens` 太小时 `content` 为空，内容在 `reasoning_content`。`max_tokens` 不要设得太小。
7. **偶发上游错误**：GPT 系与 Kimi 出现过零星 502、503、524，重试多半成功。
8. **模型清单会变**：用前先 `GET /v1/models`。
