import { ImageWithFallback } from './figma/ImageWithFallback';
import type { SpotifyTrack } from '../services/mockApi';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface SpotifyTrackGridProps {
  tracks: SpotifyTrack[];
  emotion: string;
}

export function SpotifyTrackGrid({ tracks, emotion }: SpotifyTrackGridProps) {
  // Generate a distinct color style for each card if we want contrasting styles
  const getContrastStyle = (index: number) => {
    const colors = [
      'hover:border-blue-500/40 hover:bg-blue-500/5',
      'hover:border-purple-500/40 hover:bg-purple-500/5',
      'hover:border-green-500/40 hover:bg-green-500/5',
      'hover:border-rose-500/40 hover:bg-rose-500/5',
      'hover:border-amber-500/40 hover:bg-amber-500/5',
      'hover:border-cyan-500/40 hover:bg-cyan-500/5',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-primary tracking-tight">
          Recommended Tracks
        </h3>
        <Badge variant="outline">Based on your {emotion} mood</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {tracks.slice(0, 6).map((track, index) => (
          <Card
            key={track.id}
            padding="sm"
            className={`group relative overflow-hidden flex flex-row items-center gap-3 transition-all duration-300 cursor-pointer border-border/60 hover:shadow-md animate-slide-up bg-white/5 ${getContrastStyle(index)}`}
            style={{ animationDelay: `${300 + index * 100}ms` }}
          >
            {/* Track info on left */}
            <div className="flex flex-col min-w-0 flex-1 py-1 pl-2">
              <p className="truncate font-bold text-sm md:text-base leading-tight text-primary mb-0.5 group-hover:text-accent transition-colors">
                {track.name}
              </p>
              <p className="truncate text-xs md:text-sm text-muted-foreground font-medium mb-1.5">
                {track.artist}
              </p>
              
              {/* Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant="default" className="text-[8px] uppercase tracking-wider px-1.5 py-0 bg-white/10 text-primary border-white/5">
                  {track.language === 'bollywood' ? '🎬 Bolly' : '🌟 Holly'}
                </Badge>
                {track.genre && (
                  <Badge variant="default" className="text-[8px] uppercase tracking-wider capitalize px-1.5 py-0 bg-white/10 text-primary border-white/5">
                    {track.genre}
                  </Badge>
                )}
              </div>
            </div>

            {/* Play Button on right */}
            <div className="flex-shrink-0 pr-2">
              <div className="w-10 h-10 bg-accent/10 group-hover:bg-accent rounded-full flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110">
                <svg className="w-5 h-5 text-accent group-hover:text-white ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
