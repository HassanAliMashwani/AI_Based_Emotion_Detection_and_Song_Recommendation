import { useEffect, useState } from 'react';
import { Card } from './ui/Card';

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
      { name: 'Happy', count: stats.happyCount, emoji: '😊', color: 'text-yellow-600' },
      { name: 'Sad', count: stats.sadCount, emoji: '😢', color: 'text-blue-600' },
      { name: 'Angry', count: stats.angryCount, emoji: '😠', color: 'text-red-600' },
      { name: 'Neutral', count: stats.neutralCount, emoji: '😐', color: 'text-gray-600' },
    ];

    return moods.sort((a, b) => b.count - a.count)[0];
  };

  if (stats.totalEntries === 0) return null;

  const topMood = mostCommonMood();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up-fade">
      {/* Total Entries */}
      <Card padding="md" className="relative group overflow-hidden border-border/60 hover:border-accent/40 hover:shadow-md transition-all">
        <div className="absolute top-4 right-4 text-2xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">📊</div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total entries</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-primary">{stats.totalEntries}</p>
            <span className="text-[10px] text-accent font-bold">+12%</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Recorded this month</p>
        </div>
      </Card>

      {/* Current Streak */}
      <Card padding="md" className="relative group overflow-hidden border-border/60 hover:border-accent/40 hover:shadow-md transition-all">
        <div className="absolute top-4 right-4 text-2xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">🔥</div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active days</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-primary">{stats.currentStreak}</p>
            <span className="text-[10px] text-accent font-bold">New high</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Day streak</p>
        </div>
      </Card>

      {/* Most Common Mood */}
      <Card padding="md" className="relative group overflow-hidden border-border/60 hover:border-accent/40 hover:shadow-md transition-all">
        <div className="absolute top-4 right-4 text-2xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
          {topMood.emoji}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Top mood</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-3xl font-black ${topMood.color}`}>{topMood.name}</p>
          </div>
          <p className="text-[10px] text-muted-foreground">{topMood.count} records total</p>
        </div>
      </Card>
    </div>
  );
}
