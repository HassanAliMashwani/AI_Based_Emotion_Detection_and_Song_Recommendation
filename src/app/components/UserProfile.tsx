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
        className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white border border-border shadow-sm hover:shadow-md transition-all duration-300 group"
      >
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border border-border/50"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent border-2 border-white rounded-full shadow-sm" />
        </div>

        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-primary truncate max-w-[100px]">
            {user.name}
          </p>
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
        <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-border shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-[1.5rem] overflow-hidden animate-slide-up z-50">
          {/* User Info */}
          <div className="p-6 bg-secondary/30 border-b border-border/50">
            <div className="flex flex-col items-center text-center space-y-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="min-w-0">
                <p className="font-bold text-primary text-lg">{user.name}</p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSettings();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-white transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-primary">Edit Profile</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenStatistics();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-white transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-primary">My Statistics</span>
            </button>
          </div>

          <div className="border-t border-border/50 p-2">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 group-hover:text-red-600 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="text-sm font-medium text-primary transition-colors">
                Return to Home
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
