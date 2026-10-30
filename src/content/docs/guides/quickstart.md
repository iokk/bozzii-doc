---
title: 快速开始
description: 三分钟完成第一次调用。
---

域名：`https://api.bozzii.com`。令牌在文中一律写作 `sk-xxxx`，请换成自己的令牌，不要提交进仓库或发给他人。

## 1. 查看可用模型

```bash
curl https://api.bozzii.com/v1/models -H "Authorization: Bearer sk-xxxx"
```

## 2. 发起第一次对话

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-xxxx" \
  -H "content-type: application/json" \
  -d '{"model":"deepseek-v4-pro","messages":[{"role":"user","content":"你好"}],"max_tokens":256}'
```

推理模型（如 `deepseek-v4-pro`）会先思考，`max_tokens` 过小会得到空 `content`，建议不低于 256。

## 3. 选择协议

| 你的场景 | 协议 | Base URL |
|---|---|---|
| OpenAI SDK、大多数聊天客户端 | Chat Completions | `https://api.bozzii.com/v1` |
| Anthropic SDK、Claude Code | Messages | `https://api.bozzii.com` |
| Gemini 原生生图 | generateContent | `https://api.bozzii.com` |

两者的区别见[Base URL 与鉴权](/guides/base-url-auth/)。
