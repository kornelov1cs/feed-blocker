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

// MV3 service workers can't play audio — an offscreen document does it.
async function chime() {
  if (!(await chrome.offscreen.hasDocument())) {
    await chrome.offscreen.createDocument({
      url: "focus/offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play the focus/break transition chime",
    });
  }
  chrome.runtime.sendMessage({ cmd: "chime" });
}

// Browser restart mid-phase: re-arm the alarm, or clear an expired session.
chrome.runtime.onStartup.addListener(async () => {
  const s = await getState();
  if (s.phase === "off") return;
  if (s.phaseEndsAt > Date.now()) chrome.alarms.create("phase-end", { when: s.phaseEndsAt });
  else stop();
});
