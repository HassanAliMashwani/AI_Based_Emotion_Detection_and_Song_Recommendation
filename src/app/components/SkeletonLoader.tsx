import { AnimatedLogo } from './AnimatedLogo';
import { Card } from './ui/Card';
import { MusicWaveVisualization } from './MusicWaveVisualization';

export function SkeletonLoader() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-10 animate-fade-in">
      {/* Analyzing Logo with INTENSE previous purple/pink scanning theme */}
      <div className="flex justify-center mb-12 relative">
        {/* Full-page ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-400/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        <div className="relative">
          <AnimatedLogo size="xl" showText={false} showBars={false} />
          {/* Intense Previous Purple/Pink concentric rings */}
          <div className="absolute -inset-16 border-2 border-purple-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute -inset-10 border-2 border-pink-500/30 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          <div className="absolute -inset-4 border-2 border-orange-400/40 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />
          
          {/* Glowing core */}
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
        </div>
      </div>

      {/* Mood Card Skeleton with Shimmer */}
      <Card className="relative overflow-hidden p-10 space-y-6 flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        <div className="relative h-20 w-20 bg-secondary rounded-full animate-pulse shadow-sm" />
        <div className="relative space-y-3 w-full">
          <div className="h-8 w-48 bg-secondary rounded-xl mx-auto animate-pulse" />
          <div className="h-4 w-64 bg-secondary/60 rounded-lg mx-auto animate-pulse" />
        </div>
      </Card>

      {/* Analyzing Text */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-secondary rounded-full">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <p className="text-sm font-semibold text-primary">
            Analyzing your emotional patterns...
          </p>
        </div>

        {/* Processing indicators */}
        <div className="flex justify-center gap-1.5 pt-2">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Track Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="group flex flex-col border-border/60 overflow-hidden"
          >
            <div className="relative aspect-square w-full bg-secondary animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-5 w-full bg-secondary rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-secondary/60 rounded animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
