# 铂子 API 文档站

基于 [Astro Starlight](https://starlight.astro.build/) 的静态文档站，部署在阿里云 ESA Pages。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物在 dist/
```

文档都在 `src/content/docs/`，Markdown 即页面。侧边栏顺序在 `astro.config.mjs` 的 `sidebar` 里调整。

## 更新流程

1. 修改 `src/content/docs/` 下的文件，在 `guides/changelog.md` 记一条。
2. 提交并推送到 `main`。
3. ESA Pages 检测到推送后自动构建并发布。

## ESA Pages 构建配置

| 项 | 值 |
|---|---|
| 框架预设 | Astro |
| 安装命令 | `npm ci` |
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| Node 版本 | 22 |

站点域名改动时，同步修改 `astro.config.mjs` 里的 `site`。

## 注意

文档里的令牌一律写作 `sk-xxxx`，不要提交真实 Key。
