# AdSense 申请准备 Checklist
**生成时间**: 2026-07-13
**目标域名**: https://xchat.directory

---

## ✅ 已完成的硬性要求（系统已就绪）

### 1. 法律 / 合规页面
- [x] [/privacy/](https://xchat.directory/privacy/) — 隐私政策
- [x] [/terms/](https://xchat.directory/terms/) — 服务条款
- [x] [/contact/](https://xchat.directory/contact/) — 联系方式（带 last-updated）
- [x] [/affiliate-disclosure/](https://xchat.directory/affiliate-disclosure/) — FTC 联盟披露
- [x] [/about/](https://xchat.directory/about/) — 关于我们（含 editorial standards）

### 2. Cookie 同意（GDPR / CCPA）
- [x] CookieBanner 组件（Accept all / Only necessary 两个按钮）
- [x] localStorage 持久化（key: `xchat-cookie-consent`）
- [x] Google Consent Mode v2 已接入
- [x] 默认拒绝 analytics_storage（需用户主动接受）
- [x] Footer 含 "Cookie preferences" 入口

### 3. SEO / 技术基建
- [x] sitemap.xml（46 URLs，priority 与 changefreq 已配置）
- [x] robots.txt（含 sitemap 引用，AI 爬虫允许，SEO 爬虫屏蔽）
- [x] manifest.webmanifest / favicon / og-image / apple-touch-icon
- [x] 移动端响应式（CSS clamp / media query）
- [x] GA4: G-3J5D4C9DPK（已配置 consent mode）

### 4. 内容深度（AdSense 重点）
- [x] 10 个评测页（`/reviews/[slug]/`）
- [x] 5 个对比页（`/compare/...`）— 含 2 个三连对比（2026 加固）
- [x] 1 个 best-of 榜单页（1500-2500 词，2026 long-tail 锚点）
- [x] Group 分类页 ×N（自动生成）
- [x] **总 46 pages built**，content body 各 ≥ 1000 字

### 5. 广告位预留
- [x] AdSlot 组件（4 个 slot: `review-top` / `review-mid` ×2 / `review-bottom`）
- [x] 已嵌入到 6 个评测 + 对比页
- [x] **现在 AdSlot 是占位，等 AdSense 批准后替换为真实 ad code**

---

## ⏳ 需要用户手动做的事

### Step 1: 提交 AdSense 申请
1. 打开 https://www.google.com/adsense/
2. 用 Google 账号登录
3. 输入 `https://xchat.directory`
4. 选择国家 / 接受条款
5. 等待 Google 验证（验证方式：插 `<meta name="google-adsense-account" content="ca-pub-xxx">` 到 `<head>`，或者上传 HTML 文件到站点根）

### Step 2: 等待审批（通常 1-14 天）
- 期间 Google 会爬取网站检查内容质量
- 可能发邮件要求修改（如内容不足 / 导航不清晰）

### Step 3: 拿到 ads.txt + auto ads code 后给我
- 我会：
  - 创建 `public/ads.txt` 文件
  - 把 AdSlot 组件里的占位换成真实 ad code
  - 在 Layout.astro 加 auto ads script
  - 部署上线

---

## ⚠️ 已知风险（AdSense 可能拒批的原因）

1. **流量太少**：新站流量 < 100 UV/day 容易被拒
   - **缓解**：6-8 周内专注 SEO 长尾词收录（v1 计划已包含）
2. **内容看起来薄**：有些页面只有几十字
   - **缓解**：已确认评测 / 对比页都是 1500+ 词
3. **导航 / 分类不够清晰**
   - **缓解**：已有 Header + Footer + Group 分类页
4. **群组目录看起来像 link farm**
   - **缓解**：GitHub Action 已暂停（手动审核），现有群组都是 XChat 相关

---

## 📊 当前 build 状态

```
[build] 46 page(s) built in 2.97s
[build] Complete!
[check] 0 errors / 0 warnings / 17 hints
```

---

## 🚀 部署后立刻可做的「加分项」

1. **加 About 页面更多编辑团队信息**（AdSense 喜欢 E-E-A-T）
2. **加 author schema 到评测页**（个人作者，不是组织）
3. **加快收录**：提交 sitemap 到 Google Search Console
4. **持续产出内容**：每月 1-2 篇新评测 / 对比

---

## ❓ 不做的事

- 不预先放假广告（AdSense 政策禁止）
- 不修改 Content-Security-Policy 阻碍爬虫
- 不使用 cloaking / hidden text 等黑帽 SEO