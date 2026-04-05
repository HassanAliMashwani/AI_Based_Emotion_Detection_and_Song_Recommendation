import { useEffect, useState } from 'react';

interface HistoryEntry {
  id: string;
  emotion: string;
  timestamp: number;
  preview: string;
}

interface MoodHistoryProps {
  onSelectEntry: (entry: HistoryEntry) => void;
  currentEntryId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const moodEmojis: Record<string, string> = {
  Happy: '😊',
  Sad: '😢',
  Angry: '😠',
  Neutral: '😐',
};

export function MoodHistory({ onSelectEntry, currentEntryId, isOpen, onClose }: MoodHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const stored = localStorage.getItem('moodtune_history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('moodtune_history');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setHistory(parsed);
        } catch (error) {
          console.error('Failed to load history:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event for same-tab updates
    window.addEventListener('moodtune_history_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('moodtune_history_updated', handleStorageChange);
    };
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border z-50 overflow-y-auto p-6 space-y-4 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with close button */}
        <div className="sticky top-0 bg-sidebar/95 backdrop-blur-xl -mx-6 px-6 py-4 mb-2 border-b border-sidebar-border/50">
          <div className="flex items-center justify-between">
            <h3 className="text-sidebar-foreground flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mood History
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {history.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="text-5xl opacity-30">📝</div>
            <p className="text-sm text-muted-foreground">No entries yet</p>
            <p className="text-xs text-muted-foreground/70">Start journaling to track your moods</p>
          </div>
        ) : (
          history.map((entry, index) => (
            <button
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 group animate-slide-in-left ${
                currentEntryId === entry.id
                  ? 'bg-gradient-to-r from-sidebar-accent to-accent/10 ring-2 ring-accent/30 shadow-lg scale-[1.02]'
                  : 'hover:bg-sidebar-accent/70 hover:scale-[1.01]'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-3xl transition-transform duration-300 ${
                    currentEntryId === entry.id ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  {moodEmojis[entry.emotion] || '😐'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-sidebar-foreground group-hover:text-accent transition-colors">
                    {entry.preview}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDate(entry.timestamp)}
                  </p>
                </div>

                {/* Selection indicator */}
                {currentEntryId === entry.id && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
                  </div>
                )}
              </div>
            </button>
          ))
        )}
        </div>
      </div>
    </>
  );
}
