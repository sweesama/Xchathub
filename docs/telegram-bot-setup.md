# Telegram Bot 设置指南 — 用于群组提交通知

> **适用人群**：xchat.directory 站长 / 管理员
> **目标**：把 [list-your-group 表单](https://xchat.directory/list-your-group) 的提交自动转发到你的 Telegram 群（@Xchathubcommunity）。
> **预计耗时**：10 分钟

---

## 1. 为什么要配置这个 Bot

当前 [api/submit-group.ts](file:///f:/windsurf/xchat/api/submit-group.ts) 在环境变量未配置时会返回 503：

```
"Form backend is not yet configured. Please send your submission to @Xchathubcommunity on Telegram instead."
```

配置完后，用户在网站提交群组 → 你在 Telegram 群立刻收到结构化通知（带 Group Name、Plan、Invite Link、Description 等），24 小时内审核。

---

## 2. 创建 Telegram Bot（2 分钟）

### 2.1 打开 @BotFather

- 在 Telegram 搜索 `@BotFather`
- 点击 **Start**
- （必须是蓝色认证的 @BotFather，别加错仿冒号）

### 2.2 创建 Bot

发送：
```
/newbot
```

BotFather 会问：
1. **Bot 名称**（显示名）：例如 `XChat Directory Notifier`
2. **Username**（必须以 `bot` 结尾，全局唯一）：例如 `xchat_directory_notify_bot`

### 2.3 拿到 Bot Token

BotFather 会回复：

```
Done! Congratulations on your new bot. You will find it at t.me/xchat_directory_notify_bot.

Use this token to access the HTTP API:
7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Keep your token secure and store it safely.
```

📋 **复制这个 token**（这就是 `TELEGRAM_BOT_TOKEN`），先贴在记事本里。

⚠️ **安全警告**：
- 任何人拿到 token 都能控制你的 bot 发消息
- **绝不要提交到 Git**
- **绝不要**直接写在代码里
- 如果泄露，立刻去 BotFather 发送 `/revoke` 重置 token

---

## 3. 拿到目标群 Chat ID（3 分钟）

### 3.1 创建 / 选好目标群

- 用你私人 Telegram 创建一个群（或者用现有的）
- 群名建议：`XChat Directory Submissions`（审核用专用群）
- 把管理员加上（包括你自己）

### 3.2 把 Bot 加进群并设为管理员

1. 在群里点击 → Add Member → 搜索你的 bot username（如 `@xchat_directory_notify_bot`）
2. 加进去后，把 bot **设为管理员**（必须，否则它发不出消息）
   - 群设置 → Administrators → Add Administrator → 选 bot → 至少勾选 "Send Messages"

### 3.3 拿到 Chat ID

**方法 A：用 @userinfobot 拿你的 ID（仅对私聊群）**

对私聊 bot 发送消息：
```
@userinfobot
```
会回复你的 user ID。但这个对群聊没用。

**方法 B（推荐）：群内 @ 一下 bot 触发消息**

1. 在群里发一条消息：`@你的bot_username hello`
2. 浏览器访问：
   ```
   https://api.telegram.org/bot<你的TOKEN>/getUpdates
   ```
   （把 `<你的TOKEN>` 换成第 2.3 步拿到的 token）

3. 浏览器会返回 JSON，找 `"chat":{"id":-100xxxxxxxxxx,...}`

📋 **记录这个 id**（这就是 `TELEGRAM_CHAT_ID`，是**负数**，例如 `-1003835444332`）

**方法 C：用 curl 一行命令**：
```bash
curl -s "https://api.telegram.org/bot<TOKEN>/getUpdates" | python -m json.tool | grep -A3 '"chat"'
```

---

## 4. 测试 Bot 是否能发消息（1 分钟）

在浏览器或终端试一下：

```
https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<CHAT_ID>&text=Hello+from+XChat+bot
```

- ✅ 群里收到 "Hello from XChat bot" → 配置成功
- ❌ 报 403 "bot was blocked by the user" → bot 没被加进群
- ❌ 报 400 "chat not found" → chat_id 错了
- ❌ 报 401 "Unauthorized" → token 错了

---

## 5. 在 Vercel 配环境变量（2 分钟）

### 5.1 打开 Vercel Dashboard

- 登录 https://vercel.com
- 选你的项目（xchat.directory 那个）
- 点 **Settings** → **Environment Variables**

### 5.2 添加两个变量

| Name | Value | Environments |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | `7123456789:AAHxxxxxxxxxxxxxx...` | ✅ Production / ✅ Preview / ✅ Development |
| `TELEGRAM_CHAT_ID` | `-1003835444332` | ✅ Production / ✅ Preview / ✅ Development |

> ⚠️ 三个环境都勾上，因为 Preview 部署也要能收通知。
> ⚠️ 不要把 token 写到 README 或 issues 里。

### 5.3 重新部署

回到 **Deployments** 标签：
- 最新一次部署右边三个点 → **Redeploy**
- 或者 git push 触发自动部署

---

## 6. 验证（2 分钟）

部署完成后：

1. 打开 https://xchat.directory/list-your-group
2. 填写测试数据（不点 BMC 付款，正常走免费 plan）
3. 勾上蜜罐检查（别填 website 字段）
4. 提交
5. 检查 Telegram 群 → 应该立刻收到一条带 HTML 格式的通知：

```
📥 New group submission

Plan: Free
Group name: Test Submission
Invite link: https://x.com/i/chat/group_join/xxxxx
Category: Test
...
```

如果收到 → 🎉 全链路通了。
如果 5xx 报错 → 看 Vercel 函数日志（Dashboard → Functions → submit-group → Logs）。

---

## 7. 维护

### 重置 token（如果泄露）

在 BotFather 私聊：
```
/revoke
```
选你的 bot → 拿新 token → 在 Vercel 更新环境变量 → Redeploy。

### 改用别的群

1. 把 bot 加到新群（设为管理员）
2. 拿新 chat_id
3. 在 Vercel 改 `TELEGRAM_CHAT_ID` → Redeploy
4. 老群不需要踢 bot（不踢也不影响）

### 调试模式

如果有问题想看 Telegram 实际返回：
- Vercel → Functions → submit-group → Logs
- 任何错误都打 `console.error('Telegram API error:', ...)` 和 `console.error('Network error ...')`

---

## 8. 常见问题

**Q: 提交后一直 503？**
A: 检查 Vercel 环境变量名是不是完全等于 `TELEGRAM_BOT_TOKEN` 和 `TELEGRAM_CHAT_ID`（大小写敏感），并确认 Redeploy 了。

**Q: Telegram 群收不到，但 Vercel 日志显示成功？**
A: 检查 chat_id 是不是**负数**开头的（群 chat_id 必须负数），且 bot 在群里是**管理员**。

**Q: 不想用 Telegram，想改成 Email？**
A: 把 [api/submit-group.ts](file:///f:/windsurf/xchat/api/submit-group.ts) 里的 fetch 调用换成 Resend / SendGrid。但 Telegram 是免费的，Email 至少要绑卡。

**Q: 一个人能不能同时管多个群？**
A: 可以。改 `TELEGRAM_CHAT_ID` 环境变量就行。或者让 bot 在多个群里被加为管理员，每次发送都指定同一个 chat_id。

---

## 9. 相关文件

- API 实现：[api/submit-group.ts](file:///f:/windsurf/xchat/api/submit-group.ts)
- 表单页：[src/pages/list-your-group.astro](file:///f:/windsurf/xchat/src/pages/list-your-group.astro)
- Vercel 配置：[vercel.json](file:///f:/windsurf/xchat/vercel.json)

---

## 10. 一句话总结

1. **找 BotFather** → `/newbot` → 拿 token
2. **把 bot 加进群** → 设为管理员
3. **getUpdates 拿 chat_id**（负数）
4. **Vercel 配两个 env var** → Redeploy
5. **测试提交** → Telegram 收通知 🎉

需要我做哪一步的详细操作吗？比如自动测试 Telegram 通知、或者改成发送邮件版？