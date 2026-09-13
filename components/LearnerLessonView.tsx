import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, ChevronDown, ChevronRight, PlayCircle, CheckCircle, 
    FileText, MessageSquare, Download, Menu, X, MoreVertical, 
    Home, Folder, Sparkles, Info, LogOut, User, Users, Globe, Video, Mic, Send, Award
} from 'lucide-react';

const LearnerLessonView: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Curriculum (Left)
  const [toolsOpen, setToolsOpen] = useState(true);     // Floating Tools
  const [activeTab, setActiveTab] = useState<'content' | 'notes'>('content');
  
  // Popup State
  const [activePopup, setActivePopup] = useState<'exit' | 'message' | 'resources' | 'ai' | 'info' | null>(null);

  // Mock Lesson Data
  const currentLesson = {
      title: "The Warm-Up Phase",
      unit: "Unit 6: Practical Delivery",
      description: "A specific warm-up is designed to prepare the muscles and joints that will be used during the main workout. Unlike a general warm-up which raises overall body temperature, a specific warm-up mimics the movements of the activity to follow.",
      duration: "15 min"
  };

  const curriculum = [
      {
          id: 'u6',
          title: 'Unit 6: Practical Delivery',
          lessons: [
              { id: 'l1', title: 'Introduction to Delivery', duration: '5:00', completed: true },
              { id: 'l2', title: 'The Warm-Up Phase', duration: '15:00', completed: false, active: true },
              { id: 'l3', title: 'Main Component (CV)', duration: '12:30', completed: false },
              { id: 'l4', title: 'Main Component (Resistance)', duration: '20:00', completed: false },
              { id: 'l5', title: 'Cool Down & Flexibility', duration: '10:00', completed: false },
          ]
      },
      {
          id: 'u7',
          title: 'Unit 7: Business Acumen',
          lessons: [
              { id: 'l6', title: 'Setting up your business', duration: '10:00', completed: false },
              { id: 'l7', title: 'Marketing Basics', duration: '15:00', completed: false },
          ]
      }
  ];

  return (
    <div className="fixed inset-0 bg-[#0c0c0d] z-50 flex flex-col h-screen text-white overflow-hidden">
        
        {/* 1. PLAYER HEADER */}
        <div className="h-16 bg-[#1a1a1a] border-b border-white/10 flex justify-between items-center px-4 md:px-6 shrink-0 z-50">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                    title="Toggle Curriculum"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="h-6 w-px bg-white/10 hidden md:block"></div>
                <button 
                    onClick={() => setActivePopup('exit')}
                    className="text-white/70 hover:text-white transition-colors"
                    title="Back to Dashboard"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="hidden md:block">
                    <h2 className="text-xs font-bold text-[#01b3ef] uppercase tracking-wider mb-0.5">{currentLesson.unit}</h2>
                    <h1 className="text-sm font-bold text-white leading-none">{currentLesson.title}</h1>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center text-xs font-bold text-white/50">
                    <span className="bg-white/10 px-2 py-1 rounded mr-2">Progress: 30%</span>
                </div>
            </div>
        </div>

        {/* 2. MAIN CONTENT AREA */}
        <div className="flex flex-1 overflow-hidden relative">
            
            {/* LEFT SIDEBAR: Curriculum */}
            <div 
                className={`bg-[#1a1a1a] border-r border-white/10 flex flex-col transition-all duration-300 ${
                    sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'
                }`}
            >
                <div className="p-4 border-b border-white/10 bg-[#1a1a1a]">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Course Content</h3>
                    <div className="flex bg-black/40 p-1 rounded-lg">
                        <button 
                            onClick={() => setActiveTab('content')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'content' ? 'bg-[#01b3ef] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            Lessons
                        </button>
                        <button 
                            onClick={() => setActiveTab('notes')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'notes' ? 'bg-[#01b3ef] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            Notes
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {activeTab === 'content' && (
                        <div className="space-y-1 p-2">
                            {curriculum.map((unit) => (
                                <div key={unit.id} className="mb-2">
                                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-white/5 rounded mb-1">
                                        {unit.title}
                                    </div>
                                    <div className="space-y-1 pl-2 border-l border-white/10 ml-2">
                                        {unit.lessons.map((lesson) => (
                                            <button 
                                                key={lesson.id}
                                                className={`w-full text-left px-3 py-3 rounded-lg flex items-start group transition-all ${
                                                    lesson.active 
                                                    ? 'bg-[#01b3ef]/10 border border-[#01b3ef]/30' 
                                                    : 'hover:bg-white/5 border border-transparent'
                                                }`}
                                            >
                                                <div className="mr-3 mt-0.5">
                                                    {lesson.completed ? (
                                                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                            <CheckCircle className="w-3 h-3 text-white" />
                                                        </div>
                                                    ) : lesson.active ? (
                                                        <div className="w-4 h-4 rounded-full border-2 border-[#01b3ef] flex items-center justify-center">
                                                            <div className="w-2 h-2 bg-[#01b3ef] rounded-full"></div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full border-2 border-gray-600"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`text-sm font-medium leading-tight ${lesson.active ? 'text-[#01b3ef]' : 'text-gray-300 group-hover:text-white'}`}>
                                                        {lesson.title}
                                                    </h4>
                                                    <span className="text-xs text-gray-500 mt-1 block">{lesson.duration}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="p-4 text-center text-gray-500 text-sm italic">
                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No notes added for this lesson yet.</p>
                            <button className="mt-4 text-[#01b3ef] hover:underline">Add Note</button>
                        </div>
                    )}
                </div>
            </div>

            {/* CENTER: Main Content (Video) */}
            <div className="flex-1 relative h-full bg-black flex flex-col">
                
                {/* Floating Tools Panel */}
                <div className="absolute right-6 top-6 z-40 flex flex-col items-end pointer-events-none">
                    <div className="pointer-events-auto">
                        {toolsOpen ? (
                            <div className="bg-white rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] p-2 flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-300 border-2 border-white/10">
                                <button 
                                    onClick={() => setToolsOpen(false)} 
                                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-[#0c0c0d] transition-colors mx-auto"
                                    title="Minimize Tools"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="h-px w-8 bg-slate-200 mx-auto"></div>
                                
                                {/* Home Icon */}
                                <button onClick={() => setActivePopup('exit')} className="p-3 hover:bg-[#01b3ef]/10 rounded-full text-[#6c6c6c] hover:text-[#01b3ef] transition-colors" title="Dashboard">
                                    <Home className="w-5 h-5" />
                                </button>

                                {/* Info Icon - NEW */}
                                <button onClick={() => setActivePopup('info')} className="p-3 hover:bg-[#01b3ef]/10 rounded-full text-[#6c6c6c] hover:text-[#01b3ef] transition-colors" title="About Lesson">
                                    <Info className="w-5 h-5" />
                                </button>
                                
                                {/* Message Icon */}
                                <button onClick={() => setActivePopup('message')} className="p-3 hover:bg-[#01b3ef]/10 rounded-full text-[#6c6c6c] hover:text-[#01b3ef] transition-colors" title="Message">
                                    <MessageSquare className="w-5 h-5" />
                                </button>
                                
                                {/* Resources Icon */}
                                <button onClick={() => setActivePopup('resources')} className="p-3 hover:bg-[#01b3ef]/10 rounded-full text-[#6c6c6c] hover:text-[#01b3ef] transition-colors" title="Resources">
                                    <Folder className="w-5 h-5" />
                                </button>
                                
                                {/* AI Assistant Icon */}
                                <button onClick={() => setActivePopup('ai')} className="p-3 hover:bg-[#e14177]/10 rounded-full text-[#6c6c6c] hover:text-[#e14177] transition-colors" title="Ask AI Tutor">
                                    <Sparkles className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setToolsOpen(true)}
                                className="bg-white p-3 rounded-full shadow-lg text-[#01b3ef] hover:bg-[#01b3ef] hover:text-white transition-all hover:scale-110 border-2 border-[#01b3ef]/20"
                                title="Open Tools"
                            >
                                <MoreVertical className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Video Container (Centered) */}
                <div className="flex-1 flex items-center justify-center overflow-hidden bg-black relative">
                    <div className="w-full h-full relative group flex items-center justify-center">
                        {/* Mock Video Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black opacity-50"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
                            alt="Lesson Thumbnail" 
                            className="absolute inset-0 w-full h-full object-contain opacity-60"
                        />
                        
                        <button className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 hover:scale-110 hover:bg-[#01b3ef] hover:border-[#01b3ef] transition-all group-hover:shadow-[0_0_30px_rgba(1,179,239,0.5)]">
                            <PlayCircle className="w-12 h-12 text-white fill-current" />
                        </button>

                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-full bg-white/30 h-1.5 rounded-full mb-4 cursor-pointer hover:h-2 transition-all">
                                <div className="w-1/3 h-full bg-[#01b3ef] rounded-full relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-white">
                                <span>05:32 / 15:00</span>
                                <span>1080p HD</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* --- MODALS --- */}

        {/* 1. End Session Popup (Home Icon) */}
        {activePopup === 'exit' && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-lg font-bold text-[#0c0c0d]">End Session?</h2>
                        <button onClick={() => setActivePopup(null)} className="text-[#afafaf] hover:text-[#0c0c0d]"><X className="w-5 h-5"/></button>
                    </div>
                    
                    <div className="flex justify-center mb-6">
                        <LogOut className="w-16 h-16 text-[#f97316]" />
                    </div>
                    
                    <p className="text-[#6c6c6c] text-sm mb-8 px-4">
                        Are you sure you want to exit? Your progress (90%) will be saved.
                    </p>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setActivePopup(null)}
                            className="flex-1 py-3 bg-slate-100 text-[#6c6c6c] rounded-xl font-bold hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => navigate('/learner/my-courses')}
                            className="flex-1 py-3 bg-[#f97316] text-white rounded-xl font-bold hover:bg-[#ea580c] transition-colors"
                        >
                            Exit Lesson
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* 2. Lesson Info Popup (NEW) */}
        {activePopup === 'info' && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                    <div className="p-6 border-b border-[#afafaf]/20 bg-slate-50 flex justify-between items-center shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-[#0c0c0d]">About this lesson</h2>
                            <p className="text-xs text-[#01b3ef] font-bold uppercase mt-1">{currentLesson.unit}</p>
                        </div>
                        <button onClick={() => setActivePopup(null)} className="text-[#afafaf] hover:text-[#0c0c0d]"><X className="w-5 h-5"/></button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                        <div className="prose prose-sm max-w-none text-[#6c6c6c]">
                            <p className="font-medium text-[#0c0c0d] text-base">{currentLesson.description}</p>
                            <p className="font-bold text-xs uppercase text-[#afafaf] tracking-wider mt-4 mb-2">In this session:</p>
                            <ul className="list-disc pl-4 space-y-2">
                                <li>The physiological benefits of a warm-up.</li>
                                <li>Pulse raising activities specific to the main workout.</li>
                                <li>Dynamic stretching protocols.</li>
                                <li>Mental preparation strategies for clients.</li>
                            </ul>
                        </div>

                        <div className="bg-[#01427a]/10 border-l-4 border-[#01427a] p-4 rounded-r-lg">
                            <h4 className="font-bold text-[#01427a] text-sm mb-1 flex items-center"><Award className="w-4 h-4 mr-2" /> Submission Criteria (AC 1.2)</h4>
                            <p className="text-xs text-[#0c0c0d]">Ensure you can explain *why* specific dynamic stretches are chosen for the client's session plan.</p>
                        </div>
                    </div>

                    <div className="p-4 border-t border-[#afafaf]/20 bg-slate-50 space-y-3 shrink-0">
                        <button className="w-full flex items-center justify-center px-4 py-3 bg-white border border-[#afafaf] hover:bg-slate-50 rounded-lg text-sm font-bold text-[#0c0c0d] transition-colors shadow-sm">
                            <Download className="w-4 h-4 mr-2" /> Download Resources (PDF)
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-3 bg-[#01b3ef] hover:bg-[#01427a] rounded-lg text-sm font-bold text-white transition-colors shadow-md">
                            Mark Lesson Complete <CheckCircle className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* 3. Send Message Popup */}
        {activePopup === 'message' && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-[#0c0c0d]">Send Message</h2>
                        <button onClick={() => setActivePopup(null)} className="text-[#afafaf] hover:text-[#0c0c0d]"><X className="w-5 h-5"/></button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <button className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl hover:bg-[#01b3ef]/5 hover:border-[#01b3ef] border border-transparent transition-all group">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                                <User className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-[#0c0c0d] text-sm">Tutor</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl hover:bg-[#01b3ef]/5 hover:border-[#01b3ef] border border-transparent transition-all group">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-[#0c0c0d] text-sm">Cohort</span>
                        </button>
                    </div>
                    
                    <button className="w-full flex items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-[#01b3ef]/5 hover:border-[#01b3ef] border border-transparent transition-all group">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-4 group-hover:scale-110 transition-transform">
                            <Globe className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-[#0c0c0d] text-sm">Community Forum</span>
                    </button>
                </div>
            </div>
        )}

        {/* 4. Lesson Resources Popup */}
        {activePopup === 'resources' && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-[#0c0c0d]">Lesson Resources</h2>
                        <button onClick={() => setActivePopup(null)} className="text-[#afafaf] hover:text-[#0c0c0d]"><X className="w-5 h-5"/></button>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-[#afafaf]/20">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4 shrink-0">
                                <Video className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0c0c0d] text-sm">Watch Demo Video</h4>
                                <p className="text-xs text-[#6c6c6c]">Duration: 4:30</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-[#afafaf]/20">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mr-4 shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0c0c0d] text-sm">View Transcript</h4>
                                <p className="text-xs text-[#6c6c6c]">PDF Document</p>
                            </div>
                        </div>

                        <div 
                            className="flex items-center p-3 rounded-xl bg-pink-50 cursor-pointer transition-colors border border-pink-100 hover:border-pink-200"
                            onClick={() => setActivePopup('ai')}
                        >
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#e14177] mr-4 shrink-0 shadow-sm">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0c0c0d] text-sm">Ask Gemini</h4>
                                <p className="text-xs text-[#e14177]">AI Assistant</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* 5. Gemini Assistant Popup */}
        {activePopup === 'ai' && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-[#0f172a] rounded-[30px] shadow-2xl w-full max-w-sm h-[600px] overflow-hidden flex flex-col relative border border-white/10">
                    
                    {/* Header */}
                    <div className="p-6 flex justify-between items-center shrink-0">
                        <div className="flex items-center text-white">
                            <Sparkles className="w-5 h-5 text-[#e14177] mr-2" />
                            <span className="font-bold text-lg">Gemini Assistant</span>
                        </div>
                        <button onClick={() => setActivePopup(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#01b3ef]/20 via-[#e14177]/20 to-[#01427a]/20 flex items-center justify-center mb-8 relative">
                            <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-pulse"></div>
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center shadow-lg border border-white/10">
                                <Mic className="w-8 h-8 text-white/80" />
                            </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white mb-2">How can I help?</h2>
                        <div className="space-y-2 w-full max-w-xs">
                            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 text-sm text-white/70 transition-colors">
                                "Explain the deadlift warm-up"
                            </button>
                            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 text-sm text-white/70 transition-colors">
                                "What does AC 1.2 mean?"
                            </button>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-[#1e293b]/50 backdrop-blur-md">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Type your question..." 
                                className="w-full bg-[#0f172a] text-white border border-white/20 rounded-full py-3 pl-5 pr-12 text-sm focus:outline-none focus:border-[#e14177] placeholder-white/30"
                            />
                            <button className="absolute right-1 top-1 p-2 bg-[#e14177] rounded-full text-white hover:bg-[#c03060] transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        )}

    </div>
  );
};

export default LearnerLessonView;