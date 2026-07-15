const $ = (id) => document.getElementById(id);
let state = { phase: "off", phaseEndsAt: 0, focusMin: 50, breakMin: 10 };

function render() {
  const running = state.phase !== "off";
  $("toggle").textContent = running ? "Stop" : "Start";
  $("toggle").classList.toggle("running", running);
  $("phase").textContent = running ? state.phase : "";
  if (!running) {
    $("status").textContent = "–";
    return;
  }
  const left = Math.max(0, state.phaseEndsAt - Date.now());
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  $("status").textContent = `${m}:${String(s).padStart(2, "0")}`;
}

chrome.storage.local.get().then((s) => {
  state = { ...state, ...s };
  $("focus").value = state.focusMin;
  $("break").value = state.breakMin;
  render();
});

chrome.storage.onChanged.addListener((changes) => {
  for (const [k, v] of Object.entries(changes)) state[k] = v.newValue;
  render();
});

setInterval(render, 500);

$("toggle").addEventListener("click", () => {
  if (state.phase !== "off") {
    chrome.runtime.sendMessage({ cmd: "stop" });
  } else {
    chrome.runtime.sendMessage({
      cmd: "start",
      focusMin: Math.max(1, Number($("focus").value) || 50),
      breakMin: Math.max(1, Number($("break").value) || 10),
    });
  }
});
