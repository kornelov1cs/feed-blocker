// Two-note chime via Web Audio — no bundled sound file needed.
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.cmd !== "chime") return;
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
});
