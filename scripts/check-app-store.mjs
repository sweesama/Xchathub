import xchat from '../src/data/xchat.json' with { type: 'json' };

const MONTHS = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

function formatIsoFromExpected(match) {
  const [, month, day, year] = match;
  const monthNumber = MONTHS[month];
  const paddedDay = String(day).padStart(2, '0');
  return `${year}-${monthNumber}-${paddedDay}`;
}

function toLongDisplay(isoDate) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

async function main() {
  const url = `${xchat.appStoreUrl}?l=en-US`;
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; XChatHubBot/1.0; +https://xchat.directory)',
      accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`App Store request failed: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  const expectedMatch = html.match(/Expected ([A-Z][a-z]{2}) (\d{1,2}), (\d{4})/);
  const iosMatch = html.match(/Requires iOS ([0-9.]+) or later/);

  if (!expectedMatch) {
    throw new Error('Could not find an "Expected" launch date on the App Store page.');
  }

  if (!iosMatch) {
    throw new Error('Could not find the iOS requirement on the App Store page.');
  }

  const remoteLaunchDate = formatIsoFromExpected(expectedMatch);
  const remoteLaunchDisplay = toLongDisplay(remoteLaunchDate);
  const remoteIosRequirement = `iOS ${iosMatch[1]}+`;

  const mismatches = [];

  if (remoteLaunchDate !== xchat.launchDate) {
    mismatches.push(`launchDate local=${xchat.launchDate} remote=${remoteLaunchDate}`);
  }

  if (remoteLaunchDisplay !== xchat.launchDisplay) {
    mismatches.push(`launchDisplay local="${xchat.launchDisplay}" remote="${remoteLaunchDisplay}"`);
  }

  if (remoteIosRequirement !== xchat.iosRequirement) {
    mismatches.push(`iosRequirement local="${xchat.iosRequirement}" remote="${remoteIosRequirement}"`);
  }

  console.log('[check-app-store] Official App Store snapshot');
  console.log(`- launchDate: ${remoteLaunchDate}`);
  console.log(`- launchDisplay: ${remoteLaunchDisplay}`);
  console.log(`- iosRequirement: ${remoteIosRequirement}`);

  if (mismatches.length === 0) {
    console.log('[check-app-store] Local config matches App Store.');
    return;
  }

  console.log('[check-app-store] Mismatch detected:');
  mismatches.forEach((item) => console.log(`- ${item}`));
  console.log('[check-app-store] Update src/data/xchat.json and rebuild.');
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`[check-app-store] ${error.message}`);
  process.exitCode = 1;
});
