import { useState } from 'react';
import { AnimatedLogo } from './AnimatedLogo';

interface LandingPageProps {
  onGetStarted: (mode: 'login' | 'signup') => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-accent/5 via-purple-500/5 to-pink-500/5 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header/Nav */}
        <header className="flex items-center justify-between px-8 py-6 animate-fade-in">
          <AnimatedLogo size="md" showText={true} />

          <div className="flex items-center gap-4">
            <button
              onClick={() => onGetStarted('login')}
              className="px-6 py-2.5 text-primary hover:text-accent transition-colors duration-300 font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => onGetStarted('signup')}
              className="px-6 py-2.5 bg-gradient-to-r from-accent to-purple-600 text-white rounded-xl font-medium hover:shadow-xl hover:shadow-accent/30 hover:scale-105 transition-all duration-300 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-8 py-20 text-center animate-slide-up-fade">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm text-accent animate-bounce-subtle">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI-Based Emotion Detection and Song Recommendation
            </div>

            {/* Main headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-accent via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift">
                Journal Your Mood,
              </span>
              <br />
              <span className="text-primary">
                Discover Your Sound
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your thoughts into emotional insights and find the perfect music to match your feelings. AI-powered journaling meets personalized music discovery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={() => onGetStarted('signup')}
                className="group relative px-10 py-5 bg-gradient-to-r from-accent via-purple-600 to-accent bg-size-200 bg-pos-0 text-white rounded-2xl font-semibold text-lg overflow-hidden transition-all duration-500 hover:bg-pos-100 hover:scale-105 hover:shadow-2xl hover:shadow-accent/50 active:scale-95"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  e.currentTarget.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px) scale(1.05)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Journey
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>

              <button
                onClick={() => onGetStarted('login')}
                className="px-10 py-5 bg-card/80 backdrop-blur-sm border-2 border-border hover:border-accent/50 text-primary rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                Watch Demo
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-600 border-2 border-background" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-background" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-600 to-red-600 border-2 border-background" />
                </div>
                <span>Join 10,000+ users</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-8 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to unlock your emotional journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '✍️',
                title: 'Journal Your Thoughts',
                description: 'Write freely about your day, feelings, or anything on your mind. No judgment, just pure expression.',
                color: 'from-accent to-purple-600',
              },
              {
                icon: '🧠',
                title: 'AI Analyzes Your Mood',
                description: 'Our advanced AI instantly detects your emotions and provides insights into your emotional patterns.',
                color: 'from-purple-600 to-pink-600',
              },
              {
                icon: '🎧',
                title: 'Get Music Recommendations',
                description: 'Discover personalized Spotify tracks that perfectly match your current mood and enhance your emotional state.',
                color: 'from-pink-600 to-red-600',
              },
            ].map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                {/* Card */}
                <div className="relative h-full p-8 bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:border-accent/50">
                  {/* Number badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-accent to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`text-6xl mb-6 transition-transform duration-300 ${hoveredFeature === index ? 'scale-110 animate-bounce-subtle' : ''}`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emotions Showcase */}
        <section className="px-8 py-20 bg-gradient-to-b from-transparent via-accent/5 to-transparent">
          <div className="max-w-7xl mx-auto text-center space-y-16">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">
                Track All Your Emotions
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From joy to sadness, happiness to anger — we understand them all
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { emoji: '😊', name: 'Happy', color: 'from-yellow-400 to-amber-500' },
                { emoji: '😢', name: 'Sad', color: 'from-indigo-500 to-blue-600' },
                { emoji: '😠', name: 'Angry', color: 'from-red-500 to-orange-600' },
                { emoji: '😐', name: 'Neutral', color: 'from-gray-400 to-slate-500' },
              ].map((mood, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-card/80 backdrop-blur-sm border border-border rounded-2xl transition-all duration-300 hover:scale-110 hover:border-accent/50 hover:shadow-2xl animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
                      {mood.emoji}
                    </div>
                    <p className="font-semibold text-primary">{mood.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-8 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8 p-12 bg-gradient-to-br from-accent/10 via-purple-500/10 to-pink-500/10 border border-accent/20 rounded-3xl backdrop-blur-sm relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users who are discovering their emotional patterns and finding their perfect soundtrack.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => onGetStarted('signup')}
                  className="group px-10 py-5 bg-gradient-to-r from-accent via-purple-600 to-accent bg-size-200 bg-pos-0 text-white rounded-2xl font-semibold text-lg transition-all duration-500 hover:bg-pos-100 hover:scale-105 hover:shadow-2xl hover:shadow-accent/50 active:scale-95"
                >
                  <span className="flex items-center gap-2">
                    Get Started Free
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </div>

              <p className="text-sm text-muted-foreground">
                No credit card required • Free forever • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-12 border-t border-border/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <AnimatedLogo size="md" showText={true} />

              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <a href="#" className="hover:text-accent transition-colors">About</a>
                <a href="#" className="hover:text-accent transition-colors">Features</a>
                <a href="#" className="hover:text-accent transition-colors">Privacy</a>
                <a href="#" className="hover:text-accent transition-colors">Terms</a>
                <a href="#" className="hover:text-accent transition-colors">Contact</a>
              </div>

              <p className="text-sm text-muted-foreground">
                © 2026 MoodTune. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
