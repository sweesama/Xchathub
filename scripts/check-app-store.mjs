/**
 * check-app-store.mjs — confirm the standalone X Chat store listings stay gone.
 *
 * The separate app (Apple id 6760873038, Play package com.x.chat) was removed
 * around 2026-09-14. This script expects the iTunes lookup to return no result.
 * It does not print a download URL. If the listing comes back, exit 1 so a
 * human can decide what the site should say.
 *
 * Usage: node scripts/check-app-store.mjs
 */
const ITUNES_LOOKUP = 'https://itunes.apple.com/lookup?id=6760873038&country=us';

async function main() {
  const response = await fetch(ITUNES_LOOKUP, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; XChatHubBot/1.0; +https://xchat.directory)',
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`iTunes API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const count = data.resultCount ?? data.results?.length ?? 0;

  if (count === 0) {
    console.log('[check-app-store] Standalone X Chat listing is absent, as expected since 2026-09-14.');
    console.log('[check-app-store] Site copy should keep sending people to the X app or https://chat.x.com.');
    return;
  }

  console.log(`[check-app-store] iTunes returned ${count} result(s). The removed listing may be back.`);
  console.log('[check-app-store] Do not restore a store download CTA until a person confirms the page.');
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`[check-app-store] ${error.message}`);
  process.exitCode = 1;
});
