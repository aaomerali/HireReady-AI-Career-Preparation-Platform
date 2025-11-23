import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Professional CV templates designed by industry experts",
  "AI-powered analysis with actionable improvement suggestions",
  "Realistic mock interviews with instant feedback",
  "Voice and video simulation for authentic practice",
  "Job fit scoring to match your CV with real positions",
  "Curated job boards organized by location and industry",
  "Performance tracking and progress monitoring",
  "Secure platform with enterprise-grade data protection",
];

const Benefits = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits List */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  HireReady?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of job seekers who have transformed their careers with our comprehensive platform
              </p>
            </div>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 group"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
            
            <Button variant="hero" size="xl" className="mt-8">
              Start Your Journey Today
            </Button>
          </div>
          
          {/* Right Side - Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-8 border border-border shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
              <p className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                10K+
              </p>
              <p className="text-muted-foreground">CVs Optimized</p>
            </div>
            
            <div className="bg-card rounded-xl p-8 border border-border shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1 mt-8">
              <p className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent mb-2">
                5K+
              </p>
              <p className="text-muted-foreground">Interviews Completed</p>
            </div>
            
            <div className="bg-card rounded-xl p-8 border border-border shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
              <p className="text-5xl font-bold text-secondary mb-2">
                95%
              </p>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            
            <div className="bg-card rounded-xl p-8 border border-border shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1 mt-8">
              <p className="text-5xl font-bold text-primary mb-2">
                24/7
              </p>
              <p className="text-muted-foreground">Platform Access</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
