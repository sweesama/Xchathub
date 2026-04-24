# Group Research Workflow

This workflow is for the period before and just after XChat launch, when public group mechanics are still uncertain.

## Stage 1: collect leads

Store unverified sightings in:

- [src/data/group-research.ts](/abs/path/f:/windsurf/xchat/src/data/group-research.ts)

Use the query list in `GROUP_DISCOVERY_QUERIES` to search public channels.

## Stage 2: verify

A lead should only move into the public directory after at least one of these is true:

- the invite URL works
- the owner submitted it directly
- the app flow was manually verified

## Stage 3: publish

Verified groups go into:

- [src/data/groups.ts](/abs/path/f:/windsurf/xchat/src/data/groups.ts)

## Rule of thumb

Leads are research data.

Directory entries are public product data.
