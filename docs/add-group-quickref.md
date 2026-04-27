# 快速添加群组流程（30 秒上线）

## 你做什么

发给 Cascade（我）一条这样的消息即可：

```
新群组：
名称: [群名]
描述: [一句话简介]
分类: [crypto/tech/ai/news/sports/gaming/business/entertainment/education/local]
成员数: [数字，从 X 群组预览页看]
邀请链接: https://x.com/i/chat/group_join/g[ID]/[TOKEN]
来源: [可选 — 这个群是从哪条 X 帖子看到的]
```

最少需要：**名称 + 分类 + 邀请链接**，其他我可以补全或留空。

---

## 我做什么

收到信息后，我会：

1. 验证链接格式合法（必须是 `x.com/i/chat/group_join/...`）
2. 在 `src/data/groups.ts` 的 `GROUP_DIRECTORY` 数组中加一条记录
3. 自动归入对应分类着陆页（`/groups/[category]/`）和主目录
4. 构建 + 推送（30 秒内上线）

---

## 数据格式参考

```ts
{
  slug: 'tesla-investors-zh',                        // URL 安全短名（自动生成）
  name: 'Tesla 华语投资者',
  description: '特斯拉华语投资者讨论群，覆盖教育、科技、营销、投资。',
  category: 'Business',                              // 必须是 GroupCategory 之一
  tags: ['Tesla', '投资', '华语'],                  // 可选，3-5 个
  members: 50,                                       // 数字，从 X 看
  icon: '#',                                         // 占位
  inviteUrl: 'https://x.com/i/chat/group_join/g.../...',
  sourceType: 'public-post',                         // 默认值
  sourceUrl: 'https://x.com/some_user/status/...',   // 可选 — 链接发现来源
  verifiedAt: '2026-04-27',                          // 自动填今天
  listingTier: 'free',                               // 默认 free
}
```

---

## 链接验证规则

**只接受**：
- `https://x.com/i/chat/group_join/g[数字ID]/[字母数字token]`

**拒绝**：
- 任何包含色情/赌博/诈骗关键词的群名或描述
- 链接格式不对的（不是上述格式）
- 已经存在 slug 重复的（会提示你换名）

---

## 当前可填分类

| Category 值 | 着陆页 | 适用场景 |
|------|------|------|
| `Crypto` | /groups/crypto | BTC/ETH/DeFi/NFT/Web3 |
| `Tech` | /groups/tech | 编程/创业/技术栈 |
| `AI` | /groups/ai | LLM/Agent/Prompt |
| `News` | /groups/news | 时政/突发/媒体 |
| `Sports` | /groups/sports | 球队/赛事/Fantasy |
| `Gaming` | /groups/gaming | 游戏/电竞/主机 |
| `Business` | /groups/business | 创始人/VC/销售 |
| `Entertainment` | /groups/entertainment | TV/电影/音乐/动漫 |
| `Education` | /groups/education | 学习/课程/语言交换 |
| `Local` | /groups/local | 城市/地区/社区 |
| `Other` | /groups（无分类着陆页）| 其他 |

---

## 你怎么找到真实群组（建议路径）

1. 在 X 搜索栏搜 **"xchat"** 或 **"groupchat link"** 或 **"join my group"**
2. 找到带 `x.com/i/chat/group_join/...` 链接的推文
3. 点链接，确认能看到群名和成员数（说明链接有效）
4. 把名称 + 链接发给我

最容易找到的方向：crypto、AI、tech（这些社区最早开始用 XChat 群组）。
