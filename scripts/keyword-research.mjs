#!/usr/bin/env node
/**
 * keyword-research.mjs — 关键词调研工具（不依赖付费 API）
 *
 * 设计目的：
 *   - 调 Google 自动补全免费接口（suggestqueries.google.com），
 *     抓取真实用户在搜的关键词，没有任何付费门槛。
 *   - 用多语言地区展开同一颗种子词，得到一个词的"全球热度信号"。
 *   - 自动给每个词打标签：XChat 相关 / 加密通信相关 / 混合
 *   - 自动判别搜索意图：transactional / informational / comparison / alternative / evaluation
 *   - 输出 JSON / CSV / 控制台摘要三件套，方便后续人工或自动化处理
 *
 * 用法：
 *   node scripts/keyword-research.mjs                    # 默认：8 国语言、~70 颗种子
 *   node scripts/keyword-research.mjs --quick            # 只跑 en-US，最快
 *   node scripts/keyword-research.mjs --seeds=xchat      # 只跑 XChat 词组
 *   node scripts/keyword-research.mjs --seeds=encrypted  # 只跑加密通信词组
 *   node scripts/keyword-research.mjs --top=30           # 控制台只展示前 30 条
 *   node scripts/keyword-research.mjs --delay=200        # 调整请求间隔（毫秒）
 *
 * 输出（写到 reports/ 下）：
 *   keyword-research-<timestamp>.json    完整结构化数据
 *   keyword-research-<timestamp>.csv     Excel / Sheets 直接打开
 *   keyword-research-<timestamp>-summary.txt   给人看的纯文本摘要
 *
 * 数据可靠性说明：
 *   - Google 自动补全返回的词，是该地区用户最近实际搜过的扩展词，不是猜测。
 *   - 一个词被多个不同种子触发 → 说明这个需求是"通用痛点"，不是边缘词。
 *   - 一个词在多个语言地区返回 → 说明是"跨国需求"，值得做全球页。
 *   - 单一来源，单一地区，occurrences=1 的词 → 谨慎对待，可能是噪音。
 *
 * 使用建议：
 *   1. 先跑一次 --quick 看 1 分钟内的产出，确认数据可用
 *   2. 跑完整模式，得到完整数据集
 *   3. 看 CSV 排序"occurrences desc"，挑前 30 个词作为新内容选题
 *   4. 用 JSON 详细数据再做分组、跨语言对比
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(PROJECT_ROOT, 'reports');

// ───────────────────────────────────────────────────────────────
// 配置
// ───────────────────────────────────────────────────────────────

const SUGGEST_URL = 'https://suggestqueries.google.com/complete/search';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const SEED_GROUPS = {
  // ── XChat 自身核心词 ──
  xchat_core: [
    'xchat',
    'xchat app',
    'xchat android',
    'xchat apk',
    'xchat ios',
    'xchat download',
    'xchat review',
    'xchat safe',
    'xchat groups',
    'xchat messaging',
    'xchat messenger',
    'xchat iphone',
    'xchat mac',
    'xchat windows',
    'xchat web',
    'xchat launch',
    'xchat beta',
  ],

  // ── XChat 同名歧义（用来分辨是不是 X Corp 那款） ──
  xchat_disambig: [
    'is xchat a real app',
    'is xchat by x corp',
    'xchat nostr',
    'xchat solana',
    'xchat crypto',
    'xchat meme',
    'xchat irc',
    'x chat vs twitter',
    'xchat twitter',
    'x chat x',
  ],

  // ── 加密通信核心词 ──
  encrypted_core: [
    'encrypted messaging app',
    'private messaging app',
    'secure messaging app',
    'best encrypted messaging app',
    'best private messaging app',
    'most secure messaging app',
    'private chat app',
    'encrypted chat app',
    'secure chat app',
    'end to end encrypted messaging',
    'encrypted messenger',
  ],

  // ── 应用对比（长青） ──
  app_comparison: [
    'signal vs whatsapp',
    'signal vs telegram',
    'signal vs threema',
    'telegram secret chat',
    'whatsapp encryption',
    'telegram encryption',
    'threema vs signal',
    'simplex vs signal',
    'wire vs signal',
    'telegram vs signal',
    'imessage vs signal',
    'best whatsapp alternative',
    'best telegram alternative',
  ],

  // ── 替代品需求（用户流失红利） ──
  alternatives: [
    'session alternative',
    'session replacement',
    'whatsapp alternative',
    'telegram alternative',
    'signal alternative',
    'open source messaging',
    'no phone number messenger',
    'anonymous messaging app',
    'privacy messenger',
    'session shutdown alternative',
    'best secure messaging app 2026',
  ],

  // ── 用户疑虑：购买前研究 ──
  concerns: [
    'is whatsapp safe',
    'is telegram encrypted',
    'is signal really private',
    'is signal safe',
    'messenger app privacy',
    'meta data collection',
    'secure messaging 2026',
    'is x chat encrypted',
    'xchat privacy',
    'is xchat legit',
  ],
};

// 完整模式：覆盖多语言地区
const LANGUAGES_FULL = [
  { hl: 'en', gl: 'us', label: 'en-US' },
  { hl: 'en', gl: 'gb', label: 'en-GB' },
  { hl: 'es', gl: 'es', label: 'es-ES' },
  { hl: 'de', gl: 'de', label: 'de-DE' },
  { hl: 'fr', gl: 'fr', label: 'fr-FR' },
  { hl: 'pt', gl: 'br', label: 'pt-BR' },
  { hl: 'ja', gl: 'jp', label: 'ja-JP' },
  { hl: 'ko', gl: 'kr', label: 'ko-KR' },
  { hl: 'zh', gl: 'cn', label: 'zh-CN' },
  { hl: 'zh', gl: 'tw', label: 'zh-TW' },
];

// 快速模式：只 en-US，省时间
const LANGUAGES_QUICK = [{ hl: 'en', gl: 'us', label: 'en-US' }];

// ───────────────────────────────────────────────────────────────
// 抓取
// ───────────────────────────────────────────────────────────────

async function fetchSuggestions(query, hl, gl) {
  const url = `${SUGGEST_URL}?client=firefox&q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json,text/plain,*/*',
        'Accept-Language': `${hl};q=0.9,en;q=0.8`,
      },
      signal: AbortSignal.timeout(8000),
    });

    if (response.status === 429) {
      return { suggestions: [], rateLimited: true };
    }
    if (!response.ok) {
      return { suggestions: [], rateLimited: false };
    }
    const data = await response.json();
    if (Array.isArray(data) && Array.isArray(data[1])) {
      const filtered = data[1].filter((s) => typeof s === 'string' && s.trim().length > 0);
      return { suggestions: filtered, rateLimited: false };
    }
    return { suggestions: [], rateLimited: false };
  } catch {
    return { suggestions: [], rateLimited: false };
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function expandSeed(seed, languages, delayMs) {
  const all = [];
  let anyRateLimit = false;
  for (const lang of languages) {
    const { suggestions, rateLimited } = await fetchSuggestions(seed, lang.hl, lang.gl);
    if (rateLimited) anyRateLimit = true;
    for (const s of suggestions) {
      all.push({ suggestion: s, lang: lang.label });
    }
    // 被限流就拉长间隔
    await sleep(rateLimited ? delayMs * 5 : delayMs);
  }
  return { results: all, wasRateLimited: anyRateLimit };
}

// ───────────────────────────────────────────────────────────────
// 聚合分析
// ───────────────────────────────────────────────────────────────

function aggregateResults(rawResults) {
  const map = new Map();

  for (const { seed, group, results } of rawResults) {
    for (const { suggestion, lang } of results) {
      const key = suggestion.toLowerCase().trim();
      if (!key) continue;
      // 排除完全等同于种子的
      if (key === seed.toLowerCase().trim()) continue;

      if (!map.has(key)) {
        map.set(key, {
          keyword: suggestion,
          occurrences: 0,
          languages: new Set(),
          sourceSeeds: new Set(),
          groups: new Set(),
        });
      }
      const entry = map.get(key);
      entry.occurrences += 1;
      entry.languages.add(lang);
      entry.sourceSeeds.add(seed);
      entry.groups.add(group);
    }
  }

  return Array.from(map.values())
    .map((entry) => ({
      keyword: entry.keyword,
      occurrences: entry.occurrences,
      languageCount: entry.languages.size,
      languages: Array.from(entry.languages).sort(),
      sourceSeedCount: entry.sourceSeeds.size,
      sourceSeeds: Array.from(entry.sourceSeeds).slice(0, 5),
      groups: Array.from(entry.groups),
    }))
    .sort((a, b) => {
      // 综合排序：出现次数 × 语言广度
      const scoreA = a.occurrences + a.languageCount * 0.7;
      const scoreB = b.occurrences + b.languageCount * 0.7;
      return scoreB - scoreA;
    });
}

// ───────────────────────────────────────────────────────────────
// 判定：这是什么词、什么意图
// ───────────────────────────────────────────────────────────────

function recommendCategory(kw) {
  const lower = kw.toLowerCase();

  // XChat 同名干扰词：Nostr / crypto token / IRC / meme 等
  const isDisambig = /\b(nostr|solana|crypto|meme|irc|token|coin)\b/i.test(lower);

  // XChat 主体词（X Corp 官方 app 相关）
  const hasXchatWord = /\b(x[\s-]?chat|chat\s+x)\b/i.test(lower);

  if (hasXchatWord && !isDisambig) return 'xchat';

  // 加密通信主体词
  const encPatterns = [
    /\bencrypted\b/i,
    /\bprivate\s+(messaging|chat|messenger)\b/i,
    /\bsecure\s+(messaging|chat|messenger)\b/i,
    /\bend[\s-]?to[\s-]?end\b/i,
    /\be2e\b/i,
    /\bsignal\b/i,
    /\bthreema\b/i,
    /\bsimplex\b/i,
    /\bsession\b/i,
    /\bwire\b/i,
    /\bprivacy\s+messenger\b/i,
    /\bopen\s+source\s+messaging\b/i,
    /\bno\s+phone\s+number\b/i,
    /\banonymous\s+messag/i,
  ];
  if (encPatterns.some((p) => p.test(lower))) return 'encrypted_messaging';

  return 'mixed';
}

function classifyIntent(kw) {
  const lower = kw.toLowerCase();
  if (/\bvs\.?$|\bvs\.?\s|\bcomparison|\bcompare|\bbetter\s+than|\bor\s+/i.test(lower)) return 'comparison';
  if (/\balternative|\breplacement|\binstead\s+of|\bsimilar\s+to/i.test(lower)) return 'alternative';
  if (/\breview|\bsafe\b|\bprivacy|\btrust|\bsecure|\blegit|\bscam/i.test(lower)) return 'evaluation';
  if (/\bdownload|\binstall|\bget\s+it|\bsignup|\bsign\s+up|\bapp\s+free/i.test(lower)) return 'transactional';
  if (/^(how|what|why|when|where|who|is|are|does|can|should)\b/i.test(lower)) return 'informational';
  return 'navigational';
}

// ───────────────────────────────────────────────────────────────
// 输出
// ───────────────────────────────────────────────────────────────

function ensureReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

function getTimestamp() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}_${hh}${mi}${ss}`;
}

function csvEscape(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function writeCsv(filepath, rows) {
  if (rows.length === 0) {
    fs.writeFileSync(filepath, '', 'utf-8');
    return;
  }
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(','));
  }
  fs.writeFileSync(filepath, lines.join('\n') + '\n', 'utf-8');
}

function writeSummaryTxt(filepath, summary) {
  const lines = [];
  lines.push('═══════════════════════════════════════════════════════════════════');
  lines.push('  关键词调研报告  XChat Hub / Encrypted Messaging');
  lines.push(`  生成时间: ${summary.generatedAt}`);
  lines.push(`  数据源:   Google Autocomplete API (免费端点)`);
  lines.push(`  语言地区: ${summary.languages.join(', ')}`);
  lines.push(`  种子词数: ${summary.totalSeeds}    唯一关键词: ${summary.totalUnique}`);
  lines.push('═══════════════════════════════════════════════════════════════════');
  lines.push('');
  lines.push('图例：');
  lines.push('  [X] = XChat 词（X Corp 官方 app 相关）');
  lines.push('  [E] = 加密通信词（Signal/Telegram/Threema 等比较）');
  lines.push('  [?] = 混合词（建议人工筛）');
  lines.push('  occ = 出现次数（同一词被多少不同种子触发）');
  lines.push('  L   = 多少个语言地区返回了这个词');
  lines.push('');

  for (const group of summary.groups) {
    lines.push('───────────────────────────────────────────────────────────────────');
    lines.push(`▶ ${group.label}    共 ${group.keywords.length} 词`);
    lines.push('───────────────────────────────────────────────────────────────────');
    const top = group.keywords.slice(0, 40);
    if (top.length === 0) {
      lines.push('  （无）');
    } else {
      for (const kw of top) {
        const flag = kw.category === 'xchat' ? '[X]' : kw.category === 'encrypted_messaging' ? '[E]' : '[?]';
        const intent = (kw.intent || '').padEnd(13);
        lines.push(
          `  ${flag} ${kw.keyword.padEnd(44)} occ=${String(kw.occurrences).padStart(2)} L=${kw.languageCount} ${intent}`
        );
      }
    }
    lines.push('');
  }

  lines.push('───────────────────────────────────────────────────────────────────');
  lines.push('横向洞察：');
  lines.push('');

  const allKeywords = [...summary.groups[0].keywords, ...summary.groups[1].keywords, ...summary.groups[2].keywords];
  const multilingual = allKeywords.filter((k) => k.languageCount >= 3).slice(0, 10);
  const highOcc = allKeywords.filter((k) => k.occurrences >= 3).slice(0, 10);
  const transactional = allKeywords.filter((k) => k.intent === 'transactional').slice(0, 15);
  const comparison = allKeywords.filter((k) => k.intent === 'comparison').slice(0, 15);

  if (multilingual.length > 0) {
    lines.push('  ★ 多语言地区都有的词（值得做全球页）：');
    for (const kw of multilingual) lines.push(`    - ${kw.keyword}  (出现在 ${kw.languageCount} 个地区)`);
    lines.push('');
  }
  if (highOcc.length > 0) {
    lines.push('  ★ 被多种子触发的词（多数人心智里的问题）：');
    for (const kw of highOcc) lines.push(`    - ${kw.keyword}  (occ=${kw.occurrences})`);
    lines.push('');
  }
  if (transactional.length > 0) {
    lines.push('  ★ 交易意图词（用户准备下载/买）：');
    for (const kw of transactional) lines.push(`    - ${kw.keyword}`);
    lines.push('');
  }
  if (comparison.length > 0) {
    lines.push('  ★ 对比意图词（最佳做 vs/ 页面）：');
    for (const kw of comparison) lines.push(`    - ${kw.keyword}`);
    lines.push('');
  }

  lines.push('───────────────────────────────────────────────────────────────────');
  lines.push('推荐下一篇文章选题（综合 score 最高的前 15 词）：');
  lines.push('');

  const ranked = [...allKeywords]
    .map((kw) => ({ ...kw, score: kw.occurrences + kw.languageCount * 0.7 + (kw.intent === 'transactional' ? 2 : 0) + (kw.intent === 'comparison' ? 1.5 : 0) + (kw.intent === 'alternative' ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  ranked.forEach((kw, i) => {
    lines.push(`  ${String(i + 1).padStart(2)}. ${kw.keyword.padEnd(45)} score=${kw.score.toFixed(1)}  [${kw.category}] ${kw.intent}`);
  });

  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════════════');
  lines.push('');

  fs.writeFileSync(filepath, lines.join('\n'), 'utf-8');
}

function printConsole(summary, topN) {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  关键词调研摘要');
  console.log(`  生成时间: ${summary.generatedAt}`);
  console.log(`  语言地区: ${summary.languages.join(', ')}`);
  console.log(`  唯一关键词: ${summary.totalUnique}`);
  console.log('═══════════════════════════════════════════════════════════════════');

  for (const group of summary.groups) {
    console.log('');
    console.log(`▶ ${group.label} (${group.keywords.length} 词)`);
    console.log('─'.repeat(70));
    const slice = group.keywords.slice(0, topN);
    if (slice.length === 0) {
      console.log('  （无）');
    } else {
      for (const kw of slice) {
        const flag = kw.category === 'xchat' ? '[X] ' : kw.category === 'encrypted_messaging' ? '[E] ' : '[?] ';
        console.log(
          `  ${flag}${kw.keyword.padEnd(46)} occ=${String(kw.occurrences).padStart(2)} L=${kw.languageCount}`
        );
      }
    }
    if (group.keywords.length > topN) {
      console.log(`  ... 还有 ${group.keywords.length - topN} 个（看 JSON / CSV / 摘要文件）`);
    }
  }

  console.log('');
  console.log('──────────────────────────────────────────────────');
  console.log('完整结果已写入：');
  console.log(`  ${path.join(REPORTS_DIR, 'keyword-research-<timestamp>.json')}`);
  console.log(`  ${path.join(REPORTS_DIR, 'keyword-research-<timestamp>.csv')}`);
  console.log(`  ${path.join(REPORTS_DIR, 'keyword-research-<timestamp>-summary.txt')}`);
  console.log('──────────────────────────────────────────────────');
  console.log('');
}

// ───────────────────────────────────────────────────────────────
// CLI
// ───────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    quick: args.includes('--quick'),
    topN: 20,
    delayMs: 150,
    seedsFilter: null,
  };

  for (const a of args) {
    if (a.startsWith('--top=')) out.topN = Number(a.split('=')[1]) || 20;
    if (a.startsWith('--delay=')) out.delayMs = Number(a.split('=')[1]) || 150;
    if (a.startsWith('--seeds=')) out.seedsFilter = a.split('=')[1];
  }

  return out;
}

function getSeedsByFilter(filterArg) {
  if (!filterArg) return SEED_GROUPS;

  const map = {
    xchat: ['xchat_core', 'xchat_disambig'],
    encrypted: ['encrypted_core', 'app_comparison', 'alternatives', 'concerns'],
    all: Object.keys(SEED_GROUPS),
  };

  const keys = map[filterArg];
  if (!keys) {
    console.error(`✗ --seeds 只接受: xchat / encrypted / all (你输入的是 "${filterArg}")`);
    process.exit(1);
  }

  const filtered = {};
  for (const k of keys) filtered[k] = SEED_GROUPS[k];
  return filtered;
}

// ───────────────────────────────────────────────────────────────
// 主流程
// ───────────────────────────────────────────────────────────────

async function main() {
  const { quick, topN, delayMs, seedsFilter } = parseArgs();

  console.log('🔍 关键词调研工具启动');
  console.log(`   模式:    ${quick ? '快速（仅 en-US）' : '完整（多语言）'}`);
  if (seedsFilter) console.log(`   种子范围: ${seedsFilter}`);
  console.log(`   输出:    ${path.relative(PROJECT_ROOT, REPORTS_DIR)}/`);
  console.log('');

  ensureReportsDir();

  const languages = quick ? LANGUAGES_QUICK : LANGUAGES_FULL;
  const seedGroups = getSeedsByFilter(seedsFilter);

  const allSeeds = [];
  for (const [group, seeds] of Object.entries(seedGroups)) {
    for (const seed of seeds) {
      allSeeds.push({ seed, group });
    }
  }
  const totalSeeds = allSeeds.length;

  console.log(`📡 准备抓取 ${totalSeeds} 颗种子 × ${languages.length} 个语言地区`);
  const estSeconds = Math.ceil((totalSeeds * languages.length * delayMs) / 1000);
  console.log(`   预计耗时: ~${estSeconds} 秒`);
  console.log('');

  const rawResults = [];
  let processed = 0;
  let rateLimitHits = 0;

  for (const { seed, group } of allSeeds) {
    const { results, wasRateLimited } = await expandSeed(seed, languages, delayMs);
    if (wasRateLimited) rateLimitHits++;
    rawResults.push({ seed, group, results });
    processed++;
    const pct = Math.round((processed / totalSeeds) * 100);
    process.stdout.write(`\r  进度: ${processed}/${totalSeeds} (${pct}%)${rateLimitHits > 0 ? ` · 已被限流 ${rateLimitHits} 次` : ''}    `);
  }
  process.stdout.write('\n');

  console.log('');
  console.log('📊 聚合分析中...');
  const aggregated = aggregateResults(rawResults);

  for (const kw of aggregated) {
    kw.category = recommendCategory(kw.keyword);
    kw.intent = classifyIntent(kw.keyword);
  }

  const xchatGroup = {
    label: 'XChat 词群（X Corp 官方应用相关，排除同名歧义）',
    keywords: aggregated.filter((k) => k.category === 'xchat'),
  };
  const encryptedGroup = {
    label: '加密通信词群（Signal/Telegram/Threema/Privacy 等）',
    keywords: aggregated.filter((k) => k.category === 'encrypted_messaging'),
  };
  const mixedGroup = {
    label: '混合/不确定（建议人工筛）',
    keywords: aggregated.filter((k) => k.category === 'mixed'),
  };

  const stamp = getTimestamp();
  const jsonFile = path.join(REPORTS_DIR, `keyword-research-${stamp}.json`);
  const csvFile = path.join(REPORTS_DIR, `keyword-research-${stamp}.csv`);
  const summaryFile = path.join(REPORTS_DIR, `keyword-research-${stamp}-summary.txt`);

  const summary = {
    generatedAt: new Date().toISOString(),
    mode: quick ? 'quick' : 'full',
    seedsFilter: seedsFilter || 'all',
    languages: languages.map((l) => l.label),
    totalSeeds,
    totalUnique: aggregated.length,
    rateLimitHits,
    groups: [xchatGroup, encryptedGroup, mixedGroup],
    rawSeedResults: rawResults.map((r) => ({
      seed: r.seed,
      group: r.group,
      suggestionCount: r.results.length,
      suggestions: r.results.map((x) => x.suggestion),
    })),
  };

  fs.writeFileSync(jsonFile, JSON.stringify(summary, null, 2), 'utf-8');

  const csvRows = [];
  for (const group of [xchatGroup, encryptedGroup, mixedGroup]) {
    for (const kw of group.keywords) {
      csvRows.push({
        category: kw.category,
        group_label: group.label,
        keyword: kw.keyword,
        intent: kw.intent,
        occurrences: kw.occurrences,
        language_count: kw.languageCount,
        languages: kw.languages.join(';'),
        source_seed_count: kw.sourceSeedCount,
        source_seeds: kw.sourceSeeds.join(' | '),
      });
    }
  }
  writeCsv(csvFile, csvRows);

  writeSummaryTxt(summaryFile, summary);

  console.log('✅ 完成！输出文件：');
  console.log(`   ${path.relative(PROJECT_ROOT, jsonFile)}`);
  console.log(`   ${path.relative(PROJECT_ROOT, csvFile)}`);
  console.log(`   ${path.relative(PROJECT_ROOT, summaryFile)}`);
  console.log('');

  printConsole(summary, topN);
}

main().catch((err) => {
  console.error('❌ 错误:', err);
  process.exit(1);
});
