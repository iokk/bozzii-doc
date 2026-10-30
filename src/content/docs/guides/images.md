---
title: 生图
description: Gemini 与 GPT Image 的调用方法。
---

## Gemini 3 Pro（推荐，约 13～15 秒）

```bash
curl "https://api.bozzii.com/v1beta/models/gemini-3-pro-image:generateContent" \
  -H "x-goog-api-key: sk-xxxx" -H "content-type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Draw a red apple"}]}]}'
```

响应的 `candidates[0].content.parts` 有三段：思考文本（`thought: true`）、`fileData`（`fileUri` 即图片链接，JPEG）、一段 markdown 图片链接。

- 图片是**外链**，托管在第三方域名，不在 `api.bozzii.com` 下。请自行下载保存，不要假设长期有效。
- 也可以走 `POST /v1/chat/completions`（非流式），链接以 markdown 形式出现在 `content` 里。
- 不能走 `/v1/responses`（400）和 `/v1/images/generations`（404）。任何协议带 `stream: true` 都会被拒绝。

## GPT Image（`gpt-image-2.5-flare`，约 28 秒）

```bash
curl https://api.bozzii.com/v1/images/generations \
  -H "Authorization: Bearer sk-xxxx" -H "content-type: application/json" \
  -d '{"model":"gpt-image-2.5-flare","prompt":"a red apple","size":"1024x1024"}'
```

返回 `data[0].b64_json`（base64 PNG）。

耗时接近网关的 30 秒超时上限，非流式请求超时会得到 `524`。客户端要做重试，读取超时设为 60 秒以上。
