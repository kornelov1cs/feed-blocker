# Feed Blocker

Hides Facebook, Twitter/X and YouTube feeds so you can do focused work while
search, direct links, profiles and messages keep working. No permissions, no
background worker, no UI — pure CSS content scripts (plus 3 lines of JS for
Twitter path detection).

## Install (Brave / Chrome)

1. Open `brave://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select this folder

To temporarily allow feeds, toggle the extension off on the same page.

## If a feed reappears

The site changed a selector. Open the matching `.css` file, fix the selector
(DevTools → inspect the feed container), then hit the reload icon on
`brave://extensions`.
