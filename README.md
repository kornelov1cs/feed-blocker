# Feed Blocker

Hides Facebook, Twitter/X and YouTube feeds so you can do focused work while
search, direct links, profiles and messages keep working. No permissions, no
background worker, no UI — pure CSS content scripts (plus 3 lines of JS for
Twitter path detection).

## Install (Brave / Chrome)

1. Open `brave://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select this folder

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
`brave://extensions`.
