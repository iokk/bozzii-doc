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

直接 `--model <模型名>`，或在会话里 `/model <模型名>`。工具调用（Bash 等）实测通过。

## 非 Claude 模型（DeepSeek、GLM、Kimi）

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

:::caution
`gpt-6-astra`、`gpt-6.1-sol` 不能用于 Claude Code。Claude Code 只走 `/v1/messages`，而这两个模型的 Messages 接口目前返回 403。请通过 Chat 或 Responses 调用。
:::
