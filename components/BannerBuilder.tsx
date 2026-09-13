
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Save, Image as ImageIcon, Link, 
    UploadCloud, X, Check, Monitor, Smartphone, 
    Tablet, Eye, EyeOff, Layout as LayoutIcon, Type, MousePointerClick, 
    Bell, Search, Menu, Tag, AlertTriangle, GripVertical, Plus, Trash2, Layers, Users, Globe
} from 'lucide-react';
import { LEARNER_GROUPS } from '../constants';

// --- Types ---
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  ctaText: string;
  linkUrl: string;
  bgImage: string | null;
  isVisible: boolean;
  showButton: boolean;
  targetAudience: 'all' | 'specific';
  targetGroups: string[]; // IDs from LEARNER_GROUPS
}

// --- Mock Data ---
const INITIAL_BANNERS: Banner[] = [
  {
    id: '1',
    title: 'Welcome to the New Term',
    subtitle: 'Check out our latest CPD courses added to your library.',
    badgeText: 'Announcement',
    ctaText: 'View Courses',
    linkUrl: '',
    bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    isVisible: true,
    showButton: true,
    targetAudience: 'all',
    targetGroups: []
  },
  {
    id: '2',
    title: 'System Maintenance',
    subtitle: 'Platform scheduled for updates this Sunday 2AM-4AM.',
    badgeText: 'Alert',
    ctaText: 'Status Page',
    linkUrl: '',
    bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
    isVisible: false,
    showButton: true,
    targetAudience: 'all',
    targetGroups: []
  }
];

const BannerBuilder: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- Global Banner State ---
  // Load from localStorage if available, else use defaults
  const [banners, setBanners] = useState<Banner[]>(() => {
      const saved = localStorage.getItem('betterfit_banners');
      return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [activeBannerId, setActiveBannerId] = useState<string>(() => {
      // Try to get first banner ID from loaded banners
      const saved = localStorage.getItem('betterfit_banners');
      const loaded = saved ? JSON.parse(saved) : INITIAL_BANNERS;
      return loaded.length > 0 ? loaded[0].id : '';
  });
  
  // --- Editor Local State (Synced with Active Banner) ---
  const [activeBanner, setActiveBanner] = useState<Banner>(INITIAL_BANNERS[0]);
  
  // Sync activeBanner state when selection changes
  useEffect(() => {
      const found = banners.find(b => b.id === activeBannerId);
      if (found) {
          setActiveBanner(found);
      } else if (banners.length > 0) {
          // Fallback if ID not found (e.g. after deletion)
          setActiveBanner(banners[0]);
          setActiveBannerId(banners[0].id);
      }
  }, [activeBannerId, banners]);

  // View State
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isAudienceModalOpen, setIsAudienceModalOpen] = useState(false);
  const [draggedBannerIndex, setDraggedBannerIndex] = useState<number | null>(null);

  // --- Layout State (Resizable Panels) ---
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(288); // Default w-72
  const [rightSidebarWidth, setRightSidebarWidth] = useState(384); // Default w-96

  // --- Handlers ---

  // Field Updates
  const updateField = (field: keyof Banner, value: any) => {
      // Update local state for immediate feedback
      const updated = { ...activeBanner, [field]: value };
      setActiveBanner(updated);
      
      // Update main list
      setBanners(prev => prev.map(b => b.id === activeBannerId ? updated : b));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              updateField('bgImage', reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSave = () => {
      // Save to localStorage to persist for Learner Dashboard
      localStorage.setItem('betterfit_banners', JSON.stringify(banners));
      navigate('/creator-dashboard');
  };

  const handleAddNewBanner = () => {
      const newBanner: Banner = {
          id: Date.now().toString(),
          title: 'New Announcement',
          subtitle: 'Enter your subtitle here...',
          badgeText: 'New',
          ctaText: 'Learn More',
          linkUrl: '',
          bgImage: null,
          isVisible: true,
          showButton: true,
          targetAudience: 'all',
          targetGroups: []
      };
      setBanners([...banners, newBanner]);
      setActiveBannerId(newBanner.id);
  };

  const handleDeleteBanner = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (banners.length <= 1) return; // Prevent deleting last banner
      
      const newBanners = banners.filter(b => b.id !== id);
      setBanners(newBanners);
      if (activeBannerId === id) {
          setActiveBannerId(newBanners[0].id);
      }
  };

  const toggleGroupSelection = (groupId: string) => {
      const currentGroups = activeBanner.targetGroups || [];
      const newGroups = currentGroups.includes(groupId) 
          ? currentGroups.filter(g => g !== groupId)
          : [...currentGroups, groupId];
      updateField('targetGroups', newGroups);
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
      setDraggedBannerIndex(index);
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      if (draggedBannerIndex === null || draggedBannerIndex === targetIndex) return;

      const newBanners = [...banners];
      const [movedBanner] = newBanners.splice(draggedBannerIndex, 1);
      newBanners.splice(targetIndex, 0, movedBanner);
      
      setBanners(newBanners);
      setDraggedBannerIndex(null);
  };

  // --- Resizing Handlers ---
  const startResizingLeft = (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = leftSidebarWidth;

      const doDrag = (dragEvent: MouseEvent) => {
          const newWidth = Math.max(200, Math.min(600, startWidth + (dragEvent.clientX - startX)));
          setLeftSidebarWidth(newWidth);
      };

      const stopDrag = () => {
          document.removeEventListener('mousemove', doDrag);
          document.removeEventListener('mouseup', stopDrag);
          document.body.style.cursor = 'default';
      };

      document.body.style.cursor = 'col-resize';
      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', stopDrag);
  };

  const startResizingRight = (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = rightSidebarWidth;

      const doDrag = (dragEvent: MouseEvent) => {
          const newWidth = Math.max(280, Math.min(600, startWidth - (dragEvent.clientX - startX)));
          setRightSidebarWidth(newWidth);
      };

      const stopDrag = () => {
          document.removeEventListener('mousemove', doDrag);
          document.removeEventListener('mouseup', stopDrag);
          document.body.style.cursor = 'default';
      };

      document.body.style.cursor = 'col-resize';
      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', stopDrag);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col fixed inset-0 z-50">
        
        {/* 1. Header Navigation */}
        <div className="h-16 bg-white border-b border-[#afafaf]/30 flex items-center justify-between px-6 shrink-0 z-40 shadow-sm relative">
            <div className="flex items-center">
                <button 
                    onClick={() => setIsExitModalOpen(true)}
                    className="mr-4 text-[#6c6c6c] hover:text-[#01427a] transition-colors p-2 hover:bg-slate-50 rounded-full"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-[#0c0c0d] leading-none">Banner Editor</h1>
                    <span className="text-xs text-[#6c6c6c]">Manage learner dashboard announcements</span>
                </div>
            </div>
            
            {/* Center Banner Title */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 max-w-md">
                 <div className="flex items-center justify-center gap-2">
                     <input 
                        type="text" 
                        value={activeBanner.title} 
                        onChange={(e) => updateField('title', e.target.value)}
                        className="text-center font-bold text-[#0c0c0d] bg-transparent border-b border-transparent hover:border-[#afafaf] focus:border-[#01b3ef] focus:ring-0 p-1 w-full truncate transition-colors text-lg"
                        placeholder="Banner Title"
                    />
                    {/* Status Badge */}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 border ${activeBanner.isVisible ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-[#6c6c6c] border-[#afafaf]/20'}`}>
                        {activeBanner.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                 </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden md:flex bg-slate-100 rounded-lg p-1 mr-4">
                    <button 
                        onClick={() => setPreviewDevice('desktop')}
                        className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-white shadow-sm text-[#01427a]' : 'text-[#afafaf]'}`}
                        title="Desktop Preview"
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setPreviewDevice('tablet')}
                        className={`p-2 rounded ${previewDevice === 'tablet' ? 'bg-white shadow-sm text-[#01427a]' : 'text-[#afafaf]'}`}
                        title="Tablet Preview"
                    >
                        <Tablet className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setPreviewDevice('mobile')}
                        className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-white shadow-sm text-[#01427a]' : 'text-[#afafaf]'}`}
                        title="Mobile Preview"
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                </div>

                <div className="h-8 w-px bg-[#afafaf]/30 mx-2 hidden md:block"></div>

                <button 
                    onClick={() => setIsAudienceModalOpen(true)}
                    className="flex items-center px-4 py-2 border border-[#afafaf] rounded-lg text-sm font-medium text-[#6c6c6c] hover:bg-slate-50 transition-colors"
                >
                    {activeBanner.targetAudience === 'all' ? (
                        <>
                            <Globe className="w-4 h-4 mr-2 text-[#01427a]" />
                            All Students
                        </>
                    ) : (
                        <>
                            <Users className="w-4 h-4 mr-2 text-[#01427a]" />
                            Specific Groups ({activeBanner.targetGroups.length})
                        </>
                    )}
                </button>

                <button 
                    onClick={handleSave}
                    className="bg-[#01b3ef] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-[#01427a] transition-colors flex items-center"
                >
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
            </div>
        </div>

        {/* 2. Main Workspace */}
        <div className="flex flex-1 overflow-hidden">
            
            {/* COLUMN 1: BANNER LIST & ORDERING */}
            <div 
                className="bg-white border-r border-[#afafaf]/30 flex flex-col shrink-0 z-10 relative"
                style={{ width: leftSidebarWidth }}
            >
                <div className="p-4 border-b border-[#afafaf]/20 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="text-xs font-bold text-[#6c6c6c] uppercase tracking-wider flex items-center">
                            <Layers className="w-4 h-4 mr-2" /> Display Order
                        </h3>
                        <p className="text-[10px] text-[#afafaf] mt-0.5">Top banner appears first</p>
                    </div>
                    <button 
                        onClick={handleAddNewBanner}
                        className="p-1.5 bg-[#01b3ef] text-white rounded hover:bg-[#01427a] transition-colors"
                        title="Add New Banner"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {banners.map((banner, index) => (
                        <div 
                            key={banner.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onClick={() => setActiveBannerId(banner.id)}
                            className={`group relative flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                activeBannerId === banner.id 
                                ? 'bg-[#01b3ef]/5 border-[#01b3ef] shadow-sm' 
                                : 'bg-white border-[#afafaf]/30 hover:border-[#01b3ef]/50'
                            }`}
                        >
                            <div className="mr-3 text-[#afafaf] cursor-grab active:cursor-grabbing hover:text-[#0c0c0d]">
                                <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-mono text-[#afafaf] bg-slate-100 px-1.5 rounded">{index + 1}</span>
                                    {banner.isVisible ? (
                                        <Eye className="w-3 h-3 text-green-600" />
                                    ) : (
                                        <EyeOff className="w-3 h-3 text-slate-400" />
                                    )}
                                    {banner.targetAudience === 'specific' && (
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded border border-blue-200" title="Targeted Audience">
                                            Targeted
                                        </span>
                                    )}
                                </div>
                                <h4 className={`text-sm font-bold truncate ${activeBannerId === banner.id ? 'text-[#01427a]' : 'text-[#0c0c0d]'}`}>
                                    {banner.title || 'Untitled Banner'}
                                </h4>
                            </div>
                            
                            {banners.length > 1 && (
                                <button 
                                    onClick={(e) => handleDeleteBanner(e, banner.id)}
                                    className="ml-2 p-1.5 text-[#afafaf] hover:text-[#e14177] hover:bg-[#e14177]/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Resizer Handle */}
                <div 
                    className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#01b3ef] z-10 transition-colors"
                    onMouseDown={startResizingLeft}
                ></div>
            </div>

            {/* COLUMN 2: LIVE PREVIEW (Learner Context) */}
            <div className="flex-1 bg-slate-100 flex flex-col overflow-hidden relative">
                
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md z-10 pointer-events-none">
                    Previewing: Learner Dashboard
                </div>

                <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                    
                    {/* Simulated Learner Dashboard Container */}
                    <div 
                        className={`bg-white shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden ${
                            previewDevice === 'mobile' ? 'w-[375px] h-[700px] rounded-[30px] border-[8px] border-slate-800' :
                            previewDevice === 'tablet' ? 'w-[768px] h-[800px] rounded-[30px] border-[8px] border-slate-800' :
                            'w-full max-w-5xl h-auto min-h-[600px] rounded-xl border border-[#afafaf]/20'
                        }`}
                    >
                        {/* Mock Nav Bar */}
                        <div className="h-16 bg-[#01427a] flex items-center justify-between px-4 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#01b3ef] rounded flex items-center justify-center text-white font-bold">B</div>
                                {previewDevice !== 'mobile' && <span className="text-white font-bold text-sm">BETTERFIT LMS</span>}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex gap-4 text-white/70 text-xs font-medium">
                                    <span>Dashboard</span>
                                    <span>Courses</span>
                                    <span>Progress</span>
                                </div>
                                <div className="flex gap-2 text-white">
                                    <Bell className="w-5 h-5" />
                                    <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Mock Content */}
                        <div className="bg-slate-50 flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
                            
                            {/* --- THE BANNER COMPONENT BEING BUILT --- */}
                            <div className={`relative w-full rounded-2xl overflow-hidden shadow-lg group transition-all duration-300 ${activeBanner.isVisible ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                                
                                {/* Background */}
                                <div className="relative aspect-[21/9] md:aspect-[3/1] bg-slate-900">
                                    {activeBanner.bgImage && (
                                        <img src={activeBanner.bgImage} alt="Preview" className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                                </div>

                                {/* Text Content */}
                                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 max-w-2xl">
                                    {activeBanner.badgeText && (
                                        <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest mb-2 text-yellow-400">
                                            {activeBanner.badgeText}
                                        </span>
                                    )}
                                    <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-2 drop-shadow-md">
                                        {activeBanner.title || 'Banner Title'}
                                    </h2>
                                    <p className="text-white/90 text-xs md:text-base mb-6 font-medium max-w-lg">
                                        {activeBanner.subtitle || 'Subtitle text will appear here...'}
                                    </p>
                                    
                                    {activeBanner.showButton && (
                                        <button className="px-6 py-2 md:py-3 bg-[#01b3ef] text-white rounded-lg font-bold shadow-lg w-fit text-xs md:text-sm hover:bg-[#01427a] transition-colors">
                                            {activeBanner.ctaText || 'Click Here'}
                                        </button>
                                    )}
                                </div>

                                {/* Hidden/Audience Indicator Overlay */}
                                {!activeBanner.isVisible ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-20">
                                        <div className="bg-black/80 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center">
                                            <EyeOff className="w-4 h-4 mr-2" /> Hidden from Learners
                                        </div>
                                    </div>
                                ) : activeBanner.targetAudience === 'specific' ? (
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="bg-[#01427a] text-white px-3 py-1.5 rounded-full font-bold text-xs flex items-center border border-white/20 shadow-lg">
                                            <Users className="w-3 h-3 mr-2" /> Targeted: {activeBanner.targetGroups.length} Groups
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            {/* --- END BANNER --- */}

                            {/* Mock Dashboard Content Below */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50 pointer-events-none select-none">
                                <div className="bg-white p-4 rounded-xl h-32 border border-slate-200"></div>
                                <div className="bg-white p-4 rounded-xl h-32 border border-slate-200"></div>
                                <div className="bg-white p-4 rounded-xl h-32 border border-slate-200"></div>
                                <div className="md:col-span-2 bg-white p-4 rounded-xl h-64 border border-slate-200"></div>
                                <div className="bg-white p-4 rounded-xl h-64 border border-slate-200"></div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* COLUMN 3: Configuration Panel */}
            <div 
                className="bg-white border-l border-[#afafaf]/30 flex flex-col overflow-y-auto relative"
                style={{ width: rightSidebarWidth }}
            >
                {/* Resizer Handle */}
                <div 
                    className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-[#01b3ef] z-10 transition-colors"
                    onMouseDown={startResizingRight}
                ></div>

                <div className="p-6 space-y-8">
                    
                    {/* Status Toggle */}
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-[#afafaf]/30">
                        <div>
                            <span className="block text-sm font-bold text-[#0c0c0d]">Banner Status</span>
                            <span className="text-xs text-[#6c6c6c]">
                                {activeBanner.isVisible ? 'Visible to learners' : 'Hidden from dashboard'}
                            </span>
                        </div>
                        <button 
                            onClick={() => updateField('isVisible', !activeBanner.isVisible)}
                            className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 relative ${activeBanner.isVisible ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${activeBanner.isVisible ? 'translate-x-7' : 'translate-x-0'}`}>
                                {activeBanner.isVisible ? <Eye className="w-3 h-3 text-green-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                            </div>
                        </button>
                    </div>

                    {/* Image Uploader */}
                    <div>
                        <h3 className="text-sm font-bold text-[#0c0c0d] uppercase tracking-wider mb-3 flex items-center">
                            <ImageIcon className="w-4 h-4 mr-2 text-[#01b3ef]" /> Background Image
                        </h3>
                        
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative w-full aspect-video rounded-xl border-2 border-dashed border-[#afafaf] bg-slate-50 hover:bg-slate-100 hover:border-[#01b3ef] transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center"
                        >
                            {activeBanner.bgImage ? (
                                <>
                                    <img src={activeBanner.bgImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white text-[#0c0c0d] px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center">
                                            <UploadCloud className="w-4 h-4 mr-2" /> Change Image
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                                        <UploadCloud className="w-6 h-6 text-[#01b3ef]" />
                                    </div>
                                    <span className="text-sm font-bold text-[#6c6c6c] group-hover:text-[#01b3ef]">Click to upload</span>
                                    <span className="text-[10px] text-[#afafaf] mt-1">1920 x 600 px recommended</span>
                                </>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                            />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div>
                        <h3 className="text-sm font-bold text-[#0c0c0d] uppercase tracking-wider mb-3 flex items-center">
                            <Type className="w-4 h-4 mr-2 text-[#01b3ef]" /> Text Overlays
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#6c6c6c] mb-1 flex items-center">
                                    <Tag className="w-3 h-3 mr-1" /> Badge Label
                                </label>
                                <input 
                                    type="text" 
                                    value={activeBanner.badgeText}
                                    onChange={(e) => updateField('badgeText', e.target.value)}
                                    className="w-full border border-[#afafaf] rounded-lg p-2.5 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef]"
                                    placeholder="e.g. Announcement, New, Alert"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#6c6c6c] mb-1">Headline Text</label>
                                <input 
                                    type="text" 
                                    value={activeBanner.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className="w-full border border-[#afafaf] rounded-lg p-2.5 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef]"
                                    placeholder="Enter headline..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#6c6c6c] mb-1">Subtitle / Description</label>
                                <textarea 
                                    rows={3}
                                    value={activeBanner.subtitle}
                                    onChange={(e) => updateField('subtitle', e.target.value)}
                                    className="w-full border border-[#afafaf] rounded-lg p-2.5 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef] resize-none"
                                    placeholder="Enter description..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Action / Link */}
                    <div>
                        <h3 className="text-sm font-bold text-[#0c0c0d] uppercase tracking-wider mb-3 flex items-center">
                            <MousePointerClick className="w-4 h-4 mr-2 text-[#01b3ef]" /> Action
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Toggle Button */}
                            <div className="flex items-center justify-between border border-[#afafaf]/50 p-3 rounded-lg bg-slate-50">
                                <span className="text-sm font-bold text-[#0c0c0d]">Show Call to Action Button</span>
                                <button 
                                    onClick={() => updateField('showButton', !activeBanner.showButton)}
                                    className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative ${activeBanner.showButton ? 'bg-[#01b3ef]' : 'bg-slate-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${activeBanner.showButton ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            {activeBanner.showButton && (
                                <div className="animate-in fade-in slide-in-from-top-1">
                                    <label className="block text-xs font-bold text-[#6c6c6c] mb-1">Button Text</label>
                                    <input 
                                        type="text" 
                                        value={activeBanner.ctaText}
                                        onChange={(e) => updateField('ctaText', e.target.value)}
                                        className="w-full border border-[#afafaf] rounded-lg p-2.5 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef]"
                                        placeholder="e.g. Learn More"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-[#6c6c6c] mb-1">Destination URL (Hyperlink)</label>
                                <div className="relative">
                                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf]" />
                                    <input 
                                        type="text" 
                                        value={activeBanner.linkUrl}
                                        onChange={(e) => updateField('linkUrl', e.target.value)}
                                        className="w-full border border-[#afafaf] rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef]"
                                        placeholder="https://..."
                                    />
                                </div>
                                <p className="text-[10px] text-[#afafaf] mt-1">
                                    {activeBanner.showButton ? 'Link attached to the button.' : 'Link attached to the entire banner.'}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* EXIT WARNING MODAL */}
            {isExitModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="bg-[#e14177] px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2" /> Unsaved Changes
                            </h2>
                            <button onClick={() => setIsExitModalOpen(false)} className="text-white/70 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-[#0c0c0d] font-medium text-lg mb-2">Do you want to save first before returning?</p>
                            <p className="text-[#6c6c6c] text-sm">Otherwise, you'll lose your banner progress.</p>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-[#afafaf]/30 flex justify-end gap-2 flex-wrap">
                            <button 
                                onClick={() => setIsExitModalOpen(false)}
                                className="px-4 py-2 border border-[#afafaf] text-[#6c6c6c] rounded font-bold hover:bg-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => navigate('/creator-dashboard')}
                                className="px-4 py-2 bg-red-100 text-red-700 border border-red-200 rounded font-bold hover:bg-red-200 transition-colors"
                            >
                                Exit Without Saving
                            </button>
                            <button 
                                onClick={() => {
                                    setIsExitModalOpen(false);
                                    handleSave();
                                }}
                                className="px-4 py-2 bg-[#01b3ef] text-white rounded font-bold hover:bg-[#01427a] transition-colors shadow-sm"
                            >
                                Save & Exit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AUDIENCE SELECTOR MODAL */}
            {isAudienceModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                        <div className="bg-[#01427a] px-6 py-4 flex justify-between items-center text-white">
                            <h2 className="text-lg font-bold flex items-center">
                                <Users className="w-5 h-5 mr-2" /> Set Target Audience
                            </h2>
                            <button onClick={() => setIsAudienceModalOpen(false)} className="text-white/70 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <p className="text-sm text-[#6c6c6c] mb-6">
                                Who should see this banner on their dashboard?
                            </p>

                            <div className="space-y-4">
                                {/* Option: All Students */}
                                <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${activeBanner.targetAudience === 'all' ? 'border-[#01b3ef] bg-[#01b3ef]/5' : 'border-[#afafaf]/30 hover:border-[#01b3ef]/50'}`}>
                                    <input 
                                        type="radio" 
                                        name="audienceType" 
                                        checked={activeBanner.targetAudience === 'all'}
                                        onChange={() => updateField('targetAudience', 'all')}
                                        className="mt-1 w-4 h-4 text-[#01b3ef] focus:ring-[#01b3ef]"
                                    />
                                    <div className="ml-3">
                                        <span className="block text-sm font-bold text-[#0c0c0d]">All Students</span>
                                        <span className="block text-xs text-[#6c6c6c]">Visible to everyone in the academy.</span>
                                    </div>
                                </label>

                                {/* Option: Specific Groups */}
                                <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${activeBanner.targetAudience === 'specific' ? 'border-[#01b3ef] bg-[#01b3ef]/5' : 'border-[#afafaf]/30 hover:border-[#01b3ef]/50'}`}>
                                    <input 
                                        type="radio" 
                                        name="audienceType" 
                                        checked={activeBanner.targetAudience === 'specific'}
                                        onChange={() => updateField('targetAudience', 'specific')}
                                        className="mt-1 w-4 h-4 text-[#01b3ef] focus:ring-[#01b3ef]"
                                    />
                                    <div className="ml-3 w-full">
                                        <span className="block text-sm font-bold text-[#0c0c0d]">Specific Groups / Courses</span>
                                        <span className="block text-xs text-[#6c6c6c] mb-3">Visible only to selected cohorts.</span>
                                        
                                        {/* Group List (Only visible if specific is selected) */}
                                        {activeBanner.targetAudience === 'specific' && (
                                            <div className="mt-3 space-y-2 pl-1 border-l-2 border-[#afafaf]/20">
                                                {LEARNER_GROUPS.map(group => (
                                                    <label key={group.id} className="flex items-center p-2 rounded hover:bg-white cursor-pointer group">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={activeBanner.targetGroups.includes(group.id)}
                                                            onChange={() => toggleGroupSelection(group.id)}
                                                            className="rounded text-[#01b3ef] focus:ring-[#01b3ef] mr-3" 
                                                        />
                                                        <span className="text-sm text-[#0c0c0d]">{group.name}</span>
                                                        <span className="ml-auto text-xs text-[#afafaf] bg-white px-2 py-0.5 rounded border border-[#afafaf]/20">{group.count} Users</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-[#afafaf]/30 flex justify-end gap-2">
                            <button 
                                onClick={() => setIsAudienceModalOpen(false)}
                                className="px-4 py-2 border border-[#afafaf] text-[#6c6c6c] rounded font-bold hover:bg-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => setIsAudienceModalOpen(false)}
                                className="px-4 py-2 bg-[#01b3ef] text-white rounded font-bold hover:bg-[#01427a] transition-colors shadow-sm"
                            >
                                Confirm Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default BannerBuilder;
