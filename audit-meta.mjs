// audit-meta.mjs — V3.3 现状审计：title / description / H1
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

const files = walk('dist');
console.log('Total HTML files:', files.length);

const titles = {};
const descs = {};
const titleTooLong = [];
const descTooLong = [];
const h1Problems = [];

for (const f of files) {
  const html = fs.readFileSync(f, 'utf-8');
  const tm = html.match(/<title>([^<]*)<\/title>/);
  const dm = html.match(/<meta name="description" content="([^"]*)"/);
  const t = tm ? tm[1].trim() : '';
  const d = dm ? dm[1].trim() : '';
  titles[t] = (titles[t] || 0) + 1;
  descs[d] = (descs[d] || 0) + 1;
  const rel = path.relative('dist', f);

  // Title 长度（Google 通常截断 60 字符）
  if (t.length > 60) titleTooLong.push({ file: rel, len: t.length, title: t });
  if (d.length > 160) descTooLong.push({ file: rel, len: d.length });

  // H1 数量
  const h1ms = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/g) || [];
  if (h1ms.length === 0) h1Problems.push({ file: rel, issue: 'NO H1' });
  else if (h1ms.length > 1) h1Problems.push({ file: rel, issue: h1ms.length + ' H1 tags' });
}

console.log('\n=== TITLE 重复 ===');
const titleDups = Object.entries(titles).filter(([k, v]) => v > 1 && k !== '');
titleDups.forEach(([k, v]) => console.log(`  ${v}x: ${k}`));
if (titleDups.length === 0) console.log('  ✓ 无重复');

console.log('\n=== DESCRIPTION 重复 ===');
const descDups = Object.entries(descs).filter(([k, v]) => v > 1 && k !== '');
descDups.forEach(([k, v]) => console.log(`  ${v}x: ${k.substring(0, 80)}...`));
if (descDups.length === 0) console.log('  ✓ 无重复');

console.log('\n=== TITLE 超长（>60 字符）===');
titleTooLong.forEach(x => console.log(`  ${x.file}: ${x.len} chars — "${x.title}"`));
if (titleTooLong.length === 0) console.log('  ✓ 全部 ≤60');

console.log('\n=== DESCRIPTION 超长（>160 字符）===');
descTooLong.forEach(x => console.log(`  ${x.file}: ${x.len} chars`));
if (descTooLong.length === 0) console.log('  ✓ 全部 ≤160');

console.log('\n=== H1 问题 ===');
h1Problems.forEach(x => console.log(`  ${x.file}: ${x.issue}`));
if (h1Problems.length === 0) console.log('  ✓ 每页正好 1 个 H1');