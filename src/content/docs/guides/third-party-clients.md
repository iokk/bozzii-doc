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

## 一键配置客户端与模型列表刷新（WorkBuddy / DSH / Claude Code / Codex）

平台控制台提供 [客户端一键配置](https://ai.bozzii.com/client-config)（支持 **WorkBuddy**、**DeepSeek Harness (DSH)**、**Claude Code**、**Codex**），自动根据你当前账号分组下发可用模型与配置。

:::tip[平台新增或下架模型后，如何 10 秒刷新本地列表？]
WorkBuddy 与 DSH 的自定义模型保存在你电脑本地配置文件（`~/.workbuddy/models.json`、`providers.yaml`）中，客户端不会自动拉取远程更新。当平台上线新模型或调整模型清单时：
1. 打开控制台 [客户端一键配置](https://ai.bozzii.com/client-config)，点击 **「生成提示词」**；
2. 将最新提示词重新粘贴发送给电脑上的 **WorkBuddy / DSH / Claude Code / Codex** 即可；
3. **无损覆盖**：刷新时仅替换本站（`api.bozzii.com` / `ai.bozzii.com`）写入的模型条目并先自动备份原文件，**不会修改或删除你配置的其他供应商模型**。
:::

## 客户端连通性自检

如果客户端提示连接失败，建议先在终端执行以下命令确认密钥与模型本身正常：

```bash
curl -s https://api.bozzii.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的令牌" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":64}'
```

若终端返回正常 JSON 而客户端报错，通常是因为客户端漏填 `/v1` 或多填了尾斜杠/重复路径。更多报错请参考 [常见错误与排查](/guides/errors/)。
