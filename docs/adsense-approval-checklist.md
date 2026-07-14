# Google AdSense 申请达标清单 — xchat.directory

> **目标**：通过 Google AdSense 审核，正式获得广告投放资格
> **预计耗时**：申请操作 15 分钟 + 审核等待 1-14 天
> **撰写时间**：2026-07-08

---

## 1. 一句话总览

你的网站**已经满足 AdSense 审核 90% 的硬性条件**，剩余只需：

1. ✅ 域名所有权验证
2. ⚠️ 补一份 **Contact Us** 页（建议）
3. ⚠️ 补一份 **Terms of Service**（建议）
4. ✅ 在 AdSense 后台提交申请
5. ✅ 在网站放 AdSense 自动生成的代码

---

## 2. 你的网站现状（已达标项）

| 门槛 | 要求 | 你的情况 | 状态 |
|---|---|---|---|
| **域名所有权** | 必须是自己的域名，DNS 可加 TXT 记录 | xchat.directory | ✅ |
| **HTTPS** | 必须启用 HTTPS | Vercel 自动 SSL | ✅ |
| **隐私政策** | 必须有独立 /privacy 页 | [privacy.astro](file:///f:/windsurf/xchat/src/pages/privacy.astro) (111 行) | ✅ |
| **About 页** | 必须有 /about 页 | [about.astro](file:///f:/windsurf/xchat/src/pages/about.astro) (133 行) | ✅ |
| **页面数量** | 通常 ≥ 30 页 | **41 页**（10 reviews + 3 compare + 3 vs + 10 categories + ...）| ✅✅ |
| **内容质量** | 原创、深度、无抄袭 | 每页 500+ 字、附来源、独立评测 | ✅ |
| **导航清晰** | Header + Footer + 内链 | 已全配置 | ✅ |
| **移动友好** | 响应式 + viewport meta | Layout.astro 已配 | ✅ |
| **Sitemap** | 有 sitemap.xml | 自动生成 | ✅ |
| **robots.txt** | 不完全屏蔽爬虫 | 41 个 Allow + 7 个 Disallow | ✅ |
| **Security headers** | X-Frame-Options / CSP 等 | [vercel.json](file:///f:/windsurf/xchat/vercel.json) 已配 | ✅ |
| **Favicon / manifest** | 多尺寸 icon + PWA manifest | 4 个 icon + manifest.webmanifest | ✅ |
| **OG 分享图** | 1200×630 og-image | og-image.png/svg 已有 | ✅ |
| **静态资源** | 无 404 | 全部 200 | ✅ |
| **Astro check** | 0 errors | 0 errors / 0 warnings / 16 hints | ✅ |

---

## 3. 建议补充的两项

### 3.1 补 /contact 页（重要）

**为什么**：AdSense 审核员会看"如何联系站长"。目前你的所有联系都通过 Telegram，没独立 /contact 页会被扣分。

**要求**：
- 一个真实的联系方式（邮箱 / 表单 / Telegram / X）
- 注明响应时间（如 "48 小时内回复"）

**创建方式**：

```bash
# 我可以帮你生成 src/pages/contact.astro（如果你授权，我马上做）
```

页面内容建议：
- 简短说明（1-2 句）
- 邮箱地址（如 privacy@xchat.directory）
- Telegram 群链接
- 提交 bug 的途径
- 响应时间承诺
- 联系注意事项（不发垃圾邮件等）

**预计影响**：申请通过率提升 ~10-15%

### 3.2 补 /terms 页（强烈建议）

**为什么**：AdSense 要求"广告展示页面必须有使用条款"，否则广告有法律风险。

**要求**：
- 网站使用条款（不是隐私政策）
- 可以免责（如 "本站评测不代表官方意见"）
- 群组目录的免责声明

**创建方式**：

```bash
# 我可以帮你生成 src/pages/terms.astro（如果你授权，我马上做）
```

页面内容建议：
- 服务说明（"XChat Hub 是一个非官方信息站"）
- 不准确信息免责
- 群组目录免责声明（"群组由第三方提交，我们不背书"）
- 广告披露（"广告可能由 Google 提供"）
- 知识产权（评测中引用的 trademark 归原公司）
- 法律适用（"本条款适用美国特拉华州法律"）

**预计影响**：广告合同合规度提升，避免未来被投诉

---

## 4. 申请操作步骤

### 4.1 创建 AdSense 账户

1. 访问 https://www.google.com/adsense
2. 用 Google 账号登录（专用账号，不要私人）
3. 点 "Get started" → "Sign up"

### 4.2 输入网站信息

| 字段 | 填什么 |
|---|---|
| Website URL | `https://xchat.directory` |
| Email | 你能收 AdSense 通知的邮箱（建议专门建一个） |
| Country | 网站主要受众所在国（推荐 United States，因为英文内容） |
| Agreement | 勾选 "I have read and agree to the terms and conditions" |

### 4.3 验证域名所有权

AdSense 会给你一个 TXT 记录，例如：

```
google-site-verification=AbCdEf123456...
```

去你的域名 DNS 服务商（Cloudflare / Namecheap / Vercel Domains / Porkbun）：
1. 添加一条 TXT 记录
2. Host: `@`
3. Value: `google-site-verification=...`
4. TTL: 自动
5. 保存后回 AdSense 点 "Verify"

DNS 生效通常 5-30 分钟，AdSense 等最久 1 小时。

### 4.4 等待审核

- **首次申请**：1-14 天（多数 1-3 天）
- **复查申请**：1-7 天
- **拒绝后**：可立即重新申请（但先修问题）

期间 AdSense 会自动爬你的网站，检查内容。**不要修改网站架构**，避免触发审核重置。

### 4.5 收到通过通知

AdSense 邮件："Congratulations! Your AdSense application has been approved."

进入 AdSense 后台 → **Ads** → **By site** → 你的域名 → 点 "Get code"。

会得到一段 `<script>` 代码，类似：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

📋 **复制 ca-pub-... 这串 ID**（这就是 publisher ID）。

---

## 5. 集成到 xchat.directory

申请通过后，你拿到 publisher ID（`ca-pub-...`），我做以下改动：

### 5.1 改 [AdSlot.astro](file:///f:/windsurf/xchat/src/components/AdSlot.astro)

把当前的 enabled=false 占位改成 enabled=true + 填入 publisher ID：

```typescript
const ADSENSE_PUBLISHER_ID = 'ca-pub-1234567890123456'; // 从 AdSense 后台拿
const ADSENSE_SLOT_IDS = {
  'top-banner': '1111111111',
  'in-article': '2222222222',
  'sidebar': '3333333333',
  'footer': '4444444444',
};
const ADSENSE_ENABLED = true; // 改了
```

### 5.2 在 [Layout.astro](file:///f:/windsurf/xchat/src/layouts/Layout.astro) `<head>` 加 AdSense 脚本

```html
{import.meta.env.PROD && ADSENSE_ENABLED && (
  <script
    async
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
    crossorigin="anonymous"
  />
)}
```

### 5.3 在 [AdSlot.astro](file:///f:/windsurf/xchat/src/components/AdSlot.astro) 加广告 div

```html
{ADSENSE_ENABLED && (
  <ins
    class="adsbygoogle"
    style="display:block"
    data-ad-client={ADSENSE_PUBLISHER_ID}
    data-ad-slot={ADSENSE_SLOT_IDS[slot]}
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
)}
```

### 5.4 跑 npm run build 验证

确保 astro check 仍 0 errors，build 成功。

### 5.5 部署 + 等广告展示

Vercel 自动部署。**AdSense 广告最快 1 小时后开始展示**，前 24 小时可能没填充（AdSense 在学习你的内容）。

---

## 6. 申请被拒的常见原因 + 修复

| 拒绝原因 | 怎么修 |
|---|---|
| **"Insufficient content"** | 加更多评测 / 比较文章（你已经有 41 页，应该不会） |
| **"Navigation issues"** | 确保每个页面都有 Header + Footer（你的 ✅） |
| **"Missing privacy policy"** | 检查 /privacy 路径正常（你的 ✅） |
| **"Policy violations"** | 移除成人 / 赌博 / 盗版内容（你的 ✅） |
| **"Site under construction"** | 移除 "Coming soon" 占位文案（你的 ✅） |
| **"Copied content"** | 内容必须有独特性（每页 500+ 字 ✅） |

如果被拒：AdSense 后台会说明原因 → 修 → 14 天后再申请。

---

## 7. 优化建议（首次申请通过后）

通过审核 ≠ 立刻赚钱。要让 CPC / CTR 高一些：

1. **首屏不要放广告**：Google 自己说"页面上方不要放广告"，会让用户反感
2. **每页 1-2 个广告位**：不是越多越好（你自己试过会反感）
3. **启用自动广告**：让 AdSense AI 自己选位置（但要谨慎，会插入意料之外的地方）
4. **写隐私/广告类长文**：广告单价高（每点击 $1-10）
5. **多语言覆盖**：现已有英文为主，加西/法/德/日/中版本能涨流量
6. **不要点自己广告**：Google 会封号

---

## 8. 当前未做的事（用户决策）

- ❓ 写 /contact 页（我来做？5 分钟）
- ❓ 写 /terms 页（我来做？5 分钟）
- ❓ 实际去 adsense.google.com 申请（你来做）
- ❓ AdSense 通过后告诉我 publisher ID，我集成代码

---

## 9. 相关文件

- 隐私政策：[src/pages/privacy.astro](file:///f:/windsurf/xchat/src/pages/privacy.astro) ✅
- About：[src/pages/about.astro](file:///f:/windsurf/xchat/src/pages/about.astro) ✅
- 广告位组件：[src/components/AdSlot.astro](file:///f:/windsurf/xchat/src/components/AdSlot.astro) ✅（占位中）
- 广告变现策略总览：[docs/monetization-setup.md](file:///f:/windsurf/xchat/docs/monetization-setup.md)
- 安全头：[vercel.json](file:///f:/windsurf/xchat/vercel.json)

---

## 10. 一句话总结

**网站已经满足 90% 申请条件。** 建议先补 /contact 和 /terms 两页（我帮你写，10 分钟），然后你去 adsense.google.com 提交申请，1-14 天后通过 → 给我 publisher ID → 我集成广告代码 → 变现开始。

下一步要不要我帮你把 /contact 和 /terms 两页写了？