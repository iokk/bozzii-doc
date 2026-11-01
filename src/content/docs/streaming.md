---
title: 流式输出
description: Chat 和 Messages 协议的流式调用示例
---

# 流式输出

流式输出可以让你实时接收模型响应,无需等待整个响应完成。适用于对话、长文本生成等场景。

## 工作原理

流式输出使用 **Server-Sent Events (SSE)** 格式,服务器逐块推送数据:

```
data: {"choices":[{"delta":{"content":"你好"}}]}

data: {"choices":[{"delta":{"content":"!"}}]}

data: [DONE]
```

每个 `data:` 行是一个 JSON 对象,`[DONE]` 表示流结束。

## Chat Completions 协议

### 请求示例

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-uQm9LJn9rDqfvE073hMpytXHJcO4UzXE5lMjYL0gyBlgVFaa" \
  -d '{
    "model": "deepseek-v3",
    "messages": [{"role": "user", "content": "用三句话介绍人工智能"}],
    "stream": true
  }'
```

### 响应格式

```json
data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","created":1730505600,"model":"deepseek-v3","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","created":1730505600,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"人工智能"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","created":1730505600,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"是"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","created":1730505600,"model":"deepseek-v3","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

## Messages 协议 (Anthropic 格式)

### 请求示例

```bash
curl https://api.bozzii.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-uQm9LJn9rDqfvE073hMpytXHJcO4UzXE5lMjYL0gyBlgVFaa" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-7-sonnet-20250219",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "用三句话介绍人工智能"}],
    "stream": true
  }'
```

### 响应格式

```json
event: message_start
data: {"type":"message_start","message":{"id":"msg_xxx","type":"message","role":"assistant","content":[],"model":"claude-3-7-sonnet-20250219","stop_reason":null,"usage":{"input_tokens":15,"output_tokens":1}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"人工智能"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"是"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"output_tokens":50}}

event: message_stop
data: {"type":"message_stop"}
```

## Python 示例

### Chat Completions

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.bozzii.com/v1",
    api_key="sk-uQm9LJn9rDqfvE073hMpytXHJcO4UzXE5lMjYL0gyBlgVFaa"
)

stream = client.chat.completions.create(
    model="deepseek-v3",
    messages=[{"role": "user", "content": "用三句话介绍人工智能"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

### Messages 协议

```python
from anthropic import Anthropic

client = Anthropic(
    base_url="https://api.bozzii.com",
    api_key="sk-uQm9LJn9rDqfvE073hMpytXHJcO4UzXE5lMjYL0gyBlgVFaa"
)

with client.messages.stream(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    messages=[{"role": "user", "content": "用三句话介绍人工智能"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

## JavaScript 示例

```javascript
const response = await fetch('https://api.bozzii.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-uQm9LJn9rDqfvE073hMpytXHJcO4UzXE5lMjYL0gyBlgVFaa'
  },
  body: JSON.stringify({
    model: 'deepseek-v3',
    messages: [{role: 'user', content: '用三句话介绍人工智能'}],
    stream: true
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const {done, value} = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n').filter(line => line.trim() !== '');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') continue;
      
      const parsed = JSON.parse(data);
      const content = parsed.choices[0].delta.content;
      if (content) {
        process.stdout.write(content);
      }
    }
  }
}
```

## 注意事项

1. **所有支持 Chat/Messages 的模型都支持流式输出**
2. **响应时间**:首字时间(TTFB)通常在 1-3 秒内
3. **超时**:非流式调用有 30 秒超时,流式调用可以持续更长时间
4. **缓冲**:某些 HTTP 客户端会缓冲响应,导致无法实时接收。确保关闭缓冲(如 Python `requests` 使用 `stream=True`)
5. **错误处理**:流中断时可能不会收到完整的错误信息,建议实现重连机制

## 相关文档

- [API 完整规范](/api-specification)
- [重试与错误处理](/retry)
- [快速参考](/quick-reference)
