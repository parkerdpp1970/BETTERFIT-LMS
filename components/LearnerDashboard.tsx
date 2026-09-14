
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Calendar as CalendarIcon, CheckCircle, Clock, BookOpen, ChevronRight, Award, Zap, AlertCircle, FileBarChart, User, FileCheck, ChevronLeft, Video, Bell, MessageSquare, Mail } from 'lucide-react';
import Button from './ui/Button';

// --- Default Mock Banners (Fallback) ---
const DEFAULT_BANNERS = [
    {
        id: 'default_1',
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
        title: "CONTINUOUS PROFESSIONAL DEVELOPMENT COURSES",
        subtitle: "Expand your expertise with our latest modules: Kettlebells, Suspension Training, and more.",
        cta: "View Courses",
        bgOverlay: "bg-gradient-to-r from-secondary/90 via-secondary/60 to-transparent",
        accentColor: "text-primary-fixed-dim",
        buttonStyle: "bg-primary text-white hover:bg-primary-deep"
    },
    {
        id: 'default_2',
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
        title: "Book a 1-on-1 Tutorial with Your Tutor",
        subtitle: "Need help with Unit 6? Schedule a session today to review your practical progress.",
        cta: "Book Now",
        bgOverlay: "bg-gradient-to-r from-primary/90 via-primary/60 to-transparent",
        accentColor: "text-white",
        buttonStyle: "bg-white text-primary hover:bg-primary-container"
    },
    {
        id: 'default_3',
        image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
        title: "Special Offer: 50% Off CPD Workshops",
        subtitle: "Limited time offer on all Level 4 specialist courses. Upgrade your qualifications today.",
        cta: "Explore Workshops",
        bgOverlay: "bg-gradient-to-r from-tertiary/90 via-tertiary/60 to-transparent",
        accentColor: "text-primary-fixed-dim",
        buttonStyle: "bg-primary text-white hover:bg-primary-deep"
    }
];

// --- Mock Current User Context ---
// In a real app, this would come from a user session/context
const CURRENT_LEARNER_GROUP_ID = 'g1'; // Simulating David is in 'Level 3 PT, September'

const LearnerDashboard: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE FOR BANNER CAROUSEL ---
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [dashboardBanners, setDashboardBanners] = useState<any[]>(DEFAULT_BANNERS);

  // Load banners from LocalStorage on mount
  useEffect(() => {
      const saved = localStorage.getItem('betterfit_banners');
      if (saved) {
          const parsed: any[] = JSON.parse(saved);
          
          // Filter Logic:
          // 1. Must be set to 'isVisible'
          // 2. Audience Check: 'all' OR learner's group is in 'targetGroups'
          const visibleBanners = parsed.filter(b => {
              if (!b.isVisible) return false;
              if (b.targetAudience === 'all') return true;
              if (b.targetAudience === 'specific' && b.targetGroups && b.targetGroups.includes(CURRENT_LEARNER_GROUP_ID)) return true;
              return false;
          });
          
          if (visibleBanners.length > 0) {
              const mapped = visibleBanners.map(b => ({
                  id: b.id,
                  image: b.bgImage || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop", // Fallback image if none selected
                  title: b.title,
                  subtitle: b.subtitle,
                  cta: b.ctaText,
                  // Standard styling for user-created banners (since builder doesn't specify styles yet)
                  bgOverlay: "bg-gradient-to-r from-black/80 via-black/50 to-transparent",
                  accentColor: "text-[#01b3ef]",
                  buttonStyle: "bg-[#01b3ef] text-white hover:bg-[#01427a]"
              }));
              setDashboardBanners(mapped);
          } else {
              // If user has saved banners but none are suitable for this learner, keep defaults or show empty? 
              // Showing defaults ensures the UI doesn't break for prototype.
              setDashboardBanners(DEFAULT_BANNERS);
          }
      }
  }, []);

  // Auto-rotate banners
  useEffect(() => {
      if (dashboardBanners.length <= 1) return;
      
      const interval = setInterval(() => {
          setCurrentBannerIndex((prev) => (prev + 1) % dashboardBanners.length);
      }, 6000);
      return () => clearInterval(interval);
  }, [dashboardBanners.length]);

  const nextBanner = () => setCurrentBannerIndex((prev) => (prev + 1) % dashboardBanners.length);
  const prevBanner = () => setCurrentBannerIndex((prev) => (prev - 1 + dashboardBanners.length) % dashboardBanners.length);


  // --- MOCK LEARNER DATA ---
  const learnerName = "David";
  const currentCourse = {
      title: "Level 2 Gym Instructor",
      progress: 30,
      nextUnit: "Unit 6: Practical Delivery",
      lastLesson: "The Warm-Up Phase"
  };

  // Expanded Notification / Submission Data
  const notifications = [
      { 
          id: 1, 
          type: 'due_date', 
          title: "Submission Due Soon", 
          message: "Q2. Main component (CV1) is due in 2 days.",
          action: "Submit Now",
          time: "2 days left",
          icon: Clock,
          color: "text-orange-500",
          bgColor: "bg-orange-50"
      },
      { 
          id: 2, 
          type: 'feedback', 
          title: "Tutor Feedback", 
          message: "Sarah left feedback on 'Session Preparation': Excellent setup, just ensure safety checks are verbalized.",
          action: "View Feedback",
          time: "1 hour ago",
          icon: MessageSquare,
          color: "text-[#01b3ef]",
          bgColor: "bg-[#01b3ef]/10"
      },
      { 
          id: 3, 
          type: 'result', 
          title: "Submission Result", 
          message: "You achieved a PASS in Unit 1: Anatomy & Physiology Exam.",
          action: "View Certificate",
          time: "Yesterday",
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50"
      },
      { 
          id: 4, 
          type: 'admin', 
          title: "Community Message", 
          message: "Webinar: 'Building your PT Business' starts on Friday at 4 PM.",
          action: "Register",
          time: "2 days ago",
          icon: Bell,
          color: "text-[#6c6c6c]",
          bgColor: "bg-slate-100"
      }
  ];

  // Calendar Mock Data
  const currentMonth = "November 2023";
  const daysInMonth = 30;
  const startDayOffset = 3; // Starts on Wed
  const eventDates = [
      { day: 5, type: 'webinar' },
      { day: 12, type: 'deadline' },
      { day: 15, type: 'webinar' },
      { day: 24, type: 'class' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* 1. PROMOTIONAL BANNER CAROUSEL */}
      <div className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden shadow-lg group">
          
          {dashboardBanners.length > 0 && (
            <>
                {/* Background Image & Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform scale-105"
                    style={{ backgroundImage: `url(${dashboardBanners[currentBannerIndex].image})` }}
                ></div>
                <div className={`absolute inset-0 ${dashboardBanners[currentBannerIndex].bgOverlay}`}></div>

                {/* Banner Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-3xl z-10">
                    <span className={`text-xs font-extrabold uppercase tracking-[0.2em] mb-3 animate-in slide-in-from-left-4 duration-700 ${dashboardBanners[currentBannerIndex].accentColor}`}>
                        Featured
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 animate-in slide-in-from-left-4 duration-700 delay-100 shadow-black drop-shadow-lg">
                        {dashboardBanners[currentBannerIndex].title}
                    </h2>
                    <p className="text-white/90 text-lg mb-8 font-medium animate-in slide-in-from-left-4 duration-700 delay-200 max-w-xl">
                        {dashboardBanners[currentBannerIndex].subtitle}
                    </p>
                    {dashboardBanners[currentBannerIndex].cta && (
                        <button className={`px-8 py-3 rounded-lg font-bold shadow-lg transition-transform hover:scale-105 w-fit animate-in fade-in duration-700 delay-300 ${dashboardBanners[currentBannerIndex].buttonStyle}`}>
                            {dashboardBanners[currentBannerIndex].cta}
                        </button>
                    )}
                </div>
            </>
          )}

          {/* Controls */}
          {dashboardBanners.length > 1 && (
              <>
                <button 
                    onClick={prevBanner}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                    onClick={nextBanner}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {dashboardBanners.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentBannerIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentBannerIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
              </>
          )}
      </div>

      {/* 2. COMPACT WELCOME & CURRENT COURSE */}
      <div className="bg-white rounded-lg shadow-sm border border-outline-variant p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
              <h1 className="text-2xl font-bold text-on-surface mb-1">Hello, {learnerName} 👋</h1>
              <p className="text-sm text-on-surface-muted">Ready to continue your learning journey?</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto bg-surface px-4 py-3 rounded-lg border border-outline-variant">
              <div className="min-w-[180px]">
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-on-surface">{currentCourse.title}</span>
                      <span className="text-primary font-semibold">{currentCourse.progress}%</span>
                  </div>
                  <div className="w-full bg-outline-variant h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${currentCourse.progress}%` }}></div>
                  </div>
              </div>
              <Button size="sm" icon={Play} onClick={() => navigate('/learner/lesson/1')}>
                  Resume
              </Button>
          </div>
      </div>

      {/* 3. QUICK ACTIONS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div 
            className="h-28 flex flex-col items-center justify-center text-center p-3 rounded-lg bg-white shadow-sm border border-outline-variant hover:border-primary-fixed-dim hover:bg-surface-container-low transition-all cursor-pointer group" 
            onClick={() => navigate('/learner/my-courses')}
          >
              <BookOpen className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-105 transition-transform" />
              <span className="block font-medium text-on-surface text-xs">My Courses</span>
          </div>
          <div className="h-28 flex flex-col items-center justify-center text-center p-3 rounded-lg bg-white shadow-sm border border-outline-variant hover:border-primary-fixed-dim hover:bg-surface-container-low transition-all cursor-pointer group">
              <FileBarChart className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-105 transition-transform" />
              <span className="block font-medium text-on-surface text-xs">My Progress</span>
          </div>
          <div className="h-28 flex flex-col items-center justify-center text-center p-3 rounded-lg bg-white shadow-sm border border-outline-variant hover:border-primary-fixed-dim hover:bg-surface-container-low transition-all cursor-pointer group">
              <FileCheck className="w-6 h-6 text-on-surface-variant mx-auto mb-2 group-hover:scale-105 transition-transform" />
              <span className="block font-medium text-on-surface text-xs">My Results</span>
          </div>
          <div 
            className="h-28 flex flex-col items-center justify-center text-center p-3 rounded-lg bg-white shadow-sm border border-outline-variant hover:border-primary-fixed-dim hover:bg-surface-container-low transition-all cursor-pointer group" 
            onClick={() => navigate('/calendar')}
          >
              <CalendarIcon className="w-6 h-6 text-warning mx-auto mb-2 group-hover:scale-105 transition-transform" />
              <span className="block font-medium text-on-surface text-xs">My Calendar</span>
          </div>
          <div className="h-28 flex flex-col items-center justify-center text-center p-3 rounded-lg bg-white shadow-sm border border-outline-variant hover:border-primary-fixed-dim hover:bg-surface-container-low transition-all cursor-pointer group">
              <Award className="w-6 h-6 text-secondary mx-auto mb-2 group-hover:scale-105 transition-transform" />
              <span className="block font-medium text-on-surface text-xs">My CPD</span>
          </div>
          <div 
            className="h-28 flex flex-col items-center justify-center text-center p-3 rounded-lg bg-white shadow-sm border border-outline-variant hover:border-primary-fixed-dim hover:bg-surface-container-low transition-all cursor-pointer group"
            onClick={() => navigate('/learner/profile')}
          >
              <User className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-105 transition-transform" />
              <span className="block font-medium text-on-surface text-xs">My Profile</span>
          </div>
      </div>

      {/* 4. MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT (2/3): Active Submissions & Notifications */}
          <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-lg shadow-sm border border-outline-variant overflow-hidden h-full">
                  <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface">
                      <h2 className="text-base font-semibold text-on-surface flex items-center">
                          <Bell className="w-4 h-4 mr-2 text-primary" /> Recent Notifications
                      </h2>
                      <span className="badge-pending">{notifications.length} New</span>
                  </div>
                  
                  <div className="divide-y divide-outline-variant">
                      {notifications.map((item) => (
                          <div key={item.id} className="p-4 hover:bg-surface transition-colors flex items-start gap-3.5">
                              <div className={`p-2.5 rounded-full shrink-0 ${
                                item.type === 'result' ? 'bg-[#D1FAE5] text-[#059669]' :
                                item.type === 'due_date' ? 'bg-warning-container text-on-warning-container' :
                                item.type === 'feedback' ? 'bg-[#CFFAFE] text-[#0891b2]' :
                                'bg-[#F3F4F6] text-on-surface-muted'
                              }`}>
                                  <item.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                  <div className="flex justify-between items-start mb-1">
                                      <h3 className="text-sm font-semibold text-on-surface">{item.title}</h3>
                                      <span className={`text-xs ${item.type === 'due_date' ? 'text-error font-medium' : 'text-on-surface-muted'}`}>
                                          {item.time}
                                      </span>
                                  </div>
                                  <p className="text-xs text-on-surface-muted mb-2 leading-relaxed">
                                      {item.message}
                                  </p>
                                  
                                  <div className="flex items-center gap-3">
                                      <button className="text-xs font-medium text-secondary hover:text-primary flex items-center transition-colors">
                                          {item.action} <ChevronRight className="w-3 h-3 ml-1" />
                                      </button>
                                      {item.type === 'due_date' && (
                                          <button className="text-xs font-medium text-on-surface-variant hover:underline flex items-center transition-colors">
                                              <Zap className="w-3 h-3 mr-1" /> Get AI Assistance
                                          </button>
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="p-3 bg-surface border-t border-outline-variant text-center">
                      <button className="text-xs font-medium text-on-surface-muted hover:text-primary">View All Notifications</button>
                  </div>
              </div>

          </div>

          {/* RIGHT (1/3): Sidebar - CALENDAR WIDGET */}
          <div className="space-y-6">
              
              {/* Calendar Widget */}
              <div className="bg-white rounded-lg shadow-sm border border-outline-variant overflow-hidden">
                  <div className="bg-white p-4 border-b border-outline-variant">
                      <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-sm text-on-surface">{currentMonth}</h3>
                          <div className="flex gap-1">
                              <button className="p-1 hover:bg-surface rounded text-on-surface-muted"><ChevronLeft className="w-4 h-4" /></button>
                              <button className="p-1 hover:bg-surface rounded text-on-surface-muted"><ChevronRight className="w-4 h-4" /></button>
                          </div>
                      </div>
                      <div className="grid grid-cols-7 text-center text-[11px] font-medium text-outline mb-2">
                          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                      </div>
                      <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
                          {/* Empty cells for start offset */}
                          {Array.from({length: startDayOffset}).map((_, i) => <div key={`empty-${i}`}></div>)}
                          
                          {Array.from({length: daysInMonth}).map((_, i) => {
                              const day = i + 1;
                              const hasEvent = eventDates.find(e => e.day === day);
                              const isToday = day === 24; // Mock today
                              
                              return (
                                  <div key={day} className="flex flex-col items-center justify-center relative py-1 cursor-pointer">
                                      <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs transition-colors ${
                                          isToday ? 'bg-primary text-white font-medium shadow-sm' : 
                                          hasEvent ? 'hover:bg-surface-container-low text-on-surface font-medium' : 'text-on-surface-muted hover:bg-surface'
                                      }`}>
                                          {day}
                                      </div>
                                      {hasEvent && (
                                          <div className={`w-1 h-1 rounded-full absolute bottom-0.5 ${
                                              hasEvent.type === 'webinar' ? 'bg-[#06B6D4]' : 
                                              hasEvent.type === 'deadline' ? 'bg-[#DC2626]' : 'bg-[#10B981]'
                                          }`}></div>
                                      )}
                                  </div>
                              );
                          })}
                      </div>
                  </div>
                  
                  {/* Upcoming Events List */}
                  <div className="p-4 bg-surface">
                      <h4 className="text-xs font-medium text-on-surface-muted uppercase tracking-wider mb-2.5">Upcoming Sessions</h4>
                      <div className="space-y-2.5">
                          <div className="flex gap-2.5 items-start p-2 hover:bg-white rounded-md transition-colors border border-transparent hover:border-outline-variant">
                              <div className="bg-[#CFFAFE] text-[#0891b2] p-2 rounded-md">
                                  <Video className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                  <p className="text-[10px] text-on-surface-muted font-medium uppercase">15 Nov • 10:00 AM</p>
                                  <h5 className="text-xs font-semibold text-on-surface">Tutorial: Practical Review</h5>
                              </div>
                          </div>
                          <div className="flex gap-2.5 items-start p-2 hover:bg-white rounded-md transition-colors border border-transparent hover:border-outline-variant">
                              <div className="bg-warning-container text-on-warning-container p-2 rounded-md">
                                  <AlertCircle className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                  <p className="text-[10px] text-on-surface-muted font-medium uppercase">12 Nov • Deadline</p>
                                  <h5 className="text-xs font-semibold text-on-surface">Unit 6 Video Submission</h5>
                              </div>
                          </div>
                          <button className="w-full text-center text-xs font-medium text-secondary hover:text-primary pt-1">
                              View Full Calendar
                          </button>
                      </div>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;
