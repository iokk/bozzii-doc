---
title: 视频接口说明
description: 为什么没有视频模型,以及可能的替代方案。
---

## 当前状态

平台**不提供**视频生成或视频理解模型,以下接口返回 404 或 503:

- `POST /v1/videos`
- `POST /v1/video/generations`
- `POST /v1/batches` (批量视频任务)

原因:

1. **上游模型商未开放**:主流 API 提供商(OpenAI、Anthropic、Google、DeepSeek 等)的视频能力尚未对外开放,或仅在特定区域、特定客户开放。
2. **成本与合规**:视频生成的计算成本、存储成本、内容审核要求远高于文本与图片,目前不具备商业可行性。

## 可能的替代方案

### 1. 视频理解(未来可能支持)

部分模型(如 Gemini、GPT-4 系列)已具备**视频理解**(读取视频帧、分析内容)能力,但 API 尚未开放。一旦上游开放,可能通过以下方式接入:

- 将视频 URL 或 base64 作为 `content` 的一部分传入
- 走 Messages 或 Chat 协议,与图片输入类似

### 2. 视频生成(短期内不可用)

市面上已有视频生成模型(Sora、Runway、Pika 等),但:

- API 未公开,或仅限企业客户
- 单次生成耗时数分钟,不适合实时 API 调用
- 内容审核与版权问题复杂

**当前建议**:使用专门的视频生成平台(Runway、Pika、剪映等),而非通过 LLM API。

### 3. 帧提取 + 图片理解

如果只需要理解视频内容(不生成视频),可以:

1. 用 ffmpeg 等工具提取关键帧
2. 将帧作为图片输入,通过[识图接口](/guides/vision/)分析
3. 结合帧之间的时间戳,推断视频内容

```bash
# 提取每秒一帧
ffmpeg -i video.mp4 -vf fps=1 frame_%04d.png

# 将帧 base64 编码后传给 API
base64 frame_0001.png | curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-xxxx" -H "content-type: application/json" \
  -d @- <<EOF
{
  "model": "glm-5.3",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "这一帧发生了什么?"},
      {"type": "image_url", "image_url": {"url": "data:image/png;base64,$(cat)"}}
    ]
  }]
}
EOF
```

## 何时会支持

我们会跟进上游模型商的开放进度。如果以下条件满足,会尽快接入:

- ✅ 上游 API 公开可用
- ✅ 成本可控(单次调用 < $1)
- ✅ 内容审核机制完备

订阅[更新日志](/guides/changelog/)获取最新进展。
