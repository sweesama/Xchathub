# AdSense / 联盟营销激活说明

本文件是 xchat.directory 项目的**变现激活清单**。站点架构、组件、CTA 位置都已经预留好变现位，只要把"参数"和"代码片段"填进去就能开始赚钱。

---

## 0. 前置条件（先满足这些才能往下走）

| 条件 | 说明 | 当前状态 |
|---|---|---|
| 域名有 ≥ 6 个月历史 | xchat.directory 必须稳定运行半年以上 | ✅ 满足 |
| 内容页 ≥ 30 篇 | 评测页 / 对比页 / FAQ / 教程都要上线 | ✅ 满足（10 篇评测 + 多篇对比/教程） |
| 移动端适配 | Google 用 mobile-first indexing，必须 responsive | ✅ 满足 |
| 隐私 / 关于 / 联系方式页 | Google 要求 | ✅ `/privacy` `/about` 都已有 |
| 自有 cookie 横幅 | GDPR / CCPA 必填 | ⚠️ 暂未实现（AdSense 上线前必须补） |

---

## 1. Google AdSense 激活（流量变现主力）

### 1.1 申请账号

1. 打开 https://www.google.com/adsense/start
2. 用一个 Google 账号登录（建议专门开一个 `monetization@xchat.directory`）
3. 输入站点 URL：`https://xchat.directory/`
4. 国家选 United States / United Kingdom（看你的 Vercel 账单地址）
5. 提交后通常 1–3 天审核，第一次过审后会给一段 `ca-pub-XXXXXXXXXXXXXXXX` 格式的发布商 ID

### 1.2 插入发布商代码

打开 [`src/layouts/Layout.astro`](/abs/path/f:/windsurf/xchat/src/layouts/Layout.astro)，在 `<head>` 里加入：

```html
<!-- Google AdSense -->
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossorigin="anonymous"
></script>
```

替换 `ca-pub-XXXXXXXXXXXXXXXX` 为你拿到的那段数字。

### 1.3 把广告位激活

项目里已经预留了 [`AdSlot.astro`](/abs/path/f:/windsurf/xchat/src/components/AdSlot.astro) 组件，目前是占位 div。

#### 1.3.1 编辑 `src/components/AdSlot.astro`

[`src/components/AdSlot.astro`](/abs/path/f:/windsurf/xchat/src/components/AdSlot.astro) 已经预留了占位/实投两路逻辑（靠 `enabled` prop 切换），**不用重写整个组件**，只需要改两处：

```diff
 // 顶部的占位常量
-const publisherId = '<ADSENSE_PUBLISHER_ID>';
-const slotId = '<ADSENSE_SLOT_ID>';
+const publisherId = 'ca-pub-XXXXXXXXXXXXXXXX';   // 你的发布商 ID
+const slotId = 'YYYYYYYYYY';                     // 这个 slot 对应的广告单元 ID

 // props 默认值：等到 AdSense 审核通过 + 真要投的时候改 true
 const {
   slot = 'default',
-  enabled = false,
+  enabled = true,
   label = 'Sponsored',
 } = Astro.props;
```

> **⚠️ 提示：** `AdSlot.astro` 已经有完整的 `{enabled ? <real ins/> : <placeholder/>}` 两路渲染，不用重写。新增广告位只要保持这种 `enabled` prop 切换模式即可。

#### 1.3.2 在 AdSense 后台创建对应广告单元

对每一个 `slot` 值，开一个匹配的广告单元：

| slot | 建议尺寸 | 放在哪些页面 |
|---|---|---|
| `review-top` | 728×90 / responsive | 所有 `/reviews/*` 顶部 |
| `review-mid` | responsive (in-article) | 评测正文中间（已经有 `<AdSlot slot="review-mid" />` 调用） |
| `review-bottom` | 728×90 / responsive | 评测 FAQ 之前 |
| `sidebar` | 300×250 / 300×600 | `/best-encrypted-messaging-apps`、`/` 右侧栏 |
| `list-mid` | responsive | `/best-encrypted-messaging-apps` 第 5 名之后插入 |

每个广告单元创建后会得到一个 10 位 `data-ad-slot` ID，写到上面代码里。

#### 1.3.3 各页面调用约定

评测页（`/reviews/*`）已经调用了 `<AdSlot slot="review-mid" />`，其他页面暂时没有调用。要补的位置：

| 页面 | 加几处 | slot 名 |
|---|---|---|
| `/` (index) | 2 | `hero-after`, `listings-mid` |
| `/best-encrypted-messaging-apps` | 3 | `top-after`, `rankings-mid`, `rankings-bottom` |
| `/faq` | 1 | `faq-mid` |
| `/about` | 0 | （避免在 about 页放广告显得 low-end） |
| `/privacy`、`/404` | 0 | （永远不放） |

### 1.4 Vercel 环境变量（可选，但推荐）

```bash
# .env.production（这个文件 .gitignore 掉，不要提交）
PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
PUBLIC_ADSENSE_SLOT_REVIEW_MID=YYYYYYYYYY
PUBLIC_ADSENSE_SLOT_REVIEW_BOTTOM=ZZZZZZZZZZ
```

然后在 `AdSlot.astro` 里改成 `import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID` 读取。这样切换 ID 不用动代码。

---

## 2. 应用商店联盟（评测页 CTA）

每个评测页都用了 [`<AppCTA app={app} />`](/abs/path/f:/windsurf/xchat/src/components/AppCTA.astro) 组件，链接逻辑集中在 `buildAffiliateUrl` 里，目前是空实现（直接返回原 URL）。

### 2.1 Apple Search Ads（iOS）

1. 去 https://searchads.apple.com/ 注册
2. 创建一个 Campaign（建议 Country = US，先测；Country = WW 再扩）
3. 拿到 `at` 参数（在 Campaign → Settings → Advanced 里）
4. 改 `AppCTA.astro`：

```typescript
const buildAffiliateUrl = (base: string): string => {
  const at = import.meta.env.PUBLIC_APPLE_SEARCH_ADS_AT;
  if (!at) return base;
  // Apple 的格式：https://apps.apple.com/app/idXXXX?at=YYYYYY&ct=ZZZ
  // 直接用 URL 拼接最稳
  const url = new URL(base);
  url.searchParams.set('at', at);
  url.searchParams.set('ct', 'xchatdir');
  return url.toString();
};
```

`.env.production`：
```bash
PUBLIC_APPLE_SEARCH_ADS_AT=1234567
```

### 2.2 Google Play Install Referrer

1. 去 https://play.google.com/intl/en_us/badges/ 注册 publisher（直接看 https://support.google.com/admob/answer/9869675 的 affiliate 章节）
2. 或更简单：用 Impact / PartnerStack / ShareASale 上的 affiliate 平台
3. 在 Google Play Console 里给 `chat.simplex.app` 之类的 package 加 `referrer` 参数
4. 同样改 `buildAffiliateUrl`：

```typescript
const androidScheme = (pkg: string) => {
  const base = `https://play.google.com/store/apps/details?id=${pkg}`;
  const ref = import.meta.env.PUBLIC_PLAY_REFERRER;
  if (!ref) return base;
  return `${base}&referrer=${encodeURIComponent(ref)}`;
};
```

### 2.3 Threema / Wire 专属联盟（高单价）

这两个是少数主动开 affiliate 计划的 messenger：

- **Threema Affiliate:** https://threema.ch/en/partners（联系 sales，最少一两个月审核期）
- **Wire Affiliate:** 通过 Impact Radius 申请（https://impact.com/ 找 Wire）

这些是**付费联盟**（按安装或订阅分钱），单价从 $0.50 到 $5+。Threema 是付费 app，转化率高，单价也高。

### 2.4 SimpleX / Briar / Session 捐赠

这几个是**开源 + 接受捐赠**的项目，没有付费联盟。建议做法：

- 把 `buildAffiliateUrl` 在它们的 app 上短路掉，直接给官方捐赠页：

```typescript
const buildAffiliateUrl = (base: string): string => {
  // 开源项目：跳官方下载页，不夹带 affiliate 参数
  if (['simplex', 'briar', 'session'].includes(app.slug)) {
    return app.website;  // 直接回官网
  }
  // 商业项目：走联盟
  // ... 上面 2.1 / 2.2 的逻辑
};
```

---

## 3. Amazon Associates（攻略/周边导购，未来）

评测页底部未来可以加一个"相关硬件"区块（带屏幕锁的手机、防窥膜、硬件安全密钥 YubiKey），这些都可以挂 Amazon Associates 链接：

```typescript
// src/data/amazonLinks.ts
export const AMAZON_TAG = 'xchatdir-20';
export const AMAZON_LINKS = {
  yubikey5: `https://www.amazon.com/dp/B07HBD71HL?tag=${AMAZON_TAG}`,
  tabletLock: `https://www.amazon.com/dp/B0...?tag=${AMAZON_TAG}`,
};
```

---

## 4. 合规 / 监管要求（FTC + GDPR）

| 法规 | 强制项 | 落地位置 |
|---|---|---|
| **FTC Endorsement Guides** | 每条联盟链接必须 `rel="sponsored"` | ✅ 已在 `AppCTA.astro` 加 `rel="nofollow noopener noreferrer sponsored"` |
| **FTC Disclosure** | 站点必须有独立的 affiliate disclosure 页 | ❌ **必须创建 `/affiliate-disclosure`** |
| **GDPR** | 投放广告 / 联盟追踪前需要 cookie consent | ❌ **必须实现 cookie banner** |
| **CCPA** | 加州用户必须有 "Do Not Sell My Info" 链接 | ❌ 放到 `/privacy` 页底部 |
| **EU DSA** | 欧盟月活 > 5M 才会被规管，xchat.directory 暂未触发 | — |

### 4.1 创建 `/affiliate-disclosure`

```bash
# 创建 src/pages/affiliate-disclosure.astro
# 用 src/pages/privacy.astro 当模板
# 内容大纲：
# 1. 我们的商业模式
# 2. 哪些链接是 affiliate
# 3. 我们怎么评分（编辑独立性）
# 4. 价格不因 affiliate 改变
# 5. 联系我们
```

### 4.2 Cookie banner

最简单的方案：用 Cookiebot（免费 100 页/月）或自建极简 banner。

```astro
---
// src/components/CookieBanner.astro
---
<script is:inline>
  if (!localStorage.getItem('xchat-cookies-accepted')) {
    document.addEventListener('DOMContentLoaded', () => {
      // 渲染 banner HTML，点了"接受"才写入 localStorage 并激活 AdSense / Analytics
    });
  }
</script>
```

---

## 5. 收入预估（每月）

| 收入来源 | 预期月活 | CPC / 转化 | 月预估 |
|---|---|---|---|
| **AdSense**（10 个评测页 × 3 个 slot） | 假设月 PV 50K | CPC $0.5–1.5（privacy 关键词很贵） | $80–250 |
| **Apple Search Ads** | 50K PV × 1% 点击 CTA | 注册转化 5% | $25–80 |
| **Google Play Referrer** | 50K PV × 1% × 50% 是 Android | 注册转化 5% | $15–60 |
| **Threema Affiliate**（审核通过后） | 50K PV × 0.2% 点 Threema | 单安装 $0.5–1.5 | $5–15 |
| **Amazon Associates**（未来） | — | — | $0–30 |
| **合计（保守）** | — | — | **$120–400/月** |

> 2026 年 7 月 Google 对"加密 / 隐私"关键词的 CPC 行情：US $1.2–2.5，EU $0.4–1.0，APAC $0.1–0.5

---

## 6. 启动顺序（推荐 timeline）

```
Day 0:  申请 AdSense（同时把 CookieBanner + affiliate-disclosure 页面写完）
Day 1-3: 申请 Apple Search Ads、注册 Impact（Threema / Wire）
Day 3-7: 等 AdSense 审核，期间把 AdSlot 组件代码写好（用假 ID 也可以）
Day 7:  AdSense 拿到发布商 ID → 替换 Layout.astro 里的 ca-pub
Day 7:  在 AdSense 后台开广告单元 → 拿 slot ID → 替换 AdSlot.astro
Day 8:  Vercel 部署 → 第一次 build → 检查 ad 渲染
Day 8:  申请 Apple Search Ads 的 at 参数 → 改 buildAffiliateUrl
Day 14: 看 Analytics 数据，盯着 fill rate / viewability / CTR
Day 30: 看 AdSense 月收入，决定要不要扩 Amazon / Threema affiliate
```

---

## 7. 不要做的事

- ❌ **不要在 `app.website` 之前夹 affiliate 参数**（会破坏用户对官网的信任）
- ❌ **不要用 cookie stuffing / iframe 假装曝光**（会被 AdSense 永久封号）
- ❌ **不要给开源 app（SimpleX / Briar / Session）加 affiliate**（它们不接受，我们也不应该）
- ❌ **不要在 `/privacy`、`/404`、`/affiliate-disclosure` 上放 AdSense**（AdSense 政策禁止）
- ❌ **不要在 cookie banner 没出来之前激活 AdSense**（欧盟流量会被罚款）
- ❌ **不要在每月 25 万 PV 之前考虑 header bidding / Mediavine / AdThrive**（门槛不够）

---

## 8. 调试清单

AdSense 装了不显示？按这个顺序排查：

1. `<head>` 里有 `ca-pub-XXXXXXXXXXXXXXXX` 的 script 吗？
2. `<ins>` 标签的 `data-ad-client` 和 `data-ad-slot` 都对吗？
3. AdSense 后台这个广告单元是 active 状态吗？
4. 浏览器 console 有没有 `adsbygoogle.push` 报错？
5. AdSense 后台 → "Policy center" 有没有违规？
6. 站点 robots.txt 没屏蔽 `pagead2.googlesyndication.com` 吧？（本站 `/robots.txt` 默认不屏蔽）
7. 你本地浏览器没装 AdBlock 吧？（这是最常见的"我看不到广告"原因）

---

## 9. 关键文件位置速查

| 用途 | 文件 |
|---|---|
| AdSense 主体代码 | `src/layouts/Layout.astro` `<head>` |
| 广告位组件 | `src/components/AdSlot.astro` |
| 联盟链接改写 | `src/components/AppCTA.astro` 的 `buildAffiliateUrl` |
| 合规披露 | `src/pages/affiliate-disclosure.astro`（待创建） |
| Cookie Banner | `src/components/CookieBanner.astro`（待创建） |
| Analytics 集成 | `src/layouts/Layout.astro`（GA4 / Plausible 推荐 Plausible） |
| 收入追踪 | Google Sheets 月度手填 |

---

## 10. 一句话总结

> 框架已搭好（`AdSlot` + `AppCTA` + 全部评测页都引用），剩下只是填 ID、补 cookie banner、写 disclosure 页。零代码改动也能上 AdSense，只是合规风险高。