
import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, LayoutDashboard, Users, BookOpen, MessageSquare, 
  Calendar as CalendarIcon, FileBarChart, Zap, FileCheck, 
  ShieldCheck, History as HistoryIcon, PenTool, LayoutTemplate, Megaphone, 
  Briefcase, GraduationCap, Award, User, FileText, Scale, 
  Clock, Mail, ChevronDown, UserCircle, Settings, RefreshCw,
  Camera, X
} from 'lucide-react';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock Profile State
  const [profile, setProfile] = useState({
    name: 'David Assessor',
    email: 'david.assessor@betterfit.com',
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
  });

  useEffect(() => {
      // Determine role from localStorage to ensure navigation persistence on shared routes
      const storedRole = localStorage.getItem('betterfit_role');
      if (storedRole) {
          setRole(storedRole);
      } else {
          // Fallback based on URL if direct link access without login flow
          if (location.pathname.includes('moderator')) setRole('moderator');
          else if (location.pathname.includes('creator')) setRole('creator');
          else if (location.pathname.includes('assessor')) setRole('assessor');
          else if (location.pathname.includes('learner')) setRole('learner');
          else setRole('super_admin');
      }

      // Close dropdown when clicking outside
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsProfileOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [location.pathname]);

  const isModerator = role === 'moderator';
  const isCreator = role === 'creator';
  const isAssessor = role === 'assessor';
  const isLearner = role === 'learner';
  const isAdmin = role === 'super_admin';

  const handleLogout = () => {
    localStorage.removeItem('betterfit_role');
    navigate('/');
  };

  const switchRole = (newRole: string) => {
    localStorage.setItem('betterfit_role', newRole);
    setRole(newRole);
    setIsProfileOpen(false);

    // Navigate to respective dashboard
    if (newRole === 'moderator') navigate('/moderator-dashboard');
    else if (newRole === 'creator') navigate('/creator-dashboard');
    else if (newRole === 'assessor') navigate('/assessor-dashboard');
    else if (newRole === 'learner') navigate('/learner-dashboard');
    else navigate('/dashboard');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-r-lg mb-1 group border-l-4 ${
      isActive
        ? 'border-[#10B981] text-[#10B981] bg-[#F0FDFA] font-semibold' 
        : 'border-transparent text-[#1A1A2E] hover:text-[#10B981] hover:bg-[#F0FDFA]' 
    } ${!isExpanded ? 'justify-center px-0 border-l-0' : ''}`;

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex overflow-hidden h-screen font-sans text-[#1A1A2E]">
      {/* Left Sidebar Navigation - Collapsible on Hover */}
      <aside 
        className={`bg-[#F8FAFB] border-r border-[#E5E7EB] text-[#1A1A2E] flex-shrink-0 flex flex-col z-50 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className={`p-4 h-16 flex items-center border-b border-[#E5E7EB] transition-all duration-300 ${isExpanded ? 'space-x-3' : 'justify-center'}`}>
           {/* Logo */}
           <div className="w-9 h-9 bg-[#10B981] rounded-lg flex items-center justify-center font-bold text-white shadow-sm shrink-0">
              B
           </div>
           {isExpanded && (
             <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="font-bold text-base tracking-tight text-[#1A1A2E] leading-none">BETTERFIT</span>
                <span className="text-[10px] uppercase tracking-widest text-[#059669] font-semibold mt-0.5">LMS Portal</span>
             </div>
           )}
        </div>

        <div className="px-2 py-3 flex-1 flex flex-col overflow-hidden">
            <div className={`text-[10px] uppercase tracking-[0.15em] text-[#6B7280] font-semibold mb-2 px-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                Menu
            </div>
            
            <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
                {isModerator ? (
                    <>
                        <NavLink to="/moderator-dashboard" className={navClass}>
                            <LayoutDashboard className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Dashboard</span>}
                        </NavLink>
                        <NavLink to="/moderator/reports-history" className={navClass}>
                            <HistoryIcon className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">IQA Reports</span>}
                        </NavLink>
                        <NavLink to="/moderator/standardization" className={navClass}>
                            <Scale className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Standardization</span>}
                        </NavLink>
                        <NavLink to="/calendar" className={navClass}>
                            <CalendarIcon className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Calendar</span>}
                        </NavLink>
                        <NavLink to="/messages" className={navClass}>
                            <MessageSquare className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Messages</span>}
                        </NavLink>
                    </>
                ) : isCreator ? (
                    <>
                        <NavLink to="/creator-dashboard" className={navClass}>
                            <LayoutDashboard className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Studio Home</span>}
                        </NavLink>
                        <NavLink to="/courses" className={navClass}>
                            <BookOpen className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Courses</span>}
                        </NavLink>
                        <NavLink to="/creator/form-builder" className={navClass}>
                            <LayoutTemplate className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Form Builder</span>}
                        </NavLink>
                        <NavLink to="/creator/banner-builder" className={navClass}>
                            <Megaphone className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Banner Manager</span>}
                        </NavLink>
                        <NavLink to="/messages" className={navClass}>
                            <MessageSquare className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Messages</span>}
                        </NavLink>
                    </>
                ) : isAssessor ? (
                    <>
                        <NavLink to="/assessor-dashboard" className={navClass}>
                            <LayoutDashboard className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Dashboard</span>}
                        </NavLink>
                        <NavLink to="/assessor/learners" className={navClass}>
                            <Users className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">My Learners</span>}
                        </NavLink>
                        <NavLink to="/assessor/pending" className={navClass}>
                            <Clock className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Pending</span>}
                        </NavLink>
                        <NavLink to="/assessor/analytics" className={navClass}>
                            <FileBarChart className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Analytics</span>}
                        </NavLink>
                        <NavLink to="/assessor/results-by/courses" className={navClass}>
                            <BookOpen className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Courses</span>}
                        </NavLink>
                        <NavLink to="/reports" className={navClass}>
                            <FileText className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">My Reports</span>}
                        </NavLink>
                        <NavLink to="/messages" className={navClass}>
                            {location.pathname === '/messages' ? (
                                <MessageSquare className="w-5 h-5 shrink-0" />
                            ) : (
                                <Mail className="w-5 h-5 shrink-0" />
                            )}
                            {isExpanded && <span className="ml-3 truncate">My Messages</span>}
                        </NavLink>
                        <NavLink to="/calendar" className={navClass}>
                            <CalendarIcon className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">My Calendar</span>}
                        </NavLink>
                    </>
                ) : isLearner ? (
                    <>
                        <NavLink to="/learner-dashboard" className={navClass}>
                            <LayoutDashboard className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Home Dashboard</span>}
                        </NavLink>
                        <NavLink to="/learner/my-courses" className={navClass}>
                            <BookOpen className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">My Courses</span>}
                        </NavLink>
                        <NavLink to="/learner/progress" className={navClass}>
                            <FileBarChart className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">My Progress</span>}
                        </NavLink>
                        <NavLink to="/learner/results" className={navClass}>
                            <FileCheck className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">My Results</span>}
                        </NavLink>
                        <NavLink to="/learner/profile" className={navClass}>
                            <User className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">My Profile</span>}
                        </NavLink>
                        <NavLink to="/calendar" className={navClass}>
                            <CalendarIcon className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Calendar</span>}
                        </NavLink>
                        <NavLink to="/messages" className={navClass}>
                            <MessageSquare className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Messages</span>}
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/dashboard" className={navClass}>
                            <LayoutDashboard className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Dashboard</span>}
                        </NavLink>
                        <NavLink to="/courses" className={navClass}>
                            <BookOpen className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Products</span>}
                        </NavLink>
                        <NavLink to="/creator/banner-builder" className={navClass}>
                            <Megaphone className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Banners</span>}
                        </NavLink>
                        <NavLink to="/reports" className={navClass}>
                            <FileBarChart className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Analytics</span>}
                        </NavLink>
                        <NavLink to="/admin/reports" className={navClass}>
                            <FileText className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Reports</span>}
                        </NavLink>
                        <NavLink to="/messages" className={navClass}>
                            <MessageSquare className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Messages</span>}
                        </NavLink>
                        <NavLink to="/calendar" className={navClass}>
                            <CalendarIcon className="w-5 h-5 shrink-0" />
                            {isExpanded && <span className="ml-3 truncate">Calendar</span>}
                        </NavLink>
                    </>
                )}
            </nav>
        </div>

        <div className="mt-auto p-3 border-t border-[#E5E7EB]">
            <button
                onClick={handleLogout}
                className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-[#DC2626] hover:bg-red-50 transition-all rounded-lg group ${!isExpanded ? 'justify-center px-0' : ''}`}
            >
                <LogOut className={`w-5 h-5 shrink-0 ${isExpanded ? 'mr-3' : ''}`} />
                {isExpanded && <span className="truncate">Sign Out</span>}
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar: #10B981, 64px, White Text, Poppins Semibold 14px */}
        <header className="h-16 bg-[#10B981] flex items-center justify-between px-6 py-3 text-white z-40 shrink-0 shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-white tracking-tight leading-tight">
                    {location.pathname.includes('dashboard') ? 'Dashboard' : 
                     (location.pathname.includes('learners') || location.pathname.includes('results-by') || location.pathname.includes('learner/')) ? 'My Learners' :
                     location.pathname.includes('pending') ? 'Pending Submissions' :
                     location.pathname.includes('analytics') ? 'Analytics Overview' :
                     location.pathname.includes('courses') ? 'Course Management' :
                     location.pathname.includes('reports') ? 'My Reports' :
                     location.pathname.includes('messages') ? 'My Messages' :
                     location.pathname.includes('calendar') ? 'My Calendar' : 'LMS Portal'}
                </h2>
                <p className="text-xs text-white/80 font-medium">
                    Welcome back, <span className="text-white font-semibold">{isModerator ? 'Elena Fisher' : isCreator ? 'Creator Admin' : isAssessor ? 'David Assessor' : isLearner ? 'Sam Learner' : 'Sam Admin'}</span>
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer group text-white"
                    >
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-white leading-tight capitalize">
                                {profile.name}
                            </div>
                            <div className="text-[10px] text-white/80 font-medium tracking-wide">
                                {isModerator ? 'IQA Specialist' : isCreator ? 'Content Designer' : isAssessor ? 'Field Assessor' : isLearner ? 'Registered Learner' : 'System Owner'}
                            </div>
                        </div>
                        <div className="h-8 w-8 rounded-full border border-white/40 overflow-hidden shrink-0">
                             <img 
                                src={profile.photo} 
                                alt="User" 
                                className="h-full w-full object-cover"
                             />
                        </div>
                        <ChevronDown className={`w-4 h-4 text-white/80 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right text-[#1A1A2E]">
                            <div className="px-4 py-2 border-b border-[#E5E7EB] mb-1">
                                <p className="text-xs font-medium text-[#6B7280]">Signed in as</p>
                                <p className="text-sm font-semibold text-[#1A1A2E] truncate">{profile.email}</p>
                            </div>

                            <button 
                                onClick={() => {
                                    setIsProfileOpen(false);
                                    setIsProfileModalOpen(true);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-[#1A1A2E] hover:bg-[#F0FDFA] hover:text-[#10B981] transition-colors"
                            >
                                <UserCircle className="w-4 h-4 text-[#7C3AED]" />
                                My Profile Settings
                            </button>

                            <div className="px-4 py-2 mt-1">
                                <p className="text-xs font-medium text-[#6B7280] mb-1.5">Switch User Role</p>
                                <div className="space-y-1">
                                    {[
                                        { id: 'super_admin', label: 'Admin', icon: ShieldCheck, color: 'text-[#DC2626]' },
                                        { id: 'creator', label: 'Creator', icon: PenTool, color: 'text-[#F59E0B]' },
                                        { id: 'assessor', label: 'Assessor', icon: Award, color: 'text-[#10B981]' },
                                        { id: 'moderator', label: 'Moderator / IQA', icon: Scale, color: 'text-[#06B6D4]' },
                                        { id: 'learner', label: 'Learner', icon: GraduationCap, color: 'text-[#7C3AED]' }
                                    ].map((choice) => (
                                        <button
                                            key={choice.id}
                                            onClick={() => switchRole(choice.id)}
                                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                                                role === choice.id 
                                                    ? 'bg-[#F0FDFA] text-[#10B981] font-semibold border border-[#10B981]/30' 
                                                    : 'text-[#1A1A2E] hover:bg-[#F8FAFB]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <choice.icon className={`w-3.5 h-3.5 ${choice.color}`} />
                                                {choice.label}
                                            </div>
                                            {role === choice.id && <div className="w-2 h-2 rounded-full bg-[#10B981]" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-2 pt-1 border-t border-[#E5E7EB]">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-[#DC2626] hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>

        {/* Profile Settings Modal */}
        {isProfileModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[#1A1A2E]/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsProfileModalOpen(false)} />
                <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 border border-[#E5E7EB]">
                    <div className="p-6 border-b border-[#E5E7EB] flex justify-between items-center bg-[#F8FAFB]">
                        <div>
                            <h2 className="text-xl font-semibold text-[#1A1A2E]">Edit Profile</h2>
                            <p className="text-xs text-[#6B7280] mt-0.5">Update your personal information and preferences.</p>
                        </div>
                        <button 
                            onClick={() => setIsProfileModalOpen(false)}
                            className="p-1.5 hover:bg-[#E5E7EB] rounded-lg transition-colors text-[#6B7280]"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Profile Photo Section */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-full border-2 border-[#10B981] shadow-sm overflow-hidden">
                                    <img 
                                        src={profile.photo} 
                                        alt="Profile Preview" 
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 p-1.5 bg-[#10B981] text-white rounded-full shadow-md border-2 border-white cursor-pointer hover:bg-[#059669] transition-colors">
                                    <Camera className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <p className="text-xs font-medium text-[#6B7280]">Profile Photo</p>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#1A1A2E] mb-1.5">
                                    Full Name <span className="text-[#DC2626]">*</span>
                                </label>
                                <div className="relative">
                                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C3AED]" />
                                    <input 
                                        type="text" 
                                        value={profile.name}
                                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E5E7EB] rounded-md focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 outline-none font-medium text-sm text-[#1A1A2E] transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#1A1A2E] mb-1.5">
                                    Email Address <span className="text-[#DC2626]">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C3AED]" />
                                    <input 
                                        type="email" 
                                        value={profile.email}
                                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E5E7EB] rounded-md focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 outline-none font-medium text-sm text-[#1A1A2E] transition-all"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className="p-4 bg-[#FEF3C7] rounded-lg border border-[#F59E0B]/30 flex items-start gap-3">
                            <div className="p-1 bg-[#F59E0B]/20 text-[#92400E] rounded">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-[#92400E]">Security Note</h4>
                                <p className="text-xs text-[#92400E] mt-0.5 leading-relaxed">
                                    Role changes are restricted. If you need elevated permissions, please contact your System Admin.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-[#F8FAFB] border-t border-[#E5E7EB] flex justify-end gap-3">
                        <button 
                            onClick={() => setIsProfileModalOpen(false)}
                            className="btn-secondary py-2.5 px-4 text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => setIsProfileModalOpen(false)}
                            className="btn-primary py-2.5 px-5 text-sm"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8FAFB] relative custom-scrollbar">
            <div className="max-w-[1600px] mx-auto">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
