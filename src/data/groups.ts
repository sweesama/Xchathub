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
  featured?: boolean;
}

// Keep this list empty until real XChat groups can be verified.
// Once invite links exist, add reviewed entries here.
export const GROUP_DIRECTORY: GroupDirectoryEntry[] = [];

export const GROUP_DISCOVERY_SIGNALS = [
  'Public invite links shared on X posts, profiles, or replies',
  'Direct submissions from owners through Telegram community',
  'Links surfaced in screenshots, launch threads, or tutorials',
  'Manual review after the app launches to confirm how invites work',
];
