export interface GroupLead {
  slug: string;
  label: string;
  sourceType: 'x-post' | 'telegram' | 'video' | 'screenshot' | 'manual-test';
  sourceUrl?: string;
  foundAt?: string;
  reviewed: boolean;
  verified: boolean;
  notes?: string;
}

// Unverified sightings belong here before they graduate into src/data/groups.ts.
export const GROUP_LEADS: GroupLead[] = [];

export const GROUP_DISCOVERY_QUERIES = [
  '"XChat" "invite"',
  '"XChat group"',
  '"join my XChat"',
  '"XChat" "link"',
  '"XChat" "community"',
  '"XChat" "chat invite"',
];

export const GROUP_DISCOVERY_CHANNELS = [
  'Public X posts, replies, and profile links',
  'Telegram community submissions',
  'Launch-day screenshots and short videos',
  'Manual in-app testing once the app is live',
];
