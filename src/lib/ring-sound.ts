const STORAGE_KEY = "flash:ring-sound";

/** Opt-in demo ringtone — never autoplays with sound unless user enabled it. */
export function readRingSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeRingSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    // ignore quota / private mode
  }
}

/** Short synthetic ring via Web Audio — no asset file required. */
export async function playDemoRingtone(): Promise<void> {
  if (typeof window === "undefined") return;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  try {
    if (ctx.state === "suspended") await ctx.resume();
    const now = ctx.currentTime;
    const tones = [880, 1174.7]; // A5 + D6-ish chirp
    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t0 = now + i * 0.12;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.08, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.2);
    });
    window.setTimeout(() => void ctx.close(), 600);
  } catch {
    void ctx.close();
  }
}
