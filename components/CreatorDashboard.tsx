import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Plus, BookOpen, FileText, ChevronRight, LayoutTemplate, Settings, PlayCircle, Edit2, Search, Sparkles, File as FileIcon, FolderPlus, X, Loader2, Image as ImageIcon, UploadCloud, Globe, Check, Megaphone, Eye, EyeOff } from 'lucide-react';

interface FormSummary {
    id: string;
    title: string;
    type: string;
    lastEdited: string;
}

const CreatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormSummary[]>([]);
  
  // Search States
  const [courseSearch, setCourseSearch] = useState('');
  const [formSearch, setFormSearch] = useState('');
  const [bannerSearch, setBannerSearch] = useState('');

  // Creation Wizard States
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'ai_prompt' | 'details'>('none');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // New Course Data Buffer
  const [newCourseData, setNewCourseData] = useState({ title: '', description: '', thumbnail: '' });

  // Image Selection States for Modal
  const [imageTab, setImageTab] = useState<'upload' | 'ai' | 'web'>('ai');
  const [imagePrompt, setImagePrompt] = useState('');
  const [webQuery, setWebQuery] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [webResults, setWebResults] = useState<string[]>([]);

  // Initialize Data
  useEffect(() => {
    const storedForms = localStorage.getItem('betterfit_forms');
    if (storedForms) {
        setForms(JSON.parse(storedForms));
    } else {
        const defaults = [
            { id: '1', title: 'L3 Practical Observation Grid', type: 'Moderation', lastEdited: '1 day ago' },
            { id: '2', title: 'Learner Satisfaction Survey', type: 'Feedback', lastEdited: '3 days ago' },
            { id: '3', title: 'Incident Report Form', type: 'Administrative', lastEdited: '1 month ago' },
        ];
        localStorage.setItem('betterfit_forms', JSON.stringify(defaults));
        setForms(defaults);
    }
  }, []);

  const recentCourses = [
      { id: 1, title: 'L3 Personal Training - Core', status: 'Published', students: 45, lastEdited: '2 days ago' },
      { id: 2, title: 'Advanced Nutrition Module', status: 'Draft', students: 0, lastEdited: '4 hours ago' },
      { id: 3, title: 'Kettlebell Masterclass', status: 'Review', students: 0, lastEdited: '1 week ago' },
  ];

  const recentBanners = [
      { id: 'b1', title: 'Mobility Flow Webinar', status: 'Hidden', imageGradient: 'from-emerald-600 to-teal-700' },
      { id: 'b2', title: 'Peer Review Session', status: 'Hidden', imageGradient: 'from-slate-700 to-slate-900' },
      { id: 'b3', title: 'Equipment Use SGPT', status: 'Hidden', imageGradient: 'from-cyan-600 to-cyan-800' },
      { id: 'b4', title: 'Schedule a Tutorial', status: 'Visible', imageGradient: 'from-purple-500 to-indigo-600' },
  ];

  // Filters
  const filteredCourses = recentCourses.filter(c => c.title.toLowerCase().includes(courseSearch.toLowerCase()));
  const filteredForms = forms.filter(f => f.title.toLowerCase().includes(formSearch.toLowerCase()));
  const filteredBanners = recentBanners.filter(b => b.title.toLowerCase().includes(bannerSearch.toLowerCase()));

  const handleEditForm = (id: string) => {
      navigate(`/creator/form-builder?formId=${id}`);
  };

  const handleEditCourse = (e: React.MouseEvent, courseId: number) => {
      e.stopPropagation();
      const course = recentCourses.find(c => c.id === courseId);
      navigate('/creator/course-builder', { state: { courseData: { title: course?.title, description: '' } } });
  };

  // --- Creation Flow Handlers ---
  const handleCreateOptionClick = (option: 'ai' | 'blank' | 'ppt') => {
      setIsCreateMenuOpen(false);
      if (option === 'ai') {
          setActiveModal('ai_prompt');
      } else if (option === 'ppt') {
          alert("PowerPoint upload feature coming soon.");
      } else {
          setNewCourseData({ title: '', description: '', thumbnail: '' });
          setImageTab('ai');
          setImagePrompt('');
          setWebResults([]);
          setActiveModal('details');
      }
  };

  const handleAiGenerate = () => {
      setIsGenerating(true);
      setTimeout(() => {
          setIsGenerating(false);
          setNewCourseData({ title: 'AI Generated: Customer Service in Fitness', description: 'A comprehensive guide to handling client interactions.', thumbnail: '' });
          setActiveModal('details');
      }, 2000);
  };

  const handleGenerateImage = () => {
      if (!imagePrompt) return;
      setIsImageLoading(true);
      setTimeout(() => {
          setIsImageLoading(false);
          setNewCourseData(prev => ({ ...prev, thumbnail: 'generated_placeholder' }));
      }, 2000);
  };

  const handleWebSearch = () => {
      if (!webQuery) return;
      setIsImageLoading(true);
      setTimeout(() => {
          setIsImageLoading(false);
          setWebResults(['res1', 'res2', 'res3']);
      }, 1000);
  };

  const handleFileUpload = () => {
      setNewCourseData(prev => ({ ...prev, thumbnail: 'uploaded_placeholder' }));
  };

  const handleFinalizeCreate = () => {
      setActiveModal('none');
      navigate('/creator/course-builder', { state: { courseData: newCourseData } });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative" onClick={() => setIsCreateMenuOpen(false)}>
      
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-[#10B981] to-[#06B6D4] rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
          
          {/* Content Layer */}
          <div className="relative z-10">
              <div className="flex items-center mb-3">
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider flex items-center mr-3">
                      <PenTool className="w-3.5 h-3.5 mr-1.5" /> Creator Studio
                  </span>
                  <span className="text-white/90 text-xs font-medium">Content Manager</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold mb-1.5 tracking-tight text-white">Hello, Creator!</h1>
              <p className="text-emerald-50 text-sm sm:text-base font-normal mb-5">Ready to build the next generation of learning content?</p>
              
              <div className="flex flex-wrap gap-3 relative">
                  {/* Create Course Dropdown Wrapper */}
                  <div className="relative">
                      <button 
                          onClick={(e) => { e.stopPropagation(); setIsCreateMenuOpen(!isCreateMenuOpen); }}
                          className="btn-secondary !bg-white !text-[#10B981] !border-white hover:!bg-emerald-50 font-semibold shadow-sm flex items-center text-xs"
                      >
                          <Plus className="w-4 h-4 mr-1.5" /> Create New Course
                      </button>

                      {/* Dropdown Menu */}
                      {isCreateMenuOpen && (
                          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
                              <div className="p-2 space-y-1">
                                  <button onClick={() => handleCreateOptionClick('ai')} className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50 rounded-lg flex items-center group transition-colors">
                                      <Sparkles className="w-4 h-4 mr-3 text-[#06B6D4] group-hover:scale-110 transition-transform" />
                                      <div>
                                          <span className="block text-xs font-semibold text-[#1A1A2E]">Create with AI</span>
                                          <span className="block text-[10px] text-gray-500">Generate content in seconds</span>
                                      </div>
                                  </button>
                                  <button onClick={() => handleCreateOptionClick('blank')} className="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 rounded-lg flex items-center group transition-colors">
                                      <Edit2 className="w-4 h-4 mr-3 text-gray-500 group-hover:text-[#10B981]" />
                                      <span className="text-xs font-semibold text-[#1A1A2E]">Create blank</span>
                                  </button>
                                  <button onClick={() => handleCreateOptionClick('ppt')} className="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 rounded-lg flex items-center group transition-colors">
                                      <FileIcon className="w-4 h-4 mr-3 text-gray-500 group-hover:text-[#10B981]" />
                                      <span className="text-xs font-semibold text-[#1A1A2E]">Create from PowerPoint</span>
                                      <span className="ml-auto text-[9px] bg-emerald-100 text-[#059669] px-1.5 py-0.5 rounded font-semibold">PPTX</span>
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>

                  <button 
                      onClick={() => navigate('/creator/form-builder')}
                      className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center backdrop-blur-sm shadow-sm"
                  >
                      <LayoutTemplate className="w-4 h-4 mr-1.5" /> Create New Form
                  </button>

                  <button 
                      onClick={() => navigate('/creator/banner-builder')}
                      className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center backdrop-blur-sm shadow-sm"
                  >
                      <Megaphone className="w-4 h-4 mr-1.5" /> Create New Banner
                  </button>
              </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform origin-bottom-right"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* 2. Recent Courses Card */}
          <div className="card-standard overflow-hidden flex flex-col h-full">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/70 gap-3">
                  <h2 className="text-sm font-semibold text-[#1A1A2E] flex items-center whitespace-nowrap">
                      <BookOpen className="w-4 h-4 mr-2 text-[#10B981]" /> Recent Courses
                  </h2>
                  
                  {/* Course Search */}
                  <div className="relative w-full sm:w-auto">
                      <input 
                          type="text" 
                          placeholder="Search courses..." 
                          value={courseSearch}
                          onChange={(e) => setCourseSearch(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:border-[#10B981] focus:ring-2 focus:ring-emerald-500/20 w-full text-[#1A1A2E] bg-white"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
              </div>
              <div className="p-4 sm:p-5 flex-1">
                  <div className="space-y-3">
                      {filteredCourses.length > 0 ? (
                          filteredCourses.map(course => (
                              <div key={course.id} className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-lg hover:border-[#10B981] hover:shadow-sm transition-all group cursor-pointer">
                                  <div className="flex items-center min-w-0 mr-2">
                                      <div className="h-12 w-16 bg-gray-100 rounded-lg overflow-hidden mr-3 relative shrink-0 border border-gray-200 flex items-center justify-center">
                                            <div className={`absolute inset-0 opacity-20 ${course.id % 2 === 0 ? 'bg-[#7C3AED]' : 'bg-[#10B981]'}`}></div>
                                            <ImageIcon className="w-5 h-5 text-gray-400 relative z-10" />
                                      </div>
                                      
                                      <div className="min-w-0">
                                          <h3 className="font-semibold text-xs text-[#1A1A2E] truncate">{course.title}</h3>
                                          <div className="flex gap-2 text-[11px] text-gray-500 mt-0.5">
                                              <span>{course.lastEdited}</span>
                                              <span>•</span>
                                              <span>{course.students} Students</span>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex items-center shrink-0">
                                      <button 
                                          onClick={(e) => handleEditCourse(e, course.id)}
                                          className="p-1.5 text-gray-400 hover:text-[#10B981] hover:bg-emerald-50 rounded-md transition-colors" 
                                          title="Edit Course"
                                      >
                                          <Edit2 className="w-4 h-4" />
                                      </button>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <div className="text-center text-gray-400 py-8 text-xs italic">
                              No courses found.
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* 3. Forms Library Card -> Recent Forms */}
          <div className="card-standard overflow-hidden flex flex-col h-full">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/70 gap-3">
                  <h2 className="text-sm font-semibold text-[#1A1A2E] flex items-center whitespace-nowrap">
                      <LayoutTemplate className="w-4 h-4 mr-2 text-[#7C3AED]" /> Recent Forms
                  </h2>
                  
                  {/* Form Search */}
                  <div className="relative w-full sm:w-auto">
                      <input 
                          type="text" 
                          placeholder="Search forms..." 
                          value={formSearch}
                          onChange={(e) => setFormSearch(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:border-[#10B981] focus:ring-2 focus:ring-emerald-500/20 w-full text-[#1A1A2E] bg-white"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
              </div>
              <div className="p-4 sm:p-5 flex-1">
                   <div className="space-y-3">
                      {filteredForms.length > 0 ? (
                          filteredForms.map(form => (
                              <div 
                                  key={form.id} 
                                  onClick={() => handleEditForm(form.id)}
                                  className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-lg hover:border-[#7C3AED] hover:shadow-sm transition-all group cursor-pointer"
                              >
                                  <div className="flex items-center min-w-0 mr-2">
                                      <div className="h-9 w-9 bg-purple-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors shrink-0 text-[#7C3AED]">
                                          <FileText className="w-4 h-4" />
                                      </div>
                                      <div className="min-w-0">
                                          <h3 className="font-semibold text-xs text-[#1A1A2E] truncate">{form.title}</h3>
                                          <div className="flex gap-2 text-[11px] text-gray-500 mt-0.5">
                                              <span>{form.lastEdited}</span>
                                              <span>•</span>
                                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${form.type === 'Moderation' ? 'bg-purple-50 text-[#7C3AED] border border-purple-200' : 'bg-gray-100 text-gray-600'}`}>
                                                  {form.type}
                                              </span>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex items-center shrink-0">
                                      <button className="p-1.5 text-gray-400 hover:text-[#7C3AED] hover:bg-purple-50 rounded-md transition-colors">
                                          <Edit2 className="w-4 h-4" />
                                      </button>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <div className="text-center text-gray-400 py-8 text-xs italic">
                              No forms found.
                          </div>
                      )}
                  </div>
              </div>
              <div className="p-3.5 bg-gray-50/70 border-t border-gray-100 text-center">
                   <button onClick={() => navigate('/creator/form-builder')} className="text-xs font-semibold text-gray-600 hover:text-[#7C3AED] flex items-center justify-center w-full transition-colors">
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Build New Form
                  </button>
              </div>
          </div>

          {/* 4. Banner Library Card -> Recent Banners */}
          <div className="card-standard overflow-hidden flex flex-col h-full">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/70 gap-3">
                  <h2 className="text-sm font-semibold text-[#1A1A2E] flex items-center whitespace-nowrap">
                      <Megaphone className="w-4 h-4 mr-2 text-[#06B6D4]" /> Recent Banners
                  </h2>
                  <div className="relative w-full sm:w-auto">
                      <input 
                          type="text" 
                          placeholder="Search banners..." 
                          value={bannerSearch}
                          onChange={(e) => setBannerSearch(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:border-[#10B981] focus:ring-2 focus:ring-emerald-500/20 w-full text-[#1A1A2E] bg-white"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
              </div>
              <div className="p-4 sm:p-5 flex-1">
                  <div className="space-y-3">
                      {filteredBanners.map(banner => (
                          <div key={banner.id} className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-lg hover:border-[#06B6D4] hover:shadow-sm transition-all group cursor-pointer" onClick={() => navigate('/creator/banner-builder')}>
                              <div className="flex items-center min-w-0 mr-2">
                                  <div className="h-10 w-16 bg-gray-200 rounded-lg overflow-hidden mr-3 relative shrink-0">
                                      <div className={`absolute inset-0 bg-gradient-to-r ${banner.imageGradient}`}></div>
                                  </div>
                                  <div className="min-w-0">
                                      <h3 className="font-semibold text-[#1A1A2E] text-xs truncate">{banner.title}</h3>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                          {banner.status === 'Visible' ? (
                                              <span className="badge-success text-[10px] py-0.5 px-2 flex items-center">
                                                  <Eye className="w-3 h-3 mr-1" /> Visible
                                              </span>
                                          ) : (
                                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 flex items-center">
                                                  <EyeOff className="w-3 h-3 mr-1" /> Hidden
                                              </span>
                                          )}
                                      </div>
                                  </div>
                              </div>
                              <div className="flex items-center shrink-0">
                                  <button className="p-1.5 text-gray-400 hover:text-[#06B6D4] rounded-md transition-colors">
                                      <Edit2 className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="p-3.5 bg-gray-50/70 border-t border-gray-100 text-center">
                   <button onClick={() => navigate('/creator/banner-builder')} className="text-xs font-semibold text-gray-600 hover:text-[#06B6D4] flex items-center justify-center w-full transition-colors">
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Create New Banner
                  </button>
              </div>
          </div>

      </div>

      {/* --- MODALS --- */}

      {/* 1. AI Prompt Modal */}
      {activeModal === 'ai_prompt' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200">
                  <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-start mb-5">
                          <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center">
                              <Sparkles className="w-5 h-5 mr-2.5 text-[#06B6D4]" />
                              Create with AI
                          </h2>
                          <button onClick={() => setActiveModal('none')} className="text-gray-400 hover:text-[#1A1A2E] transition-colors p-1"><X className="w-5 h-5" /></button>
                      </div>
                      
                      {isGenerating ? (
                          <div className="py-12 flex flex-col items-center justify-center text-center">
                              <div className="relative">
                                  <div className="w-14 h-14 border-3 border-gray-200 border-t-[#10B981] rounded-full animate-spin"></div>
                                  <Sparkles className="w-5 h-5 text-[#10B981] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                              </div>
                              <h3 className="mt-5 text-base font-semibold text-[#1A1A2E]">Generating Course Structure...</h3>
                              <p className="text-xs text-gray-500 mt-1">Analysing requirements and building modules.</p>
                          </div>
                      ) : (
                          <>
                              <p className="text-xs text-gray-600 mb-3">Describe what you'd like to create and let our AI build the foundation for you.</p>
                              <textarea 
                                  className="w-full border border-gray-200 rounded-lg p-3.5 text-xs text-[#1A1A2E] focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10B981] min-h-[140px] resize-none leading-relaxed outline-none"
                                  placeholder="e.g. A 20-minute course on Health & Safety for Gym Instructors, covering risk submission and emergency procedures..."
                              ></textarea>
                              
                              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <button className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-left text-xs hover:border-[#10B981] hover:bg-emerald-50/40 transition-colors">
                                      <span className="block font-semibold text-[#10B981] mb-0.5">Create a 10-minute course</span>
                                      <span className="text-gray-500 text-[11px]">on customer service etiquette</span>
                                  </button>
                                  <button className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-left text-xs hover:border-[#10B981] hover:bg-emerald-50/40 transition-colors">
                                      <span className="block font-semibold text-[#10B981] mb-0.5">Create a 20-question quiz</span>
                                      <span className="text-gray-500 text-[11px]">on machine safety</span>
                                  </button>
                              </div>

                              <div className="mt-6 flex justify-end">
                                  <button 
                                      onClick={handleAiGenerate}
                                      className="btn-accent flex items-center text-xs"
                                  >
                                      Generate <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                                  </button>
                              </div>
                          </>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* 2. Course Details Modal (Enhanced) */}
      {activeModal === 'details' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
                  <div className="bg-[#10B981] px-6 py-4 flex justify-between items-center text-white shrink-0">
                      <h2 className="text-base font-semibold">Course Details</h2>
                      <button onClick={() => setActiveModal('none')} className="text-white/80 hover:text-white"><X className="w-5 h-5"/></button>
                  </div>
                  
                  <div className="p-6 space-y-5 overflow-y-auto">
                      {/* Image Selection Area */}
                      <div className="space-y-2.5">
                          <label className="block text-xs font-semibold text-[#1A1A2E]">Course Thumbnail</label>
                          
                          {/* Image Preview Window */}
                          <div className="w-full aspect-video bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative flex items-center justify-center group">
                                {newCourseData.thumbnail ? (
                                    <>
                                        <div className={`w-full h-full ${newCourseData.thumbnail.includes('generated') ? 'bg-gradient-to-br from-[#10B981] to-[#06B6D4]' : 'bg-gray-300' } flex items-center justify-center text-white text-xs font-semibold`}>
                                            {newCourseData.thumbnail === 'generated_placeholder' ? 'AI Generated Image' : 'Selected Image'}
                                        </div>
                                        <button 
                                            onClick={() => setNewCourseData(prev => ({ ...prev, thumbnail: '' }))}
                                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1.5 opacity-50" />
                                        <p className="text-[11px] text-gray-400">No image selected</p>
                                    </div>
                                )}
                          </div>

                          {/* Image Source Tabs */}
                          <div className="flex bg-gray-100 p-1 rounded-lg">
                              <button 
                                  onClick={() => setImageTab('ai')}
                                  className={`flex-1 flex items-center justify-center py-1.5 text-xs font-semibold rounded-md transition-all ${imageTab === 'ai' ? 'bg-white text-[#10B981] shadow-xs' : 'text-gray-600 hover:text-[#1A1A2E]'}`}
                              >
                                  <Sparkles className="w-3 h-3 mr-1" /> AI Generate
                              </button>
                              <button 
                                  onClick={() => setImageTab('upload')}
                                  className={`flex-1 flex items-center justify-center py-1.5 text-xs font-semibold rounded-md transition-all ${imageTab === 'upload' ? 'bg-white text-[#10B981] shadow-xs' : 'text-gray-600 hover:text-[#1A1A2E]'}`}
                              >
                                  <UploadCloud className="w-3 h-3 mr-1" /> Upload
                              </button>
                              <button 
                                  onClick={() => setImageTab('web')}
                                  className={`flex-1 flex items-center justify-center py-1.5 text-xs font-semibold rounded-md transition-all ${imageTab === 'web' ? 'bg-white text-[#10B981] shadow-xs' : 'text-gray-600 hover:text-[#1A1A2E]'}`}
                              >
                                  <Globe className="w-3 h-3 mr-1" /> Web Search
                              </button>
                          </div>

                          {/* Tab Content */}
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 min-h-[100px]">
                              {imageTab === 'ai' && (
                                  <div className="space-y-2.5">
                                      <input 
                                          type="text" 
                                          value={imagePrompt}
                                          onChange={(e) => setImagePrompt(e.target.value)}
                                          placeholder="Describe the image you want..." 
                                          className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:border-[#10B981] focus:ring-2 focus:ring-emerald-500/20 bg-white text-[#1A1A2E] outline-none"
                                      />
                                      <button 
                                          onClick={handleGenerateImage}
                                          disabled={isImageLoading || !imagePrompt}
                                          className="w-full btn-primary py-2 text-xs flex items-center justify-center disabled:opacity-50"
                                      >
                                          {isImageLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Sparkles className="w-3 h-3 mr-1.5" />}
                                          Generate Image
                                      </button>
                                  </div>
                              )}

                              {imageTab === 'upload' && (
                                  <div 
                                      onClick={handleFileUpload}
                                      className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#10B981] transition-colors"
                                  >
                                      <UploadCloud className="w-6 h-6 text-gray-400 mb-1.5" />
                                      <span className="text-xs font-medium text-gray-700">Click to browse or drag file here</span>
                                      <span className="text-[10px] text-gray-400 mt-0.5">JPG, PNG up to 5MB</span>
                                  </div>
                              )}

                              {imageTab === 'web' && (
                                  <div className="space-y-2.5">
                                      <div className="flex gap-2">
                                          <input 
                                              type="text" 
                                              value={webQuery}
                                              onChange={(e) => setWebQuery(e.target.value)}
                                              placeholder="Search web images..." 
                                              className="flex-1 text-xs border border-gray-200 rounded-lg p-2.5 focus:border-[#10B981] focus:ring-2 focus:ring-emerald-500/20 bg-white text-[#1A1A2E] outline-none"
                                          />
                                          <button 
                                              onClick={handleWebSearch}
                                              className="btn-accent py-2 px-3 text-xs"
                                          >
                                              <Search className="w-3.5 h-3.5" />
                                          </button>
                                      </div>
                                      
                                      {/* Mock Results Grid */}
                                      {isImageLoading ? (
                                           <div className="flex justify-center py-3"><Loader2 className="w-5 h-5 animate-spin text-[#10B981]" /></div>
                                      ) : webResults.length > 0 ? (
                                           <div className="grid grid-cols-3 gap-2">
                                                {webResults.map((_, i) => (
                                                    <div 
                                                        key={i} 
                                                        onClick={() => setNewCourseData(prev => ({ ...prev, thumbnail: `web_res_${i}` }))}
                                                        className="aspect-square bg-gray-200 rounded-lg cursor-pointer hover:ring-2 hover:ring-[#10B981] relative overflow-hidden group"
                                                    >
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                                                    </div>
                                                ))}
                                           </div>
                                      ) : (
                                          <div className="text-center py-3 text-xs text-gray-400 italic">Enter a keyword to search</div>
                                      )}
                                  </div>
                              )}
                          </div>
                      </div>

                      <div className="border-t border-gray-100 my-3"></div>

                      <div>
                          <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Title <span className="text-[#DC2626]">*</span></label>
                          <input 
                              type="text" 
                              value={newCourseData.title} 
                              onChange={(e) => setNewCourseData({...newCourseData, title: e.target.value})}
                              className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:border-[#10B981] focus:ring-2 focus:ring-emerald-500/20 bg-white text-[#1A1A2E] outline-none" 
                              placeholder="Untitled course"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Description</label>
                          <textarea 
                              value={newCourseData.description} 
                              onChange={(e) => setNewCourseData({...newCourseData, description: e.target.value})}
                              rows={3}
                              className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:border-[#10B981] focus:ring-2 focus:ring-emerald-500/20 bg-white text-[#1A1A2E] outline-none resize-none" 
                              placeholder="Add a brief description..."
                          ></textarea>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 shrink-0">
                          <button onClick={() => setActiveModal('none')} className="btn-secondary text-xs py-2 px-4">Cancel</button>
                          <button onClick={handleFinalizeCreate} className="btn-primary text-xs py-2 px-4">Create</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default CreatorDashboard;