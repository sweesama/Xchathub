# Launch Change Checklist

Use this checklist whenever XChat launch details change, the app goes live, or Android news drops.

## If launch date changes again

1. Update [src/data/xchat.json](/abs/path/f:/windsurf/xchat/src/data/xchat.json)
2. Run `npm run build`
3. Verify these pages:
   [src/pages/index.astro](/abs/path/f:/windsurf/xchat/src/pages/index.astro)
   [src/pages/faq.astro](/abs/path/f:/windsurf/xchat/src/pages/faq.astro)
   [src/pages/launch-countdown.astro](/abs/path/f:/windsurf/xchat/src/pages/launch-countdown.astro)
   [src/pages/groups.astro](/abs/path/f:/windsurf/xchat/src/pages/groups.astro)
4. Check generated [public/llms.txt](/abs/path/f:/windsurf/xchat/public/llms.txt)
5. Check launch banner text in [src/components/Header.astro](/abs/path/f:/windsurf/xchat/src/components/Header.astro)
6. Sanity-check OG tags and `WebSite` schema in [src/layouts/Layout.astro](/abs/path/f:/windsurf/xchat/src/layouts/Layout.astro)

## If the app actually launches

1. Confirm the App Store page no longer says `Expected`
2. Update launch-sensitive hero copy on:
   [src/pages/index.astro](/abs/path/f:/windsurf/xchat/src/pages/index.astro)
   [src/pages/launch-countdown.astro](/abs/path/f:/windsurf/xchat/src/pages/launch-countdown.astro)
   [src/pages/faq.astro](/abs/path/f:/windsurf/xchat/src/pages/faq.astro)
3. Revisit any wording like:
   `currently listed to launch`
   `should auto-install`
   `if the listing does not move again`
4. If real group links exist, populate the data source for `/groups`
5. Rebuild and preview

## If Android is announced

1. Update [src/data/xchat.json](/abs/path/f:/windsurf/xchat/src/data/xchat.json)
2. Update Android-specific copy on:
   [src/pages/index.astro](/abs/path/f:/windsurf/xchat/src/pages/index.astro)
   [src/pages/faq.astro](/abs/path/f:/windsurf/xchat/src/pages/faq.astro)
   [src/pages/vs/whatsapp.astro](/abs/path/f:/windsurf/xchat/src/pages/vs/whatsapp.astro)
   [src/pages/vs/signal.astro](/abs/path/f:/windsurf/xchat/src/pages/vs/signal.astro)
   [src/pages/vs/telegram.astro](/abs/path/f:/windsurf/xchat/src/pages/vs/telegram.astro)
3. Update CTA strategy if Android users no longer need Telegram-only notification flow
4. Rebuild and verify

## Before deploy

1. Run `npm run build`
2. Check `dist` output builds cleanly
3. Open homepage, FAQ, launch countdown, and groups page
4. Confirm `public/llms.txt` and `public/og-image.png` are fresh
