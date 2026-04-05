import { useState, useEffect } from 'react';
import { ThoughtInput } from './components/ThoughtInput';
import { SkeletonLoader } from './components/SkeletonLoader';
import { MoodCard } from './components/MoodCard';
import { SpotifyTrackGrid } from './components/SpotifyTrackGrid';
import { MoodHistory } from './components/MoodHistory';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { UserProfile } from './components/UserProfile';
import { ParticleBackground } from './components/ParticleBackground';
import { WelcomeBanner } from './components/WelcomeBanner';
import { MoodStats } from './components/MoodStats';
import { LiveGlowBackground } from './components/LiveGlowBackground';
import { AnimatedLogo } from './components/AnimatedLogo';
import { ProfileSettings } from './components/ProfileSettings';
import { Statistics } from './components/Statistics';
import {
  analyzeEmotion,
  getSpotifyRecommendations,
  EmotionAnalysisResult,
  SpotifyTrack,
} from './services/mockApi';
import { getCurrentUser, logoutUser, User } from './services/authService';

type AppState = 'input' | 'analyzing' | 'results';
type ViewState = 'landing' | 'auth' | 'app';

interface HistoryEntry {
  id: string;
  emotion: string;
  timestamp: number;
  preview: string;
  text: string;
  result: EmotionAnalysisResult;
  tracks: SpotifyTrack[];
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showWelcome, setShowWelcome] = useState(true);
  const [state, setState] = useState<AppState>('input');
  const [thoughtText, setThoughtText] = useState('');
  const [currentResult, setCurrentResult] = useState<EmotionAnalysisResult | null>(null);
  const [currentTracks, setCurrentTracks] = useState<SpotifyTrack[]>([]);
  const [currentEntryId, setCurrentEntryId] = useState<string | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const existingUser = getCurrentUser();
    setUser(existingUser);
    setIsAuthChecked(true);

    // If user is already logged in, skip landing page
    if (existingUser) {
      setViewState('app');
    }
  }, []);

  const handleGetStarted = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setViewState('auth');
  };

  const handleAuthSuccess = () => {
    const loggedInUser = getCurrentUser();
    setUser(loggedInUser);
    setViewState('app');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setState('input');
    setThoughtText('');
    setCurrentResult(null);
    setCurrentTracks([]);
    setCurrentEntryId(undefined);
    setViewState('landing');
  };

  const handleAnalyze = async () => {
    if (!thoughtText.trim()) return;

    setState('analyzing');

    try {
      // Analyze emotion
      const result = await analyzeEmotion(thoughtText);

      // Get Spotify recommendations
      const tracks = await getSpotifyRecommendations(result.emotion);

      // Create history entry
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        emotion: result.emotion,
        timestamp: Date.now(),
        preview: thoughtText.substring(0, 50) + (thoughtText.length > 50 ? '...' : ''),
        text: thoughtText,
        result,
        tracks,
      };

      // Save to localStorage
      const existingHistory = localStorage.getItem('moodtune_history');
      const history: HistoryEntry[] = existingHistory ? JSON.parse(existingHistory) : [];
      history.unshift(entry);

      // Keep only last 20 entries
      if (history.length > 20) {
        history.splice(20);
      }

      localStorage.setItem('moodtune_history', JSON.stringify(history));

      // Trigger storage event for same-tab updates
      window.dispatchEvent(new Event('moodtune_history_updated'));

      setCurrentResult(result);
      setCurrentTracks(tracks);
      setCurrentEntryId(entry.id);
      setState('results');
    } catch (error) {
      console.error('Analysis failed:', error);
      setState('input');
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
    const storedHistory = localStorage.getItem('moodtune_history');
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
        <div className="size-full flex items-center justify-center bg-background">
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

      {/* Show auth page */}
      {isAuthChecked && viewState === 'auth' && (
        <AuthPage onAuthSuccess={handleAuthSuccess} initialMode={authMode} />
      )}

      {/* Show main app if logged in */}
      {isAuthChecked && viewState === 'app' && user && (
        <div className="size-full flex bg-background relative">
          {/* Live Glow Background that reacts to mood */}
          <LiveGlowBackground emotion={currentResult?.emotion || null} />

          {/* Animated particle background */}
          <ParticleBackground />

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
                className="fixed top-6 left-6 z-30 p-3 bg-card/90 backdrop-blur-xl border border-border rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6 text-primary group-hover:text-accent transition-colors"
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

              {/* Header with user profile */}
              <div className="flex items-start justify-center gap-8">
                <div className="flex-1 text-center space-y-4 pb-6 relative max-w-4xl mx-auto">
                  {/* Decorative gradient background */}
                  <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-accent/5 via-purple-500/5 to-transparent blur-3xl rounded-full" />
                  </div>

                  <div className="inline-flex flex-col items-center gap-4 animate-fade-in">
                    <AnimatedLogo size="lg" showText={false} />
                    <div>
                      <h1 className="text-primary bg-gradient-to-r from-accent via-purple-600 to-accent bg-clip-text text-transparent animate-gradient-shift mb-2">
                        MoodTune
                      </h1>
                      <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
                    </div>
                  </div>

                  <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '100ms' }}>
                    Journal your thoughts, discover your emotional patterns, and find music that resonates with your mood
                  </p>
                </div>
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

                {state === 'analyzing' && <SkeletonLoader />}

                {state === 'results' && currentResult && (
                  <>
                    <MoodCard
                      emotion={currentResult.emotion}
                      confidence={currentResult.confidence}
                      description={currentResult.description}
                    />
                    <SpotifyTrackGrid tracks={currentTracks} emotion={currentResult.emotion} />

                    {/* New Entry Button */}
                    <div className="flex justify-center pt-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
                      <button
                        onClick={handleNewEntry}
                        className="group relative px-10 py-4 bg-gradient-to-r from-secondary to-muted text-primary rounded-xl font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border hover:border-accent/50 active:scale-95"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          New Journal Entry
                        </span>
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
