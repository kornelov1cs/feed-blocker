# Feed Blocker

Hides Facebook, Twitter/X, YouTube, 9GAG and TikTok feeds so you can do
focused work while search, direct links, profiles and messages keep working.
No account tracking, minimal permissions (`storage`, `alarms`, `offscreen` —
all local, see [below](#permissions)), pure CSS content scripts for feed
hiding (plus a few lines of JS for path detection and a toggle).

A separate focus timer can also hard-block a wider list of distracting sites
entirely for a set number of minutes.

This is a personal tool, released publicly so anyone can read the code,
verify what it does, and use or fork it. It isn't run as a community project
with a roadmap — see [ROADMAP.md](ROADMAP.md) for what's planned and why.

## Install

### Chrome / Brave / Edge (Chromium)

1. Download or clone this repo.
2. Open `brave://extensions` (or `chrome://extensions`, `edge://extensions`).
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select this folder.

### Firefox

Firefox support is newer and less exercised than Chromium — see
[ROADMAP.md](ROADMAP.md) for known gaps (the focus-timer chime in
particular).

1. Download or clone this repo.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on** and select `manifest.json`.
4. Note: temporary add-ons are removed when Firefox restarts — reload them
   the same way after a restart.

To temporarily allow feeds, click the extension icon and untick **Hide feeds**
— it applies instantly to open tabs. Tick it again to hide feeds. (The focus
timer's hard block is separate and unaffected.)

## Focus timer

Click the extension icon → set focus/break minutes (default 50/10) → **Start**.
During a focus phase the sites listed in `manifest.json` (first `content_scripts`
entry) are fully blocked with a countdown screen; `music.youtube.com` stays
allowed for focus music. A chime plays at each transition, breaks lift the
block, and the loop repeats until you hit **Stop**. To change the blocked
sites, edit the `matches` list in `manifest.json` and reload the extension.

## If a feed reappears

The site changed a selector. Open the matching `.css` file, fix the selector
(DevTools → inspect the feed container), then hit the reload icon on
`brave://extensions`. Selector fixes are welcome as PRs — see
[CONTRIBUTING.md](CONTRIBUTING.md).

## Permissions

- `storage` — remember the focus-timer state and the feed-hiding toggle, locally only.
- `alarms` — schedule the focus/break phase transitions.
- `offscreen` — play the phase-transition chime from the background service worker (Chromium only; Firefox uses a direct fallback, see [ROADMAP.md](ROADMAP.md)).

No network requests, no analytics, no remote code.

## License

[MIT](LICENSE)
