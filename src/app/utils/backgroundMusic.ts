const MUSIC_SRC = `${import.meta.env.BASE_URL}audio/background.mp4`;
const NORMAL_VOLUME = 0.14;
const DUCK_VOLUME = 0.03;

let audio: HTMLAudioElement | null = null;
let duckCount = 0;
let started = false;

function getAudio() {
  if (!audio) {
    audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = NORMAL_VOLUME;
    audio.preload = 'auto';
  }
  return audio;
}

function applyVolume() {
  const el = getAudio();
  el.volume = duckCount > 0 ? DUCK_VOLUME : NORMAL_VOLUME;
}

/** يخفّض الموسيقى وقت الكلام أو المؤثرات المهمة */
export function duckBackgroundMusic() {
  duckCount += 1;
  applyVolume();
}

export function unduckBackgroundMusic() {
  duckCount = Math.max(0, duckCount - 1);
  applyVolume();
}

export async function startBackgroundMusic() {
  const el = getAudio();
  if (started) return;
  try {
    await el.play();
    started = true;
  } catch {
    /* يحتاج تفاعل من المستخدم */
  }
}

export function stopBackgroundMusic() {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  started = false;
}
