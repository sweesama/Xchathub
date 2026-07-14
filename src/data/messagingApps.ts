/**
 * messagingApps.ts — 加密通信 App 中央数据
 *
 * 这是整个评测 / 对比 / 榜单页面的单一数据源。
 * 新增一个 App 时，只在这里加一条 ——
 * 所有 reviews/[slug]、compare/[a-vs-b]、best-of 页面都会自动出数据。
 *
 * 数据约定：
 * - 不收录营销页/隐私糟的 app（避免变成无脑推荐）
 * - 价格信息只写公开透明的（避免时变化信息误用）
 * - "foundedYear" 用公开披露的官方年份
 * - "openSource" 仅对客户端+服务端都开源的才写 true
 * - 所有外链等 2026 上半年之前仍然真实的
 */
export interface MessagingApp {
  /** URL slug, 唯一，用于 /reviews/{slug}/ 和 compare 路径 */
  slug: string;
  /** 全名，App Store / Play Store 上的官方名称 */
  name: string;
  /** 一句话定位，用于卡片/比较标题下方的副标题 */
  tagline: string;
  /** 60-90 字的概要，用于 hero/列表卡 */
  summary: string;
  /** 200-400 字的简短评测正文，用于 /reviews/{slug} 页 */
  description: string;
  /** 品牌主色（用于卡片色条/header accent） */
  brandColor: string;
  /** 用于小 logo 的 emoji 或简短字符（无版权问题） */
  monogram: string;
  /** simple-icons.org 上的品牌 SVG slug（如 'signal'、'threema'）。
   *  设了这里就用 simple-icons CDN 渲染 logo（统一矢量、可着色）；
   *  留空时回退到 monogram （briar / xchat 在 simple-icons 库中不存在）。
   *  商用请遵守 simple-icons 商标政策。 */
  simpleIconsSlug?: string;
  /** 官网 */
  website: string;
  /** 是否公开源代码（客户端 + 服务端） */
  openSource: boolean;
  /** 端到端加密默认打开？枚举值用于"vs"表格式化 */
  encryptionDefault: 'always' | 'opt-in' | 'partial' | 'none';
  /** 简短一句话描述加密方式 */
  encryptionTech: string;
  /** 是否强制要手机号 */
  phoneNumberRequired: boolean;
  /** 是否需要邮箱 */
  emailRequired: boolean;
  /** 价格模型 */
  pricing: 'free' | 'paid-once' | 'freemium' | 'paid-subscription';
  /** paid 模型时的具体金额（USD） */
  priceAmount?: number;
  /** 支持的平台 */
  platforms: {
    ios: boolean;
    android: boolean;
    web: boolean;
    desktop: boolean;
  };
  /** 最大群成员数（频道算订阅数） */
  groupLimit: number;
  /** 法律归属 / 主体 */
  owner: string;
  ownerType: 'nonprofit' | 'company' | 'foundation';
  ownerCountry: string;
  /** 上线年份 */
  foundedYear: number;
  /** 月活（万）— 数据来源日期请看 sources */
  monthlyActiveUsersMillions?: number;
  /** 来源声明：用于站内显示 + llms.txt 引用 */
  sources: { label: string; url: string }[];
  /** 优点（用于评测页亮点卡） */
  pros: string[];
  /** 缺点 */
  cons: string[];
  /** "Best for" 场景（用于决定卡片和决策路径） */
  bestFor: string[];
  /** 评审人评分 0-10，用于排行 */
  editorScore: number;
  /** 编辑员最近一次审查日期 (ISO) */
  lastReviewedISO: string;
  /** App ID - iTunes / Play 真实 ID — 用于外部"下载"链接 */
  appStoreId?: string;
  playStorePackage?: string;
}

/** 中央数据列表（按 editorScore 倒序排列，no particular promotion） */
export const MESSAGING_APPS: MessagingApp[] = [
  {
    slug: 'signal',
    name: 'Signal',
    tagline: 'The gold standard for private messaging',
    summary: 'Open-source, nonprofit, end-to-end encrypted messenger that owns the protocol WhatsApp itself uses.',
    description: 'Signal is the gold-standard encrypted messenger maintained by the nonprofit Signal Foundation, founded by privacy advocate Moxie Marlinspike and WhatsApp co-founder Brian Acton. The Signal Protocol (now in WhatsApp, Google Messages, and Skype) is the most peer-reviewed messaging crypto in the world. Signal collects almost no metadata, runs open-source servers and clients, and operates on donations rather than advertising or user tracking. Its Message Request safety numbers, sealed-sender routing, and disappearing messages remain unmatched by commercial competitors.',
    brandColor: '#2592e9',
    monogram: 'S',
    simpleIconsSlug: 'signal',
    website: 'https://signal.org',
    openSource: true,
    encryptionDefault: 'always',
    encryptionTech: 'Signal Protocol (Double Ratchet), sealed-sender metadata minimization',
    phoneNumberRequired: true,
    emailRequired: false,
    pricing: 'free',
    platforms: { ios: true, android: true, web: true, desktop: true },
    groupLimit: 1000,
    owner: 'Signal Foundation',
    ownerType: 'nonprofit',
    ownerCountry: 'United States',
    foundedYear: 2014,
    monthlyActiveUsersMillions: 70,
    sources: [
      { label: 'Signal Foundation official site', url: 'https://signal.org' },
      { label: 'Signal on Wikipedia', url: 'https://en.wikipedia.org/wiki/Signal_(software)' },
      { label: 'Signal source code on GitHub', url: 'https://github.com/signalapp' },
    ],
    pros: [
      'Truly open source (clients + server) with regular third-party audits',
      'Minimal metadata collection — sealed sender hides who is messaging whom',
      'Nonprofit funding model — no ads, no investor pressure to monetize',
      'E2E encrypted by default on every chat, call, and group',
      'Phone-number optional usernames (release 2024) without breaking contacts',
    ],
    cons: [
      'Phone number still required at registration — usernames are forward-only',
      'No large public broadcast channels like Telegram',
      'Sticker / GIF / theme ecosystem is small vs WhatsApp/Telegram',
    ],
    bestFor: [
      'Anyone who needs real, audited end-to-end encryption',
      'Journalists, activists, lawyers, doctors',
      'Cross-platform E2EE voice/video calls',
      'Privacy-aware everyday users who want one app to replace WhatsApp',
    ],
    editorScore: 9.7,
    lastReviewedISO: '2026-07-13',
    appStoreId: '874139669',
    playStorePackage: 'org.thoughtcrime.securesms',
  },
  {
    slug: 'threema',
    name: 'Threema',
    tagline: 'Swiss-made, paid, truly anonymous',
    summary: 'Open-source Swiss messenger that does not require a phone number or email — paid once, then yours.',
    description: "Threema is the only well-known messenger that gives you a fully anonymous account from registration onward. Buy the app for a small one-time fee (~$4), generate a random Threema ID, and never share any personal identifier. Like Signal, Threema is fully open source, but it's hosted in Switzerland where strict privacy laws govern servers. Group size is smaller than most, but for privacy-pure use cases Threema routinely beats Signal. The app also offers Threema Work for enterprises and Threema Education for schools.",
    brandColor: '#23272a',
    monogram: 'T',
    simpleIconsSlug: 'threema',
    website: 'https://threema.ch',
    openSource: true,
    encryptionDefault: 'always',
    encryptionTech: 'NaCl (libsodium) end-to-end, open-source clients and servers (Threema Gateway is published)',
    phoneNumberRequired: false,
    emailRequired: false,
    pricing: 'paid-once',
    priceAmount: 4.49,
    platforms: { ios: true, android: true, web: true, desktop: true },
    groupLimit: 256,
    owner: 'Threema GmbH',
    ownerType: 'company',
    ownerCountry: 'Switzerland',
    foundedYear: 2012,
    monthlyActiveUsersMillions: 1.1,
    sources: [
      { label: 'Threema official site', url: 'https://threema.ch/en' },
      { label: 'Threema on Wikipedia', url: 'https://en.wikipedia.org/wiki/Threema' },
      { label: 'Threema open source repositories', url: 'https://threema.ch/en/open-source' },
    ],
    pros: [
      'No phone, no email — register with a random Threema ID',
      'Swiss data centers, fully open-source clients (iOS, Android, Desktop)',
      "One-time payment — no subscription, no ad pressure, no user-data sale incentives",
      'E2E encrypted messages, files, calls, group chats',
    ],
    cons: [
      'Smaller user base (~1M users) — your contacts probably don\'t have it',
      'Paid upfront (~$4), so no daily friction-free user onboarding',
      'Group limit of 256 (smaller than Signal\'s 1000)',
    ],
    bestFor: [
      'European users, especially in DACH region',
      'Anyone who values true anonymity over network effects',
      'Business / professional use (Threema Work)',
      'People who don\'t want to give any identifier to a messenger',
    ],
    editorScore: 9.2,
    lastReviewedISO: '2026-07-13',
    appStoreId: '580137991',
    playStorePackage: 'ch.threema.app',
  },
  {
    slug: 'wire',
    name: 'Wire',
    tagline: 'Swiss-grade E2EE with team collaboration',
    summary: 'End-to-end encrypted messenger from Wire Swiss GmbH, with the strongest team / enterprise feature set.',
    description: "Wire is built for businesses that need provably secure messaging — every message, call, and conference is end-to-end encrypted with the open-source Proteus protocol (also based on the Signal Protocol). Unlike Signal, Wire ships serious team collaboration features: rooms (persistent group spaces), file sharing with inline preview, guest rooms with cross-org access, and full SAML/SSO integrations. Personal messaging is free and unthrottled; business plans add admin controls. Wire is audited annually by independent firms and is fully GDPR compliant.",
    brandColor: '#1d2125',
    monogram: 'W',
    simpleIconsSlug: 'wire',
    website: 'https://wire.com',
    openSource: true,
    encryptionDefault: 'always',
    encryptionTech: 'Proteus protocol (based on Signal), MLS for multi-party, custom audio/video codec',
    phoneNumberRequired: false,
    emailRequired: false,
    pricing: 'freemium',
    platforms: { ios: true, android: true, web: true, desktop: true },
    groupLimit: 500,
    owner: 'Wire Swiss GmbH',
    ownerType: 'company',
    ownerCountry: 'Switzerland',
    foundedYear: 2014,
    monthlyActiveUsersMillions: 1.0,
    sources: [
      { label: 'Wire official site', url: 'https://wire.com' },
      { label: 'Wire on Wikipedia', url: 'https://en.wikipedia.org/wiki/Wire_(software)' },
      { label: 'Wire source on GitHub', url: 'https://github.com/wireapp/wire' },
    ],
    pros: [
      'Full E2EE on 1:1, group chats, voice, video, and file transfers',
      'Best-in-class team features (rooms, guest access, admin controls)',
      'Personal messaging is genuinely free — no chat-count limits',
      'Audited annually by security firms',
    ],
    cons: [
      'Much smaller consumer user base than Signal or Telegram',
      "Some users report the desktop app has occasional sync glitches",
      "Brand recognition outside Europe is low",
    ],
    bestFor: [
      'Teams of 5–5000 that need provable E2EE',
      'Cross-company collaboration (guest rooms)',
      'EU / GDPR-conscious enterprise replacements for Slack',
      'Power users who want E2EE without giving their phone number',
    ],
    editorScore: 9.0,
    lastReviewedISO: '2026-07-13',
    appStoreId: '930944768',
    playStorePackage: 'com.wire',
  },
  {
    slug: 'session',
    name: 'Session',
    tagline: 'No phone, no email, onion-routed',
    summary: 'Fork of Signal that requires no phone number and routes messages through an onion network.',
    description: "Session is a fork of Signal that strips out the phone-number requirement and routes all messages through a decentralized onion-routing network. The result: nobody, not even Session's own servers, knows who is messaging whom. Session IDs are random and decoupled from any real identifier. Trade-offs: voice/video calls are less reliable than Signal because of the onion routing, and the user base is smaller. Session is the natural choice for activists, journalists, and high-risk users who'd otherwise use Signal but cannot give a phone number.",
    brandColor: '#cc1633',
    monogram: 'Se',
    simpleIconsSlug: 'session',
    website: 'https://getsession.org',
    openSource: true,
    encryptionDefault: 'always',
    encryptionTech: 'Signal Protocol forked, onion-routed via Loki/Session Network',
    phoneNumberRequired: false,
    emailRequired: false,
    pricing: 'free',
    platforms: { ios: true, android: true, web: false, desktop: true },
    groupLimit: 100,
    owner: 'Session Technology Foundation',
    ownerType: 'foundation',
    ownerCountry: 'Australia',
    foundedYear: 2020,
    monthlyActiveUsersMillions: 1.5,
    sources: [
      { label: 'Session official site', url: 'https://getsession.org' },
      { label: 'Session on Wikipedia', url: 'https://en.wikipedia.org/wiki/Session_(software)' },
      { label: 'Session source on GitHub', url: 'https://github.com/oxen-io' },
    ],
    pros: [
      'Zero identifiers — no phone, email, or name',
      'Onion routing hides IP + metadata from network observers',
      'Open-source clients, audited independently',
    ],
    cons: [
      'Group size limit of ~100 (smaller than Signal/Threema)',
      'Voice and video calls less reliable than central-routing apps',
      'Smaller user base — discovery is harder',
    ],
    bestFor: [
      'Activists, journalists, and high-risk users who cannot link themselves to a phone number',
      'Onion-routing advocates',
      'Anyone in a country where messenger metadata is dangerous',
    ],
    editorScore: 8.5,
    lastReviewedISO: '2026-07-13',
    appStoreId: '1470165428',
    playStorePackage: 'network.loki.messenger',
  },
  {
    slug: 'whatsapp',
    name: 'WhatsApp',
    tagline: 'Encrypted messaging for 3+ billion people',
    summary: 'The world\'s largest messenger — uses the Signal Protocol, but owned by Meta and collects extensive metadata.',
    description: "WhatsApp is the dominant global messenger with E2E encryption by default using the Signal Protocol. Two billion users is its killer feature: nearly everyone you know already has it. The trade-off is the Meta ownership — WhatsApp collects extensive metadata (who you talk to, when, how often) that it shares with the broader Meta family of products for advertising. Personal messages are E2EE so Meta can't read them. For everyday users talking to other everyday users, WhatsApp is still the practical encrypted messenger. For privacy-sensitive ones, it isn't.",
    brandColor: '#25d366',
    monogram: 'W',
    simpleIconsSlug: 'whatsapp',
    website: 'https://whatsapp.com',
    openSource: false,
    encryptionDefault: 'always',
    encryptionTech: 'Signal Protocol (E2EE), central servers, encrypted backups opt-in',
    phoneNumberRequired: true,
    emailRequired: false,
    pricing: 'free',
    platforms: { ios: true, android: true, web: true, desktop: true },
    groupLimit: 1024,
    owner: 'Meta Platforms, Inc.',
    ownerType: 'company',
    ownerCountry: 'United States',
    foundedYear: 2009,
    monthlyActiveUsersMillions: 3000,
    sources: [
      { label: 'WhatsApp official site', url: 'https://whatsapp.com' },
      { label: 'WhatsApp Security Whitepaper', url: 'https://www.whatsapp.com/security' },
    ],
    pros: [
      'E2E by default on every chat and call — built on the Signal Protocol',
      'Universal install base — almost everyone already has it',
      'Voice/video call quality is excellent and works on slow networks',
      'Status, channels, communities, and business messaging included',
    ],
    cons: [
      'Meta collects significant metadata (who, when, how often)',
      'Closed source — code audits are external only',
      'No way to use it without giving Meta your phone number',
      'Backup encryption is opt-in (turned off by default)',
    ],
    bestFor: [
      'Communicating with the largest possible number of people without installing anything new',
      'Cross-platform group chats with international friends and family',
      'Anyone who wants E2EE without changing contact apps',
    ],
    editorScore: 7.8,
    lastReviewedISO: '2026-07-13',
    appStoreId: '310633997',
    playStorePackage: 'com.whatsapp',
  },
  {
    slug: 'element',
    name: 'Element (Matrix)',
    tagline: 'Open-source, federated, end-to-end encrypted',
    summary: 'Open-source messenger built on the federated Matrix protocol — like email, but for instant messaging.',
    description: 'Element is the reference client for the Matrix open standard — a federated protocol like email, where any organization can run its own server and all servers interoperate. E2EE is end-to-end via the Olm/Megolm protocol. Element runs a hosted service (element.io) but you can self-host. For communities, B2B, and open-source projects, federated Matrix is one of the few protocols designed for true interoperability without a single point of control. Bridge to other messengers (Telegram, Discord, Slack) is possible.',
    brandColor: '#0dbd8b',
    monogram: 'E',
    simpleIconsSlug: 'element',
    website: 'https://element.io',
    openSource: true,
    encryptionDefault: 'opt-in',
    encryptionTech: 'Olm/Megolm end-to-end, Matrix federated protocol',
    phoneNumberRequired: false,
    emailRequired: false,
    pricing: 'freemium',
    platforms: { ios: true, android: true, web: true, desktop: true },
    groupLimit: 1000,
    owner: 'Element (New Vector)',
    ownerType: 'company',
    ownerCountry: 'United Kingdom',
    foundedYear: 2017,
    monthlyActiveUsersMillions: 6,
    sources: [
      { label: 'Element official site', url: 'https://element.io' },
      { label: 'Matrix protocol', url: 'https://matrix.org' },
      { label: 'Element source on GitHub', url: 'https://github.com/element-hq' },
    ],
    pros: [
      'Open standard (Matrix) with federated server model — no single point of control',
      'E2EE rooms + interoperability bridges to Telegram/Slack/Discord',
      'Self-hostable for organizations',
    ],
    cons: [
      'E2EE must be turned on for each new room (not default)',
      'User experience is rougher than WhatsApp/Telegram',
      'Smaller consumer user base than major players',
    ],
    bestFor: [
      'Open-source communities and standards organizations',
      'Self-hosted messaging for businesses',
      'Anyone who wants mail-server-like control over their messenger',
    ],
    editorScore: 8.2,
    lastReviewedISO: '2026-07-13',
    appStoreId: '1080504784',
    playStorePackage: 'im.vector.app',
  },
  {
    slug: 'simplex',
    name: 'SimpleX Chat',
    tagline: 'No user IDs anywhere — not even random ones',
    summary: 'The only messenger with no user IDs of any kind — even operator can\'t correlate users across conversations.',
    description: "SimpleX takes anonymity further than anyone else: there are no user IDs, no phone numbers, no usernames — every conversation gets a unique disposable link. The protocol was designed so the operator (SimpleX Chat Ltd) cannot match users across conversations even if they wanted to. E2E encryption is mandatory. The trade-off: no contact list, no group chats in the same way as others (you manage invite links). The user base is small but devoted. For maximum-metadata-stripping use, this is the leader.",
    brandColor: '#0066cc',
    monogram: 'Sx',
    simpleIconsSlug: 'simplex',
    website: 'https://simplex.chat',
    openSource: true,
    encryptionDefault: 'always',
    encryptionTech: 'Double ratchet (own implementation), no user IDs at protocol level',
    phoneNumberRequired: false,
    emailRequired: false,
    pricing: 'free',
    platforms: { ios: true, android: true, web: false, desktop: true },
    groupLimit: 500,
    owner: 'SimpleX Chat Ltd',
    ownerType: 'company',
    ownerCountry: 'United Kingdom',
    foundedYear: 2021,
    monthlyActiveUsersMillions: 0.5,
    sources: [
      { label: 'SimpleX official site', url: 'https://simplex.chat' },
      { label: 'SimpleX on Wikipedia', url: 'https://en.wikipedia.org/wiki/SimpleX_Chat' },
      { label: 'SimpleX source on GitHub', url: 'https://github.com/simplex-chat/simplex-chat' },
    ],
    pros: [
      'No user IDs anywhere — even the operator can\'t correlate users',
      'Open-source, audited',
      'Disposable invite links per conversation',
    ],
    cons: [
      'Smaller user base than alternatives',
      'No public group directory',
      'Voice/video calls only on mobile',
    ],
    bestFor: [
      'Maximum-anonymity users who distrust server operators',
      'Journalists with high-risk sources',
      'Anyone uncomfortable with random ID assignment',
    ],
    editorScore: 8.4,
    lastReviewedISO: '2026-07-13',
    appStoreId: '1605779357',
    playStorePackage: 'chat.simplex.app',
  },
  {
    slug: 'telegram',
    name: 'Telegram',
    tagline: 'Fastest messenger with the biggest groups',
    summary: 'Cloud-based messenger with up to 200,000-member channels — but only "Secret Chats" are end-to-end encrypted.',
    description: "Telegram is the fastest and most flexible cloud messenger on the market: 200,000-member public channels, public usernames, bots, voice rooms, full cross-platform sync, and a polished UX. Almost everything is cloud-stored so you can read old chats on any device. The catch: most chats are not end-to-end encrypted. Telegram added the Signal Protocol-based \"Secret Chats\" feature years ago, but it has to be opted into per conversation. If you forget, your messages sit on Telegram's servers encrypted only to Telegram itself. For sharing but not for private conversation by default.",
    brandColor: '#0088cc',
    monogram: 'Tg',
    simpleIconsSlug: 'telegram',
    website: 'https://telegram.org',
    openSource: false,
    encryptionDefault: 'opt-in',
    encryptionTech: 'MTProto (E2EE only in Secret Chats), client-side apps partially open-source',
    phoneNumberRequired: true,
    emailRequired: false,
    pricing: 'freemium',
    platforms: { ios: true, android: true, web: true, desktop: true },
    groupLimit: 200000,
    owner: 'Telegram Messenger LLP',
    ownerType: 'company',
    ownerCountry: 'United Arab Emirates',
    foundedYear: 2013,
    monthlyActiveUsersMillions: 900,
    sources: [
      { label: 'Telegram FAQ', url: 'https://telegram.org/faq' },
      { label: 'Telegram Privacy Policy', url: 'https://telegram.org/privacy' },
    ],
    pros: [
      'Massive 200K-member channels for public broadcasting',
      'Cloud sync across unlimited devices',
      'Telegram Bots platform — unmatched extensibility',
      'Fast even on slow networks; voice rooms and video notes',
    ],
    cons: [
      'Default chats are NOT end-to-end encrypted (server-encrypted only)',
      'Secret Chats must be opted into per conversation',
      'Closed source servers',
      'Phone-number required for signup',
    ],
    bestFor: [
      'Large public broadcast communities',
      'Cross-device cloud messaging',
      'Bot-driven workflows',
      'Non-sensitive everyday chat where speed matters more than E2EE',
    ],
    editorScore: 7.5,
    lastReviewedISO: '2026-07-13',
    appStoreId: '686449807',
    playStorePackage: 'org.telegram.messenger',
  },
  {
    slug: 'briar',
    name: 'Briar',
    tagline: 'Peer-to-peer messenger that works without internet',
    summary: 'Encrypted messenger that works over Tor, Wi-Fi, or Bluetooth — even when the internet is shut down.',
    description: "Briar is unique in the encrypted messaging field: it's a peer-to-peer messenger that doesn't depend on a central server. When the internet is available, it routes over Tor. When the internet is restricted, it syncs over Wi-Fi or Bluetooth between devices in physical proximity. For journalists in conflict zones, activists during internet shutdowns, or anyone preparing for civil-liberties emergencies, Briar is the closest thing to a survival messenger. The user interface is utilitarian and the user base is tiny, but the security model is well thought through.",
    brandColor: '#ff5722',
    monogram: 'B',
    website: 'https://briarproject.org',
    openSource: true,
    encryptionDefault: 'always',
    encryptionTech: 'Bramble (custom), Tor for transport, no central server',
    phoneNumberRequired: false,
    emailRequired: false,
    pricing: 'free',
    platforms: { ios: false, android: true, web: false, desktop: false },
    groupLimit: 100,
    owner: 'Briar Project',
    ownerType: 'foundation',
    ownerCountry: 'United Kingdom',
    foundedYear: 2015,
    monthlyActiveUsersMillions: 0.1,
    sources: [
      { label: 'Briar official site', url: 'https://briarproject.org' },
      { label: 'Briar on Wikipedia', url: 'https://en.wikipedia.org/wiki/Briar_(software)' },
    ],
    pros: [
      'Peer-to-peer — no central server to attack or seize',
      'Works over Tor, Wi-Fi, and Bluetooth',
      'No identifiers, no phone number, no email',
    ],
    cons: [
      'Android only (no iOS, no desktop)',
      'Tiny user base',
      'UI is utilitarian compared to mainstream messengers',
    ],
    bestFor: [
      'Journalists / activists in countries with internet shutdowns',
      'High-risk users who need a messenger that works offline',
      'Anyone who wants to never depend on a central server',
    ],
    editorScore: 8.3,
    lastReviewedISO: '2026-07-13',
    appStoreId: undefined,
    playStorePackage: 'org.briarproject.briar.android',
  },
  {
    slug: 'xchat',
    name: 'XChat',
    tagline: 'New encrypted messenger from X',
    summary: 'Brand-new end-to-end encrypted messenger launched April 2026 inside the X (Twitter) ecosystem.',
    description: "XChat is the encrypted messaging app launched inside X (formerly Twitter) on April 24, 2026. It uses E2EE by default, supports group chats up to 1,000 members (350 at launch, growing), voice/video calls, screenshot blocking, and disappearing messages — all gated behind an X account rather than a phone number. XChat has no published third-party audit yet. The killer features vs Signal and Threema are the X social-graph integration (you already know who's online) and no phone number — but those come with the trade-off of an X account tied to encrypted identity and no public audit to verify the cryptography yet.",
    brandColor: '#1d9bf0',
    monogram: 'X',
    website: 'https://x.com',
    openSource: false,
    encryptionDefault: 'always',
    encryptionTech: 'Proprietary E2EE (no published protocol specs at launch); Signal Protocol features claimed but not auditable',
    phoneNumberRequired: false,
    emailRequired: false,
    pricing: 'free',
    platforms: { ios: true, android: true, web: true, desktop: false },
    groupLimit: 1000,
    owner: 'X Corp',
    ownerType: 'company',
    ownerCountry: 'United States',
    foundedYear: 2026,
    sources: [
      { label: 'Apple App Store listing', url: 'https://apps.apple.com/us/app/xchat/id6760873038' },
      { label: 'Google Play Store listing', url: 'https://play.google.com/store/apps/details?id=com.x.chat' },
      { label: 'XChat Hub overview', url: 'https://xchat.directory/what-is-xchat/' },
    ],
    pros: [
      'E2EE by default on every chat and call',
      'X social graph — you can DM people you already know on X',
      'No phone number required — X handle is your identity',
      'Screenshot blocking + disappearing messages built in',
      'Group chats up to 1,000 members',
    ],
    cons: [
      'No published independent audit of the cryptography',
      'Closed source — implementation cannot be verified',
      'No iPad, Mac, or Windows desktop app at launch',
      'Identity is tied to your X account profile (pseudonymous by default but not anonymous)',
    ],
    bestFor: [
      'X users who want messaging to live next to their social feed',
      'People who don\'t want to give any phone number to a chat app',
      'Casual encrypted conversations inside the X ecosystem',
    ],
    editorScore: 7.9,
    lastReviewedISO: '2026-07-13',
    appStoreId: '6760873038',
    playStorePackage: 'com.x.chat',
  },
];

/** Helper: 通过 slug 查找应用 */
export function getAppBySlug(slug: string): MessagingApp | undefined {
  return MESSAGING_APPS.find((a) => a.slug === slug);
}

/** Helper: 按 editorScore 降序排列的应用列表 */
export function getAppsRanked(): MessagingApp[] {
  return [...MESSAGING_APPS].sort((a, b) => b.editorScore - a.editorScore);
}

/** Helper: 列出所有唯一平台字段（用于筛选 UI） */
export const ALL_PLATFORMS = ['ios', 'android', 'web', 'desktop'] as const;
export type PlatformKey = typeof ALL_PLATFORMS[number];

/** 共享格式化函数：在评测页 + 对比页 + best-of 都能复用 */
export function formatPrice(app: MessagingApp): string {
  switch (app.pricing) {
    case 'free': return 'Free';
    case 'paid-once': return `$${app.priceAmount?.toFixed(2) ?? '?'} one-time`;
    case 'freemium': return 'Free + paid tiers';
    case 'paid-subscription': return `$${app.priceAmount?.toFixed(2) ?? '?'}/mo`;
  }
}

export function formatEncryption(app: MessagingApp): string {
  switch (app.encryptionDefault) {
    case 'always': return 'Default (E2EE)';
    case 'opt-in': return 'Optional in select chats';
    case 'partial': return 'Partial coverage';
    case 'none': return 'No E2EE';
  }
}

export function formatOwnership(app: MessagingApp): string {
  const country = app.ownerCountry ? ` · ${app.ownerCountry}` : '';
  switch (app.ownerType) {
    case 'nonprofit': return `Nonprofit${country}`;
    case 'foundation': return `Foundation${country}`;
    case 'company': return `Commercial${country}`;
  }
}

export function formatPlatforms(app: MessagingApp): string {
  const list: string[] = [];
  if (app.platforms.ios) list.push('iOS');
  if (app.platforms.android) list.push('Android');
  if (app.platforms.web) list.push('Web');
  if (app.platforms.desktop) list.push('Desktop');
  return list.length ? list.join(' / ') : 'None';
}

export function editorStars(score: number): string {
  // 10 分制 → 5 星显示
  return (score / 2).toFixed(1) + ' / 5';
}
