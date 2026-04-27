# 提交表单 → Telegram 自动通知 配置指南

我把 `/list-your-group` 的提交表单接到了一个 Cloudflare Pages Function（`functions/api/submit-group.ts`），它会把每条提交转成 Telegram 消息发到你的社区群。

要让它真正跑起来，你需要做 **3 步一次性配置**（5 分钟）：

---

## 1. 创建 Telegram bot 并拿到 token

1. 在 Telegram 里搜索 **@BotFather**，开启对话
2. 发送 `/newbot`
3. 按提示给 bot 起名（例如 `XChatHubSubmissions`）和 username（必须以 `bot` 结尾，例如 `xchathub_submissions_bot`）
4. BotFather 会回一段消息，里面有 token，类似：
   ```
   8123456789:AAH-aBcDeFgHiJkLmNoPqRsTuVwXyZ-1234567
   ```
5. **保存这个 token**（私密，等同密码）

---

## 2. 把 bot 加进你的 Telegram 群并拿 chat_id

1. 在 Telegram 里打开 **@Xchathubcommunity** 群
2. 群信息 → Add Members → 搜你刚建的 bot username → 加进来
   - 不需要给 admin 权限，普通成员就够发消息
3. 在群里随便发一句话（任何文字都行）
4. 浏览器打开（把 `<TOKEN>` 换成第 1 步拿到的 token）：
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
5. 在返回的 JSON 里找 `"chat":{"id":-100xxxxxxxxxx,...}`
   - **注意**：群的 chat_id 是负数，且通常以 `-100` 开头（例如 `-1001234567890`）
6. **保存这个 chat_id**

---

## 3. 在 Cloudflare Pages 配置环境变量

1. 打开 Cloudflare Dashboard → 你的项目 → **Settings** → **Environment variables**
2. 切到 **Production** 标签
3. 加两条 **Encrypted** 类型变量：

| Variable name | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | 第 1 步的 token |
| `TELEGRAM_CHAT_ID` | 第 2 步的 chat_id（带负号） |

4. **重新部署一次**（Cloudflare 不会自动应用新 env）：
   - Deployments → 最新一次 → 右上 `…` → **Retry deployment**

---

## 验证流程

1. 打开 https://xchat.directory/list-your-group/#submit
2. 填一份测试数据（group name 写 `TEST` 之类的）
3. 提交后，Telegram 群里应该立刻出现一条格式化消息：
   ```
   📥 New group submission
   Plan: Free
   Group name: TEST
   Invite link: https://x.com/i/chat/group_join/...
   ...
   ```
4. 网页端会显示绿色的「Thanks! Your submission was sent to our review queue.」

---

## 常见问题

| 现象 | 原因 | 修复 |
|---|---|---|
| 「Form backend is not yet configured」错误 | env 变量没生效 | 确认 Cloudflare 上变量名拼写正确，重新部署 |
| 「Could not deliver to Telegram」 | bot token 错或 bot 没在群里 | 重新检查 token；确认 bot 是群成员 |
| chat_id 拿不到 | bot 没收到消息 / getUpdates 返回空 | 在群里再随便发一句话，刷新 getUpdates |
| 表单提交 0 内容也通过 | 蜜罐字段被填了（bot） | 这是设计，bot 提交会被 honeypot 静默吞掉 |

---

## 为什么用 Cloudflare Pages Function 而不是 Formspree

- **零月费**：Cloudflare Pages Functions 免费额度 100k 请求/天，你这个体量永远用不完
- **直接进 Telegram**：你已经在用 Telegram 当主要触达渠道，省一层邮件中转
- **没有 vendor lock-in**：未来想换数据库存到 D1 / KV，再加几行代码就行

如果你嫌 BotFather 流程麻烦，告诉我，我可以改成 [Formspree](https://formspree.io)（邮件转发，无需配 bot），但响应延迟会变成几分钟。
