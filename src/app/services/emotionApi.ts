/**
 * src/app/services/emotionApi.ts
 *
 * Calls the FastAPI /predict endpoint.
 * Falls back to a keyword-based engine if the API is unreachable.
 *
 * Output always matches EmotionApiResult shape so callers don't need
 * to know which path was taken.
 */

export interface EmotionApiResult {
  mood: 'Happy' | 'Sad' | 'Angry' | 'Neutral';
  confidence: number;
  subMood: string | null;
  modelVersion: string;
  fallbackUsed: boolean;
  description: string;
  audioFeatures: { energy: number; valence: number; danceability: number };
}

const API_URL = 'http://localhost:8000';
const API_TIMEOUT_MS = 3000;
const LOW_CONFIDENCE_THRESHOLD = 0.50;

// ── Keyword fallback (mirrors ml/inference.py keyword engine) ─────────────────
const KEYWORD_RULES: Record<string, string[]> = {
  happy: [
    'happy','joy','great','excited','wonderful','love it','amazing','fantastic',
    'excellent','smile','laugh','blessed','thrilled','pumped','glad','cheerful',
    'khush','khushi','bohat khush','bahut khush','maza','mazaa','maja',
    'achha lag raha','accha lag raha',
  ],
  sad: [
    'sad','unhappy','down','depressed','upset','lonely','cry','miss','hurt',
    'lost','grief','heartbroken','sorrow','feeling low','not okay','not ok',
    'broken','udaas','dukhi','rona','bura lag raha','mood off','mood off hai',
    'dil dukhi','toot gaya','dil toot','dard',
  ],
  angry: [
    'angry','mad','furious','annoyed','frustrated','hate','rage','irritated',
    'livid','outraged','fed up','ghussa','ghussa aa raha','gussa','krodh',
    'chidchida','bahut gussa','ghusse mein',
  ],
};

const SUBMOOD_KEYWORDS: Record<string, string[]> = {
  grief:     ['dog died','cat died','pet died','passed away','funeral','lost my','died','death'],
  breakup:   ['broke up','she left','he left','breakup','dil toot','toot gaya','heartbreak','ex','chhod gaya','chhod gayi'],
  low:       ['feeling low','mood off','mood off hai','udaas','down today','not okay','feel empty','kuch nahi karna','maan nahi'],
  anxious:   ['tension','stressed','anxious','nervous','worried','darr','stress ho','pareshan','fikar'],
  excitement:['so excited','can\'t wait','thrilled','pumped','bohat khush','bahut khush'],
  loneliness:['lonely','alone','no one','nobody','akela','akeli','koi nahi'],
};

function detectSubMood(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [sm, kws] of Object.entries(SUBMOOD_KEYWORDS)) {
    if (kws.some(kw => lower.includes(kw))) return sm;
  }
  return null;
}

function keywordPredict(text: string): EmotionApiResult {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = { happy: 0, sad: 0, angry: 0 };
  for (const [mood, kws] of Object.entries(KEYWORD_RULES)) {
    for (const kw of kws) {
      if (lower.includes(kw)) scores[mood]++;
    }
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const rawMood = best[1] > 0 ? best[0] : 'neutral';
  const confidence = best[1] > 0 ? Math.min(0.72, 0.45 + best[1] * 0.08) : 0.40;
  const subMood = detectSubMood(text);
  return buildResult(rawMood, confidence, subMood, 'keyword-fallback-v1', true);
}

const MOOD_DESCRIPTIONS: Record<string, string> = {
  happy:   'You seem to be in a positive and uplifting mood!',
  sad:     'It sounds like you might be feeling a bit down. Music can help.',
  angry:   'You seem to be experiencing some frustration or anger.',
  neutral: 'Your mood seems balanced and calm.',
};

const AUDIO_FEATURES: Record<string, { energy: number; valence: number; danceability: number }> = {
  happy:   { energy: 0.75, valence: 0.85, danceability: 0.75 },
  sad:     { energy: 0.30, valence: 0.20, danceability: 0.25 },
  angry:   { energy: 0.90, valence: 0.30, danceability: 0.55 },
  neutral: { energy: 0.45, valence: 0.50, danceability: 0.45 },
};

function capitalize(s: string): 'Happy' | 'Sad' | 'Angry' | 'Neutral' {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as 'Happy' | 'Sad' | 'Angry' | 'Neutral';
}

function buildResult(
  rawMood: string,
  confidence: number,
  subMood: string | null,
  modelVersion: string,
  fallbackUsed: boolean,
): EmotionApiResult {
  // If confidence is below threshold, widen to neutral
  const effectiveMood = confidence < LOW_CONFIDENCE_THRESHOLD ? 'neutral' : rawMood;
  return {
    mood: capitalize(effectiveMood),
    confidence,
    subMood,
    modelVersion,
    fallbackUsed,
    description: MOOD_DESCRIPTIONS[effectiveMood] || MOOD_DESCRIPTIONS.neutral,
    audioFeatures: AUDIO_FEATURES[effectiveMood] || AUDIO_FEATURES.neutral,
  };
}

// ── Main exported function ────────────────────────────────────────────────────
export async function analyzeEmotion(text: string): Promise<EmotionApiResult> {
  // Simulate slight network delay for UX
  await new Promise(r => setTimeout(r, 800));

  // Try FastAPI
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    const res = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      const subMood = data.subMood ?? detectSubMood(text);
      return buildResult(data.mood, data.confidence, subMood, data.modelVersion, false);
    }
  } catch {
    // API unreachable — use fallback silently
  }

  return keywordPredict(text);
}
