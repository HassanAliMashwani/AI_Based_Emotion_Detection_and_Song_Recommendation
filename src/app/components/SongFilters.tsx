import { type LanguageFilter, type GenreFilter } from '../services/mockApi';

interface SongFiltersProps {
  language: LanguageFilter;
  genre: GenreFilter;
  availableGenres: string[];
  onLanguageChange: (lang: LanguageFilter) => void;
  onGenreChange: (genre: GenreFilter) => void;
}

const LANGUAGE_OPTIONS: { value: LanguageFilter; label: string; flag: string }[] = [
  { value: 'both', label: 'All', flag: '🌐' },
  { value: 'bollywood', label: 'Bollywood', flag: '🎬' },
  { value: 'hollywood', label: 'Hollywood', flag: '🌟' },
];

export function SongFilters({
  language, genre, availableGenres,
  onLanguageChange, onGenreChange,
}: SongFiltersProps) {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-in py-8">
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto">
        <span className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">Region</span>
        <div className="flex items-center justify-between gap-1 p-1 sm:p-1.5 bg-secondary/80 rounded-2xl border border-border/50 shadow-inner w-full sm:w-auto">
          {LANGUAGE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              id={`lang-filter-${opt.value}`}
              onClick={() => onLanguageChange(opt.value)}
              className={`flex-1 sm:flex-none px-2 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                language === opt.value
                  ? 'bg-white text-primary shadow-md sm:shadow-xl border border-border/20 scale-100 sm:scale-105 z-10'
                  : 'text-primary/60 hover:text-primary hover:bg-white/60'
              }`}
            >
              <span className="text-sm sm:text-base">{opt.flag}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <span className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">Vibe</span>
        {availableGenres.length > 0 && (
          <div className="relative group w-full sm:w-auto">
            <select
              id="genre-filter-select"
              value={genre}
              onChange={e => onGenreChange(e.target.value as GenreFilter)}
              className="appearance-none w-full pl-4 pr-10 py-2 sm:pl-6 sm:pr-12 sm:py-3.5 text-xs sm:text-sm bg-secondary/80 border border-border/50 rounded-2xl text-primary font-bold focus:outline-none focus:ring-4 focus:ring-accent/10 cursor-pointer hover:bg-secondary transition-all shadow-inner sm:min-w-[180px]"
            >
              <option value="all">All Genres</option>
              {availableGenres.map(g => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
