import { DEFAULT_QUIZ_SETTINGS } from '../App';
import { duckBackgroundMusic, unduckBackgroundMusic } from './backgroundMusic';

const audioBase = `${import.meta.env.BASE_URL}audio/`;

let currentAudio: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;
const ttsCache = new Map<string, string>();

function clearPlayback() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  currentObjectUrl = null;
}

async function playSrc(src: string) {
  duckBackgroundMusic();
  try {
    clearPlayback();
    const audio = new Audio(src);
    currentAudio = audio;
    await new Promise<void>((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('speech playback failed'));
      void audio.play().catch(reject);
    });
  } finally {
    unduckBackgroundMusic();
  }
}

function isDefaultMessage(text: string, type: 'welcome' | 'ready') {
  const trimmed = text.trim();
  if (type === 'welcome') return trimmed === DEFAULT_QUIZ_SETTINGS.welcomeMessage;
  return trimmed === DEFAULT_QUIZ_SETTINGS.readyMessage;
}

async function fetchDynamicTTS(text: string): Promise<string | null> {
  const cached = ttsCache.get(text);
  if (cached) return cached;

  try {
    const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
    if (!res.ok) return null;
    const blob = await res.blob();
    if (blob.size < 100) return null;
    const url = URL.createObjectURL(blob);
    ttsCache.set(text, url);
    return url;
  } catch {
    return null;
  }
}

function bundledSrc(type: 'welcome' | 'ready') {
  return `${audioBase}${type === 'welcome' ? 'welcome' : 'ready'}.mp3`;
}

/** تفعيل الصوت — اضغطي أي زر مرة واحدة */
export function unlockIntroAudio() {
  const audio = new Audio(bundledSrc('welcome'));
  audio.volume = 0.01;
  void audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
  }).catch(() => {});
}

/** صوت بنت — يقرأ النص اللي تكتبينه */
export async function playIntroSpeech(text: string, type: 'welcome' | 'ready') {
  const trimmed = text.trim();
  if (!trimmed) return;

  stopIntroSpeech();

  if (isDefaultMessage(trimmed, type)) {
    try {
      await playSrc(bundledSrc(type));
      return;
    } catch {
      /* يكمل للتوليد الديناميكي */
    }
  }

  const dynamicUrl = await fetchDynamicTTS(trimmed);
  if (dynamicUrl) {
    try {
      await playSrc(dynamicUrl);
    } catch {
      /* لا صوت */
    }
  }
}

export function stopIntroSpeech() {
  clearPlayback();
}
