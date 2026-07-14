# Search Console Verification Setup

xchat.directory 现在已支持 3 个搜索引擎的 verification meta tag。拿到 token 后，**通过环境变量注入**即可生效，无需改代码。

## 1. 拿 token

| 搜索引擎 | URL | 步骤 |
|---|---|---|
| **Google Search Console** | https://search.google.com/search-console | 添加 property → URL Prefix → `https://xchat.directory/` → 验证方式选 "HTML tag" → 复制 `content="..."` 里的字符串 |
| **Bing Webmaster Tools** | https://www.bing.com/webmasters | 添加 site → URL → 验证方式 "Meta tag" → 复制 `<meta name="msvalidate.01" content="..." />` 里的 content |
| **Yandex Webmaster** | https://webmaster.yandex.com | 添加 site → Meta tag → 复制 content（Yandex 2026 起对新站弱化，可选） |

## 2. 填入环境变量

**本地开发**：在项目根目录创建 `.env`（已被 `.gitignore` 忽略）：

```bash
PUBLIC_GOOGLE_SITE_VERIFICATION=abc123xyz_google_token
PUBLIC_BING_SITE_VERIFICATION=xyz456bing_token
PUBLIC_YANDEX_SITE_VERIFICATION=ya_def789_token
```

**Vercel 部署**：Project Settings → Environment Variables → 同样 3 个 key。

## 3. 验证生效

1. 推送代码 / Vercel 自动部署
2. 跑 `npm run build` 本地验证
3. 检查 `dist/index.html` 的 `<head>` 里有 `<meta name="google-site-verification" content="..." />`
4. 去各 Search Console 点 "Verify" 按钮

## 4. 提交 sitemap

每个 Search Console 都有 "Sitemaps" 入口，提交：

```
https://xchat.directory/sitemap.xml
```

> 已配置在 [public/robots.txt](../../public/robots.txt) 第 235 行，多数搜索引擎会自动发现。

## 5. 触发索引（可选加速）

- **Google**：URL Inspection → 输入 `https://xchat.directory/` → Request Indexing（每天限 10-12 个 URL）
- **Bing**：URL Submission → 粘贴 URL → Submit
- **Bing 批量**：Webmaster Tools → Configure My Site → Submit URLs → 最多 10000/天

## 6. 实施状态

| 任务 | 状态 |
|---|---|
| Layout.astro 改成 env-conditional meta | ✅ V3.1 完成 |
| Google Search Console 添加 site | ⏳ 待执行 |
| Bing Webmaster 添加 site | ⏳ 待执行 |
| Yandex Webmaster 添加 site | ⏳ 可选 |
| 提交 sitemap.xml | ⏳ 待执行 |
| Request Indexing 首页 | ⏳ 待执行 |

## 7. 不需要做的事

- ❌ 不需要在每个 page 都加 meta（Layout.astro 全站应用）
- ❌ 不需要 DNS TXT record 验证（HTML tag 验证更简单，重定向风险更小）
- ❌ 不需要 HTTP file 验证（Vercel 部署 pipeline 复杂）
