import { useState } from 'react';
import { Button } from './ui/Button';

interface ProfileSettingsProps {
  onClose: () => void;
}

export function ProfileSettings({ onClose }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    name: 'Demo User',
    email: 'demo@moodtune.ai',
    bio: 'Music lover and mood enthusiast',
    notifications: true,
    darkMode: false,
    autoPlay: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings to localStorage
    localStorage.setItem('moodtune_profile', JSON.stringify(formData));
    alert('Settings saved successfully!');
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-border/60 w-full max-w-xl animate-scale-in overflow-hidden m-4 flex flex-col max-h-[calc(100vh-2rem)]">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 pb-2 shrink-0">
          <div className="pl-2">
            <h2 className="text-2xl font-bold text-primary tracking-tight">Account Settings</h2>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">Manage your preferences</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground hover:text-primary"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 pt-4 space-y-8 scrollbar-hide">
          {/* Profile Section */}
          <div className="flex items-center gap-6 p-4 bg-secondary/30 rounded-2xl border border-border/40">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white border border-border flex items-center justify-center text-3xl shadow-sm">
                👤
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 p-1.5 bg-accent text-white rounded-lg shadow-md hover:scale-110 transition-transform"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div>
              <h3 className="font-bold text-primary">Your Profile</h3>
              <p className="text-xs text-muted-foreground">Click the plus icon to change photo</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/60 rounded-xl focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5 outline-none transition-all text-sm font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/60 rounded-xl focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-secondary/50 border border-border/60 rounded-xl focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5 outline-none transition-all text-sm font-medium resize-none"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-transparent hover:border-border/40 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Notifications</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Get updates on your patterns</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => handleInputChange('notifications', e.target.checked)}
                className="w-10 h-5 rounded-full appearance-none bg-border/60 checked:bg-accent relative cursor-pointer transition-colors before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 before:transition-all shadow-sm"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-transparent hover:border-border/40 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Auto-play</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Start music immediately</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.autoPlay}
                onChange={(e) => handleInputChange('autoPlay', e.target.checked)}
                className="w-10 h-5 rounded-full appearance-none bg-border/60 checked:bg-accent relative cursor-pointer transition-colors before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 before:transition-all shadow-sm"
              />
            </label>
          </div>

          {/* Action Buttons - Also scrollable for now or fixed? Let's make them fixed at bottom */}
          <div className="flex items-center gap-4 pt-4 shrink-0">
            <Button
              type="submit"
              variant="primary"
              className="flex-1 py-4 text-sm font-bold"
            >
              Save Changes
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-sm font-bold text-muted-foreground hover:text-primary transition-colors bg-secondary/50 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
