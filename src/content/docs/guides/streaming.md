---
title: 流式输出
description: Chat 与 Messages 协议的流式调用写法。
---

长文本任务建议用流式,避免非流式 30 秒超时。

## Chat Completions 流式

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-xxxx" \
  -H "content-type: application/json" \
  -d '{"model":"deepseek-v4-pro","messages":[{"role":"user","content":"写一篇关于AI的文章"}],"stream":true}'
```

响应是 SSE 流,每个 `data:` 行是一个 JSON 对象:

```
data: {"id":"...","choices":[{"delta":{"content":"AI"}}],"model":"deepseek-v4-pro"}

data: {"id":"...","choices":[{"delta":{"content":"技术"}}],...}

data: [DONE]
```

推理模型的思考内容在 `delta.reasoning_content` 里(单独的事件),回复内容在 `delta.content`。

## Messages 流式

```bash
curl https://api.bozzii.com/v1/messages \
  -H "x-api-key: sk-xxxx" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-5-5","messages":[{"role":"user","content":"写一篇关于AI的文章"}],"max_tokens":2048,"stream":true}'
```

响应同样是 SSE,事件类型包括:

- `message_start`: 开始,带 `message.id` 与 `message.usage`
- `content_block_start`: 内容块开始
- `content_block_delta`: 增量文本,在 `delta.text` 里
- `content_block_stop`: 内容块结束
- `message_delta`: 最终 `usage` 与 `stop_reason`
- `message_stop`: 结束

## 注意

- 生图模型**不支持**流式,带 `stream: true` 会被拒绝(400)。
- Claude 系模型用 Messages 流式时,`max_tokens` 是必填项。
- 客户端读取超时建议设为 60 秒以上。
