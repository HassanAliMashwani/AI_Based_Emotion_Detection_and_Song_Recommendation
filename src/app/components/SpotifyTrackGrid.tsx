import { ImageWithFallback } from './figma/ImageWithFallback';
import type { SpotifyTrack } from '../services/mockApi';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface SpotifyTrackGridProps {
  tracks: SpotifyTrack[];
  emotion: string;
}

export function SpotifyTrackGrid({ tracks, emotion }: SpotifyTrackGridProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-primary tracking-tight">
          Recommended Tracks
        </h3>
        <Badge variant="outline">Based on your {emotion} mood</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tracks.slice(0, 6).map((track, index) => (
          <Card
            key={track.id}
            padding="none"
            className="group relative overflow-hidden flex flex-col hover:border-accent/40 transition-all duration-500 cursor-pointer border-border/60 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: `${300 + index * 100}ms` }}
          >
            {/* Album art */}
            <div className="relative aspect-square w-full overflow-hidden">
              <ImageWithFallback
                src={track.albumArt}
                alt={track.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/20">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Track info overlayed at bottom */}
            <div className="p-4 bg-white/5">
              <p className="truncate font-bold text-base leading-tight text-primary">
                {track.name}
              </p>
              <p className="truncate text-sm text-muted-foreground font-medium mb-3">
                {track.artist}
              </p>
              
              {/* Badges */}
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-[10px] uppercase tracking-wider">
                  {track.language === 'bollywood' ? '🎬 Bollywood' : '🌟 Hollywood'}
                </Badge>
                {track.genre && (
                  <Badge variant="default" className="text-[10px] uppercase tracking-wider capitalize">
                    {track.genre}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
