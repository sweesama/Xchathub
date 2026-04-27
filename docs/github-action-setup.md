# Weekly Group Discovery — GitHub Action setup

每周一 00:00 UTC，`.github/workflows/discover-groups.yml` 会自动：

1. 用 Playwright 登录 X（复用你提供的 cookie）
2. 搜索 5 个关键词（`x.com/i/chat/group_join` 等）
3. 去掉已经在 `src/data/groups.ts` 的链接
4. 把结果写到 `reports/discovered-groups.json`
5. 自动开一个 PR（分支 `auto/discover-groups`），标题 `[auto] Weekly XChat group discovery`

你只需要打开 PR 审核 JSON 文件，挑出合规的群，本地用 `npm run group:add` 加到目录里，然后 **关掉 PR**（不要合并 JSON 进 main）。

## 一次性配置步骤

### 1. 拿到 X 登录 cookie

用你已经登录 X 的浏览器：

1. 打开 https://x.com
2. F12 打开开发者工具 → Application / 应用 → Cookies → `https://x.com`
3. 复制两个 cookie 的 Value：
   - `auth_token` — 长字符串，约 40 字符
   - `ct0` — CSRF token

> 这两个 cookie 的有效期约 1 个月，过期后 Action 会跑失败，重新抓一次粘上去即可。

### 2. 在 GitHub 上配 secret

进入仓库页：

```
https://github.com/sweesama/Xchathub/settings/secrets/actions
```

点 `New repository secret`，添加两个：

| Name | Value |
|------|-------|
| `X_AUTH_TOKEN` | 上面拿到的 auth_token |
| `X_CT0` | 上面拿到的 ct0 |

### 3. 手动触发一次验证

```
Actions → Discover XChat Groups → Run workflow → main → Run
```

跑完看 Actions 日志，正常的话会生成一个 PR。

## 故障排查

| 症状 | 原因 | 修复 |
|------|------|------|
| `search returned 0 results` 5 次 | cookie 过期 / X 改了 HTML | 重新抓 cookie；或联系我更新选择器 |
| Action 超时 | X 限流 / 验证码 | 降低 `SEARCH_QUERIES` 数量，或换时段 |
| PR action 报 `permission denied` | 仓库 Actions 设置里关掉了 PR 权限 | Settings → Actions → General → Workflow permissions → 选 `Read and write permissions` 并勾 `Allow GitHub Actions to create and approve pull requests` |

## 本地运行（不走 Action）

```bash
# 本地已登录过 .playwright-profile 的情况
npm run group:discover
```

输出到 `discovered-groups.json`（被 gitignore，不会被提交）。
