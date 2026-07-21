#!/usr/bin/env node
/**
 * check-csp-hashes.mjs — CSP 内联脚本 hash 守卫（postbuild 运行）
 *
 * 背景：站点用 hash-based CSP（vercel.json 的 script-src 列出每个可执行内联脚本的
 *       sha256），彻底去掉了 'unsafe-inline'。但 hash 是脆弱的——只要内联脚本内容
 *       变一个字节，hash 就失配，浏览器会静默拒绝执行该脚本（cookie banner / 返回顶部
 *       / Partytown 等会挂掉），而且线上才发现。
 *
 * 本脚本在 build 之后扫描 dist 里所有 HTML，找出「可执行内联脚本」（排除 src 外链、
 * application/ld+json 数据块、text/partytown 类型——这三类不受 script-src 约束），
 * 计算它们的 sha256，与 vercel.json 里声明的 hash 集合比对：
 *   - dist 里出现、但 vercel.json 没声明 → 致命错误（构建失败），并打印需要补的 hash
 *   - vercel.json 声明了、但 dist 里没出现 → 仅警告（可能是删了脚本忘了清 hash）
 *
 * 这样任何人改动内联脚本后，构建会立刻红灯提醒同步 CSP，而不是等线上功能坏掉。
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const VERCEL_JSON = join(ROOT, 'vercel.json');

if (!existsSync(DIST)) {
  console.error('[check-csp-hashes] ✗ dist/ 不存在，请先运行 astro build');
  process.exit(1);
}

/** 递归收集 dist 里所有 .html 文件路径 */
function collectHtml(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) collectHtml(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

/** 从一个 HTML 里提取可执行内联脚本的 sha256（返回 hash → 首次出现信息） */
function extractInlineHashes(html, file, out) {
  const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    const body = m[2];
    if (/\bsrc=/.test(attrs)) continue; // 外链脚本走 script-src host 白名单
    const tm = attrs.match(/type=["']([^"']*)["']/);
    const type = tm ? tm[1] : '';
    // 非 JS 类型（数据块 / Partytown）不被 script-src 约束
    if (type === 'application/ld+json' || type === 'text/partytown') continue;
    const hash = 'sha256-' + createHash('sha256').update(body, 'utf8').digest('base64');
    if (!out.has(hash)) out.set(hash, { file, preview: body.trim().slice(0, 60) });
  }
}

/** 从 vercel.json 的 CSP script-src 里解析已声明的 hash 集合 */
function declaredHashes() {
  const cfg = JSON.parse(readFileSync(VERCEL_JSON, 'utf8'));
  const rule = cfg.headers
    ?.flatMap((h) => h.headers ?? [])
    .find((h) => h.key === 'Content-Security-Policy');
  if (!rule) {
    console.error('[check-csp-hashes] ✗ vercel.json 里找不到 Content-Security-Policy');
    process.exit(1);
  }
  const set = new Set();
  for (const m of rule.value.matchAll(/'(sha256-[A-Za-z0-9+/=]+)'/g)) set.add(m[1]);
  return set;
}

const found = new Map();
for (const file of collectHtml(DIST)) {
  extractInlineHashes(readFileSync(file, 'utf8'), file, found);
}
const declared = declaredHashes();

const missing = [...found.keys()].filter((h) => !declared.has(h));
const unused = [...declared].filter((h) => !found.has(h));

console.log(`[check-csp-hashes] dist 内联脚本 hash: ${found.size}，vercel.json 声明: ${declared.size}`);

if (unused.length) {
  console.warn('[check-csp-hashes] ⚠ vercel.json 声明了但 dist 未使用（可清理）:');
  for (const h of unused) console.warn('    ' + h);
}

if (missing.length) {
  console.error('[check-csp-hashes] ✗ 以下内联脚本未在 vercel.json 的 CSP 中声明:');
  for (const h of missing) {
    const info = found.get(h);
    console.error(`    ${h}`);
    console.error(`      首次出现: ${info.file}`);
    console.error(`      预览: ${JSON.stringify(info.preview)}`);
  }
  console.error('[check-csp-hashes] 请把上述 hash 加入 vercel.json 的 script-src。');
  process.exit(1);
}

console.log('[check-csp-hashes] ✓ CSP script-src hash 与 dist 内联脚本完全一致');
