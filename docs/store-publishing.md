# Store publishing (not currently pursued)

Feed Blocker is install-from-source only (see README). This doc exists so
the steps are ready if that changes — see [ROADMAP.md](../ROADMAP.md).

## Chrome Web Store

1. Create a [Chrome Web Store developer account](https://chrome.google.com/webstore/devconsole) — **one-time $5 registration fee**.
2. Zip the repo (excluding `.git`, `docs/`, `scripts/`, and other non-shipped files — the manifest's own directory is the package root).
3. In the dashboard: new item → upload zip.
4. Fill in the listing: description, category, 128×128 icon (already in `icons/128.png`), at least one screenshot (1280×800 or 640×400).
5. **Privacy practices tab** — this is the part that gets rejected if skipped: justify each permission (`storage`, `alarms`, `offscreen`) and declare no data is collected/sold. Given the broad `matches` list across several social sites, expect closer review than a single-site extension.
6. Submit for review — typically hours to a few days, longer for permission-heavy submissions.
7. Every version bump needs a re-upload and (usually) a fresh review pass.

## Edge Add-ons

1. [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge) account — free, no fee.
2. Same package as Chrome (Edge is Chromium, same manifest works unmodified).
3. Reuses most of the Chrome listing assets (icon, screenshots, description).
4. Review is usually faster than Chrome's.

## Firefox AMO (addons.mozilla.org)

1. Free [Mozilla Add-on Developer account](https://addons.mozilla.org/developers/).
2. Install `web-ext` (`npm install -g web-ext`) to lint and package: `web-ext lint`, `web-ext build`.
3. Manifest needs `browser_specific_settings.gecko.id` (already set — `feed-blocker@kornelovics`).
4. **Verify the Firefox chime fallback works first** (see ROADMAP) — AMO reviewers will file it as a bug if a declared feature silently fails.
5. Submit via the developer hub; AMO does automated + sometimes manual review before signing.
6. Signed builds can be self-distributed (no store listing needed) or listed publicly on AMO.

## Common rejection risk across all three

The `matches` list spans facebook/twitter/x/youtube/reddit/instagram/tiktok/9gag
domains. Broad host permissions on well-known social platforms tend to draw
more reviewer scrutiny than a narrow single-site extension — the privacy
disclosure needs to clearly state the extension only hides DOM elements
client-side and makes no network calls of its own.
