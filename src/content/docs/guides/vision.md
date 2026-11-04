---
title: 识图（图片输入）
description: 三种协议下传入图片的写法。
---

Chat、Messages、Responses 三种协议都支持图片输入，已用 `claude-sonnet-5-5`、`deepseek-v4-pro`、`glm-5.3` 验证。

| 协议 | 图片写法 |
|---|---|
| Chat | `{"type":"image_url","image_url":{"url":"data:image/png;base64,..."}}`，也可填 https 链接 |
| Messages | `{"type":"image","source":{"type":"base64","media_type":"image/png","data":"..."}}` |
| Responses | `{"type":"input_image","image_url":"data:image/png;base64,..."}` |

## 注意

- ~~`kimi-k3`~~（已下架）曾用于识图测试，对小字识别不准：52px 的字会出错，90px 以上全部正确。识别票据或截图时，先放大或裁剪。
- `glm-5.3` 会先由辅助视觉模型看图，再由 GLM 作答，回复开头会带“【辅助识图…】”标记。
