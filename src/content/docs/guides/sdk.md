---
title: SDK 与 curl 示例
description: Python、Node.js（OpenAI / Anthropic SDK）与 Responses 接口的可直接运行示例。
---

## Python — OpenAI SDK（推荐）

OpenAI SDK 的 `base_url` **必须包含 `/v1`**。

### 普通对话

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.bozzii.com/v1",
    api_key="sk-你的令牌",
)

resp = client.chat.completions.create(
    model="deepseek-v4.1-flash",
    messages=[{"role": "user", "content": "用三句话介绍负载均衡"}],
    max_tokens=256,
)
print(resp.choices[0].message.content)
```

### 流式输出

```python
stream = client.chat.completions.create(
    model="glm-5.3-flash",
    messages=[{"role": "user", "content": "写一段 Python 装饰器示例"}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta
    if delta.content:
        print(delta.content, end="", flush=True)
```

### OpenAI Responses 协议

非 OpenAI 模型也可通过网关协议转换直接调用 Responses 接口：

```python
resp = client.responses.create(
    model="deepseek-v4.1-flash",
    input="用一句话解释什么是幂等性",
)
print(resp.output_text)
```

---

## Python — Anthropic SDK

Anthropic SDK 的 `base_url` **不要加 `/v1`**，SDK 会自动拼接 `/v1/messages`。

:::note[模型协议提示]
`claude-sonnet-5-5`、`glm-5.3`、`hy4`、`mimo-v2.6-flash`、`gpt-6.2-sol` 均支持 Messages 协议；`deepseek-*` 系列请使用上方的 OpenAI SDK（Chat Completions 或 Responses）。
:::

```python
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.bozzii.com",  # 不要加 /v1
    api_key="sk-你的令牌",
)

msg = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=512,
    messages=[{"role": "user", "content": "你好，请用一句话自我介绍"}],
)
print(msg.content[0].text)
```

---

## Node.js / TypeScript — OpenAI SDK

```js
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.bozzii.com/v1',
  apiKey: 'sk-你的令牌',
});

const resp = await client.chat.completions.create({
  model: 'glm-5.3',
  messages: [{ role: 'user', content: '你好' }],
  max_tokens: 256,
});

console.log(resp.choices[0].message.content);
```
