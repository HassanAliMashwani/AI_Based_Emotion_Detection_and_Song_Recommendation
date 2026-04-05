import { User } from '../services/authService';

interface WelcomeBannerProps {
  user: User;
  onDismiss: () => void;
}

export function WelcomeBanner({ user, onDismiss }: WelcomeBannerProps) {
  const isNewUser = Date.now() - user.joinedDate < 60 * 60 * 1000; // Joined within last hour

  if (!isNewUser) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-accent/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-accent/20 rounded-2xl p-6 mb-8 animate-slide-up-fade">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 text-6xl opacity-10 animate-float">✨</div>
      <div className="absolute bottom-0 left-0 text-5xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🎵</div>

      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 text-4xl animate-float">👋</div>
        <div className="flex-1 space-y-2">
          <h3 className="text-primary font-medium">
            Welcome to MoodTune, {user.name.split(' ')[0]}!
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Start by journaling your thoughts and feelings. Our AI will analyze your emotional state
            and recommend music that matches your mood. Your journey to emotional awareness begins now! 🌟
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
