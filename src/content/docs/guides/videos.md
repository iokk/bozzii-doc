---
title: 视频生成
description: Seedance 2.5（sd-2.5 / sd-2.5-flash）通过 /v1/videos 与原生异步接口生成视频的参数规范、图生视频、参考图与画幅时长说明。
---

:::caution[使用范围限制]
视频生成能力**按分组开放（目前面向已开通视频权限的企业开发测试分组）**，请先通过 `GET /v1/models` 确认当前令牌可见对应模型。接入前请阅读[服务条款](https://ai.bozzii.com/user-agreement)与[隐私政策](https://ai.bozzii.com/privacy-policy)。
:::

## 可用模型与规格

当前在线的 Seedance 2.5 视频模型均基于火山方舟原生协议，支持**文生视频**、**单图图生视频（首帧）**与**多图/多模态参考生成**：

| 模型 ID | 支持分辨率 | 时长范围 | 参考素材上限 | 首尾帧（`first_frame` + `last_frame`） | 定位说明 |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `sd-2.5` | `480p` / `720p` / `1080p` | `4 ~ 30` 秒 | 最多 **30 图 + 10 视频 + 10 音频** | ❌ 当前暂不支持 | Seedance 2.5 标准满血版 |
| `sd-2.5-flash` | `480p` / `720p` | `4 ~ 30` 秒 | 最多 **10 图 + 5 视频 + 5 音频** | ❌ 当前暂不支持 | Seedance 2.5 Flash 轻量高速版 |

## 异步调用流程

视频生成属于异步任务，分为「提交任务」与「轮询结果」两步（实测 4 秒 480P 成片耗时约 **90 ~ 150 秒**）：

1. **创建任务**：`POST https://api.bozzii.com/v1/videos`（也支持火山方舟原生路径 `POST /api/v3/contents/generations/tasks`）
2. **查询状态**：`GET https://api.bozzii.com/v1/videos/{task_id}`（原生路径为 `GET /api/v3/contents/generations/tasks/{task_id}`）
3. **保存成片**：任务状态变为 `completed` / `succeeded` 后，从返回结果获取视频外链（或通过 `GET /v1/videos/{task_id}/content` 下载），**请及时下载转存至自有对象存储**，切勿长期持久化上游临时外链。

---

## 图生视频、首尾帧、参考图参数写法

:::important[四个经实测验证的硬规则]
1. **必须用 JSON 提交**：统一使用 `Content-Type: application/json`，**不支持 `multipart/form-data` 上传本地文件**。
2. **素材必须传公网 HTTP(S) URL**：图片、视频、音频均须为公网可直接下载的 `http://` 或 `https://` 链接，**不支持 Base64 Data URL**（传入 Base64 会直接返回 `references[0].url must be a public HTTP(S) URL`）。
3. **素材统一写在 `metadata.content` 中**：走 `/v1/videos` 时，请将素材数组放在 `metadata.content` 中（顶层 `input_reference` / `image` 字段不生效）；若直接调用原生 `/api/v3/contents/generations/tasks`，则将 `content` 放在 JSON 顶层。
4. **首尾帧说明**：当前在线的 `sd-2.5` 与 `sd-2.5-flash` **暂不支持同时传 `first_frame` + `last_frame`**（实测返回 `model does not support reference mode first_last_frame` / `生成模式与素材组合不一致`）。如需多图控制画面起止或角色风格，请改用 **多图参考（`role: "reference_image"`）** 配合提示词描述过渡。
:::

### 生成模式对照表

| 生成模式 | 支持状态 | 素材数量 | `metadata.content` 中的 `role` | `metadata.ratio` 要求 |
| :--- | :---: | :--- | :--- | :--- |
| **单图图生视频（首帧）** | ✅ 已实测通过 | 1 张图 | `role: "first_frame"` | 建议 `"adaptive"`（自动对齐首帧比例） |
| **首尾帧生成** | ❌ 暂不支持 | — | 当前路由不支持 `first_frame` + `last_frame` 组合 | — |
| **多图 / 多模态参考** | ✅ 已实测通过 | `sd-2.5` 最多 30 图 / 10 视频 / 10 音频；`sd-2.5-flash` 最多 10 图 / 5 视频 / 5 音频 | 图片 `role: "reference_image"`；视频 `type: "video_url", role: "reference_video"`；音频 `type: "audio_url", role: "reference_audio"` | 可自由指定画幅比例（如 `"16:9"`、`"9:16"`） |

### 示例 1：单图图生视频（首帧，走 `/v1/videos`）

```bash
curl https://api.bozzii.com/v1/videos \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sd-2.5-flash",
    "prompt": "镜头平滑向前推进，云层缓慢飘动，光影自然变化。",
    "seconds": 4,
    "metadata": {
      "resolution": "480p",
      "ratio": "adaptive",
      "generate_audio": false,
      "content": [
        {
          "type": "image_url",
          "image_url": { "url": "https://example.com/first_frame.png" },
          "role": "first_frame"
        }
      ]
    }
  }'
```

### 示例 2：多图 / 多模态参考生视频（走 `/v1/videos`）

```bash
curl https://api.bozzii.com/v1/videos \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sd-2.5",
    "prompt": "参考图中角色外观与场景风格，生成自然流畅的 16:9 镜头。",
    "seconds": 6,
    "metadata": {
      "resolution": "720p",
      "ratio": "16:9",
      "generate_audio": true,
      "content": [
        {
          "type": "image_url",
          "image_url": { "url": "https://example.com/ref_1.png" },
          "role": "reference_image"
        },
        {
          "type": "image_url",
          "image_url": { "url": "https://example.com/ref_2.png" },
          "role": "reference_image"
        }
      ]
    }
  }'
```

### 查询任务状态

```bash
curl https://api.bozzii.com/v1/videos/你的task_id \
  -H "Authorization: Bearer sk-你的令牌"
```

---

## 时长、分辨率与画幅比例

参数取值与火山方舟 Seedance 2.5 官方原版保持一致：

| 参数 | 位置（`/v1/videos`） | 支持取值 | 说明 |
| :--- | :--- | :--- | :--- |
| `seconds`（或 `duration`） | JSON 顶层 | `4 ~ 30`（整数秒）或 `-1` | 网关自动映射为上游 `duration`；传 `-1` 表示由模型自动决定时长 |
| `resolution` | `metadata.resolution` | `sd-2.5`：`480p` / `720p` / `1080p`<br/>`sd-2.5-flash`：`480p` / `720p` | 输出清晰度档位 |
| `ratio` | `metadata.ratio` | `16:9`、`9:16`、`1:1`、`4:3`、`3:4`、`21:9`、`adaptive` | 画幅比例；单图图生视频建议传 `adaptive` |
| `generate_audio` | `metadata.generate_audio` | `true` / `false` | 是否同时生成伴音 |

### 常见误区：不要传 `size: "854x480"`

:::tip[推荐写法]
在 `/v1/videos` 中，**不推荐**使用像素宽高 `size`（例如 `"size": "854x480"`）控制分辨率和画幅：
- `seconds` 可以继续放在顶层（网关会自动映射为上游 `duration`）；
- 但顶层 `size` 仅用于网关侧费用预估，**不会自动转换为上游的 `resolution` 与 `ratio`**。若只传 `size: "854x480"`，上游会忽略该字段并回退到默认规格。
- 请统一改用 **`seconds`（顶层）+ `metadata.resolution` + `metadata.ratio`**。
:::
