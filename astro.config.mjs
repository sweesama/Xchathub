import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://xchat.directory',
  output: 'static',
  // sitemap.xml 由 src/pages/sitemap.xml.ts 动态生成（每次构建自动更新 lastmod）
  integrations: [
    // Partytown：把第三方脚本（GA/gtag）挪到 Web Worker，不阻塞主线程
    // forward: dataLayer.push 让 gtag() 调用能正确代理到 worker
    partytown({
      config: {
        forward: ['dataLayer.push', 'gtag'],
        debug: false,
      },
    }),
  ],
});
