---
title: 常见错误与排查
description: 状态码速查与常见接入报错的定位方法。
---

## HTTP 状态码速查

| 状态码 | 含义 | 常见原因与处理方式 |
| :--- | :--- | :--- |
| `200` 但返回 HTML | 路径缺少 `/v1` | 请求未命中 API 路由而回落到前端页面。请确认 Base URL 或完整路径包含 `/v1/` |
| `400` | 请求参数错误 | 缺少必填字段（如 `model`，或 Messages 缺少 `max_tokens`）、参数类型不合法 |
| `401` | 鉴权失败 | 令牌无效、格式不是 `sk-` 开头、已过期或余额不足 |
| `403` | 无权限或风控拦截 | 令牌分组权限限制，或客户端使用了被拦截的默认 `User-Agent` |
| `404` | 接口不存在 | 检查 URL 路径拼写，或确认是否调用了未启用的端点（如 `/v1/embeddings`） |
| `429` | 请求频率或并发受限 | 降低并发请求数，按退避策略稍后重试 |
| `500` / `502` | 上游服务或协议转换异常 | 若在 `/v1/messages` 调用 `deepseek-*` 报 500，请改用 `/v1/chat/completions`；偶发 502 可重试 |
| `503` | 暂无可用渠道 | 当前模型临时维护或上游账号池繁忙，可稍后重试或切换同类替代模型 |
| `524` | 网关响应超时 | 非流式请求耗时过长，长文本请开启 `stream: true`，生图请求请适当延长超时并重试 |

---

## 高频问题排查

### 1. Claude Code 报错 `"There’s an issue with the selected model..."`
- **原因**：`ANTHROPIC_BASE_URL` 错误地加上了 `/v1`，导致实际请求发往 `/v1/v1/messages`（404）。
- **解决**：将 `ANTHROPIC_BASE_URL` 改为 `https://api.bozzii.com`（去掉末尾 `/v1`）。

### 2. Python 脚本直接请求返回 `403` 或 `502`
- **原因**：Python 标准库 `urllib` 默认发送 `User-Agent: Python-urllib/...`，容易被边缘 WAF 拦截。
- **解决**：改用 `openai` / `anthropic` 官方 SDK，或显式设置请求头 `"User-Agent": "curl/8.7.1"`。

### 3. 响应成功但 `content` 为空、`finish_reason` 为 `"length"`
- **原因**：调用了推理模型（如 `deepseek-v4-pro`、`grok-4.7`），且 `max_tokens` 设置过小，额度在思考阶段即耗尽。
- **解决**：将 `max_tokens` 调大至 `256` 以上（复杂推理建议 `2048+`），并同时读取 `reasoning_content`（或 Messages 中的 `thinking` 块）。

### 4. 部分模型调用 `/v1/messages` 返回 `500`
- **原因**：部分模型（如 `deepseek-v4.1-flash`、`deepseek-v4-pro`）当前主要通过 OpenAI 协议提供服务。
- **解决**：改走 `/v1/chat/completions` 或 `/v1/responses`；如需 Anthropic Messages 协议，可选用 `glm-5.3`、`hy4`、`mimo-v2.6-flash` 或 `claude-*`。
