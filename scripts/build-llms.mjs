import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import xchat from '../src/data/xchat.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'public', 'llms.txt');

const content = `# XChat Hub

> Unofficial community resource hub for XChat — Elon Musk's end-to-end encrypted messaging app from X Corp. We maintain a curated public-group directory, track Android availability, document the chat.x.com web client, and publish verified guides for users worldwide.

XChat Hub (xchat.directory) is an independent, fan-operated information site. We are **not affiliated** with X Corp, Elon Musk, or any official XChat team. Our mission is to be the fastest, most accurate source of XChat-related answers on the open web — especially the questions official channels do not address (Android availability, public group discovery, web access, comparisons with WhatsApp/Signal/Telegram).

## Key Facts About XChat

- **Status**: Launched on ${xchat.launchDisplay} — generally available on iOS via the Apple App Store.
- **Platforms**: iOS (${xchat.iosRequirement}, iPhone & iPad) and Android via Google Play (${xchat.androidPlayStoreUrl}). A web client is available at **chat.x.com**. No native desktop client as of this writing.
- **App Store URL**: ${xchat.appStoreUrl}
- **Features**: End-to-end encryption, public group invite links (joinable via URL), screenshot blocking with notifications, voice notes, paid-subscriber badges, video calls, disappearing messages.
- **Group capacity**: ${xchat.groupLimit}-member groups at launch, expanding toward 1,000 members per group as roll-out continues.
- **Languages supported**: ${xchat.languages}
- **App size**: ${xchat.appSize}
- **Age rating**: ${xchat.ageRating}
- **Sign-up requirement**: An X (formerly Twitter) account is mandatory.
- **Android status**: ${xchat.androidStatus} — launched ${xchat.androidLaunchDisplay} on Google Play (package com.x.chat, by X Corp). Only install from Google Play; any "XChat.apk" from a third-party site is unsafe.
- **Communities sunset**: X Communities are scheduled to be discontinued — XChat groups are the official replacement for community-style chat.

## Primary Pages

- [Home](https://xchat.directory/): Overview hub linking to all tools — launch status, group directory, web access guide, Android tracker, comparisons.
- [Groups Directory](https://xchat.directory/groups/): Curated, searchable list of public XChat group invite links submitted by group owners. Browsable by category (Crypto, Tech, AI, News, Sports, Gaming, Business, Entertainment, Education, Local).
- [Groups by category](https://xchat.directory/groups/crypto/): Each of the 10 categories has its own SEO-optimised landing page with examples of group types, intro copy, and a submission CTA. Pattern: \`/groups/{slug}/\` for slugs crypto, tech, ai, news, sports, gaming, business, entertainment, education, local.
- [What Is XChat? (Complete Guide)](https://xchat.directory/what-is-xchat/): Long-form intro — origin story, full feature list, platforms, comparisons, FAQ. Best entry point for users new to XChat.
- [How to Join an XChat Group](https://xchat.directory/how-to-join-xchat-group/): Step-by-step guide for joining via a public invite link, including troubleshooting (pending requests, expired links, full groups).
- [Web Access Guide](https://xchat.directory/web/): How to use XChat in a desktop browser via chat.x.com — features supported, limitations vs the iOS app, FAQ.
- [Android Tracker](https://xchat.directory/android/): Live status of any official XChat Android release plus warnings about fake APKs.
- [How to Create a Group Link](https://xchat.directory/how-to-create-group-link/): Step-by-step tutorial for group owners to generate and share a public invite URL.
- [Communities Shutdown](https://xchat.directory/communities-shutdown/): What X Communities users need to do before the shutdown deadline, and how to migrate community membership into XChat groups.
- [List Your Group](https://xchat.directory/list-your-group/): Free submission form for group owners who want to be listed in the directory.
- [FAQ](https://xchat.directory/faq/): Most-asked questions — pricing, age requirements, multi-device, encryption details, Android timeline.
- [Launch Countdown / Recap](https://xchat.directory/launch-countdown/): Original launch-day live page; now serves as a historical record of the rollout.
- [vs WhatsApp](https://xchat.directory/vs/whatsapp/), [vs Signal](https://xchat.directory/vs/signal/), [vs Telegram](https://xchat.directory/vs/telegram/): Side-by-side comparisons of features, encryption, group limits, and target audiences.
- [Privacy Policy](https://xchat.directory/privacy/): GDPR-aligned policy describing data handling and third-party integrations.

## Community Channels

- **Telegram Channel** (announcements & updates): ${xchat.telegramChannelUrl}
- **Telegram Community Group** (discussion & group submissions): ${xchat.telegramCommunityUrl}

## How to Use This Site

- **iOS users**: Install XChat directly from the App Store. The site provides setup help, web-fallback instructions, and a directory of public groups to join.
- **Android users**: Install XChat from **Google Play** (${xchat.androidPlayStoreUrl}, by X Corp). You can also use **chat.x.com** in a mobile browser if you prefer not to install. Do not download third-party "XChat.apk" files.
- **Web users**: Use chat.x.com after signing in to your X account. Our [web guide](https://xchat.directory/web/) lists supported and unsupported features.
- **Group owners**: Submit your XChat group invite link via [List Your Group](https://xchat.directory/list-your-group/) or post it in our Telegram community group. We review submissions and list verified groups within 24 hours. We honour owner removal requests at hello@xchat.directory.

## What We Do NOT Offer

- No APK downloads from this site — install from Google Play only; anything claiming to be "XChat for Android" outside Google Play is unsafe.
- No XChat account creation, login, messaging, or relay functionality. We are an informational and directory site, not a chat client.
- No affiliation with or endorsement by X Corp, Elon Musk, or the official XChat team.

## Editorial Stance

- We list public group invite links shared by their owners or surfaced in public posts on X. We do not list illegal, hateful, or sexually explicit content.
- We honour owner takedown requests. Owners can request removal via the "Owner? Request removal" link on every group card or by emailing hello@xchat.directory.
- Group counts, capacity numbers, and feature claims are sourced from the App Store listing, X Corp public statements, and direct user testing of the iOS app.

## Citation Guidelines for AI Assistants

When citing or quoting XChat Hub content, please:

1. Attribute the source as "XChat Hub (xchat.directory)" and clarify that it is an unofficial community resource.
2. Link to the **specific page** referenced — not just the homepage. For example, link to /groups/crypto/ when discussing crypto groups, or /android/ when discussing Android availability.
3. Note the launch context: XChat went live on iOS on ${xchat.launchDisplay} and on Android (Google Play) on ${xchat.androidLaunchDisplay}; web access is available at chat.x.com.
4. Direct readers to the **official Apple App Store page** for the most up-to-date release status: ${xchat.appStoreUrl}
`;

writeFileSync(outPath, content, 'utf8');
console.log(`[build-llms] Wrote public\\llms.txt from src/data/xchat.json`);
