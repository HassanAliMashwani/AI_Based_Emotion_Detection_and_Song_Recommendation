import { MoodAvatar } from './MoodAvatar';

interface MoodCardProps {
  emotion: string;
  confidence: number;
  description: string;
}

const moodConfig = {
  Happy: {
    emoji: '😊',
    color: '#FBBF24',
    gradient: 'from-yellow-50 via-yellow-100/50 to-amber-50',
    shadow: 'shadow-yellow-500/20',
    ring: 'ring-yellow-400/30',
  },
  Sad: {
    emoji: '😢',
    color: '#6366F1',
    gradient: 'from-indigo-50 via-blue-100/50 to-indigo-50',
    shadow: 'shadow-indigo-500/20',
    ring: 'ring-indigo-400/30',
  },
  Angry: {
    emoji: '😠',
    color: '#EF4444',
    gradient: 'from-red-50 via-rose-100/50 to-red-50',
    shadow: 'shadow-red-500/20',
    ring: 'ring-red-400/30',
  },
  Neutral: {
    emoji: '😐',
    color: '#9CA3AF',
    gradient: 'from-gray-50 via-slate-100/50 to-gray-50',
    shadow: 'shadow-gray-500/10',
    ring: 'ring-gray-400/20',
  },
};

export function MoodCard({ emotion, confidence, description }: MoodCardProps) {
  const config = moodConfig[emotion as keyof typeof moodConfig] || moodConfig.Neutral;

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up-fade">
      {/* Decorative background glow */}
      <div className="relative">
        <div
          className={`absolute -inset-4 bg-gradient-to-r ${config.gradient} rounded-3xl blur-3xl opacity-50 ${config.shadow}`}
        />

        <div
          className={`relative bg-gradient-to-br ${config.gradient} backdrop-blur-sm rounded-2xl p-10 space-y-6 shadow-2xl ${config.shadow} ring-1 ${config.ring} border border-white/20`}
        >
          {/* Animated mood avatar instead of emoji */}
          <div className="relative">
            <div
              className="absolute inset-0 blur-3xl opacity-60 animate-pulse-glow"
              style={{
                background: `radial-gradient(circle, ${config.color}60 0%, transparent 70%)`,
              }}
            />
            <div className="relative flex justify-center scale-125 my-4">
              <MoodAvatar mood={emotion as 'Happy' | 'Sad' | 'Angry' | 'Neutral'} />
            </div>
          </div>

          {/* Mood text with gradient */}
          <div className="space-y-3">
            <h2 className="text-center text-primary leading-tight">
              You're feeling{' '}
              <span
                className="relative font-bold animate-gradient-text"
                style={{
                  background: `linear-gradient(135deg, ${config.color}, ${config.color}CC)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {emotion}
              </span>
            </h2>

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
            </div>

            {/* Progress bar */}
            <div className="relative w-full max-w-xs mx-auto h-2 bg-secondary/50 rounded-full overflow-hidden backdrop-blur">
              <div
                className="absolute inset-y-0 left-0 rounded-full animate-progress-fill shadow-lg"
                style={{
                  width: `${confidence * 100}%`,
                  background: `linear-gradient(90deg, ${config.color}, ${config.color}DD)`,
                  boxShadow: `0 0 12px ${config.color}80`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
