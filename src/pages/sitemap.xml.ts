/**
 * sitemap.xml.ts — 动态生成站点地图
 * 每次构建自动更新 lastmod，按页面重要性设置 priority 和 changefreq
 */
import type { APIRoute } from 'astro';
import { GROUP_CATEGORY_META } from '../data/groupCategoryMeta';

const SITE = 'https://xchat.directory';

// 主页面清单：新增页面时在这里加一条即可
const corePages = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/groups/', priority: 0.9, changefreq: 'daily' },
  { path: '/faq/', priority: 0.85, changefreq: 'weekly' },
  { path: '/launch-countdown/', priority: 0.9, changefreq: 'daily' },
  { path: '/communities-shutdown/', priority: 0.9, changefreq: 'daily' },
  { path: '/how-to-create-group-link/', priority: 0.9, changefreq: 'weekly' },
  { path: '/web/', priority: 0.9, changefreq: 'weekly' },
  { path: '/android/', priority: 0.95, changefreq: 'daily' },
  { path: '/vs/whatsapp/', priority: 0.75, changefreq: 'monthly' },
  { path: '/vs/signal/', priority: 0.75, changefreq: 'monthly' },
  { path: '/vs/telegram/', priority: 0.75, changefreq: 'monthly' },
  { path: '/list-your-group/', priority: 0.7, changefreq: 'weekly' },
  { path: '/about/', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy/', priority: 0.3, changefreq: 'monthly' },
];

// 分类着陆页（自动生成，确保与路由保持同步）
const categoryPages = GROUP_CATEGORY_META.map((m) => ({
  path: `/groups/${m.slug}/`,
  priority: 0.8,
  changefreq: 'weekly' as const,
}));

const pages = [...corePages, ...categoryPages];

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
