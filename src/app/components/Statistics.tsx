import { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface StatisticsProps {
  onClose: () => void;
}

interface MoodStats {
  totalEntries: number;
  moodBreakdown: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  topMood: string;
  averageEntriesPerWeek: number;
}

export function Statistics({ onClose }: StatisticsProps) {
  const [stats, setStats] = useState<MoodStats>({
    totalEntries: 0,
    moodBreakdown: {},
    currentStreak: 0,
    longestStreak: 0,
    topMood: 'Happy',
    averageEntriesPerWeek: 0,
  });

  useEffect(() => {
    // Load history from localStorage and calculate stats
    const stored = localStorage.getItem('tunelytics_history');
    if (stored) {
      try {
        const history = JSON.parse(stored);
        calculateStats(history);
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }
  }, []);

  const calculateStats = (history: any[]) => {
    const totalEntries = history.length;

    // Calculate mood breakdown
    const moodBreakdown: Record<string, number> = {};
    history.forEach(entry => {
      moodBreakdown[entry.emotion] = (moodBreakdown[entry.emotion] || 0) + 1;
    });

    // Find top mood
    let topMood = 'Happy';
    let maxCount = 0;
    Object.entries(moodBreakdown).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topMood = mood;
      }
    });

    // Calculate streaks (consecutive days with entries)
    const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    sortedHistory.forEach(entry => {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        tempStreak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (entryDate.getTime() === today.getTime()) {
          currentStreak = 1;
        }
      } else {
        const dayDiff = Math.floor((lastDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          tempStreak++;
          if (currentStreak > 0) currentStreak = tempStreak;
        } else if (dayDiff > 1) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          currentStreak = 0;
        }
      }

      lastDate = entryDate;
    });

    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    // Calculate average entries per week
    if (totalEntries > 0) {
      const oldestEntry = history[history.length - 1];
      const newestEntry = history[0];
      const daysDiff = (newestEntry.timestamp - oldestEntry.timestamp) / (1000 * 60 * 60 * 24);
      const weeksDiff = Math.max(daysDiff / 7, 1);
      const averageEntriesPerWeek = Math.round((totalEntries / weeksDiff) * 10) / 10;

      setStats({
        totalEntries,
        moodBreakdown,
        currentStreak,
        longestStreak,
        topMood,
        averageEntriesPerWeek,
      });
    } else {
      setStats({
        totalEntries,
        moodBreakdown,
        currentStreak,
        longestStreak,
        topMood,
        averageEntriesPerWeek: 0,
      });
    }
  };

  const moodEmojis: Record<string, string> = {
    Happy: '😊',
    Sad: '😢',
    Angry: '😠',
    Neutral: '😐',
  };

  const moodColors: Record<string, string> = {
    Happy: 'bg-yellow-500',
    Sad: 'bg-blue-500',
    Angry: 'bg-red-500',
    Neutral: 'bg-gray-400',
  };

  const getTotalMoodCount = () => {
    return Object.values(stats.moodBreakdown).reduce((sum, count) => sum + count, 0);
  };

  const getMoodPercentage = (count: number) => {
    const total = getTotalMoodCount();
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#F8F8F6] rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.2)] border border-white/60 w-full max-w-4xl animate-scale-in overflow-hidden m-4 flex flex-col max-h-[calc(100vh-2rem)]">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-10 pb-6 shrink-0">
          <div>
            <h2 className="text-3xl font-black text-primary tracking-tighter">Your Progress</h2>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-[0.2em] font-bold">Insights & Analytics</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white border border-border shadow-sm rounded-2xl hover:shadow-md transition-all text-muted-foreground hover:text-primary"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 pt-0 space-y-10 scrollbar-hide">
          {stats.totalEntries === 0 ? (
            <div className="text-center py-24 space-y-4">
              <div className="text-7xl opacity-20 grayscale">📊</div>
              <h3 className="text-xl font-bold text-primary">Data is still processing</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">Journal a few more times to unlock your emotional analytics.</p>
            </div>
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card padding="md" className="border-border/60">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Entries</span>
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-black text-primary">{stats.totalEntries}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">
                    {stats.averageEntriesPerWeek} avg. / week
                  </p>
                </Card>

                <Card padding="md" className="border-border/60">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Streak</span>
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-black text-primary">{stats.currentStreak}d</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">
                    Longest: {stats.longestStreak} days
                  </p>
                </Card>

                <Card padding="md" className="border-border/60">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Top Vibe</span>
                    <span className="text-2xl">{moodEmojis[stats.topMood]}</span>
                  </div>
                  <p className="text-4xl font-black text-primary">{stats.topMood}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">
                    {getMoodPercentage(stats.moodBreakdown[stats.topMood] || 0)}% of patterns
                  </p>
                </Card>
              </div>

              {/* Mood Breakdown */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-8 bg-accent rounded-full" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Emotional Distribution</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {Object.entries(stats.moodBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([mood, count]) => {
                      const percentage = getMoodPercentage(count);
                      return (
                        <div key={mood} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{moodEmojis[mood]}</span>
                              <span className="text-sm font-bold text-primary">{mood}</span>
                            </div>
                            <span className="text-xs font-black text-accent">{percentage}%</span>
                          </div>
                          <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-border/40">
                            <div
                              className={`h-full ${moodColors[mood]} transition-all duration-1000 ease-out`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Insights */}
              <Card className="p-8 bg-white border-border/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2.5 bg-secondary rounded-xl">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-primary">Smart Insights</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.currentStreak >= 7 ? (
                    <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 flex gap-4 items-start">
                      <span className="text-xl">🏆</span>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-primary">Unstoppable consistency</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">You've reached a 7-day milestone. Your data is now 40% more accurate.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-secondary/30 rounded-2xl border border-border/40 flex gap-4 items-start">
                      <span className="text-xl">📈</span>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-primary">Build your baseline</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">Aim for a 5-day streak to unlock deeper emotional pattern recognition.</p>
                      </div>
                    </div>
                  )}

                  {stats.moodBreakdown.Happy > (getTotalMoodCount() * 0.6) && (
                    <div className="p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 flex gap-4 items-start">
                      <span className="text-xl">✨</span>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-primary">High positive variance</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">Your emotional spread is heavily weighted towards positive states lately.</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}

          <div className="pt-4 shrink-0">
            <Button
              onClick={onClose}
              variant="primary"
              className="w-full py-5 text-md font-black tracking-tight"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
