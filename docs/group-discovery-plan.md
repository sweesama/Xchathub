# Group Discovery Plan

XChat is still pre-launch, so there is no verified public group index yet. This document defines how to discover groups once invite links or share mechanisms start appearing.

## Working assumptions

- XChat may launch without a public in-app group search.
- Invite links may be the first discoverable group artifact.
- Discovery will likely be off-platform before it is on-platform.

## Discovery channels to watch

1. Public posts on X
   Search for phrases like `XChat invite`, `join my XChat group`, `XChat group`, and category-specific variants.

2. Owner submissions
   Use Telegram community and `/list-your-group` as the first intake path.

3. Screenshots and launch tutorials
   Watch for screenshots or videos showing:
   - invite buttons
   - deep links
   - QR codes
   - group share flows

4. Manual post-launch app review
   Verify whether the app supports:
   - public group search
   - invite links
   - QR join flow
   - owner approval flow
   - web deep links

## Verification rule

Do not publish a group unless at least one of these is true:

- The invite link works
- The group owner submitted it directly
- The link was confirmed manually in-app after launch

## Data entry point

Real groups should be added to:

- [src/data/groups.ts](/abs/path/f:/windsurf/xchat/src/data/groups.ts)

Each entry should include:

- stable slug
- category
- tags
- invite URL
- source type
- optional verification date

## First launch-day workflow

1. Search X for public invite/link patterns
2. Ask Telegram community for first submissions
3. Test invite behavior manually
4. Add only verified groups to `GROUP_DIRECTORY`
5. Rebuild and publish
