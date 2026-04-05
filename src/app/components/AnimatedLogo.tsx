interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function AnimatedLogo({ size = 'md', showText = true }: AnimatedLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
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
      {/* Animated Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer rotating ring */}
        <svg
          className="absolute inset-0 animate-spin-slow"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#gradient1)"
            strokeWidth="3"
            strokeDasharray="10 5"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(139, 92, 246)" />
              <stop offset="50%" stopColor="rgb(236, 72, 153)" />
              <stop offset="100%" stopColor="rgb(251, 146, 60)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner pulsing circle */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="url(#gradient2)"
            className="animate-pulse-glow"
            opacity="0.2"
          />
          <defs>
            <radialGradient id="gradient2">
              <stop offset="0%" stopColor="rgb(139, 92, 246)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>

        {/* Music wave bars */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(30, 50)">
            {/* Bar 1 */}
            <rect
              x="0"
              y="-15"
              width="5"
              height="30"
              rx="2.5"
              fill="url(#barGradient)"
              className="animate-wave"
              style={{ animationDelay: '0s' }}
            />
            {/* Bar 2 */}
            <rect
              x="10"
              y="-20"
              width="5"
              height="40"
              rx="2.5"
              fill="url(#barGradient)"
              className="animate-wave"
              style={{ animationDelay: '0.15s' }}
            />
            {/* Bar 3 */}
            <rect
              x="20"
              y="-10"
              width="5"
              height="20"
              rx="2.5"
              fill="url(#barGradient)"
              className="animate-wave"
              style={{ animationDelay: '0.3s' }}
            />
            {/* Bar 4 */}
            <rect
              x="30"
              y="-18"
              width="5"
              height="36"
              rx="2.5"
              fill="url(#barGradient)"
              className="animate-wave"
              style={{ animationDelay: '0.45s' }}
            />
            {/* Bar 5 */}
            <rect
              x="40"
              y="-12"
              width="5"
              height="24"
              rx="2.5"
              fill="url(#barGradient)"
              className="animate-wave"
              style={{ animationDelay: '0.6s' }}
            />
          </g>
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(251, 146, 60)" />
              <stop offset="50%" stopColor="rgb(236, 72, 153)" />
              <stop offset="100%" stopColor="rgb(139, 92, 246)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-accent via-purple-600 to-accent bg-clip-text text-transparent`}>
          MoodTune
        </span>
      )}
    </div>
  );
}
