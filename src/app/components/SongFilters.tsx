import { type LanguageFilter, type GenreFilter } from '../services/mockApi';

interface SongFiltersProps {
  language: LanguageFilter;
  genre: GenreFilter;
  availableGenres: string[];
  onLanguageChange: (lang: LanguageFilter) => void;
  onGenreChange: (genre: GenreFilter) => void;
}

const LANGUAGE_OPTIONS: { value: LanguageFilter; label: string; flag: string }[] = [
  { value: 'both', label: 'Both', flag: '🌐' },
  { value: 'bollywood', label: 'Bollywood', flag: '🇮🇳' },
  { value: 'hollywood', label: 'Hollywood', flag: '🎬' },
];

export function SongFilters({
  language, genre, availableGenres,
  onLanguageChange, onGenreChange,
}: SongFiltersProps) {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-wrap items-center gap-3 animate-fade-in">
      {/* Language pills */}
      <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border rounded-xl p-1.5">
        {LANGUAGE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            id={`lang-filter-${opt.value}`}
            onClick={() => onLanguageChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
              language === opt.value
                ? 'bg-accent text-white shadow-md shadow-accent/30'
                : 'text-muted-foreground hover:text-primary hover:bg-secondary'
            }`}
          >
            <span>{opt.flag}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Genre dropdown */}
      {availableGenres.length > 0 && (
        <div className="relative">
          <select
            id="genre-filter-select"
            value={genre}
            onChange={e => onGenreChange(e.target.value as GenreFilter)}
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-card/80 border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer hover:border-accent/40 transition-colors backdrop-blur"
          >
            <option value="all">All Genres</option>
            {availableGenres.map(g => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">▼</span>
        </div>
      )}
    </div>
  );
}
