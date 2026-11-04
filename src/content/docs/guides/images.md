---
title: 生图
description: GPT Image 与 nano-banana 的调用方法。
---

:::danger[仅限开发测试]
生图模型都属于海外模型，仅供经审核的企业用于内部开发和测试，不得用于向终端用户或中国境内公众提供服务。Gemini 出图渠道（`gemini-3-pro-image`）已下架。
:::

## GPT Image（推荐）

`gpt-image-2.5-flare` 约 24 秒，返回 base64：

```bash
curl https://api.bozzii.com/v1/images/generations \
  -H "Authorization: Bearer sk-xxxx" -H "content-type: application/json" \
  -d '{"model":"gpt-image-2.5-flare","prompt":"a red apple","size":"1024x1024"}'
```

返回 `data[0].b64_json`（base64 编码的 PNG），解码后保存即可。

`gpt-image-2` 约 22 秒，写法相同，返回的是图片链接 `data[0].url`。链接托管在第三方域名，请自行下载保存，不要假设长期有效。

耗时接近网关的 30 秒超时上限，超时会得到 `524`。客户端读取超时设为 60 秒以上，并做重试。

## nano-banana（走 Chat 接口）

`nano-banana-2.1`、`nano-banana-pro` 不能走 `/v1/images/generations`（返回 500），要走 Chat 接口，且必须是非流式：

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-xxxx" -H "content-type: application/json" \
  -d '{"model":"nano-banana-2.1","messages":[{"role":"user","content":"Draw a red circle"}]}'
```

图片以 markdown 形式嵌在 `choices[0].message.content` 里，格式为 `![image](data:image/png;base64,...)`。

- 实测耗时约 50 秒以上，响应体 1～2 MB。读取超时至少设为 180 秒。
- 实测中多次出现读取中断（`IncompleteRead`），稳定性不如 GPT Image，生产测试建议优先用 `gpt-image-2.5-flare`。

## 不可用

| 模型 | 原因 |
|---|---|
| `gpt-image-2.5-sunburst` | 响应读取中断，暂不可用 |
| `gemini-3-pro-image`、`gemini-3-pro-image-preview` | 出图渠道已下架 |
