import { useState } from 'react';
import { User } from '../services/authService';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenStatistics: () => void;
}

export function UserProfile({ user, onLogout, onOpenSettings, onOpenStatistics }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  const daysSinceJoined = Math.floor((Date.now() - user.joinedDate) / (1000 * 60 * 60 * 24));

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-secondary transition-all duration-300 group"
      >
        <div className="relative">
          {/* Avatar with animated ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-accent via-purple-600 to-accent rounded-full opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity" />
          <img
            src={user.avatar}
            alt={user.name}
            className="relative w-10 h-10 rounded-full object-cover ring-2 ring-border group-hover:ring-accent/50 transition-all"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full animate-pulse-glow" />
        </div>

        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground">View profile</p>
        </div>

        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up z-50">
          {/* User Info */}
          <div className="p-6 bg-gradient-to-br from-accent/10 to-purple-600/10 border-b border-border">
            <div className="flex items-start gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-accent/30"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-primary truncate">{user.name}</p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Member for {daysSinceJoined} days
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSettings();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors text-left group"
            >
              <svg className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm text-primary">Edit Profile</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenStatistics();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors text-left group"
            >
              <svg className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm text-primary">My Statistics</span>
            </button>
          </div>

          <div className="border-t border-border p-2">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left group"
            >
              <svg className="w-5 h-5 text-muted-foreground group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm text-primary group-hover:text-red-600 transition-colors">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
