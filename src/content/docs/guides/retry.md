---
title: 超时、重试与生产最佳实践
description: 面向生产环境的超时配置、可重试状态码判断与并发控制建议。
---

## 超时配置建议

不同任务的响应耗时差异较大，请勿对所有接口使用同一个短超时：

| 场景 | 建议客户端读取超时 | 说明 |
| :--- | :--- | :--- |
| 普通短对话（非流式） | `30~60 秒` | 主力 Flash 模型通常 `2~5 秒` 返回 |
| 长文本 / 复杂推理 | `60~120 秒` + **开启流式** | 使用 `stream: true` 避免网关非流式超时（`524`） |
| 图像生成（GPT Image） | `90~120 秒` | 实测耗时约 `13~45 秒`，高并发下可能接近 `60 秒` |
| 图像生成（Nano Banana） | `120~180 秒` | 响应体较大，需预留充足下载时间 |

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

## 并发与高可用建议

1. **客户端限流**：批量任务建议使用信号量（Semaphore）或队列控制并发度，避免瞬间突发高并发触发 `429` 或上游拥塞。
2. **动态容灾切换**：建议在业务侧保留「主力模型 + 备选模型」降级配置（例如 `deepseek-v4.1-flash` 异常时自动切换至 `mimo-v2.6-flash` 或 `glm-5.3-flash`）。
3. **保留请求追踪信息**：记录响应状态码、耗时与错误体中的 `request id`，如遇问题提交工单时一并提供，可大幅加快排查效率。
