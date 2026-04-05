import { ImageWithFallback } from './figma/ImageWithFallback';

interface Track {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
  previewUrl?: string;
}

interface SpotifyTrackGridProps {
  tracks: Track[];
  emotion: string;
}

export function SpotifyTrackGrid({ tracks, emotion }: SpotifyTrackGridProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <h3 className="text-muted-foreground">
          Recommended for your <span className="text-accent font-medium">{emotion}</span> mood
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="group relative bg-secondary/50 backdrop-blur-sm rounded-xl p-4 flex gap-4 items-center hover:bg-secondary transition-all duration-300 cursor-pointer border border-transparent hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: `${300 + index * 100}ms` }}
          >
            {/* Album art with overlay */}
            <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <ImageWithFallback
                src={track.albumArt}
                alt={track.name}
                className="relative h-16 w-16 rounded-lg object-cover shadow-md transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110"
              />
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-primary font-medium group-hover:text-accent transition-colors">
                {track.name}
              </p>
              <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            </div>

            {/* Play button */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <div className="relative">
                <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-50 animate-pulse-glow" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-12 transition-all duration-300 active:scale-95 active:rotate-0">
                  <svg
                    className="w-4 h-4 text-white ml-0.5 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/0 via-accent/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
