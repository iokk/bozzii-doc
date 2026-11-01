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
        { label: '快速开始', items: [
          { slug: 'guides/quickstart' },
          { slug: 'guides/base-url-auth' },
        ]},
        { label: '接口参考', items: [
          { slug: 'guides/endpoints' },
          { slug: 'guides/models' },
          { slug: 'guides/vision' },
          { slug: 'guides/images' },
          { slug: 'streaming' },
          { slug: 'video' },
          { slug: 'retry' },
        ]},
        { label: '完整规范', items: [
          { slug: 'api-specification', label: 'API 完整规范' },
          { slug: 'models-full', label: '可用模型清单' },
          { slug: 'quick-reference', label: '快速参考' },
        ]},
        { label: '客户端接入', items: [
          { slug: 'guides/claude-code' },
          { slug: 'guides/sdk' },
          { slug: 'guides/third-party-clients' },
        ]},
        { label: '排错与注意事项', items: [
          { slug: 'guides/errors' },
          { slug: 'guides/notes' },
        ]},
        { label: '更新日志', items: [{ slug: 'guides/changelog' }] },
      ],
    }),
  ],
});
