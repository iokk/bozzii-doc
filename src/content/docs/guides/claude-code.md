---
title: Claude Code
description: 在 Claude Code 中使用铂子 API。
---

:::caution[使用范围]
Claude Code 使用的是 Anthropic 协议。本页中的 `claude-*` 模型属于海外模型，仅限经审核的企业用于内部开发、测试和调试，不得用于向终端用户或中国境内公众提供服务。非 Claude 的国产模型也可以通过同样的配置使用，见[模型清单](/guides/models/)。
:::

## 环境变量（最简单）

```bash
export ANTHROPIC_BASE_URL="https://api.bozzii.com"   # 不要加 /v1
export ANTHROPIC_API_KEY="sk-xxxx"
claude --model claude-sonnet-5-5
```

## 写入 `~/.claude/settings.json`（长期生效）

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.bozzii.com",
    "ANTHROPIC_API_KEY": "sk-xxxx"
  }
}
```

## Claude 系模型

直接 `--model <模型名>`，或在会话里 `/model <模型名>`。

Claude 系列目前限制为只服务 Claude Code 客户端，用 curl 或 SDK 直接调用会被拒绝（403 或 503）。2026-11-04 用模拟 Claude Code 请求头的脚本测试，仍返回 `503 No available accounts`，说明账号池当时也没有可用账号。如果在 Claude Code 里同样报这个错，请稍后重试或改用下面的国产模型。

## 非 Claude 模型（DeepSeek、GLM）

Claude Code 自带的模型目录里没有这些名字，会在本地直接报错 `"deepseek-v4-pro" isn't described by this version's model catalog`，请求不会发到网关。需要 Claude Code 2.1.257 及以上，用 `modelPicker` 加 `behavesAs` 声明：

```json
{
  "modelPicker": {
    "options": [
      { "model": "deepseek-v4-pro", "label": "DeepSeek V4 Pro", "behavesAs": "claude-sonnet-5-5" },
      { "model": "glm-5.3",         "label": "GLM 5.3",         "behavesAs": "claude-sonnet-5-5" }
    ]
  }
}
```

然后 `claude --model deepseek-v4-pro`，或在 `/model` 里选择。

`ANTHROPIC_DEFAULT_SONNET_MODEL` 和 `ANTHROPIC_CUSTOM_MODEL_OPTION` 这两种写法实测无效，会被同一个目录检查拦截。

GPT 系列（如 `gpt-6-luna`、`gpt-5.6-sol`）的 Messages 接口 2026-11-04 实测已可用，也可以用同样的 `modelPicker` 写法接入。它们属于海外模型，同样只限开发测试。
