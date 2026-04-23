import data from './xchat.json';

export const XCHAT_APP_STORE_URL = data.appStoreUrl;
export const XCHAT_TELEGRAM_CHANNEL_URL = data.telegramChannelUrl;
export const XCHAT_TELEGRAM_COMMUNITY_URL = data.telegramCommunityUrl;
export const XCHAT_LAUNCH_ISO = data.launchIso;
export const XCHAT_LAUNCH_DATE = data.launchDate;
export const XCHAT_LAUNCH_DISPLAY = data.launchDisplay;
export const XCHAT_LAUNCH_SHORT_DISPLAY = data.launchShortDisplay;
export const XCHAT_LAUNCH_EXPECTED_LABEL = `Expected ${XCHAT_LAUNCH_DISPLAY}`;
export const XCHAT_LAUNCH_STATUS_COPY = `currently listed to launch ${XCHAT_LAUNCH_DISPLAY}`;
export const XCHAT_LAUNCH_COUNTDOWN_COPY = `currently listed to drop globally at 00:00 UTC on ${XCHAT_LAUNCH_DISPLAY}`;
export const XCHAT_IOS_REQUIREMENT = data.iosRequirement;
export const XCHAT_ANDROID_STATUS = data.androidStatus;
export const XCHAT_GROUP_LIMIT = data.groupLimit;
