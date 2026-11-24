import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeRapide from 'starlight-theme-rapide';

export default defineConfig({
  site: 'https://doc.bozzii.com',
  integrations: [
    starlight({
      title: '铂子 API 文档',
      plugins: [starlightThemeRapide()],
      customCss: ['./src/styles/custom.css'],
      defaultLocale: 'root',
      locales: { root: { label: '简体中文', lang: 'zh-CN' } },
      sidebar: [
        {
          label: '快速入门',
          items: [
            { slug: 'guides/quickstart' },
            { slug: 'guides/base-url-auth' },
          ],
        },
        {
          label: '协议与能力',
          items: [
            { slug: 'guides/endpoints' },
            { slug: 'guides/streaming' },
            { slug: 'guides/vision' },
            { slug: 'guides/images' },
            { slug: 'guides/videos' },
          ],
        },
        {
          label: '模型与计费',
          items: [
            { slug: 'guides/models' },
          ],
        },
        {
          label: '客户端与 SDK',
          items: [
            { slug: 'guides/sdk' },
            { slug: 'guides/claude-code' },
            { slug: 'guides/third-party-clients' },
          ],
        },
        {
          label: '最佳实践与排错',
          items: [
            { slug: 'guides/errors' },
            { slug: 'guides/retry' },
            { slug: 'guides/security-and-support' },
          ],
        },
        {
          label: '更新日志',
          items: [
            { slug: 'guides/changelog' },
          ],
        },
      ],
    }),
  ],
});
