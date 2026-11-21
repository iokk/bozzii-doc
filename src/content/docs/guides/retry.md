---
title: 超时、重试与生产最佳实践
description: 面向生产环境的超时配置、可重试状态码判断与并发控制建议。
---

## 超时配置建议

不同任务的响应耗时差异较大，请勿对所有接口使用同一个短超时：

| 场景 | 建议客户端读取超时 | 说明 |
| :--- | :--- | :--- |
| 普通短对话（非流式） | `30~60 秒` | 主力 Flash 模型通常 `2~5 秒` 返回；网关非流式上限 **120 秒** |
| 长文本 / 复杂推理 | `120~300 秒` + **开启流式** | 开启 `stream: true`，网关每 **10 秒** 发送 `: PING` 保活（空闲 **300 秒** / 总时长 **600 秒**） |
| 图像生成（GPT Image） | `90~120 秒` | 实测耗时约 `13~45 秒`，高并发下可能接近 `60 秒` |
| 图像生成（Nano Banana） | `120 秒` | 网关非流式上限 **120 秒**，响应体较大需预留下载余量 |

## 精准重试策略

**只对瞬时故障重试，不要对请求本身有误的 4xx 错误盲目重试**：

- **建议重试**：`429`、`500`（偶发）、`502`、`503`、`504`、`524`，以及网络连接超时/断开。
- **不要重试**：`400`（参数错误）、`401`（令牌无效）、`403`（权限/WAF 拦截）、`404`（路径错误）。

### Python 生产级重试示例（指数退避 + 抖动）

```python
import random
import time
from openai import APIStatusError, APITimeoutError, APIConnectionError

RETRYABLE_STATUS = {429, 500, 502, 503, 504, 524}

def call_with_retry(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except (APITimeoutError, APIConnectionError):
            if attempt == max_retries - 1:
                raise
        except APIStatusError as e:
            if e.status_code not in RETRYABLE_STATUS or attempt == max_retries - 1:
                raise

        wait = min((2 ** attempt) + random.uniform(0, 1), 10)
        time.sleep(wait)
```

## 并发与限流规范

为保障全站多租户稳定性，网关对单 IP 与单账户设置了温和的突发保护机制（超限将返回 `HTTP 429`）：

| 接口范围 | 边缘速率限制（单 IP） | 最大并发连接（单 IP） | 应用层模型速率上限 |
| :--- | :--- | :--- | :--- |
| 通用接口（`/v1/chat/completions`、`/v1/messages` 等） | `20 req/s`（允许 `60` 突发） | `100` 并发连接 | `300 RPM` / 用户模型 |
| 图像生成（`/v1/images/*`） | `3 req/s`（允许 `15` 突发） | `30` 并发连接 | `300 RPM` / 用户模型 |

1. **客户端限流**：批量任务建议使用信号量（Semaphore）或队列平滑并发（生图建议单客户端 ≤ 15 并发），避免瞬间突发触发 `429`。
2. **动态容灾切换**：建议在业务侧保留「主力模型 + 备选模型」降级配置（例如 `deepseek-v4.1-flash` 异常时自动切换至 `mimo-v2.6-flash` 或 `glm-5.3-flash`）。
3. **保留请求追踪信息**：记录响应状态码、耗时与错误体中的 `Request ID`，也可在控制台 [使用日志](https://ai.bozzii.com/usage-logs/common) 一键复制脱敏排障摘要，通过 [联系客服](/guides/security-and-support/) 提交，可大幅加快定位效率。
