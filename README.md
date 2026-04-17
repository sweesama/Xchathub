# XChat Hub — XChat Unofficial Resource Hub

> 全网最快的 XChat 非官方资讯枢纽，专为 "信息差截流" 打造。

## 项目定位

XChat（马斯克旗下超级隐私通讯应用）于 **2026.4.23** 在 iOS 首发（从原定 4.17 推迟），**没有安卓版**。本站承接两波自然搜索流量：

1. **短线爆发**：截获 `XChat Android APK / XChat web version` 等热词，引流到 Telegram 频道沉淀用户
2. **长线沉淀**：群组导航黄页（官方不做群组搜索，我们来做），成为被动流量池

## 技术栈

| 层级 | 选型 | 原因 |
|------|------|------|
| 框架 | **Astro 4** | 纯静态输出，零运行时 JS，SEO 天花板 |
| 样式 | **原生 CSS** | 零依赖，极致性能 |
| 部署 | **Vercel** | GitHub 集成，全球 CDN，自动部署 |
| 域名 | **xchat.directory** | Cloudflare 托管 |
| SEO | **JSON-LD + llms.txt** | 结构化数据 + AI 搜索引擎友好 |
| 社区 | **Telegram Channel + Group** | 通知频道 + 讨论社区 |

## 项目结构

```
xchat/
├── astro.config.mjs    # Astro 配置（站点、sitemap 插件）
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg     # X 风格站点图标
│   ├── og-image.svg    # 社交分享预览图（1200×630）
│   ├── robots.txt      # 爬虫规则（含 AI 爬虫白名单）
│   └── llms.txt        # LLM 抓取友好的网站描述（llmstxt.org 标准）
│   # sitemap.xml 由 @astrojs/sitemap 构建时自动生成
└── src/
    ├── styles/
    │   └── global.css  # X 纯黑科技风全局样式（X Blue 强调色）
    ├── layouts/
    │   └── Layout.astro # HTML 骨架（Meta / OG / JSON-LD / theme-color / dns-prefetch）
    ├── components/
    │   ├── Header.astro # 毛玻璃顶部导航
    │   └── Footer.astro # 免责声明 + 快速链接（含 Channel / Community 双入口）
    └── pages/
        ├── index.astro  # 首页：Hero + 双 CTA（App Store / Telegram）+ 对比表格 + FAQ
        ├── groups.astro # 群组导航：搜索 + 12 分类筛选 + Coming Soon
        ├── privacy.astro# 隐私政策（AdSense 审批前置条件）
        └── 404.astro    # 自定义 404 页面
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:4321）
npm run dev

# 构建生产版本
npm run build

# 本地预览生产版本
npm run preview
```

## 页面说明

### 首页 (`/`)
- **Hero**：安卓状态追踪器 + 双 CTA（App Store 预购 / Telegram 社区）
- **替代方案**：教安卓用户通过 X 网页版临时替代
- **对比表格**：XChat vs WhatsApp vs Signal vs Telegram（GEO 核心弹药）
- **FAQ**：6 个常见问题，带完整 Schema.org FAQPage 结构化数据

### 群组导航 (`/groups`)
- **搜索 & 12 分类筛选**：All / Crypto / Tech / AI / News / Sports / Gaming / Business / Entertainment / Education / Local / Other（基于跨平台数据调研）
- **群组卡片**：名称、描述、人数进度条、Join 按钮（发布后填充真实数据）
- **数据结构预留**：`tags[]` 数组支持未来多标签子筛选
- **Telegram CTA**：引导用户加入社区群提交群组

### 隐私政策 (`/privacy`)
- AdSense 审批前置条件 + GDPR 合规

### 404 页面
- 自定义错误页，导流回首页和群组目录

## SEO / AEO / GEO 清单

- [x] FAQPage Schema.org JSON-LD 结构化数据
- [x] WebSite Schema + SearchAction
- [x] BreadcrumbList 结构化数据
- [x] CollectionPage Schema（群组目录）
- [x] `<time>` 语义标签标注关键日期
- [x] Canonical URL + hreflang + Open Graph + Twitter Card
- [x] theme-color + color-scheme（移动浏览器原生感）
- [x] DNS Prefetch / Preconnect（Telegram、App Store 外链加速）
- [x] `robots.txt` 完整规则（AI 爬虫白名单 + SEO scraper 黑名单）
- [x] `llms.txt`（llmstxt.org 标准，AI 搜索引擎友好）
- [x] 自动生成 sitemap（@astrojs/sitemap 插件）
- [x] `og-image.svg`（1200×630 社交分享图）
- [x] 对比表格（GEO 优化，AI 搜索引擎优先抓取）
- [ ] 补一个 PNG 格式的 og-image（某些平台不支持 SVG 预览）
- [ ] 提交 Google Search Console 验证
- [ ] 申请 Google AdSense（需网站有稳定流量）

## TODO（后续迭代）

- [ ] PNG 版本 og-image（提升 Facebook / LinkedIn 分享效果）
- [ ] 接入 Plausible 或 Umami 匿名分析
- [ ] 安卓版发布后更新 Hero 状态
- [ ] 4 月 23 日后填充真实群组数据（来自 Telegram 社区提交）
- [ ] 考虑付费置顶位 / Premium 目录（商业化）

## 部署

通过 **Vercel** + GitHub 自动部署：
1. `astro.config.mjs` 中 `site` 已设为 `https://xchat.directory`
2. `public/robots.txt` 中的 sitemap URL 已正确指向生产域名
3. 推送到 GitHub 后 Vercel 自动构建部署
4. Cloudflare 管理域名 DNS 解析到 Vercel

## 免责声明

本项目为非官方社区项目，与 X Corp 或 Elon Musk 无关联。
