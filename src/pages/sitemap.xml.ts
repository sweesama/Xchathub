/**
 * sitemap.xml.ts — 动态生成站点地图
 * 每次构建自动更新 lastmod，按页面重要性设置 priority 和 changefreq
 */
import type { APIRoute } from 'astro';

const SITE = 'https://xchat.wiki';

// 页面清单：新增页面时在这里加一条即可
const pages = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/groups/', priority: 0.9, changefreq: 'daily' },
  { path: '/list-your-group/', priority: 0.7, changefreq: 'weekly' },
  { path: '/about/', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy/', priority: 0.3, changefreq: 'monthly' },
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const urlEntries = pages
    .map(
      (p) => `  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
