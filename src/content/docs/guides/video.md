---
title: 视频接口说明
description: 视频生成接口的当前状态与替代做法。
---

## 当前状态：暂不可用

模型列表里能看到字节跳动的视频模型（`doubao-seedance-2-0-260128`、`doubao-seedance-2-0-fast-260128`、`doubao-seedance-2-0-mini-260615`、`doubao-seedance-2-5-260628`、`seedance-2.5`），但 2026-11-04 实测都无法生成视频：

| 接口 | 实测结果 |
|---|---|
| `POST /v1/videos` | ❌ 503，`该模型由任务插件认领，但当前没有启用的渠道可服务此模型` |
| `POST /v1/video/generations` | ❌ 400，`model_price_error`（计费配置报错） |
| `POST /v1/contents/generations/tasks`（火山引擎原生路径） | ❌ 404，网关不支持该路径 |

结论：视频渠道当前没有启用，后台计费规则也未配置完整。渠道开通后会在[更新日志](/guides/changelog/)里通知，届时本页会补上调用示例。

:::note
视频生成通常是异步任务：提交后返回任务 ID，再轮询查询结果，单次耗时数十秒到数分钟。上线后请按异步方式接入，不要按普通对话接口的同步方式等待。
:::

## 替代做法：抽帧后识图

如果只需要理解视频内容（不生成视频），可以先抽取关键帧，再用[识图](/guides/vision/)接口逐帧分析。

```bash
# 每 2 秒抽一帧
ffmpeg -i video.mp4 -vf fps=0.5 frame_%04d.jpg
```

```python
import base64
from openai import OpenAI

client = OpenAI(base_url="https://api.bozzii.com/v1", api_key="sk-xxxx")

with open("frame_0001.jpg", "rb") as f:
    img = base64.b64encode(f.read()).decode()

resp = client.chat.completions.create(
    model="glm-5.3",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "描述这一帧画面的内容"},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img}"}},
        ],
    }],
    max_tokens=512,
)
print(resp.choices[0].message.content)
```

逐帧结果可以再交给文本模型汇总成整段视频的摘要。
