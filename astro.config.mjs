import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://doc.bozzii.com',
  integrations: [
    starlight({
      title: '铂子 API 文档',
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
