import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, Menu, X, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans text-[#1A1A2E]">
      {/* Navigation */}
      <nav className="border-b border-[#E5E7EB] sticky top-0 bg-white/95 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center font-bold text-white mr-2.5 shadow-sm">
                B
              </div>
              <span className="font-bold text-lg tracking-tight text-[#1A1A2E]">BETTERFIT LMS</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#" className="text-sm font-medium text-[#1A1A2E] hover:text-[#10B981] transition-colors">Why BetterFit</a>
              <a href="#" className="text-sm font-medium text-[#1A1A2E] hover:text-[#10B981] transition-colors">Platform</a>
              <a href="#" className="text-sm font-medium text-[#1A1A2E] hover:text-[#10B981] transition-colors">Pricing</a>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={() => navigate('/login')} 
                className="btn-secondary py-2 px-4 text-sm"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="btn-primary py-2 px-4 text-sm"
              >
                Sign up free
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#1A1A2E] p-2">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E5E7EB] p-4 space-y-3">
             <a href="#" className="block text-sm font-medium text-[#1A1A2E] py-1">Why BetterFit</a>
             <a href="#" className="block text-sm font-medium text-[#1A1A2E] py-1">Platform</a>
             <a href="#" className="block text-sm font-medium text-[#1A1A2E] py-1">Pricing</a>
             <div className="pt-3 border-t border-[#E5E7EB] flex flex-col space-y-2">
                <button 
                    onClick={() => navigate('/login')}
                    className="w-full text-center py-2 text-sm font-medium text-[#1A1A2E] border border-[#E5E7EB] rounded-lg"
                >
                    Sign In
                </button>
                <button 
                    onClick={() => navigate('/signup')}
                    className="w-full bg-[#10B981] text-white py-2 rounded-lg text-sm font-medium"
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
          <div className="inline-flex items-center rounded-full px-3.5 py-1 text-xs font-medium text-[#059669] bg-[#D1FAE5] border border-[#10B981]/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#10B981]" />
            Now with AI-Powered IQA Sampling & Moderation
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-[#1A1A2E] tracking-tight mb-6 leading-tight">
            Purpose-Built for <br />
            <span className="text-[#10B981]">Regulated Qualification Providers</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-base md:text-lg text-[#6B7280] leading-relaxed mb-8">
            An all-in-one LMS that makes high-standard compliance effortless. BetterFit connects learners, tutors, assessors, and moderation teams in one seamless workflow to ensure your institution is always audit-ready.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-16">
            <button 
              onClick={() => navigate('/signup')}
              className="btn-primary py-3 px-6 text-sm flex items-center justify-center"
            >
              Sign up free <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="btn-accent py-3 px-6 text-sm flex items-center justify-center"
            >
              <Play className="mr-2 w-4 h-4 fill-current" /> Explore Platform
            </button>
          </div>

          {/* Dashboard Preview Surface */}
          <div className="relative max-w-4xl mx-auto">
             <div className="rounded-xl bg-white p-2 shadow-lg border border-[#E5E7EB]">
                <div className="rounded-lg bg-[#F8FAFB] overflow-hidden relative aspect-[16/9] flex flex-col border border-[#E5E7EB]">
                    {/* Header */}
                    <div className="h-10 border-b border-[#E5E7EB] flex items-center justify-between px-4 bg-white">
                         <div className="flex items-center space-x-1.5">
                             <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                         </div>
                         <div className="h-5 bg-[#F8FAFB] rounded px-3 text-[11px] text-[#6B7280] font-mono border border-[#E5E7EB] flex items-center">
                            portal.betterfitlms.com/dashboard
                         </div>
                         <div className="w-10"></div>
                    </div>
                    {/* Simulated Content */}
                    <div className="flex-1 p-6 grid grid-cols-4 gap-4">
                        <div className="col-span-1 bg-white rounded-md border border-[#E5E7EB] p-3 flex flex-col gap-2">
                            <div className="h-3 w-3/4 bg-[#D1FAE5] rounded"></div>
                            <div className="h-2 w-1/2 bg-[#E5E7EB] rounded"></div>
                            <div className="h-2 w-2/3 bg-[#E5E7EB] rounded"></div>
                        </div>
                        <div className="col-span-3 grid grid-rows-3 gap-3">
                            <div className="row-span-1 grid grid-cols-3 gap-3">
                                <div className="bg-white rounded-md border border-[#E5E7EB] p-3 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-[#D1FAE5] flex items-center justify-center text-[#10B981] font-bold text-xs">✓</div>
                                    <div>
                                        <div className="h-2.5 w-12 bg-[#1A1A2E]/80 rounded mb-1"></div>
                                        <div className="h-2 w-8 bg-[#E5E7EB] rounded"></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-md border border-[#E5E7EB] p-3 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-[#E0E7FF] flex items-center justify-center text-[#7C3AED] font-bold text-xs">★</div>
                                    <div>
                                        <div className="h-2.5 w-12 bg-[#1A1A2E]/80 rounded mb-1"></div>
                                        <div className="h-2 w-8 bg-[#E5E7EB] rounded"></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-md border border-[#E5E7EB] p-3 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-[#CFFAFE] flex items-center justify-center text-[#06B6D4] font-bold text-xs">⚡</div>
                                    <div>
                                        <div className="h-2.5 w-12 bg-[#1A1A2E]/80 rounded mb-1"></div>
                                        <div className="h-2 w-8 bg-[#E5E7EB] rounded"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="row-span-2 bg-white rounded-md border border-[#E5E7EB] p-4 flex flex-col justify-between">
                                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                                    <span className="text-xs font-semibold text-[#1A1A2E]">Active Submissions</span>
                                    <span className="text-xs font-medium text-[#10B981]">100% Compliant</span>
                                </div>
                                <div className="flex items-center justify-around py-2">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-[#10B981]">98.4%</div>
                                        <div className="text-[10px] text-[#6B7280]">Pass Rate</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-[#7C3AED]">24h</div>
                                        <div className="text-[10px] text-[#6B7280]">Avg Turnaround</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-[#06B6D4]">Zero</div>
                                        <div className="text-[10px] text-[#6B7280]">Audit Sanctions</div>
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