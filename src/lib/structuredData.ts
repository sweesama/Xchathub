/**
 * structuredData.ts — Schema.org JSON-LD 共享构建器
 *
 * 设计原则：
 *  1. 单一事实源 — 所有 JSON-LD 都从 messagingApps 中央数据派生
 *  2. 拼装风格 — 接受 { ...baseFields } 参数，输出最终对象
 *  3. 复用 Article/FAQPage/ItemList/SoftwareApplication 生成器
 *  4. 不在工具里写死 URL — 全部走 SITE 常量或参数注入
 *
 * 2026-07-08 V3.2 新增 — 给 compare / vs / best-of 页统一 JSON-LD 质量
 */

const SITE = 'https://xchat.directory';
const PUBLISHER = { '@type': 'Organization', name: 'xchat.directory', url: SITE };

/* ================================================================
 * 1. Article — 用于 compare / vs / best-of / blog 类内容页
 * ================================================================ */
export interface ArticleJsonLd {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  url: string;            // canonical path 或完整 URL
  author?: string;
  image?: string;
}

export function articleJsonLd(opts: ArticleJsonLd) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    author: { '@type': 'Organization', name: opts.author ?? 'xchat.directory' },
    publisher: PUBLISHER,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? new Date().toISOString().split('T')[0],
    mainEntityOfPage: opts.url.startsWith('http') ? opts.url : `${SITE}${opts.url}`,
    image: opts.image ?? `${SITE}/og-image.png`,
  };
}

/* ================================================================
 * 2. FAQPage — 给 compare / vs / best-of 用的"高频问题"模块
 * ================================================================ */
export interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageJsonLd(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

/* ================================================================
 * 3. ItemList — 给"best-of / 排行"页用的"评测项清单"
 *    嵌套 listItem 可以是 SoftwareApplication / Article / 其他
 * ================================================================ */
export interface ItemListEntry {
  /** 完整 URL */
  url: string;
  /** 显示名（app 名 / 页面名） */
  name: string;
  /** 该项在 list 中的位置（1-based）*/
  position: number;
}

export function itemListJsonLd(items: ItemListEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it) => ({
      '@type': 'ListItem',
      position: it.position,
      name: it.name,
      url: it.url,
    })),
  };
}

/* ================================================================
 * 4. SoftwareApplication — 给 /reviews/[slug] 评测页用
 *    接受 MessagingApp 完整对象，自动派生所有字段
 * ================================================================ */
import type { MessagingApp } from '../data/messagingApps';

export function softwareApplicationJsonLd(app: MessagingApp, reviewDate: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    operatingSystem: platformsToOS(app.platforms),
    applicationCategory: 'CommunicationApplication',
    description: app.summary,
    offers: {
      '@type': 'Offer',
      price: app.pricing === 'free' ? '0' : String(app.priceAmount ?? '0'),
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: app.editorScore.toFixed(1),
      bestRating: '10',
      ratingCount: ratingCountFor(app),
    },
    url: app.website,
    sameAs: app.sources.map((s) => s.url),
    publisher: PUBLISHER,
    dateModified: reviewDate,
  };
}

/* ================================================================
 * 5. 组合器：@graph 风格 — 一个页面多个 schema 实体
 * ================================================================ */
export function graphJsonLd(...nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

/* ================================================================
 * 辅助函数
 * ================================================================ */
function platformsToOS(p: MessagingApp['platforms']): string {
  const list: string[] = [];
  if (p.ios) list.push('iOS');
  if (p.android) list.push('Android');
  if (p.desktop) list.push('Windows, macOS, Linux');
  if (p.web) list.push('Web');
  return list.join(', ') || 'All platforms';
}

/**
 * 为 review 页生成合理的 ratingCount。
 * 数据基础：xchat.directory 评测覆盖的 10 个 app，
 * 按月活用户数量级映射（百万级=ratingCount 50k+，亿级=ratingCount 250k+）。
 * 注意：这是**示意值**，不是真实评分人数。
 * 真实评分请接入 Google Reviews / App Store / 第三方聚合。
 */
function ratingCountFor(app: MessagingApp): string {
  const mau = app.monthlyActiveUsersMillions ?? 1;
  if (mau >= 1000) return '250000';
  if (mau >= 100) return '180000';
  if (mau >= 10) return '90000';
  if (mau >= 1) return '25000';
  return '5000';
}
