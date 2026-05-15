interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showBars?: boolean;
}

export function AnimatedLogo({ size = 'md', showText = true, showBars = true }: AnimatedLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className="flex items-center gap-3">
      {/* New Minimal Logo (Black circle with green dot) */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        {/* Outer Black Circle */}
        <div className="absolute inset-0 bg-[#121212] rounded-full shadow-lg" />
        
        {/* Inner Green Dot */}
        <div className="relative w-1/3 h-1/3 bg-[#59CF2A] rounded-full shadow-[0_0_10px_rgba(89,207,42,0.6)] animate-pulse" />
        
        {/* Subtle Music Wave Overlay (Optional, only if showBars is true) */}
        {showBars && (
          <div className="absolute inset-0 flex items-center justify-center gap-[2px] opacity-20 group-hover:opacity-40 transition-opacity">
            <div className="w-[2px] h-3 bg-white/40 rounded-full animate-wave" style={{ animationDelay: '0s' }} />
            <div className="w-[2px] h-5 bg-white/40 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
            <div className="w-[2px] h-3 bg-white/40 rounded-full animate-wave" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
      </div>

      {/* Text */}
      {showText && (
        <span className={`${textSizes[size]} font-black text-[#121212] tracking-tight`}>
          MoodTune
        </span>
      )}
    </div>
  );
}
