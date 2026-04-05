import { MoodAvatar } from './MoodAvatar';
import { MusicWaveVisualization } from './MusicWaveVisualization';

export function SkeletonLoader() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Analyzing Avatar with scanning effect */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <MoodAvatar mood="Neutral" />
          {/* Concentric scanning rings */}
          <div className="absolute inset-0 border-4 border-accent/30 rounded-full animate-ping" />
          <div className="absolute inset-4 border-4 border-purple-600/30 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
          <div className="absolute inset-8 border-4 border-pink-600/20 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>

      {/* Mood Card Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-secondary to-muted rounded-2xl p-10 space-y-6 shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />

        <div className="relative space-y-6">
          <div className="h-20 w-20 bg-gradient-to-br from-muted to-border rounded-full mx-auto animate-pulse-slow shadow-lg" />
          <div className="h-10 w-56 bg-gradient-to-r from-muted to-border rounded-xl mx-auto animate-pulse-slow" />
          <div className="h-5 w-72 bg-gradient-to-r from-muted to-border rounded-lg mx-auto animate-pulse-slow" />
          <div className="h-4 w-40 bg-gradient-to-r from-muted to-border rounded-lg mx-auto animate-pulse-slow" />
        </div>
      </div>

      {/* Analyzing Text */}
      <div className="text-center space-y-6">
        <p className="text-lg text-muted-foreground animate-pulse-slow">
          Analyzing your emotional state...
        </p>

        {/* Music wave visualization */}
        <div className="flex justify-center">
          <MusicWaveVisualization />
        </div>

        <div className="flex justify-center gap-1.5">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Track Grid Skeleton */}
      <div className="space-y-5">
        <div className="h-7 w-56 bg-gradient-to-r from-muted to-border rounded-lg animate-pulse-slow" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-secondary rounded-xl p-5 flex gap-4 shadow-sm"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ animationDelay: `${i * 200}ms` }} />
              <div className="relative h-16 w-16 bg-gradient-to-br from-muted to-border rounded-lg flex-shrink-0 animate-pulse-slow shadow" />
              <div className="relative flex-1 space-y-3">
                <div className="h-5 w-full bg-gradient-to-r from-muted to-border rounded animate-pulse-slow" />
                <div className="h-4 w-3/4 bg-gradient-to-r from-muted to-border rounded animate-pulse-slow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
