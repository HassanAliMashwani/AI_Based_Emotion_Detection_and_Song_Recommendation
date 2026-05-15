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
    <div className="w-full max-w-3xl mx-auto animate-slide-up-fade space-y-4">
      {/* Fallback warning banner */}
      {fallbackUsed && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm animate-fade-in shadow-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
          </svg>
          <span className="font-medium">Using keyword fallback — start the API server for higher accuracy</span>
        </div>
      )}

      {/* Low confidence warning */}
      {isLowConfidence && (
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary border border-border/80 rounded-xl text-muted-foreground text-sm animate-fade-in shadow-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
          </svg>
          <span className="font-medium">Low confidence — showing calm/neutral recommendations. Try adding more detail.</span>
        </div>
      )}

      {/* Main Insight Card */}
      <div className="bg-card border border-border shadow-sm rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        
        {/* Subtle background glow based on mood */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none" style={{ backgroundColor: config.color }} />

        {/* Left side: Avatar Character */}
        <div className="flex-shrink-0">
          <MoodAvatar mood={emotion as any} />
        </div>

        {/* Right side: Insights */}
        <div className="flex-1 space-y-4 text-center md:text-left z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-2xl font-bold text-primary tracking-tight">
              Emotion Insight
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 text-sm font-medium rounded-full" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                {emotion}
              </span>
              {subMood && SUBMOOD_LABELS[subMood] && (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-secondary text-muted-foreground border border-border/50">
                  {SUBMOOD_LABELS[subMood]}
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">Analysis Confidence</span>
              <span className="text-sm font-bold" style={{ color: config.color }}>
                {Math.round(confidence * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${confidence * 100}%`, backgroundColor: config.color }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
