# Group Publishing Workflow

Use this when someone submits or pays for an XChat group listing.

## What is already ready

- Buy Me a Coffee shop has the two paid products:
  - Featured Listing: $9
  - Lifetime Pin: $29
- The site can list verified groups from `src/data/groups.ts`.
- Paid placement is represented by `listingTier`.

## Intake checklist

Ask the owner to send this in Telegram:

```text
Plan: Free / Featured / Lifetime
Group name:
Invite link:
Category:
Tags:
Short description:
Current member count:
Owner X handle:
BMC receipt email or order reference:
```

For free listings, the receipt line can be omitted.

## Verification checklist

Do not publish a group until all required items are true:

- The invite link opens the expected XChat group.
- The group name and category match the submitted description.
- The listing does not look like spam, illegal content, hate speech, phishing, impersonation, or malware.
- For paid listings, the Buy Me a Coffee order is visible in the BMC dashboard.

## Publishing a free listing

Add an entry to `GROUP_DIRECTORY` in `src/data/groups.ts`:

```ts
{
  slug: 'example-community',
  name: 'Example Community',
  description: 'Short public description.',
  category: 'Tech',
  tags: ['XChat', 'Tech'],
  members: 0,
  icon: '#',
  inviteUrl: 'https://example.com/invite',
  sourceType: 'community-submitted',
  verifiedAt: '2026-04-27',
  listingTier: 'free',
}
```

## Publishing a Featured listing

Use `listingTier: 'featured'`.

```ts
{
  slug: 'example-featured',
  name: 'Example Featured',
  description: 'Short public description.',
  category: 'AI',
  tags: ['AI', 'Builders'],
  members: 0,
  icon: '#',
  inviteUrl: 'https://example.com/invite',
  sourceType: 'community-submitted',
  verifiedAt: '2026-04-27',
  listingTier: 'featured',
  pinnedUntil: '2026-05-27',
  paidAt: '2026-04-27',
  paymentProvider: 'buy-me-a-coffee',
  receiptReference: 'BMC order or email reference',
}
```

Featured listings are sorted above free listings.

## Publishing a Lifetime listing

Use `listingTier: 'lifetime'`.

```ts
{
  slug: 'example-lifetime',
  name: 'Example Lifetime',
  description: 'Short public description.',
  category: 'Crypto',
  tags: ['Crypto', 'XChat'],
  members: 0,
  icon: '#',
  inviteUrl: 'https://example.com/invite',
  sourceType: 'community-submitted',
  verifiedAt: '2026-04-27',
  listingTier: 'lifetime',
  paidAt: '2026-04-27',
  paymentProvider: 'buy-me-a-coffee',
  receiptReference: 'BMC order or email reference',
}
```

Lifetime listings are sorted above Featured and Free listings.

## After editing

Run:

```bash
npm run build
```

Then check:

- `/groups`
- `/list-your-group`
- `public/llms.txt`

