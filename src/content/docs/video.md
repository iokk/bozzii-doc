---
title: 视频接口说明
description: 为什么不支持视频模型及可能的替代方案
---

# 视频接口说明

## 当前状态

**博子 AI 目前不支持视频理解模型**。

原因:
1. **上游供应商限制** - Gemini、Claude 等的视频理解 API 仍处于有限可用或试验阶段
2. **成本与复杂度** - 视频处理需要更复杂的基础设施和更高的成本
3. **需求优先级** - 目前客户主要需求集中在文本和图片

## 替代方案

如果需要分析视频内容,可以采用以下方案:

### 1. 帧提取 + 识图

将视频拆分为关键帧,使用识图接口逐帧分析:

```python
import cv2
import base64
from openai import OpenAI

# 提取视频帧
video = cv2.VideoCapture('video.mp4')
fps = video.get(cv2.CAP_PROP_FPS)
frame_interval = int(fps * 2)  # 每2秒提取一帧

frames = []
frame_count = 0
while video.isOpened():
    ret, frame = video.read()
    if not ret:
        break
    if frame_count % frame_interval == 0:
        _, buffer = cv2.imencode('.jpg', frame)
        base64_image = base64.b64encode(buffer).decode('utf-8')
        frames.append(base64_image)
    frame_count += 1
video.release()

# 使用识图接口分析每一帧
client = OpenAI(
    base_url="https://api.bozzii.com/v1",
    api_key="sk-uQm9LJn9rDqfvE073hMpytXHJcO4UzXE5lMjYL0gyBlgVFaa"
)

for i, frame in enumerate(frames):
    response = client.chat.completions.create(
        model="glm-4-flashx",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": f"这是视频的第 {i*2} 秒,请描述画面内容"},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{frame}"}}
            ]
        }]
    )
    print(f"帧 {i}: {response.choices[0].message.content}")
```

### 2. 音频转文字 + 文本分析

如果视频主要是语音内容,可以:
1. 提取音频轨道
2. 使用语音识别服务(如阿里云、腾讯云)转为文字
3. 使用博子 AI 的文本模型分析对话内容

```python
# 提取音频
import subprocess
subprocess.run(['ffmpeg', '-i', 'video.mp4', '-vn', '-acodec', 'pcm_s16le', 'audio.wav'])

# 使用语音识别服务(这里需要接入第三方服务)
# transcript = speech_to_text('audio.wav')

# 使用文本模型分析
response = client.chat.completions.create(
    model="deepseek-v3",
    messages=[{
        "role": "user",
        "content": f"以下是视频的对话内容,请总结要点:\n\n{transcript}"
    }]
)
```

### 3. 字幕 + 关键帧组合

如果视频有字幕:
1. 提取字幕文件(.srt/.vtt)
2. 提取关键帧
3. 将字幕和画面描述组合后分析

## 未来计划

我们正在评估视频理解功能的可行性,可能在以下情况下提供支持:

1. **上游供应商正式开放** - Gemini/GPT-4o 等模型的视频 API 进入稳定版本
2. **客户需求验证** - 有足够的客户需要这个功能
3. **成本可控** - 能够以合理的价格提供服务

如果你有视频理解需求,欢迎联系我们,我们会根据需求优先级调整开发计划。

## 相关文档

- [识图接口](/guides/vision)
- [可用模型清单](/models-full)
- [API 完整规范](/api-specification)
