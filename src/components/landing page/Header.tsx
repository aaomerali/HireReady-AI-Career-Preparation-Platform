import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import logo from '../../assets/logo.png'

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ">
              <img src={logo} alt="logo" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-gray-700"><span className="text-[#4589f7]">Hire</span>Ready</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
              How It Works
            </a>
            <a href="#benefits" className="text-foreground hover:text-primary transition-colors font-medium">
              Benefits
            </a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors font-medium">
              Pricing
            </a>
          </nav>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost">
              Log In
            </Button>
            <Button variant="hero">
              Sign Up Free
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
