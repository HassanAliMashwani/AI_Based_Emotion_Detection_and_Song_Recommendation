import { useEffect, useState } from 'react';

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
    const stored = localStorage.getItem('moodtune_history');
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
    Happy: 'from-yellow-500 to-orange-500',
    Sad: 'from-blue-500 to-indigo-600',
    Angry: 'from-red-500 to-pink-600',
    Neutral: 'from-gray-400 to-gray-600',
  };

  const getTotalMoodCount = () => {
    return Object.values(stats.moodBreakdown).reduce((sum, count) => sum + count, 0);
  };

  const getMoodPercentage = (count: number) => {
    const total = getTotalMoodCount();
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 w-full max-w-4xl animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary">My Statistics</h2>
                <p className="text-sm text-muted-foreground">Track your mood journey and insights</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {stats.totalEntries === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="text-6xl opacity-30">📊</div>
                <h3 className="text-xl font-semibold text-primary">No Data Yet</h3>
                <p className="text-muted-foreground">Start journaling your moods to see statistics</p>
              </div>
            ) : (
              <>
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-gradient-to-br from-accent/10 to-purple-600/10 rounded-xl border border-accent/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Total Entries</span>
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-primary">{stats.totalEntries}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.averageEntriesPerWeek} per week
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-xl border border-orange-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Current Streak</span>
                      <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-primary">{stats.currentStreak}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Longest: {stats.longestStreak} days
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-600/10 rounded-xl border border-pink-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Top Mood</span>
                      <span className="text-2xl">{moodEmojis[stats.topMood]}</span>
                    </div>
                    <p className="text-3xl font-bold text-primary">{stats.topMood}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getMoodPercentage(stats.moodBreakdown[stats.topMood] || 0)}% of entries
                    </p>
                  </div>
                </div>

                {/* Mood Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    Mood Breakdown
                  </h3>

                  <div className="space-y-3">
                    {Object.entries(stats.moodBreakdown)
                      .sort(([, a], [, b]) => b - a)
                      .map(([mood, count]) => {
                        const percentage = getMoodPercentage(count);
                        return (
                          <div key={mood} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{moodEmojis[mood]}</span>
                                <span className="font-medium text-primary">{mood}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{count} entries</span>
                                <span className="text-sm font-semibold text-accent">{percentage}%</span>
                              </div>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${moodColors[mood]} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Insights */}
                <div className="p-6 bg-gradient-to-br from-accent/5 to-purple-600/5 rounded-xl border border-accent/10">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Insights & Tips
                  </h3>
                  <div className="space-y-3 text-sm">
                    {stats.currentStreak >= 7 && (
                      <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <span className="text-xl">🎉</span>
                        <div>
                          <p className="font-semibold text-green-500">Great consistency!</p>
                          <p className="text-muted-foreground">You've maintained a {stats.currentStreak}-day streak. Keep it up!</p>
                        </div>
                      </div>
                    )}
                    {stats.moodBreakdown.Happy > (getTotalMoodCount() * 0.6) && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <span className="text-xl">☀️</span>
                        <div>
                          <p className="font-semibold text-yellow-500">Positive vibes!</p>
                          <p className="text-muted-foreground">Most of your entries reflect happiness. You're doing great!</p>
                        </div>
                      </div>
                    )}
                    {stats.averageEntriesPerWeek < 2 && (
                      <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <span className="text-xl">💡</span>
                        <div>
                          <p className="font-semibold text-blue-500">Tip: Journal more often</p>
                          <p className="text-muted-foreground">Regular journaling helps track patterns. Try for 3-4 entries per week!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-accent via-purple-600 to-accent bg-size-200 hover:bg-pos-100 transition-all duration-500 rounded-xl font-semibold shadow-lg hover:shadow-accent/50 hover:scale-[1.02]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
