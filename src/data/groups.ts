export const GROUP_CATEGORIES = [
  'All',
  'Crypto',
  'Tech',
  'AI',
  'News',
  'Sports',
  'Gaming',
  'Business',
  'Entertainment',
  'Education',
  'Local',
  'Other',
] as const;

export type GroupCategory = Exclude<(typeof GROUP_CATEGORIES)[number], 'All'>;
export type GroupListingTier = 'free' | 'featured' | 'lifetime';

export interface GroupDirectoryEntry {
  slug: string;
  name: string;
  description: string;
  category: GroupCategory;
  tags: string[];
  members: number;
  icon: string;
  inviteUrl: string;
  sourceType: 'official' | 'community-submitted' | 'public-post' | 'manual-review';
  sourceUrl?: string;
  /**
   * Date of the last check. ISO calendar date (YYYY-MM-DD).
   * What that date means depends on checkKind. Do not invent a date.
   */
  verifiedAt: string;
  /**
   * verified: someone opened the invite inside XChat on verifiedAt.
   * source-checked: a public source and the invite URL format were checked on verifiedAt.
   * Source-checked listings must never be labeled "verified".
   */
  checkKind?: 'verified' | 'source-checked';
  listingTier?: GroupListingTier;
  pinnedUntil?: string;
  paidAt?: string;
  paymentProvider?: 'buy-me-a-coffee' | 'manual';
  receiptReference?: string;
  featured?: boolean;
}

export const GROUP_LISTING_BADGES: Record<GroupListingTier, string> = {
  free: '',
  featured: 'Featured',
  lifetime: 'Lifetime',
};

const GROUP_LISTING_RANK: Record<GroupListingTier, number> = {
  lifetime: 0,
  featured: 1,
  free: 2,
};

export function getGroupListingTier(group: GroupDirectoryEntry): GroupListingTier {
  if (group.listingTier) return group.listingTier;
  return group.featured ? 'featured' : 'free';
}

export function getGroupListingBadge(group: GroupDirectoryEntry): string {
  return GROUP_LISTING_BADGES[getGroupListingTier(group)];
}

/**
 * Paid featured ($9 / 30 days) and lifetime pin ($29) tiers.
 * Keep false until the directory is large enough that a pin is meaningful.
 * Flipping this back on restores the pricing cards, form options, and Offer schema.
 */
export const PAID_GROUP_LISTINGS_ENABLED = false;

/** English indefinite article for a category label ("an AI group", "a Crypto group"). */
export function indefiniteArticle(word: string): 'a' | 'an' {
  return /^[aeiou]/i.test(word.trim()) ? 'an' : 'a';
}

/** Format a verified-on ISO date for display. Uses UTC so YYYY-MM-DD does not shift a day. */
export function formatVerifiedOn(isoDate: string, locale = 'en-US'): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Card label. Source-checked groups must never use the word "verified". */
export function formatGroupCheckLabel(
  group: Pick<GroupDirectoryEntry, 'verifiedAt' | 'checkKind'>,
  locale = 'en',
): string {
  if (group.checkKind === 'source-checked') {
    if (locale.startsWith('pt')) return `Fonte conferida em ${group.verifiedAt}`;
    if (locale.startsWith('es')) return `Fuente revisada el ${group.verifiedAt}`;
    if (locale.startsWith('zh')) return `来源核对 ${group.verifiedAt}`;
    return `Source checked ${group.verifiedAt}`;
  }
  const formatted = formatVerifiedOn(group.verifiedAt, locale);
  if (locale.startsWith('pt')) return `Verificado em ${formatted}`;
  if (locale.startsWith('es')) return `Verificado el ${formatted}`;
  if (locale.startsWith('zh')) return `核实于 ${formatted}`;
  return `Verified on ${formatted}`;
}

/**
 * hreflang set for the English directory and the language guides.
 * These answer the same "where are the XChat groups" query.
 */
export const GROUP_DIRECTORY_ALTERNATES = [
  { hreflang: 'en', href: 'https://xchat.directory/groups' },
  { hreflang: 'es', href: 'https://xchat.directory/es/grupos-xchat' },
  { hreflang: 'pt', href: 'https://xchat.directory/pt/grupos-xchat' },
  { hreflang: 'pt-BR', href: 'https://xchat.directory/pt/grupos-xchat' },
  { hreflang: 'zh-CN', href: 'https://xchat.directory/zh/xchat-groups' },
  { hreflang: 'x-default', href: 'https://xchat.directory/groups' },
] as const;

/** Directory content refresh date shown on /groups. Not a per-group verification. */
export const DIRECTORY_LAST_UPDATED = '2026-10-30';

// Add a group only after a person has opened the invite and checked the topic.
// Set verifiedAt to the day of that check. Do not invent groups or dates.
export const GROUP_DIRECTORY: GroupDirectoryEntry[] = [
  {
    slug: 'griiim-pod-business-podcast',
    name: 'GRIIIM Pod — Business & Podcast',
    description: 'Weekly business-focused Spaces and podcast discussion (#griiimpod). Hosted Sunday mornings and evenings by GRIIIMGAMER.',
    category: 'Business',
    tags: ['podcast', 'business', 'spaces'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2036550380318847402/Ja3L5HR7in',
    sourceType: 'community-submitted',
    sourceUrl: 'https://x.com/GRIIIMGAMER/status/2036560531176259984',
    verifiedAt: '2026-04-27',
    checkKind: 'verified',
    listingTier: 'free',
  },
  {
    slug: 'goat-farming-101',
    name: 'Goat Farming 101',
    description: 'Learn-to-farm group for goat raising — breeding, feeding, hygiene, and farm management tips from active farmers.',
    category: 'Education',
    tags: ['farming', 'goats', 'agriculture', 'livestock'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g1949223600420208852/4U0P90rhuR',
    sourceType: 'community-submitted',
    sourceUrl: 'https://x.com/Zeezahgraphix/status/1949837669757800743',
    verifiedAt: '2026-04-27',
    checkKind: 'verified',
    listingTier: 'free',
  },
  {
    slug: 'jason-ai-builders-community-chat',
    name: 'Jason AI Builders Community Chat',
    description: 'Tech and AI builders community chat.',
    category: 'AI',
    tags: ['ai', 'tech', 'builders'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2055339858965544969/2L07KWVT1B',
    sourceType: 'manual-review',
    sourceUrl: 'https://xchatgroups.chat',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'inspire-to-thrive-blogging-chat',
    name: 'Inspire To Thrive Blogging Chat',
    description: 'Blogging and marketing chat.',
    category: 'Business',
    tags: ['blogging', 'marketing'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2047717533050896518/DmrGpR1EVz',
    sourceType: 'manual-review',
    sourceUrl: 'https://xchatgroups.chat',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'team-anthony-official-fan-community',
    name: 'Team Anthony Official Fan Community',
    description: 'Fan community.',
    category: 'Entertainment',
    tags: ['fans'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2052393199319359543/8t6Z0jRxPC',
    sourceType: 'manual-review',
    sourceUrl: 'https://xchatgroups.chat',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'pondphuwin-philippine-fans',
    name: 'PondPhuwin Philippine Fans',
    description: 'Philippine fan chat for the Thai drama pairing PondPhuwin.',
    category: 'Entertainment',
    tags: ['fans', 'thai-drama', 'philippines'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2059892735688274147/S9xB8gO7nX',
    sourceType: 'manual-review',
    sourceUrl: 'https://xchatgroups.chat',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'cbx-unite-exo-cbx',
    name: 'CBX UNITE (EXO-CBX)',
    description: 'K-pop fan chat for EXO-CBX.',
    category: 'Entertainment',
    tags: ['k-pop', 'exo-cbx'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2072564066032459780/98KnZ1GXjS',
    sourceType: 'manual-review',
    sourceUrl: 'https://xchatgroups.chat',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'wan21-causvid',
    name: 'Wan2.1 CausVid',
    description: 'Chat about the Wan2.1 CausVid AI video model.',
    category: 'AI',
    tags: ['ai', 'video'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2048238451565453522/EZoBYHLubg',
    sourceType: 'manual-review',
    sourceUrl: 'https://xchatgroups.chat',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'muslim-investors-xchat',
    name: 'Muslim Investors XChat',
    description: 'Investment-focused chat covering business and crypto topics.',
    category: 'Business',
    tags: ['investing', 'crypto'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2053972002634174767/FXjj9y2QQj',
    sourceType: 'manual-review',
    sourceUrl: 'https://xchatgroups.chat',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'okbuddyhololive-xchat',
    name: 'okbuddyhololive XChat',
    description: 'VTuber meme chat.',
    category: 'Entertainment',
    tags: ['vtuber', 'meme'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2029878376899432633/0Cnx189BN6',
    sourceType: 'manual-review',
    sourceUrl: 'https://xchatgroups.chat',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'lune-bound-for-bangkok-2026',
    name: 'Luné bound for Bangkok 2026',
    description: 'Entertainment group. The public listing gives this name and no further topic detail.',
    category: 'Entertainment',
    tags: ['entertainment'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2024785927642681658/p02W3thXjt',
    sourceType: 'manual-review',
    sourceUrl: 'https://xchatgroups.chat',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'prayer-christian-encouragement',
    name: 'Prayer / Christian encouragement',
    description: 'Christian encouragement and prayer chat. Shared in a public post by @Temmy_omoileri on 2026-10-03.',
    category: 'Other',
    tags: ['prayer', 'christian'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2048928406184886712/MWaAS02565',
    sourceType: 'public-post',
    sourceUrl: 'https://x.com/Temmy_omoileri',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'warriors-for-christ-ministries',
    name: 'Warriors For Christ Ministries',
    description: 'Christian ministry chat. Shared in a public post by @DarlPattison on 2026-10-24.',
    category: 'Other',
    tags: ['christian', 'ministry'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g1979154263764013140/yoqR5fvZdY',
    sourceType: 'public-post',
    sourceUrl: 'https://x.com/DarlPattison',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'cortis-fan-gc',
    name: 'CORTIS fan GC',
    description: 'K-pop fan chat for CORTIS, covering voting and streaming. Shared in a public post by @CortisTrophy1 on 2026-10-24.',
    category: 'Entertainment',
    tags: ['k-pop', 'cortis', 'streaming'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2108068522349723872/zhoOwO12lK',
    sourceType: 'public-post',
    sourceUrl: 'https://x.com/CortisTrophy1',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'stray-kids-streaming-gc',
    name: 'Stray Kids streaming GC',
    description: 'Stray Kids fan chat for streaming. Shared in a public post by @SKZ_GOALS on 2026-10-25.',
    category: 'Entertainment',
    tags: ['k-pop', 'stray-kids', 'streaming'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2114359262264578438/l46445om2t',
    sourceType: 'public-post',
    sourceUrl: 'https://x.com/SKZ_GOALS',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
  {
    slug: 'ramayana-fans-gc',
    name: 'Ramayana Fans GC',
    description: 'Ramayana fan chat in English and Hindi. Shared in a public post by @SidhuBeer81159 on 2026-10-30.',
    category: 'Entertainment',
    tags: ['ramayana', 'fans'],
    members: 0,
    icon: '#',
    inviteUrl: 'https://x.com/i/chat/group_join/g2107465555842384175/lUqmrxLNFB',
    sourceType: 'public-post',
    sourceUrl: 'https://x.com/SidhuBeer81159',
    verifiedAt: '2026-10-30',
    checkKind: 'source-checked',
    listingTier: 'free',
  },
];

export function latestVerifiedAt(groups: readonly Pick<GroupDirectoryEntry, 'verifiedAt'>[] = GROUP_DIRECTORY): string | null {
  let latest = '';
  for (const group of groups) {
    if (group.verifiedAt > latest) latest = group.verifiedAt;
  }
  return latest || null;
}

export function countGroupsInCategory(category: string): number {
  return GROUP_DIRECTORY.filter((group) => group.category === category).length;
}

export const SORTED_GROUP_DIRECTORY = [...GROUP_DIRECTORY].sort((a, b) => {
  const tierDiff = GROUP_LISTING_RANK[getGroupListingTier(a)] - GROUP_LISTING_RANK[getGroupListingTier(b)];
  if (tierDiff !== 0) return tierDiff;

  const verifiedA = a.verifiedAt ? Date.parse(a.verifiedAt) : 0;
  const verifiedB = b.verifiedAt ? Date.parse(b.verifiedAt) : 0;
  if (verifiedA !== verifiedB) return verifiedB - verifiedA;

  return a.name.localeCompare(b.name);
});

export const GROUP_ENTRY_TEMPLATE: GroupDirectoryEntry = {
  slug: 'example-group-slug',
  name: 'Example XChat Group',
  description: 'A short public description of the group.',
  category: 'Other',
  tags: ['XChat'],
  members: 0,
  icon: '#',
  inviteUrl: 'https://example.com/invite',
  sourceType: 'community-submitted',
  verifiedAt: '2026-04-27',
  listingTier: 'free',
};

export const GROUP_LISTING_RULES = [
  'The invite is a public https://x.com/i/chat/group_join/ link.',
  'No NSFW. No follow-for-follow. Engagement-bait groups stay out.',
  '“Verified on” means someone opened the invite in XChat that day. “Source checked” means the public source and invite format were checked — it is not an in-app verification.',
  'Owners can ask for removal from the card on the group, or by emailing hello@xchat.directory.',
];

/** @deprecated Use GROUP_LISTING_RULES. Kept so older notes still import. */
export const GROUP_DISCOVERY_SIGNALS = GROUP_LISTING_RULES;
