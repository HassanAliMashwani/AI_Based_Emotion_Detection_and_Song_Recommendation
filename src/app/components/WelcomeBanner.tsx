import { User } from '../services/authService';
import { Card } from './ui/Card';

interface WelcomeBannerProps {
  user: User;
  onDismiss: () => void;
}

export function WelcomeBanner({ user, onDismiss }: WelcomeBannerProps) {
  const isNewUser = Date.now() - user.joinedDate < 60 * 60 * 1000; // Joined within last hour

  if (!isNewUser) return null;

  return (
    <Card className="relative overflow-hidden bg-white border-border/50 p-6 mb-8 animate-slide-up-fade shadow-sm">
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />

      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-2xl">
          👋
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-bold text-primary tracking-tight">
            Welcome to MoodTune, {user.name.split(' ')[0]}!
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            We're excited to have you here. Start your journey by journaling your thoughts below, 
            and we'll find the perfect soundtrack for your current emotional state.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground hover:text-primary"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Card>
  );
}
