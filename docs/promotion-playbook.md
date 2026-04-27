# XChat Hub 推广 Playbook（让网站被发现）

> 你已经做好了网站。现在的问题是：**没人知道它存在**。
>
> 这份 playbook 是 30 天冷启动行动清单。每条任务都标注了 [你做] 或 [我做]。

---

## 优先级 P0：搜索引擎收录（必须做）

### 1. Google Search Console 验证 ✋ [你做]
1. 打开 https://search.google.com/search-console
2. 用 Google 账号登录
3. 添加资源 → 选择 "URL 前缀" → 输入 `https://xchat.directory`
4. 选择"HTML 标签"验证方式
5. 复制它给的 `<meta name="google-site-verification" content="XXXXXXX" />` 中的 token
6. **把 token 发给我**，我会把它填到 `Layout.astro` 第 68 行（已留好占位）
7. 部署完成后回到 Search Console 点"验证"
8. 验证通过后：
   - 提交 `https://xchat.directory/sitemap.xml` 给 Google
   - 用 URL Inspection 工具，对 6 个核心页面提交"请求索引"：
     - `/`
     - `/groups`
     - `/android`
     - `/web`
     - `/communities-shutdown`
     - `/how-to-create-group-link`

### 2. Bing Webmaster Tools 验证 ✋ [你做]
1. 打开 https://www.bing.com/webmasters
2. 添加站点 `https://xchat.directory`
3. 选择 Meta tag 验证方式 → 复制 `msvalidate.01` 的值发我
4. 验证后提交 sitemap

### 3. IndexNow API（让 Bing/Yandex 即时收录）[我做]
我可以加一个构建后自动 ping IndexNow 的脚本（让新页面 30 分钟内被 Bing 和 Yandex 收录，不用等爬虫）。
**告诉我"做 IndexNow"** 我就开始做。

### 4. Submit to Yandex / Baidu / DuckDuckGo ✋ [你做]
- Yandex: https://webmaster.yandex.com（如果想要俄语流量）
- DuckDuckGo: 不需要主动提交（它依赖 Bing 索引）
- Baidu: 需要中国服务器才有效，**跳过**

---

## 优先级 P1：社交平台冷启动（这周做）

### 5. 创建 X (Twitter) 账号 ✋ [你做]
- 用户名建议：`@xchathub` 或 `@xchatdirectory`
- 头像：用网站的 favicon.svg
- Banner：用 og-image
- Bio：`The community-powered XChat group directory. Find & share invite links. https://xchat.directory`
- 然后**主动关注**这些群组的群主：
  - @GRIIIMGAMER（已上线的群主）
  - @Zeezahgraphix（已上线的群主）
- **第一条推文**：感谢他们 + 介绍网站
- **每天发 1-2 条**：分享一个分类着陆页 + 鼓励群主提交

### 6. 在 X 上"温和地"宣传你帮过的群主 ✋ [你做]
- 找到 GRIIIMGAMER 的相关推文，回复："Listed your podcast group on https://xchat.directory/groups/business — hope it brings you new members 🎙️"
- 同样回复 Wahab（goat farming）
- 这是免费的反向链接 + 可能被群主转发

### 7. Reddit 战略性发帖 ✋ [你做]
**重要**：Reddit 反 self-promotion 极强，必须谨慎。
- 在 `r/Twitter` 或 `r/X_Twitter` 发"问题贴"：
  > "Anyone else struggling to find XChat groups? I made a directory: xchat.directory. Open to suggestions on how to make it better."
- **不要**在多个 sub 同时发（会被 ban）
- 先观察 1-2 周再发

### 8. 在 XChat 群组里宣传 ✋ [你做]
- 加入你已上线的两个群组（GRIIIM Pod, Goat Farming）
- 礼貌介绍：你的群被列在 xchat.directory，欢迎别的群主也提交
- 这是**最高 ROI** 的渠道：群主圈子里口碑传播

---

## 优先级 P2：内容营销（持续做）

### 9. 写 1 篇核心博客文章 [我做，需你审稿]
**话题建议**（按 SEO 价值排序）：
1. **"How XChat Groups Compare to Telegram, WhatsApp, and Signal"** — 已有对比表，写成 3000 字长文
2. **"X Communities Is Dying — How to Migrate Your Members to XChat"** — 蹭 5/30 关停热度
3. **"The First Week of XChat: What Worked, What Broke"** — 真实使用报告

告诉我做哪一个，我 1 小时内出一篇。

### 10. 制造可被引用的"权威内容" [我做]
- 已有的 `/llms.txt` — 让 ChatGPT/Claude 抓取我们网站作为 XChat 知识源
- 加一个 `/api/groups.json` 端点 — 公开 API，让其他开发者拿数据 = 反向链接
- 写一个英文 GitHub repo `awesome-xchat`，README 链接回我们

**告诉我"做 awesome-xchat"** 我就开始做。

### 11. 提交到目录站 ✋ [你做]
免费的"工具目录站"（每个都给你一条反向链接）：
- https://www.producthunt.com — 上线日要做大事件
- https://www.indiehackers.com — 写一条 Show IH
- https://www.reddit.com/r/SideProject — Show & Tell
- https://news.ycombinator.com/show — Show HN
- https://betalist.com
- https://launchingnext.com
- https://saashub.com

**Product Hunt 是最重要的** — 但只能上线一次，要选好时机（建议群组数到 20 条以上再上）。

---

## 优先级 P3：高级 SEO（30 天后）

### 12. 反向链接策略
- 写 guest post 到这些网站（要求加 `xchat.directory` 链接）：
  - Beebom、Roboin（已经有 XChat 文章，可以联系作者）
  - 9to5Mac、TheVerge、TechCrunch（如果有故事性内容）
- 在 Quora 答 "What is XChat?" 类问题，引用我们网站

### 13. 加 Schema.org 评分
我们已经有 FAQPage / CollectionPage / Organization。**还可以加**：
- 每个群组卡 → `Event` schema（如果有定期活动）
- 教程页 → `HowTo` schema（已有 step 结构，加几行 JSON-LD 就行）

**告诉我"加 HowTo schema"** 我就做。

### 14. Core Web Vitals 优化
当前 PageSpeed 分数应该不错（静态站 + 0 JS），但可以查一下：
- https://pagespeed.web.dev/?url=https%3A%2F%2Fxchat.directory
- 截图发我，有差的指标我修

---

## 30 天目标 KPI

| 指标 | 目标 | 现状 |
|------|------|------|
| Google 收录页数 | 20+ | 0（需提交） |
| Bing 收录 | 20+ | 0 |
| 直接搜索流量/天 | 50+ | 0 |
| 群组数量 | 25+ | 2 |
| X 粉丝 | 100+ | 0 |
| Reddit 上的提及 | 3+ | 0 |
| 反向链接（Ahrefs 检查） | 5+ | 0 |

---

## 今天就要做的 3 件事（5 分钟）

1. **✋ 你**：打开 Google Search Console，拿 verification token 发我
2. **✋ 你**：打开 Bing Webmaster Tools，拿 verification token 发我
3. **🤖 我**：等你给 token 后立即上线 + ping Google/Bing

---

## 下周要做的 3 件事

1. **✋ 你**：开 X 账号 `@xchathub` + 关注两位已上线群主
2. **✋ 你**：在 XChat 群里礼貌宣传
3. **🤖 我**：写 1 篇核心博客文章（你选话题）

---

## 不要做的事 ❌

- ❌ **不要**在 1 天内疯狂发 50 条推文 — X 会限流
- ❌ **不要**在 Reddit 多个 sub 同时发 — 会被永久 ban
- ❌ **不要**买流量（Fiverr/低质付费推广）— 假流量伤 SEO
- ❌ **不要**伪造群组数据（虚标成员数）— 信任崩塌后无法挽回
- ❌ **不要**在群组数 < 20 时上 Product Hunt — 一次性机会，不能浪费
