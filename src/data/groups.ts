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
  verifiedAt?: string;
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

// Keep this list empty until real XChat groups can be verified.
// Once invite links exist, add reviewed entries here.
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

export const GROUP_DISCOVERY_SIGNALS = [
  'Public invite links shared on X posts, profiles, or replies',
  'Direct submissions from owners through Telegram community',
  'Links surfaced in screenshots, launch threads, or tutorials',
  'Manual review after the app launches to confirm how invites work',
];
