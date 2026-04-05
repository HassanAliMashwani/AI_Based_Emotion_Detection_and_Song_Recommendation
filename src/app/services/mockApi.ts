// Mock API service for emotion analysis and Spotify recommendations

export interface EmotionAnalysisResult {
  emotion: 'Happy' | 'Sad' | 'Angry' | 'Neutral';
  confidence: number;
  description: string;
  audioFeatures: {
    energy: number;
    valence: number;
    danceability: number;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
  previewUrl?: string;
}

// Mock emotion analysis using keyword matching
export async function analyzeEmotion(text: string): Promise<EmotionAnalysisResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerText = text.toLowerCase();

  // Simple keyword-based emotion detection
  const happyWords = ['happy', 'joy', 'great', 'excited', 'wonderful', 'love', 'amazing', 'good', 'fantastic', 'excellent'];
  const sadWords = ['sad', 'down', 'depressed', 'upset', 'lonely', 'cry', 'unhappy', 'miss', 'hurt', 'lost'];
  const angryWords = ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'hate', 'rage', 'irritated'];

  let happyScore = 0;
  let sadScore = 0;
  let angryScore = 0;

  happyWords.forEach((word) => {
    if (lowerText.includes(word)) happyScore++;
  });

  sadWords.forEach((word) => {
    if (lowerText.includes(word)) sadScore++;
  });

  angryWords.forEach((word) => {
    if (lowerText.includes(word)) angryScore++;
  });

  const maxScore = Math.max(happyScore, sadScore, angryScore);

  let emotion: EmotionAnalysisResult['emotion'] = 'Neutral';
  let confidence = 0.6;
  let description = 'Your mood seems balanced and calm.';
  let audioFeatures = { energy: 0.5, valence: 0.5, danceability: 0.5 };

  if (maxScore > 0) {
    confidence = Math.min(0.95, 0.6 + maxScore * 0.1);

    if (happyScore === maxScore) {
      emotion = 'Happy';
      description = 'You seem to be in a positive and uplifting mood!';
      audioFeatures = { energy: 0.7, valence: 0.8, danceability: 0.7 };
    } else if (sadScore === maxScore) {
      emotion = 'Sad';
      description = 'It sounds like you might be feeling a bit down.';
      audioFeatures = { energy: 0.3, valence: 0.2, danceability: 0.3 };
    } else if (angryScore === maxScore) {
      emotion = 'Angry';
      description = 'You seem to be experiencing some frustration or anger.';
      audioFeatures = { energy: 0.9, valence: 0.3, danceability: 0.6 };
    }
  }

  return {
    emotion,
    confidence,
    description,
    audioFeatures,
  };
}

// Mock Spotify recommendations based on mood
export async function getSpotifyRecommendations(
  emotion: EmotionAnalysisResult['emotion']
): Promise<SpotifyTrack[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock track data based on emotion
  const tracksByMood: Record<string, SpotifyTrack[]> = {
    Happy: [
      {
        id: '1',
        name: 'Happy',
        artist: 'Pharrell Williams',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      },
      {
        id: '2',
        name: 'Walking on Sunshine',
        artist: 'Katrina and the Waves',
        albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
      },
      {
        id: '3',
        name: 'Good Vibrations',
        artist: 'The Beach Boys',
        albumArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
      },
      {
        id: '4',
        name: "Don't Stop Me Now",
        artist: 'Queen',
        albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
      },
    ],
    Sad: [
      {
        id: '5',
        name: 'Someone Like You',
        artist: 'Adele',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
      },
      {
        id: '6',
        name: 'The Night We Met',
        artist: 'Lord Huron',
        albumArt: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop',
      },
      {
        id: '7',
        name: 'Fix You',
        artist: 'Coldplay',
        albumArt: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400&h=400&fit=crop',
      },
      {
        id: '8',
        name: 'Hurt',
        artist: 'Johnny Cash',
        albumArt: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400&h=400&fit=crop',
      },
    ],
    Angry: [
      {
        id: '9',
        name: 'Break Stuff',
        artist: 'Limp Bizkit',
        albumArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
      },
      {
        id: '10',
        name: 'In The End',
        artist: 'Linkin Park',
        albumArt: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop',
      },
      {
        id: '11',
        name: 'Killing In The Name',
        artist: 'Rage Against The Machine',
        albumArt: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop',
      },
      {
        id: '12',
        name: 'Smells Like Teen Spirit',
        artist: 'Nirvana',
        albumArt: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop',
      },
    ],
    Neutral: [
      {
        id: '13',
        name: 'Weightless',
        artist: 'Marconi Union',
        albumArt: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop',
      },
      {
        id: '14',
        name: 'Clair de Lune',
        artist: 'Claude Debussy',
        albumArt: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      },
      {
        id: '15',
        name: 'The Scientist',
        artist: 'Coldplay',
        albumArt: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop',
      },
      {
        id: '16',
        name: 'River Flows In You',
        artist: 'Yiruma',
        albumArt: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      },
    ],
  };

  return tracksByMood[emotion] || tracksByMood.Neutral;
}
