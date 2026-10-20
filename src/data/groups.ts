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
   * Verified-on date for manual curation. ISO calendar date (YYYY-MM-DD) a person
   * last confirmed this invite still opens the group. Set it by hand — do not
   * invent a date for a link nobody checked. Shown on cards as "Verified on".
   */
  verifiedAt: string;
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

/**
 * hreflang set for the English directory and the language guides.
 * These answer the same "where are the XChat groups" query.
 */
export const GROUP_DIRECTORY_ALTERNATES = [
  { hreflang: 'en', href: 'https://xchat.directory/groups' },
  { hreflang: 'es', href: 'https://xchat.directory/es/grupos-xchat' },
  { hreflang: 'zh-CN', href: 'https://xchat.directory/zh/xchat-groups' },
  { hreflang: 'x-default', href: 'https://xchat.directory/groups' },
] as const;

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
  'The invite is a public https://x.com/i/chat/group_join/ link, and someone has opened it.',
  'The topic is a normal community. Adult, follow-for-follow, and engagement-bait groups stay out.',
  'Each listing stores a verified-on date (verifiedAt). Update that date only when you re-check the link.',
  'Owners can ask for removal from the card on the group, or by emailing hello@xchat.directory.',
];

/** @deprecated Use GROUP_LISTING_RULES. Kept so older notes still import. */
export const GROUP_DISCOVERY_SIGNALS = GROUP_LISTING_RULES;
