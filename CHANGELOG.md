# Changelog

## 1.3.0 — 2026-08-24

OSS-prep release.

- Added `LICENSE` (MIT), `.gitignore`, `CONTRIBUTING.md`, `ROADMAP.md`, `docs/store-publishing.md`.
- Added an extension icon (`icons/16.png`, `48.png`, `128.png`), wired into `manifest.json`.
- Added `9gag.css` and `tiktok.css` (feed-hiding for the home feed only), verified against the logged-out homepage.
- Added Firefox support: `browser_specific_settings.gecko.id`, a `background.scripts` fallback alongside `background.service_worker`, and a direct `AudioContext` fallback in `focus/worker.js` for the phase-transition chime since Firefox has no `chrome.offscreen` API. Unverified on real Firefox — see ROADMAP.
- README rewritten for a public audience (Firefox install steps, permissions rationale, contributing pointer).
- No feed-hiding CSS yet for Reddit or Instagram — both wall their home feed behind a login screen for logged-out/automated inspection. See ROADMAP.

## 1.2.0 and earlier

Predates this changelog — see git history and `docs/superpowers/specs/2026-07-15-feed-blocker-design.md`.
