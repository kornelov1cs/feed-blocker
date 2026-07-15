// Hard-blocks this site while a focus phase is running.
// ponytail: DOM overlay, not network blocking — the page starts loading but is
// stopped and replaced before it's visible. declarativeNetRequest if that ever bothers you.
(() => {
  if (location.hostname === "music.youtube.com") return; // focus music allowed

  let ticker = null;

  function block(phaseEndsAt) {
    window.stop();
    const ends = new Date(phaseEndsAt);
    const hhmm = `${String(ends.getHours()).padStart(2, "0")}:${String(ends.getMinutes()).padStart(2, "0")}`;
    document.documentElement.innerHTML = `
      <head><title>Focus</title></head>
      <body style="margin:0;height:100vh;display:flex;flex-direction:column;justify-content:center;
                   align-items:center;background:#111;color:#eee;font-family:system-ui,sans-serif">
        <div style="font-size:5rem;font-weight:700" id="fb-countdown"></div>
        <div style="font-size:1.2rem;color:#888;margin-top:1rem">Focus until ${hhmm}</div>
      </body>`;
    clearInterval(ticker);
    ticker = setInterval(() => {
      const left = phaseEndsAt - Date.now();
      if (left <= 0) return; // worker flips phase; storage listener reloads us
      const m = Math.floor(left / 60000);
      const s = Math.floor((left % 60000) / 1000);
      const el = document.getElementById("fb-countdown");
      if (el) el.textContent = `${m}:${String(s).padStart(2, "0")}`;
    }, 250);
  }

  chrome.storage.local.get(["phase", "phaseEndsAt"]).then((s) => {
    if (s.phase === "focus" && s.phaseEndsAt > Date.now()) block(s.phaseEndsAt);
  });

  // React to phase flips while the tab is open.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.phase) return;
    const phase = changes.phase.newValue;
    if (phase === "focus") {
      chrome.storage.local.get("phaseEndsAt").then((s) => block(s.phaseEndsAt));
    } else if (ticker !== null) {
      location.reload(); // break/stop: restore the real page
    }
  });
})();
