
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Search, 
    SlidersHorizontal, 
    ChevronDown, 
    ChevronLeft,
    ChevronRight,
    Users, 
    Layers, 
    BookOpen,
    ArrowUpDown,
    Check,
    HelpCircle,
    FileText
} from 'lucide-react';

const LEARNERS = [
    { id: '1', name: 'Soloman Habashanti', avatar: 'SH', color: 'bg-[#b91c1c]', score: '10 / 10', assessment: '5 / 10', engagement: '70%', timeSpent: '31h27min06s', lastActivity: '29 Apr 2026' },
    { id: '2', name: 'Suvwe Obano', avatar: 'SO', color: 'bg-[#c2410c]', score: '1 / 10', assessment: '0 / 1', engagement: '75%', timeSpent: '31min36s', lastActivity: '23 Apr 2026' },
    { id: '3', name: 'Abby King', avatar: 'AK', color: 'bg-emerald-600', score: '8 / 10', assessment: '4 / 10', engagement: '65%', timeSpent: '12h15min', lastActivity: 'Yesterday' },
    { id: '4', name: 'Adam Bouskill', avatar: 'AB', color: 'bg-slate-700', score: '9 / 10', assessment: '6 / 10', engagement: '82%', timeSpent: '45h20min', lastActivity: 'Today', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
    { id: '5', name: 'Ben Audley', avatar: 'BA', color: 'bg-purple-700', score: '7 / 10', assessment: '3 / 10', engagement: '55%', timeSpent: '8h45min', lastActivity: '2 days ago' },
];

const GROUPS = [
    { id: 'g1', name: 'Level 3 PT, September', count: 12, successful: 10, avgProgress: 88, activeProgressing: 2 },
    { id: 'g2', name: 'Level 2, Jim instructor', count: 8, successful: 6, avgProgress: 75, activeProgressing: 2 },
    { id: 'g3', name: 'Level 2, Fast Track', count: 5, successful: 4, avgProgress: 92, activeProgressing: 1 },
];

const COURSES = [
    { id: 'c1', name: 'L3 Personal Training', count: 45, successful: 38, avgProgress: 84 },
    { id: 'c2', name: 'L2 Gym Instructor', count: 32, successful: 25, avgProgress: 78 },
    { id: 'c3', name: 'Combined L2/L3', count: 18, successful: 15, avgProgress: 91 },
    { id: 'c4', name: 'Exercise for Health', count: 22, successful: 18, avgProgress: 82 },
];

const ASSESSMENTS = [
    { id: 'a1', name: 'Macro-nutrients Quiz', count: 28, unit: 'Nutrition Basics' },
    { id: 'a2', name: 'Anatomy Workbook', count: 15, unit: 'Anatomy & Physiology' },
    { id: 'a3', name: 'Client Interview Video', count: 12, unit: 'Consultation Skills' },
    { id: 'a4', name: 'Program Design Review', count: 8, unit: 'Applied PT' },
    { id: 'a5', name: 'Carry Band Worksheets', count: 20, unit: 'Nutrition Basics' },
];

const AssessorResultsBy: React.FC = () => {
    const { type = 'learners' } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const toggleSelectAll = () => {
        if (selectedItems.length === data.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(data.map(item => item.id));
        }
    };

    const toggleSelectItem = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(i => i !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const rawData = type === 'groups' ? GROUPS : type === 'courses' ? COURSES : type === 'assessments' ? ASSESSMENTS : LEARNERS;
    const label = type === 'groups' ? 'Group' : type === 'courses' ? 'Course' : type === 'assessments' ? 'Assessment' : 'Learner';
    const data = rawData.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-500">
            {/* Navigation Row - Consistent with Analytics dashboard */}
            <div className="flex flex-wrap gap-4 mb-8">
                <button 
                    onClick={() => navigate('/assessor/results-by/learners')}
                    className={`group flex items-center gap-3 px-6 py-4 rounded-xl border transition-all active:scale-95 shadow-sm hover:shadow-md ${type === 'learners' ? 'bg-secondary text-white border-secondary' : 'bg-white text-slate-700 border-slate-200 hover:border-primary-fixed-dim'}`}
                >
                    <div className={`p-2 rounded-lg transition-colors ${type === 'learners' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-secondary group-hover:text-white'}`}>
                        <Users className="w-5 h-5" />
                    </div>
                    <span className={`font-bold ${type === 'learners' ? 'text-white' : 'text-slate-700 group-hover:text-secondary'}`}>View by Learner</span>
                </button>
                <button 
                    onClick={() => navigate('/assessor/results-by/groups')}
                    className={`group flex items-center gap-3 px-6 py-4 rounded-xl border transition-all active:scale-95 shadow-sm hover:shadow-md ${type === 'groups' ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' : 'bg-white text-slate-700 border-slate-200 hover:border-[#8B5CF6]'}`}
                >
                    <div className={`p-2 rounded-lg transition-colors ${type === 'groups' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600 group-hover:bg-[#8B5CF6] group-hover:text-white'}`}>
                        <Layers className="w-5 h-5" />
                    </div>
                    <span className={`font-bold ${type === 'groups' ? 'text-white' : 'text-slate-700 group-hover:text-[#8B5CF6]'}`}>View by Group</span>
                </button>
                <button 
                    onClick={() => navigate('/assessor/results-by/courses')}
                    className={`group flex items-center gap-3 px-6 py-4 rounded-xl border transition-all active:scale-95 shadow-sm hover:shadow-md ${type === 'courses' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500'}`}
                >
                    <div className={`p-2 rounded-lg transition-colors ${type === 'courses' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'}`}>
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <span className={`font-bold ${type === 'courses' ? 'text-white' : 'text-slate-700 group-hover:text-emerald-500'}`}>View by Course</span>
                </button>
                <button 
                    onClick={() => navigate('/assessor/results-by/assessments')}
                    className={`group flex items-center gap-3 px-6 py-4 rounded-xl border transition-all active:scale-95 shadow-sm hover:shadow-md ${type === 'assessments' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-700 border-slate-200 hover:border-pink-500'}`}
                >
                    <div className={`p-2 rounded-lg transition-colors ${type === 'assessments' ? 'bg-white/20 text-white' : 'bg-pink-50 text-pink-600 group-hover:bg-pink-500 group-hover:text-white'}`}>
                        <FileText className="w-5 h-5" />
                    </div>
                    <span className={`font-bold ${type === 'assessments' ? 'text-white' : 'text-slate-700 group-hover:text-pink-500'}`}>View by Assessment</span>
                </button>
            </div>

            {/* Header Section */}
            <div className="mb-8 pt-4">
                <h1 className="text-3xl font-extrabold text-black">View by {type === 'learners' ? 'learners' : type === 'groups' ? 'groups' : type === 'courses' ? 'courses' : 'assessments'}</h1>
                <p className="text-slate-500 mt-2 font-medium">
                    Find individual {type === 'learners' ? 'learners' : type === 'groups' ? 'groups' : type === 'courses' ? 'courses' : 'assessments'} and check on progress and engagement.
                </p>
            </div>

            {/* Toolbar Section */}
            <div className="flex gap-4 mb-8">
                <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search className="w-5 h-5 stroke-[2.5px]" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-600 placeholder:text-slate-400"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm">
                    <SlidersHorizontal className="w-5 h-5 stroke-[2.5px]" />
                    Filter
                </button>
            </div>

            {/* Results List (Table/Row Layout) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-20 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="p-3 w-10 pt-4 pb-4">
                                <div 
                                    onClick={toggleSelectAll}
                                    className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${selectedItems.length === data.length ? 'bg-secondary border-secondary' : 'border-slate-300 bg-white hover:border-primary-fixed-dim'}`}
                                >
                                    {selectedItems.length === data.length && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </th>
                            <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</th>
                            {type === 'learners' && (
                                <>
                                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Engagement</th>
                                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Assessment</th>
                                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                </>
                            )}
                            {(type === 'groups' || type === 'courses') && (
                                <>
                                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Enrolled</th>
                                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Successful</th>
                                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Average progress</th>
                                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right pr-6 whitespace-nowrap">{type === 'groups' ? 'Group Actions' : 'Course Actions'}</th>
                                </>
                            )}
                            {type !== 'learners' && type !== 'groups' && type !== 'courses' && (
                                <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Details</th>
                            )}
                            <th className="p-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map((item) => (
                            <tr 
                                key={item.id} 
                                className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                                onClick={() => {
                                    if (type === 'learners') {
                                        navigate(`/assessor/learner/${item.id}`);
                                    } else if (type === 'assessments') {
                                        navigate(`/assessor/assessment-learners/${item.id}`);
                                    } else if (type === 'courses') {
                                        navigate(`/learner/lesson/1`);
                                    }
                                }}
                            >
                                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                    <div 
                                        onClick={() => toggleSelectItem(item.id)}
                                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${selectedItems.includes(item.id) ? 'bg-secondary border-secondary' : 'border-slate-300 bg-white hover:border-primary-fixed-dim'}`}
                                    >
                                        {selectedItems.includes(item.id) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2.5">
                                        {type === 'learners' && (
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[9px] overflow-hidden shrink-0 ${(item as any).color}`}>
                                                {(item as any).image ? (
                                                    <img src={(item as any).image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    (item as any).avatar
                                                )}
                                            </div>
                                        )}
                                        {type !== 'learners' && (
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${type === 'groups' ? 'bg-purple-100 text-purple-600' : type === 'courses' ? 'bg-emerald-100 text-emerald-600' : 'bg-pink-100 text-pink-600'}`}>
                                                {type === 'groups' ? <Layers className="w-3.5 h-3.5" /> : type === 'courses' ? <BookOpen className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <div className="font-bold text-slate-900 group-hover:text-secondary transition-colors text-[13px] truncate">{item.name}</div>
                                            {type === 'assessments' && <div className="text-[9px] text-pink-500 font-bold uppercase tracking-tight truncate">{(item as any).unit}</div>}
                                        </div>
                                    </div>
                                </td>
                                
                                {type === 'learners' && (
                                    <>
                                        <td className="p-3 text-center">
                                            <span className="text-[11px] font-black text-[#a16207]">{(item as any).engagement}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className="text-[11px] font-bold text-slate-700">{(item as any).score}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className="text-[11px] font-bold text-slate-700">{(item as any).assessment}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] uppercase font-black rounded border border-emerald-100">Successful</span>
                                        </td>
                                    </>
                                )}

                                {(type === 'groups' || type === 'courses') && (
                                    <>
                                        <td className="p-3 text-center">
                                            <span className="text-[11px] font-bold text-slate-700">{(item as any).count}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className="text-[11px] font-bold text-emerald-600">{(item as any).successful}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[11px] font-bold text-secondary">{(item as any).avgProgress}%</span>
                                                <div className="w-16 bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                                                    <div className="bg-primary h-full" style={{ width: `${(item as any).avgProgress}%` }}></div>
                                                </div>
                                                {(item as any).activeProgressing && (
                                                    <span className="text-[8px] text-slate-400 font-bold mt-1 uppercase">{(item as any).activeProgressing} active</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-2 pr-3">
                                                <button 
                                                    onClick={() => navigate(type === 'groups' ? `/assessor/qualification-units/${item.id}` : `/assessor/course-management`)}
                                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase transition-all active:scale-95 border border-slate-200"
                                                >
                                                    <BookOpen className="w-3 h-3" />
                                                    Units
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/assessor/learners?${type === 'groups' ? 'groupId' : 'courseId'}=${item.id}`)}
                                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary hover:bg-black text-white rounded-full text-[10px] font-black uppercase transition-all active:scale-95 shadow-sm"
                                                >
                                                    <Users className="w-3 h-3" />
                                                    Learners
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}

                                {type !== 'learners' && type !== 'groups' && type !== 'courses' && (
                                    <td className="p-3 text-right">
                                        <span className="text-[11px] text-slate-500 font-bold">{(item as any).count} learners</span>
                                    </td>
                                )}

                                <td className="p-3 text-right">
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-secondary transition-colors inline-block" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (
                <div className="p-20 text-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No results found matching your search criteria.
                </div>
            )}
            
            {/* Pagination Footer */}
            <div className="mt-8 flex items-center justify-end gap-6 text-sm text-slate-500 pb-12">
                <span>1-25 of 26</span>
                <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-slate-100 rounded disabled:opacity-30" disabled>
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-secondary text-secondary font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100">2</button>
                    </div>
                    <button className="p-1 hover:bg-slate-100 rounded">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium">
                        25 / page
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Help Icon in bottom corner as seen in screenshot */}
            <div className="fixed bottom-6 left-6">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 shadow-sm transition-all hover:bg-slate-50 cursor-pointer">
                    <HelpCircle className="w-6 h-6 stroke-[1.5px]" />
                </div>
            </div>
        </div>
    );
};

export default AssessorResultsBy;
