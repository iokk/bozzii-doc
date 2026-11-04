---
title: SDK 与 curl 示例
description: Anthropic Messages、OpenAI Chat 与 Responses 的调用示例。
---

## Anthropic Messages

```bash
curl https://api.bozzii.com/v1/messages \
  -H "x-api-key: sk-xxxx" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-5-5","max_tokens":256,
       "messages":[{"role":"user","content":"你好"}]}'
```

```python
import anthropic

c = anthropic.Anthropic(base_url="https://api.bozzii.com", api_key="sk-xxxx")  # 不加 /v1
print(c.messages.create(
    model="deepseek-v4-pro", max_tokens=256,
    messages=[{"role": "user", "content": "你好"}],
).content)
```

## OpenAI Chat Completions

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-xxxx" -H "content-type: application/json" \
  -d '{"model":"glm-5.3","messages":[{"role":"user","content":"你好"}],"max_tokens":256}'
```

```python
from openai import OpenAI

c = OpenAI(base_url="https://api.bozzii.com/v1", api_key="sk-xxxx")  # 要加 /v1
print(c.chat.completions.create(
    model="glm-5.3",
    messages=[{"role": "user", "content": "你好"}],
    max_tokens=256,
).choices[0].message.content)
```

## OpenAI Responses

```python
print(c.responses.create(model="deepseek-v4-pro", input="你好").output_text)
```

非 OpenAI 模型也能走 Responses，网关会做协议转换。
