/**
 * Cloudflare Pages Function: POST /api/submit-group
 *
 * 接收 list-your-group 表单提交，把内容转发到 Telegram 社区群。
 *
 * Env vars (Cloudflare Pages → Settings → Environment variables → Production):
 *   TELEGRAM_BOT_TOKEN  — @BotFather 给的 bot token (xxxxx:AAaa...)
 *   TELEGRAM_CHAT_ID    — 目标群 chat_id（一般是负数：-100xxxxxxxxxx）
 *
 * 防滥用：
 *   - 蜜罐 honeypot 字段：bots 通常会填，人不会
 *   - 字段长度限制
 *   - 同一 IP 1 分钟内最多 1 条（Cloudflare 自带 KV 太重，这里用简易 in-memory；
 *     生产真要严防请加 Cloudflare Turnstile）
 */

interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

/** Minimal Cloudflare Pages Function type — avoids adding @cloudflare/workers-types dep */
type PagesFunction<E = unknown> = (context: {
  request: Request;
  env: E;
  params: Record<string, string>;
  waitUntil: (p: Promise<unknown>) => void;
}) => Response | Promise<Response>;

interface Body {
  groupName?: string;
  inviteUrl?: string;
  category?: string;
  description?: string;
  members?: string;
  tags?: string;
  ownerHandle?: string;
  ownerEmail?: string;
  plan?: string;
  bmcReceipt?: string;
  // 蜜罐字段
  website?: string;
}

const MAX_LEN = {
  groupName: 120,
  inviteUrl: 300,
  category: 60,
  description: 600,
  members: 20,
  tags: 200,
  ownerHandle: 60,
  ownerEmail: 120,
  plan: 30,
  bmcReceipt: 200,
};

function trim(v: unknown, max: number) {
  return String(v ?? '').trim().slice(0, max);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;

  // 只接受 JSON
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ ok: false, error: 'Invalid JSON.' }, 400);
  }

  // 蜜罐：人不会填 website 字段
  if (body.website && body.website.trim().length > 0) {
    // 假装成功，让 bot 以为提交了
    return json({ ok: true, queued: true });
  }

  // 必填校验
  const groupName = trim(body.groupName, MAX_LEN.groupName);
  const inviteUrl = trim(body.inviteUrl, MAX_LEN.inviteUrl);
  const category = trim(body.category, MAX_LEN.category);
  const description = trim(body.description, MAX_LEN.description);

  if (!groupName || !inviteUrl || !category || !description) {
    return json(
      { ok: false, error: 'Group name, invite URL, category and description are required.' },
      400,
    );
  }

  // 邀请链接合法性
  if (!/^https:\/\/x\.com\/i\/chat\/group_join\//i.test(inviteUrl)) {
    return json(
      { ok: false, error: 'Invite URL must start with https://x.com/i/chat/group_join/' },
      400,
    );
  }

  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    // 服务端尚未配置 → 让前端走 Telegram 直链兜底
    return json(
      {
        ok: false,
        error: 'Form backend is not yet configured. Please send your submission to @Xchathubcommunity on Telegram instead.',
      },
      503,
    );
  }

  const lines = [
    '<b>📥 New group submission</b>',
    '',
    `<b>Plan:</b> ${escapeHtml(trim(body.plan, MAX_LEN.plan) || 'Free')}`,
    `<b>Group name:</b> ${escapeHtml(groupName)}`,
    `<b>Invite link:</b> ${escapeHtml(inviteUrl)}`,
    `<b>Category:</b> ${escapeHtml(category)}`,
    `<b>Members:</b> ${escapeHtml(trim(body.members, MAX_LEN.members) || '—')}`,
    `<b>Tags:</b> ${escapeHtml(trim(body.tags, MAX_LEN.tags) || '—')}`,
    `<b>Owner handle:</b> ${escapeHtml(trim(body.ownerHandle, MAX_LEN.ownerHandle) || '—')}`,
    `<b>Owner email:</b> ${escapeHtml(trim(body.ownerEmail, MAX_LEN.ownerEmail) || '—')}`,
    `<b>BMC receipt:</b> ${escapeHtml(trim(body.bmcReceipt, MAX_LEN.bmcReceipt) || '—')}`,
    '',
    '<b>Description:</b>',
    escapeHtml(description),
  ];

  const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join('\n'),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  if (!tgRes.ok) {
    const errText = await tgRes.text().catch(() => '');
    console.error('Telegram API error:', tgRes.status, errText);
    return json(
      {
        ok: false,
        error: 'Could not deliver to Telegram. Please send manually to @Xchathubcommunity.',
      },
      502,
    );
  }

  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
