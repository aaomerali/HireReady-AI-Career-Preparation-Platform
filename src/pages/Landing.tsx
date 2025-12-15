import { useState } from "react";
import '../index.css'
import { Link } from "react-router-dom";
import logo from '../assets/logo.png'
import whiteLogo from '../assets/logo-white.png'
import heroImg from '../assets/hero-img.jpg'





const Landing = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[hsl(222.2,84%,4.9%)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[hsl(214.3,31.8%,91.4%)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ">
                <img src={logo} alt="logo" />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-gray-700"><span className="text-[#4589f7]">Hire</span>Ready</h1>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#features" className="hover:text-[hsl(217,91%,60%)] transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="hover:text-[hsl(217,91%,60%)] transition-colors font-medium">How It Works</a>
              <a href="#benefits" className="hover:text-[hsl(217,91%,60%)] transition-colors font-medium">Benefits</a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-xl"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              ☰
            </button>

            {/* Buttons */}
            <div className="hidden lg:flex gap-4">
              <Link to="/login" className="hidden md:block px-4 py-2 rounded-md hover:bg-[hsl(210,40%,96.1%)] transition-colors font-medium">Log In</Link>
              <Link to="/signup" className="px-4 md:px-6 py-2 text-sm md:text-base rounded-md bg-linear-to-br from-[hsl(217,91%,60%)] to-[hsl(217,91%,70%)] text-white font-semibold shadow-md hover:shadow-lg transition-shadow">Sign Up</Link>
            </div>
          </div>
        </div>

        {/* Mobile Nav Panel */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t shadow-md flex flex-col p-4 gap-4 animate-fadeIn">
            <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)}>How It Works</a>
            <a href="#benefits" onClick={() => setMobileOpen(false)}>Benefits</a>

            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-2 rounded-md bg-[hsl(210,40%,96.1%)] font-medium">Log In</button>
              <button className="flex-1 py-2 rounded-md bg-linear-to-br from-[hsl(217,91%,60%)] to-[hsl(217,91%,70%)] text-white font-semibold shadow-md">Sign Up</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 bg-linear-to-b from-[hsl(210,40%,96.1%)] to-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-block px-4 py-2 rounded-full bg-linear-to-br from-[hsl(217,91%,60%)] to-[hsl(217,91%,70%)] text-white text-sm font-semibold mb-6">
              #1 AI Interview Preparation Platform
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Master Your Next Interview with AI
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[hsl(217,19%,27%)] mb-8 leading-relaxed">
              Practice with AI-powered mock interviews, get instant feedback, and land your dream job. Join thousands of successful candidates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
              <Link to="/signup" className="px-8 py-3 rounded-lg bg-linear-to-br from-[hsl(217,91%,60%)] to-[hsl(217,91%,70%)] text-white font-semibold shadow-lg hover:shadow-xl transition-shadow">Get Started Free</Link>
              <Link to="/signup" className="px-8 py-3 rounded-lg border border-[hsl(214.3,31.8%,91.4%)] bg-white font-semibold hover:bg-[hsl(210,40%,96.1%)] transition-colors">Watch Demo</Link>
            </div>

            <div className="flex gap-6 sm:gap-10 justify-center lg:justify-start text-center">
              {[{
                value: "10,000+",
                label: "CVs Analyzed"
              }, {
                value: "5,000+",
                label: "Mock Interviews"
              }, {
                value: "95%",
                label: "Success Rate"
              }].map((stat, i) => (
                <div key={i}>
                  <div className="text-xl sm:text-2xl font-bold text-[hsl(217,91%,60%)]">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-[hsl(217,19%,27%)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={heroImg}
              alt="Interview preparation"
              className="w-full max-w-[450px] sm:max-w-[550px] rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything You Need to Succeed</h2>
            <p className="text-base md:text-lg text-[hsl(217,19%,27%)]">Powerful tools to help you prepare for your next interview</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[{
              title: "AI Mock Interviews",
              desc: "Practice with realistic AI-powered interview simulations",
              icon: "🎯"
            }, {
              title: "CV Analysis",
              desc: "Get detailed feedback on your resume with AI insights",
              icon: "📄"
            }, {
              title: "Instant Feedback",
              desc: "Receive real-time feedback on your responses",
              icon: "⚡"
            }, {
              title: "Industry Questions",
              desc: "Access thousands of real interview questions",
              icon: "💼"
            }, {
              title: "Progress Tracking",
              desc: "Monitor your improvement over time",
              icon: "📈"
            }, {
              title: "Expert Tips",
              desc: "Learn from industry professionals",
              icon: "💡"
            }].map((feature, idx) => (
              <div key={idx} className="p-6 md:p-8 rounded-xl bg-white border min-h-[200px] border-[hsl(214.3,31.8%,91.4%)] shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-[hsl(217,19%,27%)]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-14 md:py-20 bg-[hsl(210,40%,96.1%)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How HireReady Works</h2>
            <p className="text-base md:text-lg text-[hsl(217,19%,27%)]">Get started in just three simple steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[{
              step: "1",
              title: "Upload Your CV",
              desc: "Upload your resume and let our AI analyze it"
            }, {
              step: "2",
              title: "Practice Interviews",
              desc: "Choose your industry and start practicing"
            }, {
              step: "3",
              title: "Get Hired",
              desc: "Apply with confidence and land your dream job"
            }].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br from-[hsl(217,91%,60%)] to-[hsl(217,91%,70%)] text-white text-3xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm md:text-base text-[hsl(217,19%,27%)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose HireReady?</h2>
            <p className="text-base sm:text-lg text-[hsl(217,19%,27%)] mb-8">
              Join thousands of candidates who have successfully landed their dream jobs using our platform.
            </p>

            <div className="flex flex-col gap-4 mb-8">
              {["AI-powered mock interviews tailored to your industry", "Detailed CV analysis with improvement suggestions", "Access to 10,000+ real interview questions", "Track your progress and improve over time", "Get hired 3x faster than traditional methods"].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[hsl(217,91%,60%)] text-white flex items-center justify-center text-sm">✓</div>
                  <span className="text-sm sm:text-base">{benefit}</span>
                </div>
              ))}
            </div>

            <Link to="/signup" className="px-8 py-3 rounded-lg bg-linear-to-br from-[hsl(217,91%,60%)] to-[hsl(217,91%,70%)] text-white font-semibold shadow-lg hover:shadow-xl transition-shadow">Start Your Free Trial</Link>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[{
              value: "50,000+",
              label: "CVs Optimized"
            }, {
              value: "25,000+",
              label: "Interviews Completed"
            }, {
              value: "95%",
              label: "Success Rate"
            }, {
              value: "24/7",
              label: "Platform Access"
            }].map((stat, idx) => (
              <div key={idx} className="p-8 rounded-xl bg-white border border-[hsl(214.3,31.8%,91.4%)] text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-bold bg-linear-to-br from-[hsl(217,91%,60%)] to-[hsl(217,91%,70%)] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[hsl(217,19%,27%)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 bg-linear-to-br from-[hsl(217,91%,60%)] to-[hsl(217,91%,70%)] text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-block px-4 py-2 rounded-full bg-white/20 text-sm font-semibold mb-6">
            Limited Time Offer
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Ready to Transform Your Career?</h2>

          <p className="text-sm sm:text-base md:text-lg mb-8 opacity-90">
            Join thousands of successful candidates and start your journey today
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/signup" className="px-8 py-3 rounded-lg bg-white text-[hsl(217,91%,60%)] font-semibold shadow-lg hover:shadow-xl">Get Started Now</Link>
            <button className="px-8 py-3 rounded-lg border-2 border-white bg-transparent text-white font-semibold hover:bg-white/10">
              View Pricing
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center text-xs sm:text-sm opacity-90">
            <span>✓ No credit card required</span>
            <span>✓ Free forever plan</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 md:py-16 bg-[hsl(217,19%,27%)] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2 text-center md:text-left">
              <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ">
                  <img src={whiteLogo} alt="logo" />
                </div>
                <h1 className="text-lg md:text-xl font-bold text-white"><span className="text-[#4589f7]">Hire</span>Ready</h1>
              </div>
              <p className="opacity-80 mb-4 text-sm md:text-base">Your AI-powered interview preparation platform</p>
              <div className="flex gap-4 justify-center md:justify-start">
                {["F", "T", "L", "I"].map((letter, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    {letter}
                  </a>
                ))}
              </div>
            </div>

            {[{
              title: "Product",
              links: ["Features", "Pricing", "FAQ", "Demo"]
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"]
            }].map((section, idx) => (
              <div key={idx} className="text-center md:text-left">
                <h3 className="font-bold mb-4">{section.title}</h3>
                <div className="flex flex-col gap-2">
                  {section.links.map((link, linkIdx) => (
                    <a
                      key={linkIdx}
                      href="#"
                      className="opacity-80 hover:opacity-100 transition-opacity text-sm md:text-base"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 text-center opacity-80 text-xs md:text-sm">
            © 2024 HireReady. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;




