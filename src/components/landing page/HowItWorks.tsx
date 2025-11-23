import { UserPlus, FileEdit, Video, Trophy } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your free account in seconds and access all platform features immediately.",
    step: "01",
  },
  {
    icon: FileEdit,
    title: "Build Your CV",
    description: "Choose from professional templates and let our AI analyze and optimize your résumé.",
    step: "02",
  },
  {
    icon: Video,
    title: "Practice Interviews",
    description: "Conduct AI-powered mock interviews tailored to your target role and receive detailed feedback.",
    step: "03",
  },
  {
    icon: Trophy,
    title: "Land the Job",
    description: "Apply with confidence using our job resources hub and your polished application materials.",
    step: "04",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            How <span className="bg-gradient-hero bg-clip-text text-transparent">HireReady</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform your job search and land your dream position
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Line - Hidden on mobile */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary opacity-20" />
          
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-soft space-y-4 h-full">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center shadow-soft mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-6xl font-bold text-muted/10">
                    {step.step}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
