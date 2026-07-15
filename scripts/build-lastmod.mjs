/**
 * build-lastmod.mjs — 从 git 历史提取每个页面源文件的最后修改日期。
 * 输出 src/data/_lastmod.json，供 sitemap.xml.ts 使用。
 *
 * 用法: node scripts/build-lastmod.mjs  (在 prebuild 阶段自动调用)
 */
import { execSync } from 'node:child_process';
import { readdirSync, writeFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

/** 获取文件的 git 最后提交日期（ISO 格式截断到日） */
function getGitDate(filePath) {
  try {
    const iso = execSync(`git log -1 --format=%aI -- "${filePath}"`, {
      cwd: ROOT,
      encoding: 'utf-8',
    }).trim();
    return iso ? iso.split('T')[0] : null;
  } catch {
    return null;
  }
}

// 路径 → 源文件的映射关系
const pathToFile = {};

// Core pages
const coreMap = {
  '/': 'src/pages/index.astro',
  '/best-encrypted-messaging-apps/': 'src/pages/best-encrypted-messaging-apps.astro',
  '/groups/': 'src/pages/groups.astro',
  '/faq/': 'src/pages/faq.astro',
  '/launch-countdown/': 'src/pages/launch-countdown.astro',
  '/communities-shutdown/': 'src/pages/communities-shutdown.astro',
  '/how-to-create-group-link/': 'src/pages/how-to-create-group-link.astro',
  '/how-to-join-xchat-group/': 'src/pages/how-to-join-xchat-group.astro',
  '/what-is-xchat/': 'src/pages/what-is-xchat.astro',
  '/web/': 'src/pages/web.astro',
  '/android/': 'src/pages/android.astro',
  '/vs/whatsapp/': 'src/pages/vs/whatsapp.astro',
  '/vs/signal/': 'src/pages/vs/signal.astro',
  '/vs/telegram/': 'src/pages/vs/telegram.astro',
  '/list-your-group/': 'src/pages/list-your-group.astro',
  '/about/': 'src/pages/about.astro',
  '/privacy/': 'src/pages/privacy.astro',
  '/terms/': 'src/pages/terms.astro',
  '/contact/': 'src/pages/contact.astro',
  '/affiliate-disclosure/': 'src/pages/affiliate-disclosure.astro',
};
Object.assign(pathToFile, coreMap);

// Reviews
const reviewDir = resolve(ROOT, 'src/pages/reviews');
for (const f of readdirSync(reviewDir).filter((n) => n.endsWith('.astro'))) {
  const slug = basename(f, '.astro');
  pathToFile[`/reviews/${slug}/`] = `src/pages/reviews/${f}`;
}

// Compare
const compareDir = resolve(ROOT, 'src/pages/compare');
for (const f of readdirSync(compareDir).filter((n) => n.endsWith('.astro'))) {
  const slug = basename(f, '.astro');
  pathToFile[`/compare/${slug}/`] = `src/pages/compare/${f}`;
}

// Build lastmod map
const lastmod = {};
const fallback = new Date().toISOString().split('T')[0];

for (const [urlPath, filePath] of Object.entries(pathToFile)) {
  lastmod[urlPath] = getGitDate(filePath) || fallback;
}

const outPath = resolve(ROOT, 'src/data/_lastmod.json');
writeFileSync(outPath, JSON.stringify(lastmod, null, 2) + '\n');

console.log(`[build-lastmod] Generated ${Object.keys(lastmod).length} entries → src/data/_lastmod.json`);
