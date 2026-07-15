/**
 * check-app-store.mjs — 通过 Apple iTunes Lookup API 验证本地 xchat.json 数据是否与线上一致。
 *
 * 用法: node scripts/check-app-store.mjs
 *
 * 如果有字段不一致，脚本打印 mismatch 并以 exitCode=1 退出。
 * CI 或本地手动跑都可以。
 */
import xchat from '../src/data/xchat.json' with { type: 'json' };

const ITUNES_LOOKUP = 'https://itunes.apple.com/lookup?id=6760873038&country=us';

function bytesToDisplay(bytes) {
  const mb = Number(bytes) / (1024 * 1024);
  return `~${Math.round(mb)} MB`;
}

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

  if (!data.results || data.results.length === 0) {
    throw new Error('iTunes API returned 0 results — app may have been removed.');
  }

  const app = data.results[0];

  // Extract fields
  const remoteVersion = app.version;
  const remoteReleaseDate = app.releaseDate?.split('T')[0] || '';
  const remoteCurrentVersionDate = app.currentVersionReleaseDate?.split('T')[0] || '';
  const remoteMinOS = `iOS ${app.minimumOsVersion?.replace(/\.0$/, '')}+`;
  const remoteAppSize = bytesToDisplay(app.fileSizeBytes);
  const remoteAgeRating = app.contentAdvisoryRating;
  const remoteLanguages = app.languageCodesISO2A?.length || 0;
  const remoteRating = app.averageUserRating?.toFixed(2);
  const remoteRatingCount = app.userRatingCount;

  console.log('[check-app-store] Live iTunes data:');
  console.log(`  version:          ${remoteVersion}`);
  console.log(`  releaseDate:      ${remoteReleaseDate}`);
  console.log(`  lastUpdate:       ${remoteCurrentVersionDate}`);
  console.log(`  minimumOS:        ${remoteMinOS}`);
  console.log(`  appSize:          ${remoteAppSize}`);
  console.log(`  ageRating:        ${remoteAgeRating}`);
  console.log(`  languages:        ${remoteLanguages}`);
  console.log(`  avgRating:        ${remoteRating} (${remoteRatingCount} reviews)`);
  console.log('');

  const mismatches = [];

  if (remoteReleaseDate !== xchat.launchDate) {
    mismatches.push(`launchDate: local="${xchat.launchDate}" remote="${remoteReleaseDate}"`);
  }

  if (remoteMinOS !== xchat.iosRequirement) {
    mismatches.push(`iosRequirement: local="${xchat.iosRequirement}" remote="${remoteMinOS}"`);
  }

  if (remoteAppSize !== xchat.appSize) {
    mismatches.push(`appSize: local="${xchat.appSize}" remote="${remoteAppSize}"`);
  }

  if (remoteAgeRating !== xchat.ageRating) {
    mismatches.push(`ageRating: local="${xchat.ageRating}" remote="${remoteAgeRating}"`);
  }

  if (remoteLanguages !== xchat.languages) {
    mismatches.push(`languages: local=${xchat.languages} remote=${remoteLanguages}`);
  }

  if (mismatches.length === 0) {
    console.log('[check-app-store] ✓ Local config matches live App Store data.');
    return;
  }

  console.log('[check-app-store] ✗ Mismatches detected:');
  mismatches.forEach((m) => console.log(`  - ${m}`));
  console.log('');
  console.log('[check-app-store] Update src/data/xchat.json and rebuild.');
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`[check-app-store] ${error.message}`);
  process.exitCode = 1;
});

// ---- Google Play basic availability check ----
async function checkPlayStore() {
  const url = xchat.androidPlayStoreUrl;
  if (!url) {
    console.log('[check-play-store] No androidPlayStoreUrl configured, skipping.');
    return;
  }
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; XChatHubBot/1.0)' },
      redirect: 'follow',
    });
    if (res.ok) {
      console.log(`[check-play-store] \u2713 Google Play page is live (${res.status})`);
    } else {
      console.log(`[check-play-store] \u2717 Google Play returned ${res.status} — app may have been removed.`);
      process.exitCode = 1;
    }
  } catch (e) {
    console.log(`[check-play-store] \u2717 Could not reach Google Play: ${e.message}`);
  }
}

checkPlayStore();
