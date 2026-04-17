import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://xchat.directory',
  output: 'static',
  // sitemap.xml 由 src/pages/sitemap.xml.ts 动态生成（每次构建自动更新 lastmod）
});
