import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, Menu, X, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from './ui/Button';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface">
      {/* Navigation */}
      <nav className="border-b border-outline-variant sticky top-0 bg-white/95 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white mr-2.5 shadow-sm">
                B
              </div>
              <span className="font-bold text-lg tracking-tight text-on-surface">BETTERFIT LMS</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#" className="text-sm font-medium text-on-surface hover:text-primary transition-colors">Why BetterFit</a>
              <a href="#" className="text-sm font-medium text-on-surface hover:text-primary transition-colors">Platform</a>
              <a href="#" className="text-sm font-medium text-on-surface hover:text-primary transition-colors">Pricing</a>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="outlined" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Sign up free
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-on-surface p-2">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-outline-variant p-4 space-y-3">
             <a href="#" className="block text-sm font-medium text-on-surface py-1">Why BetterFit</a>
             <a href="#" className="block text-sm font-medium text-on-surface py-1">Platform</a>
             <a href="#" className="block text-sm font-medium text-on-surface py-1">Pricing</a>
             <div className="pt-3 border-t border-outline-variant flex flex-col space-y-2">
                <button 
                    onClick={() => navigate('/login')}
                    className="w-full text-center py-2 text-sm font-medium text-on-surface border border-outline-variant rounded-lg"
                >
                    Sign In
                </button>
                <button 
                    onClick={() => navigate('/signup')}
                    className="w-full bg-primary text-white py-2 rounded-full text-sm font-medium"
                >
                    Sign up free
                </button>
             </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center rounded-full px-3.5 py-1 text-xs font-medium text-on-primary-container bg-primary-container border border-primary/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
            Now with AI-Powered IQA Sampling & Moderation
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-on-surface tracking-tight mb-6 leading-tight">
            Purpose-Built for <br />
            <span className="text-primary">Regulated Qualification Providers</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-base md:text-lg text-on-surface-muted leading-relaxed mb-8">
            An all-in-one LMS that makes high-standard compliance effortless. BetterFit connects learners, tutors, assessors, and moderation teams in one seamless workflow to ensure your institution is always audit-ready.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-16">
            <Button onClick={() => navigate('/signup')}>
              Sign up free
            </Button>
            <Button variant="secondary" icon={Play} onClick={() => navigate('/login')}>
              Explore Platform
            </Button>
          </div>

          {/* Dashboard Preview Surface */}
          <div className="relative max-w-4xl mx-auto">
             <div className="rounded-xl bg-white p-2 shadow-lg border border-outline-variant">
                <div className="rounded-lg bg-surface overflow-hidden relative aspect-[16/9] flex flex-col border border-outline-variant">
                    {/* Header */}
                    <div className="h-10 border-b border-outline-variant flex items-center justify-between px-4 bg-white">
                         <div className="flex items-center space-x-1.5">
                             <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-warning"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                         </div>
                         <div className="h-5 bg-surface rounded px-3 text-[11px] text-on-surface-muted font-mono border border-outline-variant flex items-center">
                            portal.betterfitlms.com/dashboard
                         </div>
                         <div className="w-10"></div>
                    </div>
                    {/* Simulated Content */}
                    <div className="flex-1 p-6 grid grid-cols-4 gap-4">
                        <div className="col-span-1 bg-white rounded-md border border-outline-variant p-3 flex flex-col gap-2">
                            <div className="h-3 w-3/4 bg-[#D1FAE5] rounded"></div>
                            <div className="h-2 w-1/2 bg-outline-variant rounded"></div>
                            <div className="h-2 w-2/3 bg-outline-variant rounded"></div>
                        </div>
                        <div className="col-span-3 grid grid-rows-3 gap-3">
                            <div className="row-span-1 grid grid-cols-3 gap-3">
                                <div className="bg-white rounded-md border border-outline-variant p-3 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-[#D1FAE5] flex items-center justify-center text-[#10B981] font-bold text-xs">✓</div>
                                    <div>
                                        <div className="h-2.5 w-12 bg-secondary/80 rounded mb-1"></div>
                                        <div className="h-2 w-8 bg-outline-variant rounded"></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-md border border-outline-variant p-3 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-xs">★</div>
                                    <div>
                                        <div className="h-2.5 w-12 bg-secondary/80 rounded mb-1"></div>
                                        <div className="h-2 w-8 bg-outline-variant rounded"></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-md border border-outline-variant p-3 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-secondary-container flex items-center justify-center text-secondary font-bold text-xs">⚡</div>
                                    <div>
                                        <div className="h-2.5 w-12 bg-secondary/80 rounded mb-1"></div>
                                        <div className="h-2 w-8 bg-outline-variant rounded"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="row-span-2 bg-white rounded-md border border-outline-variant p-4 flex flex-col justify-between">
                                <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                                    <span className="text-xs font-semibold text-on-surface">Active Submissions</span>
                                    <span className="text-xs font-medium text-[#10B981]">100% Compliant</span>
                                </div>
                                <div className="flex items-center justify-around py-2">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-[#10B981]">98.4%</div>
                                        <div className="text-[10px] text-on-surface-muted">Pass Rate</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-on-surface-variant">24h</div>
                                        <div className="text-[10px] text-on-surface-muted">Avg Turnaround</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-secondary">Zero</div>
                                        <div className="text-[10px] text-on-surface-muted">Audit Sanctions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;