// audit-internal-links.mjs — V3.4 现状审计（修 path.sep bug）
import fs from 'node:fs';
import path from 'node:path';

function walk(d) {
  const r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) r.push(...walk(p));
    else if (p.endsWith('.html')) r.push(p);
  }
  return r;
}

// 统一用正斜杠
function rel(f) {
  return path.relative('dist', f).replace(/\\/g, '/');
}

const files = walk('dist');
const inlinks = {};
for (const f of files) inlinks[rel(f)] = new Set();

for (const f of files) {
  const html = fs.readFileSync(f, 'utf-8');
  const src = rel(f);
  const hrefs = [...html.matchAll(/<a[^>]+href="([^"]+)"/g)].map(m => m[1]);
  for (const href of hrefs) {
    let target = null;
    if (href.startsWith('https://xchat.directory/')) {
      target = href.replace('https://xchat.directory/', '').replace(/\/$/, '');
      if (target === '') target = 'index.html';
      else target = target + '/index.html';
    } else if (href.startsWith('/') && !href.startsWith('//')) {
      target = href.replace(/\/$/, '');
      if (target === '' || target === '/') target = 'index.html';
      else target = target.slice(1) + '/index.html';
    } else continue;

    if (target !== src && inlinks[target] !== undefined) {
      inlinks[target].add(src);
    }
  }
}

console.log('=== 内链统计（每页被多少个其他页面引用）===');
const stats = Object.entries(inlinks)
  .map(([page, sources]) => ({ page, count: sources.size }))
  .sort((a, b) => b.count - a.count);

console.log('\n🟢 内链最强 10 页:');
stats.slice(0, 10).forEach(s => console.log(`  ${s.page} : ${s.count} links`));

console.log('\n🔴 孤儿页（0 内链进来）:');
const orphans = stats.filter(s => s.count === 0);
orphans.forEach(s => console.log(`  - ${s.page}`));
console.log(`  小计: ${orphans.length} 页`);

console.log('\n🟡 内链 < 3 的弱链接页:');
const weak = stats.filter(s => s.count > 0 && s.count < 3);
weak.forEach(s => console.log(`  - ${s.page} : ${s.count} links`));
console.log(`  小计: ${weak.length} 页`);

console.log('\n📊 全站平均内链:');
const avg = (stats.reduce((a, s) => a + s.count, 0) / stats.length).toFixed(1);
console.log(`  ${avg} links/page`);