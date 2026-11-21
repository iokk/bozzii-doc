---
title: Claude Code 接入指南
description: 在 Claude Code 中配置铂子 API，支持 Claude 系列及国产 GLM / MiMo 模型。
---

Claude Code 使用 Anthropic Messages 协议。接入铂子 API 时，**`ANTHROPIC_BASE_URL` 请填写 `https://api.bozzii.com`（不要加 `/v1`）**。

:::caution[合规范围提示]
在 Claude Code 中使用 `claude-*`、`gpt-*` 等海外模型，仅限经审核的企业客户用于内部开发、测试与调试，请遵守[服务条款](https://ai.bozzii.com/user-agreement)与[隐私政策](https://ai.bozzii.com/privacy-policy)。如需长期用于国产模型编码，可按下方 `modelPicker` 配置切换至 `glm-5.3` 或 `mimo-v2.6-pro`。
:::

## 方式一：环境变量（临时/终端会话）

```bash
export ANTHROPIC_BASE_URL="https://api.bozzii.com"   # 不要加 /v1
export ANTHROPIC_API_KEY="sk-你的令牌"
claude --model claude-sonnet-5-5
```

## 方式二：写入 `~/.claude/settings.json`（长期生效）

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.bozzii.com",
    "ANTHROPIC_API_KEY": "sk-你的令牌"
  }
}
```

配置完成后，可通过 `claude --model <模型名>` 启动，或在会话内使用 `/model <模型名>` 切换。

## 在 Claude Code 中使用非 Claude 模型（GLM / MiMo / GPT）

Claude Code 本地会校验模型目录；未内置的模型名直接传入会触发本地报错 `"<model>" isn't described by this version's model catalog`。在 Claude Code `2.1.257` 及以上版本中，可在 `~/.claude/settings.json` 通过 `modelPicker` 声明：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.bozzii.com",
    "ANTHROPIC_API_KEY": "sk-你的令牌"
  },
  "modelPicker": {
    "options": [
      { "model": "glm-5.3", "label": "GLM 5.3", "behavesAs": "claude-sonnet-5-5" },
      { "model": "mimo-v2.6-pro", "label": "MiMo V2.6 Pro", "behavesAs": "claude-sonnet-5-5" },
      { "model": "gpt-6.2-sol", "label": "GPT 6.2 Sol", "behavesAs": "claude-sonnet-5-5" }
    ]
  }
}
```

:::note[协议兼容说明]
`glm-5.3`、`glm-5.3-flash`、`hy4`、`mimo-v2.6-pro`、`gpt-6.2-sol` 均原生兼容 `/v1/messages` 接口。`deepseek-*` 系列当前仅支持 Chat Completions 与 Responses 协议，不建议用于 Claude Code。
:::
