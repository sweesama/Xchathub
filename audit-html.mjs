// audit-html.mjs — V3.7 HTML/技术 SEO 审计
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

function rel(f) { return path.relative('dist', f).replace(/\\/g, '/'); }

const files = walk('dist');
const missingAlt = [];
const noLang = [];
const multipleH1 = [];
const hugeImgsNoDim = [];

for (const f of files) {
  const html = fs.readFileSync(f, 'utf-8');
  const r = rel(f);

  // <html lang="...">
  const langMatch = html.match(/<html[^>]*lang="([^"]*)"/);
  if (!langMatch || !langMatch[1]) noLang.push(r);

  // <img> 缺 alt
  const imgs = [...html.matchAll(/<img[^>]*>/g)].map(m => m[0]);
  for (const img of imgs) {
    if (!img.includes('alt=')) missingAlt.push({ file: r, snippet: img.substring(0, 100) });
    if (!img.includes('width=') || !img.includes('height=')) {
      // 只记录大图（不是 icon）
      if (!img.includes('width="24"') && !img.includes('width="20"') && !img.includes('width="14"') && !img.includes('width="22"') && !img.includes('width="10"') && !img.includes('width="16"') && !img.includes('width="7"')) {
        hugeImgsNoDim.push({ file: r, snippet: img.substring(0, 100) });
      }
    }
  }
}

console.log('=== <html lang> 检查 ===');
console.log(`  缺失或空 lang: ${noLang.length}`);
noLang.forEach(f => console.log('   -', f));

console.log('\n=== <img alt> 检查 ===');
console.log(`  缺 alt 的 img: ${missingAlt.length}`);
missingAlt.slice(0, 10).forEach(x => console.log(`   - ${x.file}: ${x.snippet}`));

console.log('\n=== <img width/height> 检查 ===');
console.log(`  缺尺寸的较大 img: ${hugeImgsNoDim.length}`);
hugeImgsNoDim.slice(0, 5).forEach(x => console.log(`   - ${x.file}: ${x.snippet}`));

console.log('\n=== 总结 ===');
console.log(`  总 HTML 文件: ${files.length}`);
console.log(`  <html lang> 问题: ${noLang.length}`);
console.log(`  <img alt> 缺失: ${missingAlt.length}`);
console.log(`  大图缺尺寸: ${hugeImgsNoDim.length}`);