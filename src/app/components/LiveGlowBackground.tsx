import { useEffect, useState } from 'react';

interface LiveGlowBackgroundProps {
  emotion?: 'Happy' | 'Sad' | 'Angry' | 'Neutral' | null;
}

export function LiveGlowBackground({ emotion }: LiveGlowBackgroundProps) {
  const [currentGlow, setCurrentGlow] = useState('neutral');

  useEffect(() => {
    if (emotion) {
      setCurrentGlow(emotion.toLowerCase());
    }
  }, [emotion]);

  const glowConfig = {
    happy: {
      gradient: 'from-yellow-400/20 via-amber-400/15 to-orange-400/10',
      position: 'top-right',
    },
    sad: {
      gradient: 'from-indigo-400/20 via-blue-400/15 to-cyan-400/10',
      position: 'bottom-left',
    },
    angry: {
      gradient: 'from-red-400/20 via-rose-400/15 to-pink-400/10',
      position: 'top-left',
    },
    neutral: {
      gradient: 'from-gray-400/10 via-slate-400/8 to-zinc-400/5',
      position: 'center',
    },
  };

  const config = glowConfig[currentGlow as keyof typeof glowConfig] || glowConfig.neutral;

  const positionClasses = {
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-left': 'top-0 left-0',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Primary glow orb */}
      <div
        className={`absolute w-[800px] h-[800px] bg-gradient-radial ${config.gradient} rounded-full blur-3xl transition-all duration-[3000ms] ease-out opacity-0 animate-glow-appear ${
          positionClasses[config.position as keyof typeof positionClasses]
        }`}
        style={{ animationDelay: '300ms' }}
      />

      {/* Secondary accent glows */}
      <div
        className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-radial from-purple-400/15 to-transparent rounded-full blur-3xl animate-float-slow"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-accent/10 to-transparent rounded-full blur-3xl animate-float-slow"
        style={{ animationDelay: '2s', animationDuration: '12s' }}
      />

      {/* Subtle gradient mesh overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-transparent opacity-30" />
    </div>
  );
}
