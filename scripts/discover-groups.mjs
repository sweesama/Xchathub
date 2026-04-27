/**
 * discover-groups.mjs — 通过 Playwright 抓取 X 上公开的 XChat 群组邀请链接
 *
 * 设计目的：
 *   - 自动化"发现"流程，定期(GitHub Action cron)跑一次
 *   - 输出 JSON 报告，附在 PR 里供管理员审核
 *   - 不直接写入 groups.ts —— 必须人工确认（防止色情/低质内容）
 *
 * 用法（本地）：
 *   1. 先安装 Playwright：npm i -D playwright
 *   2. 第一次手动登录：node scripts/discover-groups.mjs --login
 *   3. 之后定期跑：node scripts/discover-groups.mjs
 *
 * 用法（GitHub Action）：
 *   - secrets.X_AUTH_TOKEN  存 X 登录 cookie（auth_token）
 *   - secrets.X_CT0  存 X csrf token (ct0)
 *   - cron 每周一跑一次，输出 discovered-groups.json
 *   - 自动开 PR 让管理员审核
 *
 * 输出：
 *   discovered-groups.json — 包含 link / author / text / tweetUrl
 *   已存在的 link 自动过滤（不重复抓）
 *
 * ⚠️ 重要风险提示：
 *   - 大规模抓取可能违反 X ToS
 *   - 频率：本脚本搜索 5 个关键词共约 50 次请求，远低于阈值
 *   - 如果触发限流，X 会返回空结果或验证码，脚本应优雅退出
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 搜索关键词列表（可扩展） */
const SEARCH_QUERIES = [
  '"x.com/i/chat/group_join"',
  '"chat/group_join" "join"',
  '"chat/group_join" 群',
  '"chat/group_join" trading',
  '"chat/group_join" community',
];

const PROFILE_DIR = path.resolve(__dirname, '../.playwright-profile');
const OUTPUT_FILE = process.env.DISCOVERY_OUTPUT
  ? path.resolve(process.cwd(), process.env.DISCOVERY_OUTPUT)
  : path.resolve(__dirname, '../discovered-groups.json');
const GROUPS_FILE = path.resolve(__dirname, '../src/data/groups.ts');

/** 读现有 inviteUrl 集合 */
function readExistingUrls() {
  if (!fs.existsSync(GROUPS_FILE)) return new Set();
  const content = fs.readFileSync(GROUPS_FILE, 'utf8');
  const urls = [...content.matchAll(/inviteUrl:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
  return new Set(urls);
}

/** 抓取单个搜索 query 的所有结果 */
async function searchQuery(page, query) {
  const url = `https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=live`;
  console.log(`\n→ 搜索: ${query}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const result = await page.evaluate(async () => {
    const allResults = new Map();
    const extract = () => {
      document.querySelectorAll('article[data-testid="tweet"]').forEach((tweet) => {
        const text = tweet.innerText;
        const matches = text.match(/x\.com\/i\/chat\/group_join\/g\d+\/[A-Za-z0-9]+/g);
        if (matches) {
          const tweetUrl = tweet.querySelector('a[href*="/status/"]')?.href || '';
          const author = tweet.querySelector('div[data-testid="User-Name"]')?.innerText || '';
          for (const m of matches) {
            const link = 'https://' + m;
            if (!allResults.has(link)) {
              allResults.set(link, {
                link,
                author: author.split('\n').slice(0, 2).join(' | '),
                text: text.slice(0, 400),
                tweetUrl,
              });
            }
          }
        }
      });
    };
    for (let i = 0; i < 10; i++) {
      extract();
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 1500));
    }
    extract();
    return Array.from(allResults.values());
  });

  console.log(`  ← 找到 ${result.length} 条`);
  return result;
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error('✗ 需要先安装 playwright：npm i -D playwright');
    process.exit(1);
  }

  const existingUrls = readExistingUrls();
  console.log(`已有 ${existingUrls.size} 条群组在 groups.ts，将自动过滤重复`);

  // CI 模式：用 env 注入 cookie；本地模式：用 persistent profile
  const useCookieAuth = !!process.env.X_AUTH_TOKEN;
  const isHeadless = process.env.HEADLESS === '1' || useCookieAuth;
  let browser;
  let page;

  if (useCookieAuth) {
    console.log('▶ CI 模式：使用 X_AUTH_TOKEN / X_CT0 注入 cookie');
    browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addCookies([
      {
        name: 'auth_token',
        value: process.env.X_AUTH_TOKEN,
        domain: '.x.com',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      },
      {
        name: 'ct0',
        value: process.env.X_CT0 || '',
        domain: '.x.com',
        path: '/',
        secure: true,
        sameSite: 'Lax',
      },
    ]);
    page = await ctx.newPage();
    // 把 browser.close 指向 ctx 关闭
    browser.close = (() => {
      const orig = browser.close.bind(browser);
      return async () => {
        await ctx.close().catch(() => {});
        return orig();
      };
    })();
  } else {
    if (!fs.existsSync(PROFILE_DIR)) {
      console.error(`✗ Profile 目录不存在：${PROFILE_DIR}`);
      console.error('  请先在 Playwright MCP 模式下登录 X 一次');
      process.exit(1);
    }
    browser = await chromium.launchPersistentContext(PROFILE_DIR, {
      headless: isHeadless,
      viewport: { width: 1280, height: 800 },
    });
    page = browser.pages()[0] || await browser.newPage();
  }

  const allFindings = new Map();

  for (const query of SEARCH_QUERIES) {
    try {
      const results = await searchQuery(page, query);
      for (const r of results) {
        if (!existingUrls.has(r.link) && !allFindings.has(r.link)) {
          allFindings.set(r.link, { ...r, foundVia: query });
        }
      }
    } catch (err) {
      console.error(`✗ 搜索失败 "${query}": ${err.message}`);
    }
    // 礼貌延迟
    await page.waitForTimeout(2000);
  }

  await browser.close();

  const findings = Array.from(allFindings.values());
  console.log(`\n=== 共发现 ${findings.length} 条新链接 ===\n`);

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
    discoveredAt: new Date().toISOString(),
    totalFound: findings.length,
    items: findings,
  }, null, 2), 'utf8');

  console.log(`✓ 已写入 ${OUTPUT_FILE}`);
  console.log('\n下一步：人工审核 discovered-groups.json，对每条决定：');
  console.log('  - 上线：node scripts/add-group.mjs --name "..." --category "..." --url "..."');
  console.log('  - 跳过：从 JSON 中删除即可');
}

main().catch((e) => {
  console.error('\n✗ 发生错误：', e);
  process.exit(1);
});
