import { useEffect, useState } from 'react';

import type { HistoryEntry } from '../App';

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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-background z-50 border-r border-border/60 transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-8 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-primary tracking-tight">
              History
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Your emotional journey</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground hover:text-primary"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto text-2xl">📝</div>
              <div>
                <p className="text-sm font-medium text-primary">No entries yet</p>
                <p className="text-xs text-muted-foreground mt-1">Start journaling to see history</p>
              </div>
            </div>
          ) : (
            history.map((entry, index) => (
              <button
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-200 group animate-slide-in-left ${
                  currentEntryId === entry.id
                    ? 'bg-white border border-border/50 shadow-sm ring-1 ring-accent/10'
                    : 'hover:bg-secondary/50 border border-transparent'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${
                    currentEntryId === entry.id ? 'bg-secondary' : 'bg-secondary/40'
                  }`}>
                    {moodEmojis[entry.emotion] || '😐'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-semibold truncate ${
                        currentEntryId === entry.id ? 'text-primary' : 'text-primary/80'
                      }`}>
                        {entry.emotion}
                      </p>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate leading-relaxed">
                      {entry.preview}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
