# Roadmap

This is a personal tool made public for transparency (see README). The items
below are things that are planned or intentionally left undone — not an open
invitation for feature requests, though selector-fix PRs are always welcome
(see [CONTRIBUTING.md](CONTRIBUTING.md)).

## Known gaps

- **Reddit and Instagram have no feed-hiding CSS.** They're in the focus
  timer's hard-block list (`manifest.json`, first `content_scripts` entry),
  but there's no `reddit.css` / `instagram.css` — outside a focus session
  their feeds show normally. Both sites wall off their logged-out home feed
  behind a login screen, so the selectors can't be captured without signing
  in with a real account inside DevTools. Whoever adds this needs to do that
  inspection themselves — see [CONTRIBUTING.md](CONTRIBUTING.md) for the
  selector-stability guidance.
- **9GAG and TikTok got feed-hiding CSS on 2026-08-24**, verified against the
  logged-out homepage (`9gag.css`: `section#list-view-2`; `tiktok.css`:
  `article[data-e2e="recommend-list-item-container"]`, confirmed to not
  match on profile pages). Re-verify periodically like the other sites.
- **Firefox support is unverified.** `manifest.json` now declares both
  `background.service_worker` (Chromium) and `background.scripts` (Firefox,
  which doesn't implement `chrome.offscreen`), and `focus/worker.js` falls
  back to playing the chime directly via `AudioContext` when
  `chrome.offscreen` isn't available. This has not been tested in an actual
  Firefox install — if the chime doesn't fire on Firefox, that fallback path
  is the first place to look.

## Store listings

Not planned for now — install is "clone/download + load unpacked" only. The
steps to list on Chrome Web Store, Edge Add-ons, and Firefox AMO if that
changes are written up in [docs/store-publishing.md](docs/store-publishing.md).

## Process

- Feature requests beyond the above are evaluated case by case, watching for
  permission creep (a new API often means a new manifest permission, which
  means re-justifying it in any future store listing).
- Versioning: semver bump in `manifest.json` + `git tag vX.Y.Z` +
  `CHANGELOG.md` entry per merge.
