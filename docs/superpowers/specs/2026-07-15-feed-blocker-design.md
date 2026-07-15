# Feed Blocker — Design

**Date:** 2026-07-15
**Goal:** Brave (Chromium MV3) extension that hides distracting feeds so specific-intent browsing still works.

## Scope

| Site | Hidden | Still works |
|------|--------|-------------|
| facebook.com | News feed (all `role="feed"` lists), Stories rail | Messages, notifications, search, events |
| twitter.com / x.com | Home timeline on `/home` only | Profiles, DMs, notifications, search, single tweets |
| youtube.com | Home recommendation grid, related-videos sidebar, Shorts shelves + nav entries | Search, subscriptions, direct video links, playlists |

Always-on: no toggle, no popup, no options page. Disable via `brave://extensions` when needed.

## Architecture

CSS-only content scripts, MV3, zero permissions, no background worker.

- `manifest.json` — three `content_scripts` entries, `run_at: document_start`.
- `facebook.css` — `div[role="feed"]` hidden globally (language-independent; also hides group/profile feeds — acceptable for focus).
- `twitter.css` + `twitter.js` — CSS can't match URLs and Twitter's `aria-label`s are localized, so a 3-line JS mirrors `location.pathname` onto `<html data-path>`; CSS hides the timeline only when `data-path="/home"`.
- `youtube.css` — scoped via `ytd-browse[page-subtype="home"]` and YouTube's custom element tags (language-independent).

## Error handling

None. Failure mode is a selector rotting → feed reappears → edit one CSS line and reload extension.

## Testing

Manual: load unpacked, visit each site, confirm feed gone and non-feed surfaces work.

## Rejected alternatives

- JS + MutationObserver hiding: more code, no added robustness for these sites.
- declarativeNetRequest domain blocking: blocks whole sites; user needs search/videos/profiles.
- Toggle/schedule UI: not requested (YAGNI).
