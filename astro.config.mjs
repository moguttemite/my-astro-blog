// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://mogutteru-oui.com',
  integrations: [mdx(), sitemap()],

  // NOTE: 为何删掉 src/content.config.ts，改用 legacy？
  // 之前使用 Astro v5 新 Content Layer：在 src/content.config.ts 中用 glob()
  // 定义 blog / blog_ja，指定 base: './src/content/blog' 等。在 Windows +
  // 非 ASCII 路径（中文/日文目录）下，getCollection('blog') 与 getCollection('blog_ja')
  // 一直返回空，终端报 "The collection does not exist or is empty"，首页与 /ja 无法渲染卡片。
  // 因此改为 legacy：删掉 src/content.config.ts，在 src/content/config.ts 中用 type: 'content'
  // 定义 blog、blog_ja，启用下方 legacy.collections，由 Astro 按 src/content/{collection}/ 自动扫目录。
  // --- 官方修复该 bug 后，迁回新 Content Layer 的步骤建议 ---
  // 1. 新建 src/content.config.ts，用 glob 定义 blog、blog_ja，例如：
  //    loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' })
  // 2. 确认本地/CI 下 getCollection('blog')、getCollection('blog_ja') 能返回文章
  // 3. 关闭本项 legacy: { collections: true }
  // 4. 删除 src/content/config.ts
  // 相关 issue：https://github.com/withastro/astro/issues/12795
  legacy: { collections: true },

  // i18n: 中文(默认无前缀) / 日本語(/ja/*) / English(/en/*)
  i18n: {
    locales: ['zh', 'ja', 'en'],
    defaultLocale: 'zh',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
