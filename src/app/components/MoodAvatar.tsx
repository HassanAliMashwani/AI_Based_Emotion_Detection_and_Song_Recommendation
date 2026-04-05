interface MoodAvatarProps {
  mood?: 'Happy' | 'Sad' | 'Angry' | 'Neutral';
  isTyping?: boolean;
}

export function MoodAvatar({ mood = 'Neutral', isTyping = false }: MoodAvatarProps) {
  const moodConfig = {
    Happy: {
      colors: ['#FBBF24', '#F59E0B', '#FCD34D'],
      animation: 'animate-pulse-slow',
      scale: 'scale-110',
    },
    Sad: {
      colors: ['#6366F1', '#4F46E5', '#818CF8'],
      animation: 'animate-breathing',
      scale: 'scale-95',
    },
    Angry: {
      colors: ['#EF4444', '#DC2626', '#F87171'],
      animation: 'animate-shake-subtle',
      scale: 'scale-105',
    },
    Neutral: {
      colors: ['#9CA3AF', '#6B7280', '#D1D5DB'],
      animation: 'animate-float',
      scale: 'scale-100',
    },
  };

  const config = moodConfig[mood];

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Outer glow ring */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl opacity-50 ${config.animation}`}
        style={{
          background: `radial-gradient(circle, ${config.colors[0]}80, transparent)`,
        }}
      />

      {/* Main avatar blob */}
      <svg
        viewBox="0 0 200 200"
        className={`relative w-full h-full transition-all duration-700 ${config.scale} ${
          isTyping ? 'animate-peek' : config.animation
        }`}
      >
        <defs>
          <linearGradient id={`gradient-${mood}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: config.colors[0], stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: config.colors[1], stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: config.colors[2], stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Animated blob shape */}
        <path
          fill={`url(#gradient-${mood})`}
          className="transition-all duration-1000"
          d="M 100, 100
             m -75, 0
             a 75,75 0 1,0 150,0
             a 75,75 0 1,0 -150,0"
        >
          <animate
            attributeName="d"
            dur={mood === 'Sad' ? '8s' : mood === 'Angry' ? '2s' : '5s'}
            repeatCount="indefinite"
            values="
              M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.7,56.4,53.6,69,39.9,76.4C26.1,83.8,9.8,86,-6.7,86.6C-23.2,87.2,-40,86.2,-54.3,79C-68.6,71.8,-80.4,58.4,-86.8,42.8C-93.2,27.2,-94.2,9.4,-91.8,-7.3C-89.4,-23.9,-83.6,-39.4,-74.6,-52.8C-65.6,-66.2,-53.4,-77.5,-39.2,-84.7C-25,-91.9,-8.8,-95,6.5,-88.5C21.8,-82,30.6,-83.6,44.7,-76.4Z;
              M51.1,-84.4C63.1,-76.2,68,-58.1,73.8,-41.1C79.7,-24.1,86.5,-8.2,87.1,8.1C87.7,24.4,82.1,41.1,72.8,54.8C63.5,68.5,50.5,79.2,36.1,84.7C21.7,90.2,5.9,90.5,-10.3,88.8C-26.5,87.1,-43.1,83.4,-56.8,75.1C-70.5,66.8,-81.3,53.9,-86.8,38.8C-92.3,23.7,-92.5,6.4,-88.6,-9.1C-84.7,-24.6,-76.7,-38.3,-66.4,-50C-56.1,-61.7,-43.5,-71.4,-29.8,-78.8C-16.1,-86.2,-1.3,-91.3,13.8,-89.2C28.9,-87.1,39.1,-92.6,51.1,-84.4Z;
              M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.7,56.4,53.6,69,39.9,76.4C26.1,83.8,9.8,86,-6.7,86.6C-23.2,87.2,-40,86.2,-54.3,79C-68.6,71.8,-80.4,58.4,-86.8,42.8C-93.2,27.2,-94.2,9.4,-91.8,-7.3C-89.4,-23.9,-83.6,-39.4,-74.6,-52.8C-65.6,-66.2,-53.4,-77.5,-39.2,-84.7C-25,-91.9,-8.8,-95,6.5,-88.5C21.8,-82,30.6,-83.6,44.7,-76.4Z"
          />
        </path>

        {/* Face features based on mood */}
        {mood === 'Happy' && (
          <>
            <ellipse cx="75" cy="85" rx="8" ry="10" fill="#1F2937" className="animate-blink" />
            <ellipse cx="125" cy="85" rx="8" ry="10" fill="#1F2937" className="animate-blink" />
            <path d="M 70 115 Q 100 135 130 115" stroke="#1F2937" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        )}

        {mood === 'Sad' && (
          <>
            <ellipse cx="75" cy="90" rx="6" ry="8" fill="#1F2937" />
            <ellipse cx="125" cy="90" rx="6" ry="8" fill="#1F2937" />
            <path d="M 70 125 Q 100 115 130 125" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 65 80 L 55 75" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" className="animate-tear-drop" />
          </>
        )}

        {mood === 'Angry' && (
          <>
            <ellipse cx="75" cy="90" rx="7" ry="9" fill="#1F2937" />
            <ellipse cx="125" cy="90" rx="7" ry="9" fill="#1F2937" />
            <path d="M 60 75 L 80 80" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
            <path d="M 120 80 L 140 75" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
            <path d="M 85 120 L 115 120" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
          </>
        )}

        {mood === 'Neutral' && (
          <>
            <ellipse cx="75" cy="90" rx="7" ry="8" fill="#1F2937" />
            <ellipse cx="125" cy="90" rx="7" ry="8" fill="#1F2937" />
            <line x1="80" y1="120" x2="120" y2="120" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
      </svg>

      {/* Typing indicator dots when user is typing */}
      {isTyping && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
}
