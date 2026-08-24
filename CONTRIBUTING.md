# Contributing

This is a personal tool made public for transparency, not a community project
looking for feature contributions. New sites, settings UI, or other features
are evaluated case by case and may just be declined — that isn't a judgment
on the idea, just scope.

**Selector-fix PRs are always welcome.** Sites change their DOM; when a feed
reappears, a one-line CSS selector fix is a low-risk, high-value PR:

1. Open the matching `.css` file for the site (`facebook.css`, `twitter.css`,
   `youtube.css`, `9gag.css`, `tiktok.css`).
2. Inspect the site in DevTools to find the new feed container.
3. Prefer selectors that survive redesigns: ARIA roles (`div[role="feed"]`),
   stable test ids (`data-e2e`, `data-testid`), or custom element tag names,
   over hashed/generated class names.
4. Confirm search, direct links, profiles, and messages still work — the
   goal is hiding the feed, not the whole site.
5. Note the site and date you verified the fix against in a comment, same
   style as the existing rules.

Bump the `version` in `manifest.json` (patch for a selector fix, minor for a
new site/feature) and add a `CHANGELOG.md` entry with your PR.
