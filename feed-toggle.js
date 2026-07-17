// Reflect the feedsOff storage flag onto <html> so the feed-hiding CSS can be paused.
// Attribute absent = feeds hidden (fail closed while storage loads).
const applyFeedsOff = (off) =>
  document.documentElement.toggleAttribute("data-feed-blocker-off", !!off);
chrome.storage.local.get("feedsOff").then((s) => applyFeedsOff(s.feedsOff));
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.feedsOff) applyFeedsOff(changes.feedsOff.newValue);
});
