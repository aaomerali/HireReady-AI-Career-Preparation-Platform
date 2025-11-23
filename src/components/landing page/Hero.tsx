import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Career Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Land Your Dream Job with{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                HireReady
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Empower your job search with AI-driven CV analysis, realistic mock interviews, 
              and curated job resources. Everything you need to ace your next career move.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-primary">10,000+</p>
                <p className="text-sm text-muted-foreground">CVs Analyzed</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-accent">5,000+</p>
                <p className="text-sm text-muted-foreground">Mock Interviews</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-secondary">95%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative lg:block hidden">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="Professional preparing for career with HireReady platform" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-strong border border-border animate-fade-in">
              <p className="text-sm font-semibold text-foreground">✓ CV Score: 92%</p>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-strong border border-border animate-fade-in">
              <p className="text-sm font-semibold text-foreground">🎯 Interview Ready!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
