import { AnimatedLogo } from './AnimatedLogo';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden font-sans">
      
      {/* Soft Glow Background Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-secondary/40 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] opacity-70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Navbar */}
        <header className="flex items-center justify-between py-4 sm:py-6 animate-fade-in gap-2 sm:gap-4">
          <div className="transform scale-90 sm:scale-100 origin-left flex-shrink-0">
            <AnimatedLogo size="md" />
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Features</a>
            <a href="#" className="hover:text-primary transition-colors">How it Works</a>
          </div>

          <div className="flex items-center">
            <Button variant="primary" onClick={() => onGetStarted()} className="whitespace-nowrap px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base">
              Check My Mood
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-24 pb-32 flex flex-col lg:flex-row items-center gap-16 animate-slide-up-fade">
          
          {/* Left Text */}
          <div className="flex-1 space-y-8 text-center lg:text-left z-10">
            <Badge variant="success" className="mb-4">
              ✨ The New Standard in Emotion AI
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.1] tracking-tight">
              Understand Your Mood.<br />
              <span className="text-muted-foreground">Discover Your Sound.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transform your daily thoughts into emotional insights and discover the perfect Spotify soundtrack tailored exactly to how you feel.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <Button size="lg" variant="primary" onClick={() => onGetStarted()}>
                Check My Mood
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-8 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary" />
                <div className="w-8 h-8 rounded-full border-2 border-background bg-[#C4E4AC]" />
                <div className="w-8 h-8 rounded-full border-2 border-background bg-[#59CF2A]" />
              </div>
              <p>Trusted by over 10,000+ mindful users</p>
            </div>
          </div>

          {/* Right Visual Preview (Mock Dashboard) */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            {/* Base Glass Card */}
            <Card variant="glass" className="relative z-10 w-full aspect-[4/3] p-8 border-white/40 rotate-1 hover:rotate-0 transition-transform duration-500">
              
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-6">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Current Mood Insight</p>
                  <h3 className="text-3xl font-bold text-primary">Joyful Focus</h3>
                </div>
                <Badge variant="success" size="md">92% Confidence</Badge>
              </div>

              {/* Mock Stat Row */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-secondary/30 rounded-2xl p-5 border border-white/50">
                  <p className="text-sm text-muted-foreground mb-2">Energy Level</p>
                  <p className="text-2xl font-bold text-primary">High</p>
                </div>
                <div className="bg-secondary/30 rounded-2xl p-5 border border-white/50">
                  <p className="text-sm text-muted-foreground mb-2">Recommended Genre</p>
                  <p className="text-2xl font-bold text-primary">Indie Pop</p>
                </div>
              </div>

              {/* Mock Track List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-white/40">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-accent rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-sm">Sunrise Melody</p>
                      <p className="text-xs text-muted-foreground">The Early Birds</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-accent">+ Added to Queue</span>
                </div>
                <div className="flex items-center justify-between bg-white/30 p-4 rounded-xl border border-white/40">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-muted-foreground rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-sm">Ocean Drive</p>
                      <p className="text-xs text-muted-foreground">Coastal Vibes</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Floating Element 1 */}
            <Card className="absolute -top-4 -left-2 sm:-top-6 sm:-left-12 z-20 w-36 sm:w-48 p-2.5 sm:p-4 shadow-xl border border-border/50 animate-float">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-100 flex items-center justify-center text-xs sm:text-sm">😊</div>
                <p className="font-semibold text-primary text-xs sm:text-sm">Happy</p>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-accent rounded-full" />
              </div>
            </Card>

            {/* Floating Element 2 */}
            <Card className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-right-8 z-20 w-44 sm:w-56 p-3 sm:p-5 shadow-2xl border border-border/50 animate-float" style={{ animationDelay: '1s' }}>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Recent Analysis</p>
              <p className="text-xs sm:text-sm font-medium text-primary mb-2 sm:mb-3">"Feeling great about the launch today!"</p>
              <Badge variant="outline" className="text-[10px] sm:text-xs px-2 py-0.5">Positive Sentiment</Badge>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}
