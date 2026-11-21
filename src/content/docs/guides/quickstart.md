---
title: 快速开始
description: 1 分钟获取铂子 API 密钥并发起第一次请求。
---

## 1. 获取 API 令牌

1. 登录控制台：[https://ai.bozzii.com](https://ai.bozzii.com)
2. 进入 **API 令牌管理**，创建并复制你的密钥（格式为 `sk-` 开头的字符串）。

:::caution[安全提示]
请勿将 `sk-` 令牌提交至 Git 仓库、前端代码或公开分享。建议使用环境变量管理密钥。
:::

## 2. 查询当前可用模型

接入前建议先拉取实时模型列表，确认目标模型处于在线状态：

```bash
curl https://api.bozzii.com/v1/models \
  -H "Authorization: Bearer sk-你的令牌"
```

## 3. 发起第一次对话

以常用的国产主力模型 `deepseek-v4.1-flash` 为例：

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4.1-flash",
    "messages": [
      {"role": "user", "content": "你好，请用一句话介绍 RESTful API"}
    ],
    "max_tokens": 256
  }'
```

预期返回（节选）：

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "model": "deepseek-v4.1-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "RESTful API 是一种基于 HTTP 协议和标准方法（GET/POST/PUT/DELETE）来操作资源的设计风格。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 28,
    "total_tokens": 40
  }
}
```

## 4. 根据场景选择协议

| 使用场景 | 推荐协议 | Base URL |
| :--- | :--- | :--- |
| OpenAI SDK、Cherry Studio、NextChat、LobeChat | OpenAI Chat Completions | `https://api.bozzii.com/v1` |
| OpenAI 新版 Responses 接口 | OpenAI Responses | `https://api.bozzii.com/v1` |
| Anthropic SDK、Claude Code | Anthropic Messages | `https://api.bozzii.com`（不带 `/v1`） |
| 图像生成（GPT Image） | OpenAI Images | `https://api.bozzii.com/v1` |

下一步建议阅读 [Base URL 与鉴权](/guides/base-url-auth/)，避免路径拼接错误。
