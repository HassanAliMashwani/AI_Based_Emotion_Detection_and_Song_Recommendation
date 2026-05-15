import { useState, useEffect } from 'react';
import { ThoughtInput } from './components/ThoughtInput';
import { SkeletonLoader } from './components/SkeletonLoader';
import { MoodCard } from './components/MoodCard';
import { SpotifyTrackGrid } from './components/SpotifyTrackGrid';
import { SongFilters } from './components/SongFilters';
import { MoodHistory } from './components/MoodHistory';
import { LandingPage } from './components/LandingPage';
import { UserProfile } from './components/UserProfile';
import { WelcomeBanner } from './components/WelcomeBanner';
import { MoodStats } from './components/MoodStats';
import { AnimatedLogo } from './components/AnimatedLogo';
import { LiveGlowBackground } from './components/LiveGlowBackground';
import { ProfileSettings } from './components/ProfileSettings';
import { Statistics } from './components/Statistics';
import {
  analyzeEmotion,
  getSpotifyRecommendations,
  getAvailableGenres,
  EmotionAnalysisResult,
  SpotifyTrack,
  type LanguageFilter,
  type GenreFilter,
} from './services/mockApi';
import { getCurrentUser, logoutUser, User } from './services/authService';

type AppState = 'input' | 'analyzing' | 'results';
type ViewState = 'landing' | 'auth' | 'app';

export interface HistoryEntry {
  id: string;
  emotion: string;
  timestamp: number;
  preview: string;
  text: string;
  result: EmotionAnalysisResult;
  tracks: SpotifyTrack[];
}

export default function App() {
  const [user, setUser] = useState<User | null>({
    id: '1',
    email: 'guest@tunelytics.com',
    name: 'Guest User',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest&backgroundColor=b6e3f4',
    joinedDate: Date.now(),
  });
  const [isAuthChecked, setIsAuthChecked] = useState(true);
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [showWelcome, setShowWelcome] = useState(true);
  const [state, setState] = useState<AppState>('input');
  const [thoughtText, setThoughtText] = useState('');
  const [currentResult, setCurrentResult] = useState<EmotionAnalysisResult | null>(null);
  const [currentTracks, setCurrentTracks] = useState<SpotifyTrack[]>([]);
  const [currentEntryId, setCurrentEntryId] = useState<string | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('both');
  const [genreFilter, setGenreFilter] = useState<GenreFilter>('all');
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [showStatistics, setShowStatistics] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const existingUser = getCurrentUser();
    setUser(existingUser);
    setIsAuthChecked(true);

    // If user is already logged in, skip landing page
    // if (existingUser) {
    //   setViewState('app');
    // }
  }, []);

  const handleGetStarted = () => {
    setViewState('app');
  };

  const handleLogout = () => {
    setViewState('landing');
    setState('input');
    setThoughtText('');
    setCurrentResult(null);
    setCurrentTracks([]);
    setCurrentEntryId(undefined);
  };

  const handleAnalyze = async () => {
    if (!thoughtText.trim()) return;

    setState('analyzing');

    try {
      // Analyze emotion
      const result = await analyzeEmotion(thoughtText);

      // Compute available genres for the detected mood
      const genres = getAvailableGenres(result.mood, languageFilter);
      setAvailableGenres(genres);

      // Get recommendations with current filters
      const tracks = await getSpotifyRecommendations(result.mood, languageFilter, genreFilter);

      // Create history entry
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        emotion: result.mood,
        timestamp: Date.now(),
        preview: thoughtText.substring(0, 50) + (thoughtText.length > 50 ? '...' : ''),
        text: thoughtText,
        result,
        tracks,
      };

      // Save to localStorage
      const existingHistory = localStorage.getItem('tunelytics_history');
      const history: HistoryEntry[] = existingHistory ? JSON.parse(existingHistory) : [];
      history.unshift(entry);

      // Keep only last 20 entries
      if (history.length > 20) {
        history.splice(20);
      }

      localStorage.setItem('tunelytics_history', JSON.stringify(history));
      window.dispatchEvent(new Event('tunelytics_history_updated'));

      setCurrentResult(result);
      setCurrentTracks(tracks);
      setCurrentEntryId(entry.id);
      setState('results');
    } catch (error) {
      console.error('Analysis failed:', error);
      setState('input');
    }
  };

  // Re-fetch songs when filters change (results state only)
  const handleFiltersChange = async (lang: LanguageFilter, genre: GenreFilter) => {
    setLanguageFilter(lang);
    setGenreFilter(genre);
    if (state === 'results' && currentResult) {
      const genres = getAvailableGenres(currentResult.mood, lang);
      setAvailableGenres(genres);
      const tracks = await getSpotifyRecommendations(currentResult.mood, lang, genre);
      setCurrentTracks(tracks);
    }
  };

  const handleNewEntry = () => {
    setState('input');
    setThoughtText('');
    setCurrentResult(null);
    setCurrentTracks([]);
    setCurrentEntryId(undefined);
  };

  const handleSelectHistoryEntry = (entry: HistoryEntry) => {
    // Load the selected entry from localStorage to get full data
    const storedHistory = localStorage.getItem('tunelytics_history');
    if (storedHistory) {
      const history: HistoryEntry[] = JSON.parse(storedHistory);
      const fullEntry = history.find((e) => e.id === entry.id);

      if (fullEntry) {
        setThoughtText(fullEntry.text);
        setCurrentResult(fullEntry.result);
        setCurrentTracks(fullEntry.tracks);
        setCurrentEntryId(fullEntry.id);
        setState('results');
      }
    }
  };

  return (
    <>
      {/* Show loading while checking auth */}
      {!isAuthChecked && (
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
          <div className="text-center space-y-6">
            <AnimatedLogo size="xl" showText={false} />
            <div className="flex justify-center gap-1.5">
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {/* Show landing page */}
      {isAuthChecked && viewState === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}

      {/* Show main app if logged in */}
      {isAuthChecked && viewState === 'app' && user && (
        <div 
          className={`min-h-screen w-full flex transition-colors duration-1000 relative ${
            currentResult?.mood === 'Angry' ? 'bg-red-50/50' : 
            currentResult?.mood === 'Sad' ? 'bg-blue-50/50' : 
            currentResult?.mood === 'Happy' ? 'bg-amber-50/50' : 
            'bg-background'
          }`}
        >
          {/* Dynamic background glow */}
          {currentResult?.mood && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-30 blur-[120px] animate-pulse"
              style={{ 
                background: `radial-gradient(circle at 50% 50%, ${
                  currentResult.mood === 'Angry' ? '#EF4444' : 
                  currentResult.mood === 'Sad' ? '#6366F1' : 
                  currentResult.mood === 'Happy' ? '#FBBF24' : 
                  'transparent'
                }, transparent)` 
              }}
            />
          )}

          {/* Mood History Sidebar */}
          <MoodHistory
            onSelectEntry={handleSelectHistoryEntry}
            currentEntryId={currentEntryId}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-8 py-8 space-y-10">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="fixed top-6 left-6 z-30 p-2.5 bg-white border border-border shadow-sm rounded-xl hover:shadow-md hover:bg-secondary transition-all group"
                aria-label="Open menu"
              >
                <svg
                  className="w-5 h-5 text-primary group-hover:text-accent transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* User Profile - Fixed to top right */}
              <div className="fixed top-6 right-6 z-30 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <UserProfile
                  user={user}
                  onLogout={handleLogout}
                  onOpenSettings={() => setShowProfileSettings(true)}
                  onOpenStatistics={() => setShowStatistics(true)}
                />
              </div>

              {/* Header with MoodTune Branding */}
              <div className="flex items-center justify-between pb-6 border-b border-border/50 animate-fade-in">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity text-left"
                >
                  <AnimatedLogo size="md" showText={false} />
                  <div>
                    <h1 className="text-2xl font-bold text-primary tracking-tight">
                      Tunelytics
                    </h1>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
                      Dashboard
                    </p>
                  </div>
                </button>
              </div>

              {/* Main Content Area */}
              <div className="space-y-10">
                {/* Welcome Banner */}
                {showWelcome && user && (
                  <WelcomeBanner user={user} onDismiss={() => setShowWelcome(false)} />
                )}

                {/* Mood Statistics */}
                {state === 'input' && <MoodStats />}

                {state === 'input' && (
                  <ThoughtInput
                    value={thoughtText}
                    onChange={setThoughtText}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={false}
                  />
                )}

                {state === 'analyzing' && (
                  <div className="flex flex-col items-center">
                    <LiveGlowBackground />
                    <SkeletonLoader />
                  </div>
                )}

                {state === 'results' && currentResult && (
                  <>
                    <MoodCard
                      emotion={currentResult.mood}
                      confidence={currentResult.confidence}
                      description={currentResult.description}
                      subMood={(currentResult as any).subMood}
                      fallbackUsed={(currentResult as any).fallbackUsed}
                    />
                    <SongFilters
                      language={languageFilter}
                      genre={genreFilter}
                      availableGenres={availableGenres}
                      onLanguageChange={(lang) => handleFiltersChange(lang, genreFilter)}
                      onGenreChange={(genre) => handleFiltersChange(languageFilter, genre)}
                    />
                    <SpotifyTrackGrid tracks={currentTracks} emotion={currentResult.mood} />

                    {/* New Entry Button */}
                    <div className="flex justify-center pt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
                      <button
                        onClick={handleNewEntry}
                        className="px-8 py-3 bg-white border border-border shadow-sm text-primary rounded-xl font-bold hover:bg-secondary hover:border-border/80 transition-all duration-200 active:scale-95 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Journal Entry
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showProfileSettings && <ProfileSettings onClose={() => setShowProfileSettings(false)} />}

      {/* Statistics Modal */}
      {showStatistics && <Statistics onClose={() => setShowStatistics(false)} />}
    </>
  );
}
