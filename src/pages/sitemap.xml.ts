/**
 * sitemap.xml.ts — 站点地图
 *
 * 2026 重新设计后包括：
 *   - 旧 XChat 资产（保留）
 *   - 新增 Reviews（10 个 app 各一页）
 *   - 新增 Compare（核心对比页）
 *   - 新增 Best-Of 榜单页
 *   - 新增 Groups 按分类（自动生成）
 *
 * 每次构建自动更新 lastmod，按页面重要性设置 priority 和 changefreq。
 */
import type { APIRoute } from 'astro';
import { GROUP_CATEGORY_META } from '../data/groupCategoryMeta';
import { MESSAGING_APPS } from '../data/messagingApps';
import lastmodMap from '../data/_lastmod.json';

/** Review 评测页白名单（只列出已存在页面的 slug，避免 sitemap 里出现死链）。
 *  新增评测页时，同时把 slug 加到这里。 */
const PUBLISHED_REVIEW_SLUGS = new Set<string>([
  'signal',
  'threema',
  'xchat',
  'wire',
  'session',
  'element',
  'whatsapp',
  'telegram',
  'briar',
  'simplex',
]);

const SITE = 'https://xchat.directory';

// 主要内容页（每改一次就改这里的 priority）
const corePages = [
  // ---- 新顶级页面（2026 重新定位的核心） ----
  { path: '/best-encrypted-messaging-apps/', priority: 1.0, changefreq: 'monthly' as const },

  // ---- 旧 XChat 资产（保留） ----
  { path: '/', priority: 1.0, changefreq: 'daily' as const },
  { path: '/groups/', priority: 0.9, changefreq: 'daily' as const },
  { path: '/faq/', priority: 0.85, changefreq: 'weekly' as const },
  { path: '/launch-countdown/', priority: 0.85, changefreq: 'monthly' as const },
  { path: '/communities-shutdown/', priority: 0.85, changefreq: 'monthly' as const },
  { path: '/how-to-create-group-link/', priority: 0.85, changefreq: 'weekly' as const },
  { path: '/how-to-join-xchat-group/', priority: 0.85, changefreq: 'weekly' as const },
  { path: '/what-is-xchat/', priority: 0.85, changefreq: 'weekly' as const },
  { path: '/web/', priority: 0.85, changefreq: 'weekly' as const },
  { path: '/android/', priority: 0.9, changefreq: 'weekly' as const },

  // ---- 旧 XChat 对比页（保留，作为品牌资产） ----
  { path: '/vs/whatsapp/', priority: 0.75, changefreq: 'monthly' as const },
  { path: '/vs/signal/', priority: 0.75, changefreq: 'monthly' as const },
  { path: '/vs/telegram/', priority: 0.75, changefreq: 'monthly' as const },

  // ---- 法务 / 资源 ----
  { path: '/list-your-group/', priority: 0.7, changefreq: 'weekly' as const },
  { path: '/about/', priority: 0.5, changefreq: 'monthly' as const },
  { path: '/privacy/', priority: 0.3, changefreq: 'monthly' as const },
  { path: '/terms/', priority: 0.3, changefreq: 'monthly' as const },
  { path: '/contact/', priority: 0.4, changefreq: 'monthly' as const },
  { path: '/affiliate-disclosure/', priority: 0.3, changefreq: 'monthly' as const },
];

/** Reviews: 只从中央数据中选出已发布的 app，未发布的不会进 sitemap */
const reviewPages = MESSAGING_APPS
  .filter((app) => PUBLISHED_REVIEW_SLUGS.has(app.slug))
  .map((app) => ({
    path: `/reviews/${app.slug}/`,
    priority: 0.9,
    changefreq: 'monthly' as const,
  }));

/** Compare: 当前出货的对比页 — 之后扩展时编辑这里 */
const comparePages = [
  { path: '/compare/signal-vs-threema/', priority: 0.95, changefreq: 'monthly' as const },
  { path: '/compare/signal-vs-telegram/', priority: 0.9, changefreq: 'monthly' as const },
  { path: '/compare/whatsapp-vs-signal/', priority: 0.9, changefreq: 'monthly' as const },
  { path: '/compare/wire-vs-signal-vs-threema/', priority: 0.92, changefreq: 'monthly' as const },
  { path: '/compare/signal-vs-whatsapp-vs-telegram/', priority: 0.95, changefreq: 'monthly' as const },
  { path: '/compare/signal-vs-whatsapp-security/', priority: 0.95, changefreq: 'monthly' as const },
  { path: '/compare/signal-vs-telegram-security/', priority: 0.95, changefreq: 'monthly' as const },
  { path: '/compare/imessage-vs-signal/', priority: 0.9, changefreq: 'monthly' as const },
];

/** Groups by category（自动生成）*/
const categoryPages = GROUP_CATEGORY_META.map((m) => ({
  path: `/groups/${m.slug}/`,
  priority: 0.75,
  changefreq: 'weekly' as const,
}));

const pages = [
  ...corePages,
  ...reviewPages,
  ...comparePages,
  ...categoryPages,
];

export const GET: APIRoute = () => {
  const fallback = new Date().toISOString().split('T')[0];

  const urlEntries = pages
    .map(
      (p) => `  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${(lastmodMap as Record<string, string>)[p.path] || fallback}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(2)}</priority>
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
