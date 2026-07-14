/// <reference path="../.astro/types.d.ts" />

/**
 * 全局类型扩展
 *
 * CookieBanner.astro 在 window 上挂了一个 openCookiePreferences() 函数，
 * 用于让 footer "Cookie preferences" 按钮重新打开 consent banner。
 */
declare global {
  interface Window {
    openCookiePreferences?: () => void;
  }
}

export {};/// <reference path="../.astro/types.d.ts" />