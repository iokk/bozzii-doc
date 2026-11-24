---
title: 更新日志
description: 铂子 API 文档站点与接口能力更新记录。
---

## 2026-11-25

- **新增视频生成文档**：上线 [视频生成](/guides/videos/) 接入指南，补充 `sd-2.5` / `sd-2.5-flash` 的 `/v1/videos` 异步调用流程、图生视频/首尾帧/多模态参考参数规范、公网 URL 约束及 `metadata.resolution` / `metadata.ratio` 推荐写法。

## 2026-11-24

- **模型清单同步**：新增 Google Gemini 4 系列（`gemini-4-argon`、`gemini-4-carbon`、`gemini-4-hydrogen`、`gemini-4-neon`、`gemini-3.8-flash`）、`claude-fable-5-2` 与生图模型 `seedream-5-5`。

## 2026-11-22

- **全站文档重构**：统一品牌名称为「铂子 API」，合并冗余页面，按「快速入门 → 协议与能力 → 模型与计费 → 客户端与 SDK → 最佳实践与排错」重组结构。
- **补充网关限流与并发规范**：公开边缘与模型层温和限流参数（通用接口 `20 req/s` 突发 `60`、生图接口 `3 req/s` 突发 `15`、模型速率 `300 RPM`）。
- **实时校准模型与协议矩阵**：
  - 新增国产主力模型 `hy4`、`hy4-flash`、`mimo-v2.6-flash`、`mimo-v2.6-pro` 与 `deepseek-v4.1-flash`。
  - 新增国际主流开发测试模型 `gpt-6.2-sol`、`gpt-6.2-astra`、`grok-4.6`、`grok-4.7`；`claude-sonnet-5-5`、`claude-opus-5-5` 等支持通过 SDK / curl 与 Claude Code 直接调用。
  - 生图文档新增 `gpt-image-2.6-flare`、`gpt-image-2.6-sunburst` 与 `gemini-nano-banana-2.1` 说明。
  - 补充完整计费细则（7.30 汇率、缓存读写、长上下文阶梯、谷时半价、失败退费）、限流与超时保活参数（1,000/2,000 RPM、120s/300s/600s、10s `: PING`、100MB 请求体）以及[安全、隐私与客服支持](/guides/security-and-support/)指南。
- **修正代码示例**：修复重试示例中无差别重试 4xx 错误的逻辑，补充精准状态码过滤与 `User-Agent` 注意事项。

## 2026-11-04

- 更新模型清单、生图模型列表及接口状态说明。

## 2026-10-29

- 文档站点首次上线。
