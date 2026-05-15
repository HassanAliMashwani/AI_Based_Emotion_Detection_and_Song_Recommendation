/**
 * src/app/services/mockApi.ts
 *
 * Song recommendation engine using the structured catalog.
 *
 * Catalog is imported at build time from data/song_catalog.json.
 * In Vite, JSON imports work out-of-the-box.
 *
 * Key features:
 *  - Language filter: bollywood | hollywood | both
 *  - Genre filter: specific genre or 'all'
 *  - Diversity window: last N song IDs are excluded from recommendations
 *  - Randomized selection within the filtered set
 *  - Falls back to neutral songs if no match found
 */

// Re-export EmotionApiResult from the real emotion module
export type { EmotionApiResult as EmotionAnalysisResult } from './emotionApi';
export { analyzeEmotion } from './emotionApi';

// ── Song schema ───────────────────────────────────────────────────────────────
export interface Song {
  id: string;
  title: string;
  artist: string;
  language: 'bollywood' | 'hollywood';
  genre: string;
  mood: string;
  subMood?: string;
  year?: number;
  albumArt?: string;
  link?: string;
}

// SpotifyTrack is the shape the UI currently consumes — we extend it
export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
  language: 'bollywood' | 'hollywood';
  genre: string;
  subMood?: string;
  previewUrl?: string;
}

export type LanguageFilter = 'both' | 'bollywood' | 'hollywood';
export type GenreFilter = string | 'all';

// ── Catalog (imported from JSON) ──────────────────────────────────────────────
// Vite handles JSON imports natively.
import rawCatalog from '../../../data/song_catalog.json';
const CATALOG: Song[] = rawCatalog as Song[];

// ── Diversity window ──────────────────────────────────────────────────────────
const DIVERSITY_WINDOW = 10;
let _recentlyPlayed: string[] = [];

function recordPlayed(ids: string[]) {
  _recentlyPlayed = [..._recentlyPlayed, ...ids].slice(-DIVERSITY_WINDOW);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Main recommendation function ──────────────────────────────────────────────
export async function getSpotifyRecommendations(
  mood: string,
  language: LanguageFilter = 'both',
  genre: GenreFilter = 'all',
  n = 6,
): Promise<SpotifyTrack[]> {
  await new Promise(r => setTimeout(r, 400));

  const moodLower = mood.toLowerCase();

  let pool = CATALOG.filter(s => s.mood === moodLower);

  // Language filter
  if (language !== 'both') {
    pool = pool.filter(s => s.language === language);
  }

  // Genre filter
  if (genre !== 'all') {
    pool = pool.filter(s => s.genre === genre);
  }

  // Exclude recently played
  let filtered = pool.filter(s => !_recentlyPlayed.includes(s.id));
  if (filtered.length < 2) {
    // Reset diversity if too few songs remain
    filtered = pool;
    _recentlyPlayed = [];
  }

  // Fallback to neutral if still empty
  if (filtered.length === 0) {
    filtered = CATALOG.filter(s => s.mood === 'neutral');
  }

  const selected = shuffle(filtered).slice(0, n);
  recordPlayed(selected.map(s => s.id));

  return selected.map(s => ({
    id: s.id,
    name: s.title,
    artist: s.artist,
    albumArt: s.albumArt ?? `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop`,
    language: s.language,
    genre: s.genre,
    subMood: s.subMood,
  }));
}

// ── Available genres helper ───────────────────────────────────────────────────
export function getAvailableGenres(mood: string, language: LanguageFilter = 'both'): string[] {
  const moodLower = mood.toLowerCase();
  let pool = CATALOG.filter(s => s.mood === moodLower);
  if (language !== 'both') pool = pool.filter(s => s.language === language);
  return [...new Set(pool.map(s => s.genre))].sort();
}
