import { MoodAvatar } from './MoodAvatar';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

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
      <div className="flex justify-center mb-6">
        <MoodAvatar mood="Neutral" isTyping={value.length > 0 && !isAnalyzing} />
      </div>

      <Card padding="md" className="relative group overflow-visible border-border/80 transition-shadow hover:shadow-md">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How are you feeling today? Pour your thoughts here..."
          className="relative w-full h-48 px-2 py-2 bg-transparent resize-none focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/60 text-primary text-lg leading-relaxed"
          disabled={isAnalyzing}
        />
        
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/50">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="opacity-70">Press</span>
            <kbd className="px-2 py-1 bg-secondary rounded-md text-xs font-medium text-primary">
              ⌘/Ctrl + Enter
            </kbd>
            <span className="opacity-70">to analyze</span>
          </p>

          <Button
            onClick={onAnalyze}
            disabled={!value.trim() || isAnalyzing}
            variant="primary"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Analyze My Mood
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
