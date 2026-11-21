---
title: 第三方客户端配置
description: Cherry Studio、NextChat、LobeChat 等桌面与 Web 客户端接入铂子 API 的通用配置。
---

大多数第三方 AI 客户端均支持 **OpenAI 兼容（OpenAI-Compatible）** 模式。

## 通用填写项

| 配置项 | 填写值 | 说明 |
| :--- | :--- | :--- |
| 接口类型 / 协议 | OpenAI 兼容 | 若客户端有“启用 Responses API”开关，建议保持关闭，使用 Chat Completions 兼容性最好 |
| API 地址（Base URL） | `https://api.bozzii.com/v1` | 如客户端要求填完整端点路径，则填 `https://api.bozzii.com/v1/chat/completions` |
| API 密钥（API Key） | `sk-你的令牌` | 从控制台获取 |
| 模型名称 | 与 `GET /v1/models` 一致 | 例如 `deepseek-v4.1-flash`、`glm-5.3`、`mimo-v2.6-flash` |

## 常见客户端示例

### Cherry Studio
- **接口地址**：`https://api.bozzii.com/v1`
- **API 密钥**：`sk-你的令牌`
- 点击「管理 / 获取模型」即可自动拉取当前在线模型列表。

### NextChat / LobeChat
- **接口地址（Base URL）**：`https://api.bozzii.com/v1`
- **API Key**：`sk-你的令牌`
- 自定义模型填写 `deepseek-v4.1-flash`、`deepseek-v4-pro` 或 `glm-5.3`。

## 客户端连通性自检

如果客户端提示连接失败，建议先在终端执行以下命令确认密钥与模型本身正常：

```bash
curl -s https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":64}'
```

若终端返回正常 JSON 而客户端报错，通常是因为客户端漏填 `/v1` 或多填了尾斜杠/重复路径。更多报错请参考 [常见错误与排查](/guides/errors/)。
