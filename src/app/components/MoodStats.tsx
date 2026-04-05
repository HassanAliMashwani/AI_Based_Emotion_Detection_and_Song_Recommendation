import { useEffect, useState } from 'react';

interface MoodStats {
  totalEntries: number;
  happyCount: number;
  sadCount: number;
  angryCount: number;
  neutralCount: number;
  currentStreak: number;
}

export function MoodStats() {
  const [stats, setStats] = useState<MoodStats>({
    totalEntries: 0,
    happyCount: 0,
    sadCount: 0,
    angryCount: 0,
    neutralCount: 0,
    currentStreak: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      const historyJson = localStorage.getItem('moodtune_history');
      if (!historyJson) return;

      try {
        const history = JSON.parse(historyJson);
        const newStats: MoodStats = {
          totalEntries: history.length,
          happyCount: 0,
          sadCount: 0,
          angryCount: 0,
          neutralCount: 0,
          currentStreak: 0,
        };

        history.forEach((entry: { emotion: string }) => {
          switch (entry.emotion) {
            case 'Happy':
              newStats.happyCount++;
              break;
            case 'Sad':
              newStats.sadCount++;
              break;
            case 'Angry':
              newStats.angryCount++;
              break;
            case 'Neutral':
              newStats.neutralCount++;
              break;
          }
        });

        // Calculate streak (days with at least one entry)
        const dates = new Set(
          history.map((entry: { timestamp: number }) =>
            new Date(entry.timestamp).toDateString()
          )
        );
        newStats.currentStreak = dates.size;

        setStats(newStats);
      } catch (error) {
        console.error('Failed to calculate stats:', error);
      }
    };

    calculateStats();

    // Listen for history updates
    const handleUpdate = () => calculateStats();
    window.addEventListener('moodtune_history_updated', handleUpdate);

    return () => {
      window.removeEventListener('moodtune_history_updated', handleUpdate);
    };
  }, []);

  const mostCommonMood = () => {
    const moods = [
      { name: 'Happy', count: stats.happyCount, emoji: '😊', color: 'from-yellow-500 to-amber-500' },
      { name: 'Sad', count: stats.sadCount, emoji: '😢', color: 'from-indigo-500 to-blue-500' },
      { name: 'Angry', count: stats.angryCount, emoji: '😠', color: 'from-red-500 to-rose-500' },
      { name: 'Neutral', count: stats.neutralCount, emoji: '😐', color: 'from-gray-500 to-slate-500' },
    ];

    return moods.sort((a, b) => b.count - a.count)[0];
  };

  if (stats.totalEntries === 0) return null;

  const topMood = mostCommonMood();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up-fade">
      {/* Total Entries */}
      <div className="relative group bg-gradient-to-br from-secondary to-muted rounded-2xl p-6 border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 text-6xl opacity-5 group-hover:scale-110 transition-transform">📊</div>
        <div className="relative space-y-2">
          <p className="text-sm text-muted-foreground">Total Entries</p>
          <p className="text-3xl font-bold text-primary">{stats.totalEntries}</p>
          <p className="text-xs text-muted-foreground">Journal entries recorded</p>
        </div>
      </div>

      {/* Current Streak */}
      <div className="relative group bg-gradient-to-br from-secondary to-muted rounded-2xl p-6 border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 text-6xl opacity-5 group-hover:scale-110 transition-transform">🔥</div>
        <div className="relative space-y-2">
          <p className="text-sm text-muted-foreground">Active Days</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            {stats.currentStreak}
          </p>
          <p className="text-xs text-muted-foreground">Keep the streak going!</p>
        </div>
      </div>

      {/* Most Common Mood */}
      <div className="relative group bg-gradient-to-br from-secondary to-muted rounded-2xl p-6 border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 text-6xl opacity-5 group-hover:scale-110 transition-transform">
          {topMood.emoji}
        </div>
        <div className="relative space-y-2">
          <p className="text-sm text-muted-foreground">Top Mood</p>
          <p className={`text-3xl font-bold bg-gradient-to-r ${topMood.color} bg-clip-text text-transparent`}>
            {topMood.name}
          </p>
          <p className="text-xs text-muted-foreground">{topMood.count} times recorded</p>
        </div>
      </div>
    </div>
  );
}
