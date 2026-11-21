---
title: 图像生成
description: 使用 GPT Image 与 Gemini 生图模型生成图片的参数、返回格式与超时配置。
---

:::caution[使用范围限制]
生图系列模型**不对个人用户开放，仅限经审核的企业客户用于内部开发、测试与调试**，不得用于面向中国境内公众的终端产品服务。接入前请阅读[服务条款](https://ai.bozzii.com/user-agreement)与[隐私政策](https://ai.bozzii.com/privacy-policy)。
:::

## GPT Image 系列（推荐）

通过标准 OpenAI Images 接口 `POST /v1/images/generations` 调用：

```bash
curl https://api.bozzii.com/v1/images/generations \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2.6-flare",
    "prompt": "a minimal flat illustration of a red apple on a wooden table",
    "n": 1
  }'
```

### 可用模型与返回格式差异

不同生图模型的返回字段有所不同，请在解析响应时同时兼容 `url` 与 `b64_json`：

| 模型 ID | 实测耗时 | 响应字段 | 说明 |
| :--- | :--- | :--- | :--- |
| `gpt-image-2.6-flare` | 约 20~35 秒 | `data[0].url` | 最新 2.6 系列，返回签名图片外链 |
| `gpt-image-2.6-sunburst` | 约 20~40 秒 | `data[0].url` | 最新 2.6 系列，返回签名图片外链 |
| `gpt-image-2.5-flare` | 约 13~25 秒 | `data[0].b64_json` | 返回 Base64 编码 PNG，需本地解码保存 |
| `gpt-image-2.5-sunburst` | 约 15~30 秒 | `data[0].b64_json` | 2.5 系列，返回 Base64 |
| `gpt-image-2` | 约 20~30 秒 | `data[0].url` | 返回签名图片外链 |

### 常用请求参数

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `model` | `string` | 必填，模型 ID（如 `gpt-image-2.6-flare`） |
| `prompt` | `string` | 必填，画面描述提示词 |
| `n` | `integer` | 可选，生成张数，默认 `1` |
| `size` | `string` | 可选，尺寸规格（部分 2.6 路由会根据模型默认比例自适应） |

:::tip[工程接入建议]
1. **及时转存外链**：`data[0].url` 为带有效期的签名对象存储链接，**请下载并转存至你自己的存储服务**，切勿直接长期持久化外链。
2. **超时设足 90~120 秒**：生图耗时通常在 `15~45 秒`（高并发下可能接近 60 秒），请务必将客户端读取超时设为 **90 秒以上**，并对 `502/503/524` 做有限次重试。
3. **不要传 `stream: true`**：生图接口仅支持同步非流式返回。
:::

## Gemini Nano Banana（走 Chat 接口）

`gemini-nano-banana-2.1` 需通过 `POST /v1/chat/completions`（**非流式**）调用，不能走 `/v1/images/generations`：

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-nano-banana-2.1",
    "messages": [{"role": "user", "content": "Draw a minimal red apple"}]
  }'
```

生成的图片会以 Markdown Base64 形式（`![image](data:image/png;base64,...)`）或图文块返回在响应中，实测耗时约 15~50 秒。网关非流式上限为 **120 秒**，客户端读取超时建议设为 **120 秒**（为大图下载预留余量）。
