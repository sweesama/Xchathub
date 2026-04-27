/**
 * Vercel Serverless Function: POST /api/submit-group
 *
 * 接收 list-your-group 表单提交，把内容转发到 Telegram 社区群。
 *
 * Env vars (Vercel Project → Settings → Environment Variables → Production):
 *   TELEGRAM_BOT_TOKEN  — @BotFather 给的 bot token
 *   TELEGRAM_CHAT_ID    — 目标群 chat_id（负数，例如 -1003835444332）
 *
 * Vercel 会自动把这个文件部署成 Node.js serverless function：
 *   path        URL                            runtime
 *   api/submit-group.ts → /api/submit-group   nodejs (默认)
 */

interface VercelRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status(code: number): VercelResponse;
  setHeader(name: string, value: string): VercelResponse;
  json(data: unknown): VercelResponse;
  end(): void;
}

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
  /** 蜜罐字段：人不会填，bot 会 */
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

function trim(v: unknown, max: number): string {
  return String(v ?? '').trim().slice(0, max);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  // CORS / 安全头
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed.' });
    return;
  }

  // Vercel 默认会自动 parse JSON body（Content-Type: application/json）
  // 但极端情况下 body 可能是 string，做兼容
  let body: Body;
  try {
    body =
      typeof req.body === 'string'
        ? (JSON.parse(req.body) as Body)
        : ((req.body ?? {}) as Body);
  } catch {
    res.status(400).json({ ok: false, error: 'Invalid JSON.' });
    return;
  }

  // 蜜罐：人不会填 website 字段，bot 会
  if (body.website && body.website.trim().length > 0) {
    res.status(200).json({ ok: true, queued: true });
    return;
  }

  const groupName = trim(body.groupName, MAX_LEN.groupName);
  const inviteUrl = trim(body.inviteUrl, MAX_LEN.inviteUrl);
  const category = trim(body.category, MAX_LEN.category);
  const description = trim(body.description, MAX_LEN.description);

  if (!groupName || !inviteUrl || !category || !description) {
    res.status(400).json({
      ok: false,
      error: 'Group name, invite URL, category and description are required.',
    });
    return;
  }

  if (!/^https:\/\/x\.com\/i\/chat\/group_join\//i.test(inviteUrl)) {
    res.status(400).json({
      ok: false,
      error: 'Invite URL must start with https://x.com/i/chat/group_join/',
    });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    res.status(503).json({
      ok: false,
      error:
        'Form backend is not yet configured. Please send your submission to @Xchathubcommunity on Telegram instead.',
    });
    return;
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

  try {
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
      res.status(502).json({
        ok: false,
        error:
          'Could not deliver to Telegram. Please send manually to @Xchathubcommunity.',
      });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Network error reaching Telegram:', err);
    res.status(502).json({
      ok: false,
      error: 'Network error reaching Telegram. Please try again or message us manually.',
    });
  }
}
