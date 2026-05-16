import { duckBackgroundMusic, unduckBackgroundMusic } from './backgroundMusic';

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

export function warmUpAudio() {
  getContext();
}

function withMusicDuck(run: () => void, durationMs: number) {
  duckBackgroundMusic();
  run();
  window.setTimeout(() => unduckBackgroundMusic(), durationMs);
}

let tickTockHigh = true;

/** تيك توك — مع كل ثانية في العدّاد */
export function playTickTockSound(urgent = false) {
  const ctx = getContext();
  const now = ctx.currentTime;
  const duration = urgent ? 0.07 : 0.05;
  const volume = urgent ? 0.24 : 0.15;

  tickTockHigh = !tickTockHigh;
  const freq = tickTockHigh
    ? urgent
      ? 1200
      : 900
    : urgent
      ? 480
      : 620;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);

  const click = ctx.createOscillator();
  const clickGain = ctx.createGain();
  click.type = 'triangle';
  click.frequency.value = tickTockHigh ? 180 : 120;
  clickGain.gain.setValueAtTime(urgent ? 0.1 : 0.06, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  click.connect(clickGain);
  clickGain.connect(ctx.destination);
  click.start(now);
  click.stop(now + 0.04);
}

export function resetTickTock() {
  tickTockHigh = true;
}

/** صوت "أوووو" حزين — خطأ أو انتهاء الوقت */
export function playSadSound() {
  withMusicDuck(() => {
  const ctx = getContext();
  const now = ctx.currentTime;
  const duration = 1.35;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(155, now + duration);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.38, now + 0.06);
  gain.gain.linearRampToValueAtTime(0.3, now + duration * 0.7);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(200, now + 0.1);
  osc2.frequency.exponentialRampToValueAtTime(90, now + duration);
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.12, now + 0.1);
  gain2.gain.linearRampToValueAtTime(0, now + duration);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + duration);
  }, 1500);
}

/** صوت فرح — إجابة صحيحة */
export function playHappySound() {
  withMusicDuck(() => {
  const ctx = getContext();
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((freq, i) => {
    const start = now + i * 0.1;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.28, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.32);
  });
  }, 900);
}
