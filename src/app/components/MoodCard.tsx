import { MoodAvatar } from './MoodAvatar';

interface MoodCardProps {
  emotion: string;
  confidence: number;
  description: string;
  subMood?: string | null;
  fallbackUsed?: boolean;
}

const moodConfig = {
  Happy: {
    emoji: '😊', color: '#FBBF24',
    gradient: 'from-yellow-50 via-yellow-100/50 to-amber-50',
    shadow: 'shadow-yellow-500/20', ring: 'ring-yellow-400/30',
  },
  Sad: {
    emoji: '😢', color: '#6366F1',
    gradient: 'from-indigo-50 via-blue-100/50 to-indigo-50',
    shadow: 'shadow-indigo-500/20', ring: 'ring-indigo-400/30',
  },
  Angry: {
    emoji: '😠', color: '#EF4444',
    gradient: 'from-red-50 via-rose-100/50 to-red-50',
    shadow: 'shadow-red-500/20', ring: 'ring-red-400/30',
  },
  Neutral: {
    emoji: '😐', color: '#9CA3AF',
    gradient: 'from-gray-50 via-slate-100/50 to-gray-50',
    shadow: 'shadow-gray-500/10', ring: 'ring-gray-400/20',
  },
};

const SUBMOOD_LABELS: Record<string, string> = {
  grief: '💔 Grief',
  breakup: '💔 Breakup',
  low: '😔 Feeling Low',
  anxious: '😰 Anxious',
  excitement: '🎉 Excited',
  loneliness: '🌑 Lonely',
  love: '❤️ Love',
  joy: '✨ Joyful',
  anger: '🔥 Anger',
  calm: '🌿 Calm',
};

const LOW_CONFIDENCE_THRESHOLD = 0.50;

export function MoodCard({ emotion, confidence, description, subMood, fallbackUsed }: MoodCardProps) {
  const config = moodConfig[emotion as keyof typeof moodConfig] || moodConfig.Neutral;
  const isLowConfidence = confidence < LOW_CONFIDENCE_THRESHOLD;

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up-fade space-y-3">
      {/* Fallback warning banner */}
      {fallbackUsed && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
          </svg>
          <span>Using keyword fallback — start the API server for higher accuracy</span>
        </div>
      )}

      {/* Low confidence warning */}
      {isLowConfidence && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
          </svg>
          <span>Low confidence — showing calm/neutral recommendations. Try adding more detail.</span>
        </div>
      )}

      {/* Main card */}
      <div className="relative">
        <div className={`absolute -inset-4 bg-gradient-to-r ${config.gradient} rounded-3xl blur-3xl opacity-50 ${config.shadow}`} />
        <div className={`relative bg-gradient-to-br ${config.gradient} backdrop-blur-sm rounded-2xl p-10 space-y-6 shadow-2xl ${config.shadow} ring-1 ${config.ring} border border-white/20`}>

          {/* Avatar */}
          <div className="relative">
            <div className="absolute inset-0 blur-3xl opacity-60 animate-pulse-glow"
              style={{ background: `radial-gradient(circle, ${config.color}60 0%, transparent 70%)` }} />
            <div className="relative flex justify-center scale-125 my-4">
              <MoodAvatar mood={emotion as 'Happy' | 'Sad' | 'Angry' | 'Neutral'} />
            </div>
          </div>

          {/* Mood text */}
          <div className="space-y-3">
            <h2 className="text-center text-primary leading-tight">
              You're feeling{' '}
              <span className="relative font-bold animate-gradient-text" style={{
                background: `linear-gradient(135deg, ${config.color}, ${config.color}CC)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {emotion}
              </span>
            </h2>

            {/* SubMood badge */}
            {subMood && SUBMOOD_LABELS[subMood] && (
              <div className="flex justify-center">
                <span className="px-3 py-1 text-sm rounded-full border border-current/20 bg-white/40 backdrop-blur text-primary/70 font-medium">
                  {SUBMOOD_LABELS[subMood]}
                </span>
              </div>
            )}

            <p className="text-center text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          {/* Confidence meter */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <span className="font-semibold" style={{ color: config.color }}>
                {Math.round(confidence * 100)}%
              </span>
              {isLowConfidence && (
                <span className="text-xs text-blue-500 font-medium">(Low)</span>
              )}
            </div>
            <div className="relative w-full max-w-xs mx-auto h-2 bg-secondary/50 rounded-full overflow-hidden backdrop-blur">
              <div className="absolute inset-y-0 left-0 rounded-full animate-progress-fill shadow-lg"
                style={{
                  width: `${confidence * 100}%`,
                  background: `linear-gradient(90deg, ${config.color}, ${config.color}DD)`,
                  boxShadow: `0 0 12px ${config.color}80`,
                }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
