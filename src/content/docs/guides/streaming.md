---
title: 流式输出与推理参数
description: 使用 SSE 流式输出避免超时，并正确处理推理模型的思考过程与 max_tokens。
---

对于长文本生成、代码输出或推理任务，建议始终开启流式输出（`stream: true`），以获得首字低延迟体验，并避免非流式请求超过网关 **120 秒** 上限时触发 `524` 超时。

## Chat Completions 流式（SSE）

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4-pro",
    "messages": [{"role": "user", "content": "写一段简短的快速排序 Python 实现"}],
    "stream": true
  }'
```

响应以 `text/event-stream` 返回，每条 `data:` 为一个 JSON 块，结束标志为 `data: [DONE]`：

```text
data: {"id":"...","choices":[{"delta":{"content":"```python"}}],"model":"deepseek-v4-pro"}
data: {"id":"...","choices":[{"delta":{"content":"\ndef quicksort"}}]}
data: [DONE]
```

### 推理模型字段说明

部分推理模型（如 `deepseek-v4-pro`、`grok-4.7`、`hy4-flash` 等）会先输出思考过程，再输出最终正文：

- **Chat Completions**：思考内容在 `choices[0].delta.reasoning_content`（或非流式 `message.reasoning_content`），最终回答在 `content`。
- **Anthropic Messages**：思考内容在 `content` 中的 `type: "thinking"` 块，最终回答在 `type: "text"` 块。

:::caution[max_tokens 过小会导致正文为空]
推理模型的思考过程同样占用 `max_tokens` 额度。如果 `max_tokens` 设得过小（例如 `32` 或 `64`），额度可能在思考阶段耗尽，导致 `content` 为空且 `finish_reason: "length"`。
- **普通对话**：建议 `max_tokens >= 256`
- **复杂推理/代码生成**：建议 `max_tokens >= 2048`
:::

## Anthropic Messages 流式

Messages 协议要求 `max_tokens` 为必填参数：

```bash
curl https://api.bozzii.com/v1/messages \
  -H "x-api-key: sk-你的令牌" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-5.3-flash",
    "max_tokens": 2048,
    "messages": [{"role": "user", "content": "用三点总结容器化的优势"}],
    "stream": true
  }'
```

常见 SSE 事件顺序：
1. `message_start`（包含 `message.id` 与初始 `usage`）
2. `content_block_start` → `content_block_delta`（`delta.text` 或 `delta.thinking`）→ `content_block_stop`
3. `message_delta`（包含最终 `usage` 与 `stop_reason`）
4. `message_stop`

## 注意事项与心跳保活

- **10 秒 `: PING` 保活心跳**：在长思考（如 `claude-opus-5-5`、`deepseek-v4-pro`）或高负载等待期间，网关每隔 **10 秒** 发送一次 SSE 注释行 `: PING` 防止 CDN / 代理断开连接。官方 SDK 会自动忽略 `:` 开头的注释行；自写 SSE 解析器请务必跳过以 `:` 开头的行。
- **网关超时上限**：非流式单次请求上限 **120 秒**；SSE 流式空闲超时 **300 秒**、单次总时长上限 **600 秒**。
- **客户端超时**：流式请求的客户端读取超时建议设为 **120~300 秒**。
- **生图模型不支持流式**：调用 `/v1/images/generations` 时不要传 `stream: true`。
