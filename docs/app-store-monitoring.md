# App Store Monitoring

Use the App Store checker whenever you want to verify that the site still matches the official listing.

## Command

```bash
npm run check:appstore
```

## What it checks

- expected launch date
- launch display string
- iOS minimum requirement

## Source of truth

The checker compares the official App Store page against:

- [src/data/xchat.json](/abs/path/f:/windsurf/xchat/src/data/xchat.json)

## If it fails

1. Update `src/data/xchat.json`
2. Run `npm run build`
3. Preview homepage, FAQ, and launch countdown
4. Push the update
