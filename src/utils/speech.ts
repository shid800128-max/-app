import * as Speech from 'expo-speech';

/**
 * Centralised text-to-speech that picks the most natural-sounding Chinese voice
 * available on the device (preferring "Enhanced" quality voices such as iOS
 * 美佳/婷婷), so pronunciation sounds less robotic than the default compact voice.
 *
 * On iPhone, install an enhanced voice for the best result:
 *   設定 → 輔助使用 → 朗讀內容 → 語音 → 中文 → 下載「美佳（增強版）」
 * The app then picks it up automatically.
 */

// undefined = not resolved yet, null = resolved but none found (use language only)
let cachedVoiceId: string | null | undefined = undefined;
let resolving: Promise<string | null> | null = null;

// Voices that tend to sound natural for Mandarin (zh-TW / zh-CN).
const PREFERRED_NAME_HINTS = ['美佳', 'meijia', '婷婷', 'tingting', 'sinji', 'yu-shu', 'yushu', 'mei-jia'];

function isChinese(lang: string): boolean {
  return /^zh/i.test(lang);
}

function scoreVoice(v: Speech.Voice): number {
  let score = 0;
  const lang = (v.language || '').toLowerCase();
  const name = (v.name || '').toLowerCase();

  // Taiwanese Mandarin first, then any Chinese.
  if (lang.startsWith('zh-tw') || lang.includes('hant')) score += 100;
  else if (lang.startsWith('zh')) score += 40;

  // Enhanced/premium voices sound far more human than the default compact ones.
  if (v.quality === Speech.VoiceQuality.Enhanced) score += 50;

  // Known natural-sounding voice names.
  if (PREFERRED_NAME_HINTS.some((h) => name.includes(h))) score += 30;

  return score;
}

async function fetchVoicesWithRetry(maxAttempts = 4): Promise<Speech.Voice[]> {
  // On web, the voice list can be empty until the engine finishes loading.
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      if (voices && voices.length > 0) return voices;
    } catch {
      // ignore and retry
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  return [];
}

async function resolveBestVoice(): Promise<string | null> {
  if (cachedVoiceId !== undefined) return cachedVoiceId;
  if (resolving) return resolving;

  resolving = (async () => {
    const voices = await fetchVoicesWithRetry();
    const chinese = voices.filter((v) => isChinese(v.language || ''));
    if (chinese.length === 0) {
      cachedVoiceId = null;
      return cachedVoiceId;
    }
    chinese.sort((a, b) => scoreVoice(b) - scoreVoice(a));
    cachedVoiceId = chinese[0].identifier ?? null;
    return cachedVoiceId;
  })();

  const result = await resolving;
  resolving = null;
  return result;
}

/** Preload the voice list once at app start so the first tap speaks instantly. */
export function prewarmVoices(): void {
  resolveBestVoice().catch(() => {});
}

type SpeakOptions = { rate?: number; pitch?: number };

/**
 * Speak Chinese text using the best available voice.
 * Slower rate + slightly higher pitch reads clearer and friendlier for young children.
 */
export async function speak(text: string, { rate = 0.5, pitch = 1.1 }: SpeakOptions = {}): Promise<void> {
  const voice = await resolveBestVoice();
  Speech.speak(text, {
    language: 'zh-TW',
    ...(voice ? { voice } : {}),
    rate,
    pitch,
  });
}
