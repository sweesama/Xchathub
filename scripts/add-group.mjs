/**
 * add-group.mjs — XChat 群组快速添加工具
 *
 * 设计目的：
 *   把添加群组从"手动改 TS 文件 + 构建 + 推送"压缩成一行命令。
 *   未来可无缝接入 GitHub Actions / Webhook 实现完全自动化。
 *
 * 用法 1：交互式提问
 *   node scripts/add-group.mjs
 *
 * 用法 2：一行参数（全自动）
 *   node scripts/add-group.mjs \
 *     --name "Tesla 华语投资者" \
 *     --category Business \
 *     --url "https://x.com/i/chat/group_join/g.../..." \
 *     --description "特斯拉华语投资者讨论群" \
 *     --members 50 \
 *     --tags "Tesla,投资,华语"
 *
 * 用法 3：JSON 通过 stdin（适合 webhook / API 调用）
 *   echo '{"name":"...","category":"...","inviteUrl":"..."}' | node scripts/add-group.mjs --stdin
 *
 * 自动化能力：
 *   - 验证邀请链接格式（必须是 x.com/i/chat/group_join/g.../...）
 *   - 自动生成 slug（去重、URL 安全）
 *   - 拒绝重复链接 / 重复 slug
 *   - 自动填 verifiedAt = 今天
 *   - 写入 src/data/groups.ts，保留原有格式
 *   - 输出"下一步运行什么"提示
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output, argv, exit } from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GROUPS_FILE = path.resolve(__dirname, '../src/data/groups.ts');

const VALID_CATEGORIES = [
  'Crypto', 'Tech', 'AI', 'News', 'Sports', 'Gaming',
  'Business', 'Entertainment', 'Education', 'Local', 'Other',
];

const VALID_TIERS = ['free', 'featured', 'lifetime'];

/** XChat 群组邀请链接正则：必须是 x.com/i/chat/group_join/g[ID]/[TOKEN] */
const INVITE_URL_REGEX = /^https:\/\/x\.com\/i\/chat\/group_join\/g\d+\/[A-Za-z0-9]+\/?$/;

/* ---------- 参数解析 ---------- */

function parseArgs() {
  const args = argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

/* ---------- 工具函数 ---------- */

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')          // 去重音
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')    // 保留中英文 + 数字 + 横杠
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[\u4e00-\u9fa5]/g, (c) => c.charCodeAt(0).toString(16))  // 中文转 hex 保 URL 安全
    .slice(0, 60) || 'group';
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function escapeForTs(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

/* ---------- 验证 ---------- */

function validate(entry, existing) {
  const errors = [];

  if (!entry.name || entry.name.length < 2)
    errors.push('name 必填且长度 >= 2');

  if (!entry.category || !VALID_CATEGORIES.includes(entry.category))
    errors.push(`category 必须是: ${VALID_CATEGORIES.join(' / ')}`);

  if (!entry.inviteUrl || !INVITE_URL_REGEX.test(entry.inviteUrl))
    errors.push('inviteUrl 必须是 https://x.com/i/chat/group_join/g[ID]/[TOKEN] 格式');

  if (entry.listingTier && !VALID_TIERS.includes(entry.listingTier))
    errors.push(`listingTier 必须是: ${VALID_TIERS.join(' / ')}`);

  if (entry.members !== undefined && (isNaN(Number(entry.members)) || Number(entry.members) < 0))
    errors.push('members 必须是非负整数');

  // 重复检查
  const dupeUrl = existing.find((g) => g.inviteUrl === entry.inviteUrl);
  if (dupeUrl) errors.push(`此邀请链接已存在（slug: ${dupeUrl.slug}）`);

  const dupeSlug = existing.find((g) => g.slug === entry.slug);
  if (dupeSlug) errors.push(`slug "${entry.slug}" 已存在，请换名或加后缀`);

  return errors;
}

/* ---------- 读现有数据（粗略提取已存在的 slug 与 inviteUrl） ---------- */

function readExistingEntries(content) {
  const entries = [];
  const slugMatches = content.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
  const urlMatches = content.matchAll(/inviteUrl:\s*['"]([^'"]+)['"]/g);
  for (const m of slugMatches) entries.push({ slug: m[1], inviteUrl: '' });
  let i = 0;
  for (const m of urlMatches) {
    if (entries[i]) entries[i].inviteUrl = m[1];
    i++;
  }
  return entries.filter((e) => e.slug);
}

/* ---------- 写入 groups.ts ---------- */

function buildEntryBlock(entry) {
  const lines = [];
  lines.push('  {');
  lines.push(`    slug: '${escapeForTs(entry.slug)}',`);
  lines.push(`    name: '${escapeForTs(entry.name)}',`);
  lines.push(`    description: '${escapeForTs(entry.description || '')}',`);
  lines.push(`    category: '${entry.category}',`);
  lines.push(`    tags: [${(entry.tags || []).map((t) => `'${escapeForTs(t)}'`).join(', ')}],`);
  lines.push(`    members: ${Number(entry.members) || 0},`);
  lines.push(`    icon: '${escapeForTs(entry.icon || '#')}',`);
  lines.push(`    inviteUrl: '${escapeForTs(entry.inviteUrl)}',`);
  lines.push(`    sourceType: '${entry.sourceType || 'community-submitted'}',`);
  if (entry.sourceUrl) lines.push(`    sourceUrl: '${escapeForTs(entry.sourceUrl)}',`);
  lines.push(`    verifiedAt: '${entry.verifiedAt}',`);
  if (entry.listingTier) lines.push(`    listingTier: '${entry.listingTier}',`);
  lines.push('  },');
  return lines.join('\n');
}

function insertIntoFile(content, entryBlock) {
  // 找到 GROUP_DIRECTORY 数组定义
  const arrayRegex = /export const GROUP_DIRECTORY:\s*GroupDirectoryEntry\[\]\s*=\s*\[([\s\S]*?)\];/;
  const match = content.match(arrayRegex);
  if (!match) {
    throw new Error('无法在 groups.ts 中定位 GROUP_DIRECTORY 数组');
  }

  const inner = match[1];
  const isEmpty = inner.trim().length === 0 || inner.trim().match(/^\/\/.*$/m);

  let newInner;
  if (isEmpty) {
    newInner = `\n${entryBlock}\n`;
  } else {
    // 在数组末尾追加
    const trimmed = inner.replace(/\s+$/, '');
    const needsComma = !trimmed.endsWith(',');
    newInner = `${trimmed}${needsComma ? ',' : ''}\n${entryBlock}\n`;
  }

  return content.replace(
    arrayRegex,
    `export const GROUP_DIRECTORY: GroupDirectoryEntry[] = [${newInner}];`
  );
}

/* ---------- 交互式提问 ---------- */

async function interactivePrompt(prefilled = {}) {
  const rl = readline.createInterface({ input, output });
  async function ask(question, defaultValue) {
    const dv = defaultValue ? ` [${defaultValue}]` : '';
    const ans = await rl.question(`${question}${dv}: `);
    return ans.trim() || defaultValue || '';
  }

  console.log('\n=== XChat 群组添加（交互模式）===\n');

  const name = prefilled.name || await ask('群名称');
  const inviteUrl = prefilled.inviteUrl || prefilled.url || await ask('邀请链接 (x.com/i/chat/group_join/...)');
  const category = prefilled.category || await ask(`分类 (${VALID_CATEGORIES.join('/')})`);
  const description = prefilled.description || await ask('一句话描述', '');
  const tagsRaw = prefilled.tags || await ask('标签（逗号分隔，可空）', '');
  const members = prefilled.members || await ask('成员数（数字，可空）', '0');
  const sourceUrl = prefilled.sourceUrl || prefilled['source-url'] || await ask('来源推文链接（可空）', '');
  const listingTier = prefilled.listingTier || prefilled.tier || await ask(`层级 (${VALID_TIERS.join('/')})`, 'free');

  rl.close();

  return {
    name,
    inviteUrl,
    category,
    description,
    tags: typeof tagsRaw === 'string' ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : tagsRaw,
    members: Number(members) || 0,
    sourceUrl: sourceUrl || undefined,
    listingTier: listingTier || 'free',
  };
}

/* ---------- 主流程 ---------- */

async function main() {
  const args = parseArgs();

  let entry;

  if (args.stdin) {
    // 从 stdin 读 JSON（webhook 场景）
    let raw = '';
    for await (const chunk of input) raw += chunk;
    entry = JSON.parse(raw);
  } else if (args.name && args.url && args.category) {
    // 全参数模式
    entry = {
      name: args.name,
      inviteUrl: args.url || args.inviteUrl,
      category: args.category,
      description: args.description || '',
      tags: typeof args.tags === 'string' ? args.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      members: Number(args.members) || 0,
      sourceUrl: args['source-url'] || undefined,
      listingTier: args.tier || args.listingTier || 'free',
    };
  } else {
    // 交互模式（用 args 中的部分预填）
    entry = await interactivePrompt(args);
  }

  // 标准化字段
  entry.slug = entry.slug || slugify(entry.name);
  entry.verifiedAt = entry.verifiedAt || todayISO();
  entry.sourceType = entry.sourceType || 'community-submitted';
  entry.icon = entry.icon || '#';

  // 读现有文件
  if (!fs.existsSync(GROUPS_FILE)) {
    console.error(`✗ 找不到文件: ${GROUPS_FILE}`);
    exit(1);
  }
  const fileContent = fs.readFileSync(GROUPS_FILE, 'utf8');
  const existing = readExistingEntries(fileContent);

  // 验证
  const errors = validate(entry, existing);
  if (errors.length > 0) {
    console.error('\n✗ 验证失败：');
    errors.forEach((e) => console.error(`  - ${e}`));
    exit(1);
  }

  // 构建并写入
  const block = buildEntryBlock(entry);
  const newContent = insertIntoFile(fileContent, block);
  fs.writeFileSync(GROUPS_FILE, newContent, 'utf8');

  console.log('\n✓ 群组已写入 src/data/groups.ts');
  console.log('\n--- 写入内容 ---');
  console.log(block);
  console.log('\n--- 下一步 ---');
  console.log('  npm run build && git add -A && git commit -m "add: ' + entry.name + '" && git push');
  console.log('\n或直接运行：node scripts/add-group.mjs --commit  (TODO: 接入 git 自动化)');
}

main().catch((e) => {
  console.error('\n✗ 发生错误：', e.message);
  exit(1);
});
