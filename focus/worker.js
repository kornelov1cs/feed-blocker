// Focus timer: drives the focus/break loop with chrome.alarms.
// State lives in chrome.storage.local so popup and content scripts stay in sync.
const DEFAULTS = { focusMin: 50, breakMin: 10 };

async function getState() {
  return { phase: "off", phaseEndsAt: 0, ...DEFAULTS, ...(await chrome.storage.local.get()) };
}

async function setPhase(phase, minutes) {
  const phaseEndsAt = Date.now() + minutes * 60_000;
  await chrome.storage.local.set({ phase, phaseEndsAt });
  await chrome.alarms.create("phase-end", { when: phaseEndsAt });
}

async function stop() {
  await chrome.alarms.clear("phase-end");
  await chrome.storage.local.set({ phase: "off", phaseEndsAt: 0 });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.cmd === "start") {
    chrome.storage.local
      .set({ focusMin: msg.focusMin, breakMin: msg.breakMin })
      .then(() => setPhase("focus", msg.focusMin));
  }
  if (msg.cmd === "stop") stop();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "phase-end") return;
  const s = await getState();
  if (s.phase === "focus") await setPhase("break", s.breakMin);
  else if (s.phase === "break") await setPhase("focus", s.focusMin);
  else return;
  await chime();
});

// Chrome's MV3 service workers can't play audio — an offscreen document does it.
// Firefox has no chrome.offscreen API, but its "background.scripts" fallback
// (see manifest.json) runs as a page context with AudioContext, so play directly.
// Unverified on real Firefox — flag if the chime doesn't fire there.
async function chime() {
  if (chrome.offscreen) {
    if (!(await chrome.offscreen.hasDocument())) {
      await chrome.offscreen.createDocument({
        url: "focus/offscreen.html",
        reasons: ["AUDIO_PLAYBACK"],
        justification: "Play the focus/break transition chime",
      });
    }
    chrome.runtime.sendMessage({ cmd: "chime" });
  } else if (typeof AudioContext !== "undefined") {
    playChime();
  }
}

function playChime() {
  const ctx = new AudioContext();
  [880, 1174.66].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime + i * 0.3;
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    osc.start(t);
    osc.stop(t + 1.2);
  });
}

// Browser restart mid-phase: re-arm the alarm, or clear an expired session.
chrome.runtime.onStartup.addListener(async () => {
  const s = await getState();
  if (s.phase === "off") return;
  if (s.phaseEndsAt > Date.now()) chrome.alarms.create("phase-end", { when: s.phaseEndsAt });
  else stop();
});
