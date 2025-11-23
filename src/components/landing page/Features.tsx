import { FileText, MessageSquare, Briefcase, TrendingUp, Award, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "CV Builder & Analyzer",
    description: "Create professional résumés with customizable templates and get AI-powered analysis with actionable feedback and job fit scores.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: MessageSquare,
    title: "AI Mock Interviews",
    description: "Practice with realistic AI-powered interviews tailored to your field. Get instant feedback on your responses and improve your performance.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Briefcase,
    title: "Job Resources Hub",
    description: "Access curated job boards, internship platforms, and freelancing websites organized by country and industry for easy navigation.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    description: "Monitor your progress with detailed statistics on CV analyses, interview completions, and improvement trends over time.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Award,
    title: "Personalized Insights",
    description: "Receive customized recommendations to enhance your CV, improve interview skills, and match job requirements effectively.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security. Practice and prepare with complete peace of mind.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything You Need to{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and resources designed to give you the competitive edge in your job search
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border hover:shadow-strong transition-all duration-300 hover:-translate-y-1 bg-card"
            >
              <CardContent className="p-6 space-y-4">
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
