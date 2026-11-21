---
title: 多模态识图与工具调用
description: 使用 Chat、Messages、Responses 协议传入图片，以及标准 Tool Calling（函数调用）写法。
---

## 多模态识图（图片输入）

支持 `PNG`、`JPEG`、`WebP`、`GIF` 格式的图片输入，可通过 **Base64 Data URI** 或 **公开 HTTPS 链接** 传入（建议单张图片小于 20 MB）。国产模型推荐使用 `glm-5.3`。

### Chat Completions 写法

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-5.3",
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "请描述这张图片的内容"},
        {
          "type": "image_url",
          "image_url": {"url": "https://example.com/image.jpg"}
        }
      ]
    }],
    "max_tokens": 512
  }'
```

如需使用 Base64，将 `url` 替换为 `"data:image/png;base64,iVBORw0KGgo..."`。

### Anthropic Messages 写法

```json
{
  "model": "glm-5.3",
  "max_tokens": 512,
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "请描述这张图片的内容"},
      {
        "type": "image",
        "source": {
          "type": "base64",
          "media_type": "image/png",
          "data": "iVBORw0KGgo..."
        }
      }
    ]
  }]
}
```

### OpenAI Responses 写法

```json
{
  "model": "glm-5.3",
  "input": [{
    "role": "user",
    "content": [
      {"type": "input_text", "text": "请描述这张图片的内容"},
      {"type": "input_image", "image_url": "data:image/png;base64,iVBORw0KGgo..."}
    ]
  }]
}
```

:::tip[票据与小字识别建议]
识别包含密集小字、表格或票据的截图时，建议先对关键区域适当裁剪或放大，可显著提升文字提取准确率。
:::

---

## Tool Calling（函数调用）

主流文本模型（如 `deepseek-v4.1-flash`、`deepseek-v4-pro`、`glm-5.3`、`mimo-v2.6-flash`、`gpt-6.2-sol`、`claude-sonnet-5-5`）均支持标准 Function Calling / Tools 协议。

### Chat Completions 示例

```bash
curl https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4.1-flash",
    "messages": [
      {"role": "user", "content": "帮我查一下北京今天的天气"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "查询指定城市的实时天气",
          "parameters": {
            "type": "object",
            "properties": {
              "city": {"type": "string", "description": "城市名称，例如 北京"}
            },
            "required": ["city"]
          }
        }
      }
    ],
    "max_tokens": 256
  }'
```

模型需要调用工具时，会在 `choices[0].message.tool_calls` 中返回函数名与 JSON 参数字符串，`finish_reason` 为 `"tool_calls"`；客户端执行函数后，将结果以 `role: "tool"` 消息回传即可完成多轮调用。
