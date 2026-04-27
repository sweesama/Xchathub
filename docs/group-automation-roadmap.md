# 群组数据自动化路线图

> 解决核心问题：**网站没有群组数据 = 网站废了**。
>
> 目标：让群组数据从"靠人手动收集"变成"自动流入 + 一键审核"。

---

## 现实情况（4/27/2026）

1. **Google 索引不到野生 X 群组邀请链接** —— X 反爬严格，绝大多数链接只在 X 内部传播
2. **xchat.show 等中文目录站已经在收录** —— 但用户禁止使用其内容，避免抄袭质疑
3. **群主主动提交意愿低** —— 没人会找一个空目录主动提交

**结论**：必须建立**主动 + 被动双管道**，先把链子打通，再考虑流量。

---

## 三层自动化架构

```
┌─────────────────────────────────────────────────┐
│  第 0 层：本地脚本（已完成 ✓）                  │
│  scripts/add-group.mjs                          │
│  - 验证链接格式                                 │
│  - 自动生成 slug                                │
│  - 拒绝重复                                     │
│  - 一行命令写入并提示构建                       │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  第 1 层：群主提交管道（待做）                  │
│  /list-your-group 表单 → API → GitHub PR        │
│  - 群主填表单 + 邀请链接                        │
│  - Cloudflare Worker 验证 + 触发 GH Action      │
│  - Action 调 add-group.mjs --stdin              │
│  - 自动开 PR，等管理员 1 键 merge               │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  第 2 层：链接巡检（待做）                      │
│  GitHub Action cron 每天跑                      │
│  - 抓取每个 inviteUrl，检查 HTTP 200            │
│  - 失败的标记为 "expired" 或自动下架            │
│  - 定期清理避免目录"死链化"                     │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  第 3 层：主动发现（待做）                      │
│  GitHub Action cron 每 6 小时跑                 │
│  - 调用 Apify / Bright Data 抓取 X 上的         │
│    "xchat group_join" 关键词推文                │
│  - 解析推文上下文（群名/作者/描述）             │
│  - LLM API 自动分类（Claude Haiku 极便宜）      │
│  - 写入 PR，待人工审批                          │
└─────────────────────────────────────────────────┘
```

---

## 第 0 层使用方法（已上线）

### 用法 1：交互式（最简单）
```bash
npm run group:add
```
然后跟着提示填：群名、链接、分类、描述、标签、成员数...

### 用法 2：一行命令（最快）
```bash
node scripts/add-group.mjs \
  --name "Tesla 华语投资者" \
  --category Business \
  --url "https://x.com/i/chat/group_join/g123/abc" \
  --description "特斯拉华语投资者讨论" \
  --members 50 \
  --tags "Tesla,投资,华语"
```

### 用法 3：JSON 通过 stdin（自动化场景）
```bash
echo '{"name":"...","category":"...","inviteUrl":"..."}' | \
  node scripts/add-group.mjs --stdin
```

### 添加完成后
脚本会提示：
```
npm run build && git add -A && git commit -m "add: <名称>" && git push
```
跑一行就上线（30 秒内）。

---

## 第 1 层实施方案（推荐下一步做）

### 技术栈
- **前端表单**：现有 `/list-your-group` 页升级（已有静态表单）
- **后端 API**：Cloudflare Worker（免费 100,000 请求/天）
- **触发器**：Worker → GitHub repository_dispatch event
- **执行器**：GitHub Actions workflow → 跑 add-group.mjs --stdin → 开 PR

### 实施步骤
1. 写一个 Cloudflare Worker 路由 `POST /api/submit-group`
2. Worker 验证表单 + Turnstile（CAPTCHA）→ 防垃圾
3. Worker 调 GitHub API 触发 `repository_dispatch`
4. `.github/workflows/process-submission.yml` 监听该事件
5. Workflow 跑：
   ```yaml
   - run: echo '${{ github.event.client_payload.entry }}' | node scripts/add-group.mjs --stdin
   - uses: peter-evans/create-pull-request@v6
   ```
6. 你收到邮件通知 → 1 click merge → 自动构建部署上线

### 预计工作量
- Worker 代码：30 分钟
- GitHub workflow：20 分钟
- 表单升级：30 分钟
- **总计 1.5 小时**

---

## 第 2 层实施方案

### 简单巡检脚本
```bash
# scripts/check-group-links.mjs
# 遍历 GROUP_DIRECTORY，对每个 inviteUrl 发 HEAD 请求
# 失败的写入 expired-groups.json，发邮件告警
```

### GitHub Action
```yaml
# .github/workflows/check-links.yml
on:
  schedule:
    - cron: '0 8 * * *'  # 每天 UTC 8:00
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node scripts/check-group-links.mjs
      - run: |
          # 如有失效链接，自动开 issue 通知
```

---

## 第 3 层实施方案（最复杂，最值钱）

### 关键依赖
- **Apify Actor**: `apify/twitter-scraper`（约 $0.25 / 1000 推文）
- **Claude Haiku API**: 自动分类（约 $0.25 / M tokens，几乎免费）
- **GitHub PAT**: 用于自动开 PR

### 工作流伪代码
```js
// scripts/discover-groups.mjs
const tweets = await apify.search('"x.com/i/chat/group_join"', { limit: 50 });
const newLinks = [];

for (const tweet of tweets) {
  const url = extractInviteUrl(tweet.text);
  if (!url || existsInDB(url)) continue;

  // 用 Claude 提取群名、推断分类
  const meta = await claude.extract({
    text: tweet.text,
    schema: { name: 'string', category: 'enum', description: 'string' },
  });

  newLinks.push({ ...meta, inviteUrl: url, sourceUrl: tweet.url });
}

// 写入 PR
for (const entry of newLinks) {
  await runScript('add-group.mjs', '--stdin', JSON.stringify(entry));
}
await openPR('Auto-discover: ' + newLinks.length + ' new groups');
```

### 预计运营成本
- Apify: ~$5/月（每 6 小时搜 50 条 = 约 6000 条/月）
- Claude Haiku: < $1/月
- **总计 < $6/月**，但能持续给目录注入新内容

---

## 我（Cascade）能立即帮你做什么

### 短期（今晚-明天）
- ✅ 第 0 层脚本已就绪
- 你以后只要把链接发到对话里，我直接调脚本上线（30 秒内）

### 中期（这周）
- 实施第 1 层：表单 → Worker → PR 自动化
- 实施第 2 层：链接巡检

### 长期（下周）
- 实施第 3 层：主动发现（需要你提供 Apify + Claude API key）

---

## 关于"我直接帮你找群组"

我已尝试通过 Google + 主流搜索引擎搜索"野生" XChat 群组邀请链接，结果是：
- **几乎搜不到** — X 链接被搜索引擎抓取得很少
- **xchat.show 上有真实链接但你禁用** — 我尊重这一决定
- **新闻/博客中嵌入的链接稀少** — 大多数来源只演示链接结构，不放真实链接

**实际可行的种子内容获取路径**：
1. 你（用户）在 X 上手动搜，发现链接 → 发我 → 我 30 秒上线
2. 你在 Telegram XChat 社群里求群主提交 → 同上
3. 等第 1 层管道做好 → 群主自助提交

**我无法替你在 X 上爬虫** — 这是技术能力边界，不是不愿意做。

---

## 总结

| 阶段 | 状态 | 价值 |
|------|------|------|
| 第 0 层：手动脚本 | ✅ 已完成 | 把"加群组"从 5 分钟压到 30 秒 |
| 第 1 层：群主提交 | 待做 | 让群主自助上线，你只需点 merge |
| 第 2 层：链接巡检 | 待做 | 防止目录死链化 |
| 第 3 层：主动发现 | 待做 | 自动给目录注入新内容（最值钱） |
