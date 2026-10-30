---
title: 第三方客户端
description: XSEEK、Cherry Studio 等客户端的配置要点。
---

1. 渠道类型选 **OpenAI 兼容**。客户端若有“支持 Responses API”开关，保持关闭即可，Chat Completions 对所有在线文本模型都可用。
2. Base URL 填 `https://api.bozzii.com/v1`。若要求填完整接口地址，填 `https://api.bozzii.com/v1/chat/completions`。不要填 `/v1/responses`，也不要漏掉 `/v1`。
3. 模型名必须与 `/v1/models` 返回的完全一致。
4. 对 `claude-sonnet-5-5`、`claude-fable-5`、`claude-opus-4-8`，把 temperature、top_p 留空或设为 1，否则返回 400。
5. 探测失败时，先在终端复现：

```bash
curl -s https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-xxxx" -H "content-type: application/json" \
  -d '{"model":"deepseek-v4-pro","messages":[{"role":"user","content":"hi"}],"max_tokens":64}'
```

错误对照见[常见错误](/guides/errors/)。
