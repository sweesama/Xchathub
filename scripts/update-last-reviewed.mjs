/**
 * scripts/update-last-reviewed.mjs
 * --------------------------------------------------------------------------
 * 一键更新 src/data/messagingApps.ts 中所有 app 的 `lastReviewedISO` 字段。
 *
 * 用法：
 *   npm run review                       # 默认使用当前 UTC 日期
 *   npm run review -- auto               # 同上
 *   npm run review -- 2026-07-15         # 指定日期
 *
 * 行为：
 *   - 把每个 app 的 lastReviewedISO: 'YYYY-MM-DD' 改为 lastReviewedISO: '<新日期>'
 *   - 校验日期格式，避免误破坏 schema
 *   - 报告更新数量
 *
 * 这是 review 页面顶部 "Last reviewed <time>" 自动化的核心支撑：
 *   - 数据驱动：所有评测页 + 对比页 + best-of 列表都消费 app.lastReviewedISO
 *   - 周/月度评审时只需 `npm run review` 一次即可统一刷新
 * --------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DATA_FILE = resolve(process.cwd(), 'src/data/messagingApps.ts');
const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

// 1) 解析目标日期：auto / 缺省 = 今天 UTC；或显式传 YYYY-MM-DD
const arg = process.argv[2];
let targetDate;
if (!arg || arg === 'auto') {
  targetDate = new Date().toISOString().split('T')[0];
} else if (ISO_RE.test(arg)) {
  targetDate = arg;
} else {
  console.error(`✗ 无效日期格式: "${arg}"`);
  console.error(`  期望 YYYY-MM-DD（例如 2026-07-08）或 auto/缺省`);
  process.exit(1);
}

// 2) 读取数据文件
let content;
try {
  content = readFileSync(DATA_FILE, 'utf-8');
} catch (err) {
  console.error(`✗ 读取失败: ${DATA_FILE}`);
  console.error(`  ${err.message}`);
  process.exit(1);
}

// 3) 匹配所有 lastReviewedISO 字段（保留前缀的缩进/冒号/空格）
const pattern = /(lastReviewedISO:\s*)'(\d{4}-\d{2}-\d{2})'/g;
let updatedCount = 0;
let skippedCount = 0;
const updated = content.replace(pattern, (match, prefix) => {
  updatedCount++;
  return `${prefix}'${targetDate}'`;
});

// 4) 写回
if (updatedCount === 0) {
  console.error(`✗ 在 ${DATA_FILE} 中没有匹配到任何 lastReviewedISO 字段。`);
  console.error(`  请确认文件格式（当前版本字段是 lastReviewedISO: 'YYYY-MM-DD',）。`);
  process.exit(1);
}

writeFileSync(DATA_FILE, updated, 'utf-8');

// 5) 输出结果
console.log(`✓ 已更新 ${updatedCount} 个 app 的 lastReviewedISO → ${targetDate}`);
console.log(`  文件: ${DATA_FILE}`);
console.log(`  下一步: npm run build 验证 review 页日期显示是否生效`);
