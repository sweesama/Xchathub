/**
 * groupCategoryMeta.ts — 每个群组分类的 SEO 元数据与文案
 *
 * 用于 /groups/[category]/ 动态路由生成专属着陆页。
 * 每个分类一段独立 SEO 描述，命中分类相关长尾词。
 */
import type { GroupCategory } from './groups';

export interface GroupCategoryMeta {
  /** URL slug，用作 /groups/[slug]/ */
  slug: string;
  /** 分类显示名（与 GROUP_CATEGORIES 中匹配） */
  label: GroupCategory;
  /** 分类 emoji，用于 hero 区视觉 */
  emoji: string;
  /** SEO H1（页面主标题） */
  h1: string;
  /** SEO meta title（< 60 字符） */
  metaTitle: string;
  /** SEO meta description（< 160 字符） */
  metaDescription: string;
  /** Hero 区副标题（解释这个分类） */
  intro: string;
  /** 该分类下"会有什么类型的群"的示例（占位状态用） */
  exampleTypes: string[];
  /** 重点关键词（用于 alt 文本/JSON-LD keywords） */
  keywords: string[];
}

export const GROUP_CATEGORY_META: GroupCategoryMeta[] = [
  {
    slug: 'crypto',
    label: 'Crypto',
    emoji: '₿',
    h1: 'XChat Crypto Groups — Bitcoin, Ethereum, DeFi & Web3 Communities',
    metaTitle: 'XChat Crypto Groups Directory — BTC, ETH, DeFi, Web3 Chats',
    metaDescription: 'Find public XChat group chat invite links for crypto, Bitcoin, Ethereum, DeFi, NFTs, and Web3. Submit your crypto group to be listed.',
    intro: 'Crypto Twitter has always been the loudest part of X. With XChat\'s encrypted group links, traders, builders, and degens are moving alpha conversations into private rooms. This page tracks public crypto groups as they appear.',
    exampleTypes: [
      'Bitcoin & macro discussion rooms',
      'Ethereum builders and DeFi protocols',
      'Solana, Base, and L2 ecosystem groups',
      'NFT collectors and trading desks',
      'On-chain alpha and trading signals',
    ],
    keywords: ['xchat crypto group', 'crypto group chat', 'bitcoin xchat', 'ethereum group', 'defi xchat', 'web3 group chat'],
  },
  {
    slug: 'tech',
    label: 'Tech',
    emoji: '💻',
    h1: 'XChat Tech Groups — Software, Startups & Developer Communities',
    metaTitle: 'XChat Tech Groups Directory — Devs, Startups, Engineering',
    metaDescription: 'Browse XChat group chat invite links for software developers, startups, engineering, and tech founders. Submit your tech group free.',
    intro: 'Tech Twitter is splitting into hundreds of group chats. From indie hackers to Big Tech engineers, XChat is becoming a private replacement for Slack-style communities. This is where to find them.',
    exampleTypes: [
      'Indie hackers and bootstrapped founder rooms',
      'Frontend, backend, and mobile dev chats',
      'Specific stack groups (React, Rust, Go, etc.)',
      'Startup co-founder matchmaking',
      'DevOps, SRE, and infrastructure',
    ],
    keywords: ['xchat tech group', 'developer group chat', 'startup xchat', 'engineering chat', 'indie hacker group'],
  },
  {
    slug: 'ai',
    label: 'AI',
    emoji: '🤖',
    h1: 'XChat AI Groups — LLMs, Agents, Prompt Engineering & ML Research',
    metaTitle: 'XChat AI Groups Directory — LLMs, Agents, ML, Prompts',
    metaDescription: 'Find public XChat group chat invite links for AI, LLMs, ChatGPT, Grok, Claude, agents, and ML research. Submit your AI group free.',
    intro: 'AI moves faster than any subreddit can keep up with. XChat groups have become the place where researchers, prompt engineers, and tool builders share what\'s new in real time. Track them here.',
    exampleTypes: [
      'LLM research and paper discussion',
      'Prompt engineering and prompt swaps',
      'AI agents and autonomous systems',
      'ChatGPT, Grok, and Claude user groups',
      'AI builder communities (Cursor, Windsurf, etc.)',
    ],
    keywords: ['xchat ai group', 'llm group chat', 'chatgpt group', 'grok community', 'ai agents chat'],
  },
  {
    slug: 'news',
    label: 'News',
    emoji: '📰',
    h1: 'XChat News Groups — Breaking News, Politics & Current Events',
    metaTitle: 'XChat News Groups Directory — Breaking News & Discussion',
    metaDescription: 'Find public XChat group chat invite links for breaking news, politics, current events, and journalism. Submit your news group free.',
    intro: 'News broke first on Twitter. With XChat groups, journalists, news junkies, and political commentators are organizing into private rooms for sharper discussion away from the algorithm.',
    exampleTypes: [
      'Breaking news and live event coverage',
      'Politics and policy analysis',
      'Local news and city-specific updates',
      'Journalism and reporter networks',
      'Geopolitics and international affairs',
    ],
    keywords: ['xchat news group', 'breaking news chat', 'politics xchat', 'journalism community'],
  },
  {
    slug: 'sports',
    label: 'Sports',
    emoji: '⚽',
    h1: 'XChat Sports Groups — Live Game Chat, Fantasy & Team Communities',
    metaTitle: 'XChat Sports Groups Directory — Fans, Fantasy, Live Games',
    metaDescription: 'Find public XChat group chat invite links for football, basketball, soccer, MMA, fantasy sports, and team fan groups. Submit your sports group.',
    intro: 'Game-day group chats moved off Discord and SMS. XChat\'s 350-1000 member groups are perfect for team fan rooms, fantasy leagues, and live-event commentary.',
    exampleTypes: [
      'NFL, NBA, MLB, NHL team fan rooms',
      'Soccer / football clubs (Premier League, La Liga, etc.)',
      'Fantasy sports leagues and waiver chat',
      'MMA, boxing, and combat sports',
      'Live game commentary and reaction',
    ],
    keywords: ['xchat sports group', 'sports fan chat', 'fantasy football xchat', 'team group chat'],
  },
  {
    slug: 'gaming',
    label: 'Gaming',
    emoji: '🎮',
    h1: 'XChat Gaming Groups — Esports, Streaming, MMO & Console Chat',
    metaTitle: 'XChat Gaming Groups Directory — Esports, Streamers, MMOs',
    metaDescription: 'Find public XChat group chat invite links for gaming, esports, streamers, MMO guilds, and console communities. Submit your gaming group.',
    intro: 'Gamers were among the first to test joinable group links. From competitive esports teams to casual MMO guilds, XChat is becoming a Discord alternative for X-native communities.',
    exampleTypes: [
      'Esports teams and competitive scenes',
      'MMO guilds and raid coordination',
      'Console-specific groups (PS5, Xbox, Switch)',
      'Streamer fan rooms and clip-sharing',
      'Indie game communities and devs',
    ],
    keywords: ['xchat gaming group', 'esports chat', 'mmo guild xchat', 'streamer community'],
  },
  {
    slug: 'business',
    label: 'Business',
    emoji: '💼',
    h1: 'XChat Business Groups — Founders, Investors & Industry Networks',
    metaTitle: 'XChat Business Groups Directory — Founders, VCs, Sales',
    metaDescription: 'Find public XChat group chat invite links for founders, investors, sales, marketing, and industry-specific business networks. Submit your business group.',
    intro: 'B2B Twitter networks are migrating into XChat groups. Founders, operators, VCs, and sales teams are using invite-only rooms to share deal flow and intel without the noise.',
    exampleTypes: [
      'Founder peer groups and accelerator alumni',
      'VC and angel investor deal-share',
      'Sales, marketing, and growth operators',
      'Industry-specific networks (SaaS, fintech, e-com)',
      'Remote work and distributed team rooms',
    ],
    keywords: ['xchat business group', 'founder chat', 'vc network', 'sales community xchat'],
  },
  {
    slug: 'entertainment',
    label: 'Entertainment',
    emoji: '🎬',
    h1: 'XChat Entertainment Groups — TV, Movies, Music & Pop Culture',
    metaTitle: 'XChat Entertainment Groups — TV, Movies, Music, Anime',
    metaDescription: 'Find public XChat group chat invite links for TV shows, movies, music, anime, and pop culture fans. Submit your entertainment group free.',
    intro: 'TV finales, album drops, and movie premieres are the perfect group-chat moments. XChat entertainment groups give fan communities a private place to react in real time.',
    exampleTypes: [
      'TV show fan rooms and episode reactions',
      'Movie release discussion and reviews',
      'Music genres, artists, and album drops',
      'Anime and manga communities',
      'Reality TV, podcasts, and pop culture',
    ],
    keywords: ['xchat entertainment group', 'tv fan chat', 'music group xchat', 'anime community'],
  },
  {
    slug: 'education',
    label: 'Education',
    emoji: '🎓',
    h1: 'XChat Education Groups — Study Groups, Courses & Learning Communities',
    metaTitle: 'XChat Education Groups — Study, Courses, Learning',
    metaDescription: 'Find public XChat group chat invite links for study groups, online courses, language learning, and academic communities. Submit your education group.',
    intro: 'Learning is more fun in a group. XChat is filling the gap between Discord study servers and Telegram course channels with encrypted, X-native learning communities.',
    exampleTypes: [
      'Cohort-based course study groups',
      'Language exchange and learning rooms',
      'University class and major-specific',
      'Self-taught skill communities (coding, design)',
      'Reading clubs and book discussion',
    ],
    keywords: ['xchat education group', 'study group chat', 'language exchange xchat', 'course community'],
  },
  {
    slug: 'local',
    label: 'Local',
    emoji: '📍',
    h1: 'XChat Local Groups — City, Neighborhood & Regional Communities',
    metaTitle: 'XChat Local Groups Directory — City & Neighborhood Chats',
    metaDescription: 'Find public XChat group chat invite links for cities, neighborhoods, and regional communities. Submit your local group free.',
    intro: 'Nextdoor is dying. WhatsApp groups don\'t scale. XChat local groups support up to 1,000 members — large enough for an entire neighborhood, small enough to stay relevant.',
    exampleTypes: [
      'Major city general chats (NYC, LA, London, Tokyo)',
      'Neighborhood-specific community rooms',
      'Country and language-region groups',
      'Local meetup and event coordination',
      'Expat and digital nomad communities',
    ],
    keywords: ['xchat local group', 'city chat xchat', 'neighborhood community', 'expat group'],
  },
];

/** 通过 slug 查找分类元数据 */
export function getCategoryMeta(slug: string): GroupCategoryMeta | undefined {
  return GROUP_CATEGORY_META.find((m) => m.slug === slug);
}

/** 通过 label 查找 slug（用于群组数据匹配） */
export function getCategorySlug(label: GroupCategory): string {
  return GROUP_CATEGORY_META.find((m) => m.label === label)?.slug ?? 'other';
}
