import { MoodAvatar } from './MoodAvatar';

interface ThoughtInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function ThoughtInput({ value, onChange, onAnalyze, isAnalyzing }: ThoughtInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !isAnalyzing) {
      onAnalyze();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Mood Avatar that reacts to typing */}
      <div className="flex justify-center mb-8">
        <MoodAvatar mood="Neutral" isTyping={value.length > 0 && !isAnalyzing} />
      </div>

      <div className="relative group">
        {/* Animated glow effect on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-gradient-shift" />

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How are you feeling today? Pour your thoughts here..."
          className="relative w-full h-64 px-7 py-6 bg-card border-2 border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-300 placeholder:text-muted-foreground/60 shadow-soft backdrop-blur-sm"
          disabled={isAnalyzing}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="opacity-70">Press</span>
          <kbd className="px-2.5 py-1.5 bg-gradient-to-b from-secondary to-muted border border-border rounded-lg text-xs shadow-sm">
            ⌘/Ctrl + Enter
          </kbd>
          <span className="opacity-70">to analyze</span>
        </p>

        <button
          onClick={onAnalyze}
          disabled={!value.trim() || isAnalyzing}
          onMouseMove={(e) => {
            if (!value.trim() || isAnalyzing) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            e.currentTarget.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0) scale(1)';
          }}
          className="group relative px-8 py-3.5 bg-gradient-to-r from-accent via-purple-600 to-accent bg-size-200 bg-pos-0 text-white rounded-xl font-medium overflow-hidden transition-all duration-300 hover:bg-pos-100 hover:shadow-2xl hover:shadow-accent/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-pos-0 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Analyze My Mood
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
