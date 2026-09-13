
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Users, ChevronRight, Clock, MoreHorizontal, ArrowUpDown, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Layout as LayoutIcon, History as HistoryIcon } from 'lucide-react';

// --- MOCK DATA ---
const GROUPS = [
    { id: 'all', name: 'All Learners', count: 25, type: 'summary' },
    { id: 'g1', name: 'Level 3 PT, September', course: 'L3 Personal Training', count: 12, successful: 10, avgProgress: 88, type: 'group' },
    { id: 'g2', name: 'Level 2, Jim instructor', course: 'L2 Gym Instructor', count: 8, successful: 6, avgProgress: 75, type: 'group' },
    { id: 'g3', name: 'Level 2, Fast Track', course: 'Combined L2/L3', count: 5, successful: 4, avgProgress: 92, type: 'group' },
];

const LEARNERS = [
    { id: '101', name: 'Tom Hanks', group: 'Certificate in Gym Instruction Level 2', groupId: 'g2', activityScore: 95, lastLogin: '2 hours ago', status: 'On Track', progress: 80, timeSpent: '42h 15m', avatar: 'TH', tags: ['high_engagement'] },
    { id: '102', name: 'Leonardo DiCaprio', group: 'Certificate in Gym Instruction Level 2', groupId: 'g2', activityScore: 88, lastLogin: 'Yesterday', status: 'On Track', progress: 75, timeSpent: '38h 20m', avatar: 'LD', tags: ['high_engagement'] },
    { id: '103', name: 'Meryl Streep', group: 'Level 3 PT, September', groupId: 'g1', activityScore: 92, lastLogin: '4 hours ago', status: 'Ahead', progress: 90, timeSpent: '56h 10m', avatar: 'MS', tags: ['high_engagement'] },
    { id: '104', name: 'Heath Ledger', group: 'Level 3 PT, September', groupId: 'g1', activityScore: 15, lastLogin: '14 days ago', status: 'At Risk', progress: 20, timeSpent: '8h 45m', avatar: 'HL', tags: ['at_risk', 'procrastinating'] },
    { id: '105', name: 'Denzel Washington', group: 'Level 2, Fast Track', groupId: 'g3', activityScore: 78, lastLogin: '1 day ago', status: 'On Track', progress: 60, timeSpent: '28h 30m', avatar: 'DW', tags: [] },
    { id: '106', name: 'Marlon Brando', group: 'Level 2, Fast Track', groupId: 'g3', activityScore: 10, lastLogin: '21 days ago', status: 'At Risk', progress: 10, timeSpent: '4h 15m', avatar: 'MB', tags: ['at_risk'] },
    { id: '107', name: 'Marilyn Monroe', group: 'Level 3 PT, September', groupId: 'g1', activityScore: 45, lastLogin: '5 days ago', status: 'Falling Behind', progress: 40, timeSpent: '15h 0m', avatar: 'MM', tags: ['wheel_spinning'] },
    { id: '108', name: 'Chadwick Boseman', group: 'Certificate in Gym Instruction Level 2', groupId: 'g2', activityScore: 60, lastLogin: '2 days ago', status: 'On Track', progress: 55, timeSpent: '22h 10m', avatar: 'CB', tags: ['procrastinating'] },
];

const AssessorLearners: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('all');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const groupId = params.get('groupId');
    const analyticsFilter = params.get('filter');
    
    if (groupId) {
      setSelectedGroupId(groupId);
    }
    
    if (analyticsFilter) {
      setActiveFilter(analyticsFilter as any);
    }
  }, [location]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'at_risk' | 'active' | 'high_engagement' | 'procrastinating' | 'wheel_spinning'>('all');
  const [sortOrder, setSortOrder] = useState<'name' | 'activity'>('activity');

  // 1. Filter by Group
  const groupFiltered = selectedGroupId === 'all' 
    ? LEARNERS 
    : LEARNERS.filter(l => l.groupId === selectedGroupId);

  // 2. Filter by Search
  const searchFiltered = groupFiltered.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.id.includes(searchTerm)
  );

  // 3. Filter by Status (Quick Filters)
  const finalFiltered = searchFiltered.filter((l: any) => {
      if (activeFilter === 'at_risk') return l.status === 'At Risk' || l.status === 'Falling Behind';
      if (activeFilter === 'active') return l.activityScore > 70;
      if (activeFilter === 'high_engagement') return l.tags?.includes('high_engagement');
      if (activeFilter === 'procrastinating') return l.tags?.includes('procrastinating');
      if (activeFilter === 'wheel_spinning') return l.tags?.includes('wheel_spinning');
      return true;
  });

  // 4. Sort
  const sortedLearners = [...finalFiltered].sort((a, b) => {
      if (sortOrder === 'activity') {
          // Sort by engagement score (ascending for "At Risk" view usually, but standard is descending)
          return activeFilter === 'at_risk' ? a.activityScore - b.activityScore : b.activityScore - a.activityScore;
      }
      return a.name.localeCompare(b.name);
  });

  const currentGroup = GROUPS.find(g => g.id === selectedGroupId);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row bg-slate-50 border border-[#afafaf]/30 rounded-xl overflow-hidden animate-in fade-in duration-500">
        
        {/* LEFT SIDEBAR: GROUPS */}
        <div className="w-full md:w-64 bg-white border-r border-[#afafaf]/30 flex flex-col shrink-0">
            <div className="p-4 border-b border-[#afafaf]/20">
                <h2 className="text-sm font-bold text-[#6c6c6c] uppercase tracking-wider flex items-center">
                    <LayoutIcon className="w-4 h-4 mr-2" /> Groups Managed
                </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {GROUPS.map(group => (
                    <button
                        key={group.id}
                        onClick={() => setSelectedGroupId(group.id)}
                        className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition-all ${
                            selectedGroupId === group.id 
                            ? 'bg-[#01427a] text-white shadow-sm' 
                            : 'text-[#0c0c0d] hover:bg-slate-100'
                        }`}
                    >
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-sm truncate">{group.name}</span>
                            {group.type === 'group' && <span className={`text-xs truncate ${selectedGroupId === group.id ? 'text-blue-200' : 'text-[#6c6c6c]'}`}>{group.course}</span>}
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedGroupId === group.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-[#6c6c6c]'}`}>
                            {group.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>

        {/* RIGHT MAIN AREA: LEARNER LIST */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            
            {/* 1. Top Toolbar */}
            <div className="p-6 border-b border-[#afafaf]/20 bg-white">
                <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-[#0c0c0d]">{currentGroup?.name}</h1>
                        <p className="text-[#6c6c6c] text-sm">Managing {finalFiltered.length} learners</p>
                    </div>
                    
                    <div className="flex gap-2">
                        {/* Quick Filters - Replaces big widgets */}
                        <button 
                            onClick={() => setActiveFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${activeFilter === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-[#6c6c6c] border-[#afafaf] hover:bg-slate-50'}`}
                        >
                            All
                        </button>
                        {(activeFilter === 'active' || activeFilter === 'high_engagement') && (
                            <button 
                                onClick={() => setActiveFilter('active')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors flex items-center ${activeFilter === 'active' || activeFilter === 'high_engagement' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-700 border-green-200 hover:bg-green-50'}`}
                            >
                                <TrendingUp className="w-4 h-4 mr-2" /> 
                                {activeFilter === 'high_engagement' ? 'High Engagement' : 'Most Active'}
                            </button>
                        )}
                        {(activeFilter === 'at_risk' || activeFilter === 'procrastinating' || activeFilter === 'wheel_spinning') && (
                            <button 
                                onClick={() => setActiveFilter('at_risk')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors flex items-center ${activeFilter === 'at_risk' || activeFilter === 'procrastinating' || activeFilter === 'wheel_spinning' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-700 border-red-200 hover:bg-red-50'}`}
                            >
                                <AlertCircle className="w-4 h-4 mr-2" /> 
                                {activeFilter === 'procrastinating' ? 'Procrastinating' : activeFilter === 'wheel_spinning' ? 'Wheel Spinning' : 'At Risk / Inactive'}
                            </button>
                        )}
                        {activeFilter === 'all' && (
                            <>
                                <button 
                                    onClick={() => setActiveFilter('active')}
                                    className="px-4 py-2 rounded-lg text-sm font-bold border bg-white text-green-700 border-green-200 hover:bg-green-50 transition-colors flex items-center"
                                >
                                    <TrendingUp className="w-4 h-4 mr-2" /> Most Active
                                </button>
                                <button 
                                    onClick={() => setActiveFilter('at_risk')}
                                    className="px-4 py-2 rounded-lg text-sm font-bold border bg-white text-red-700 border-red-200 hover:bg-red-50 transition-colors flex items-center"
                                >
                                    <AlertCircle className="w-4 h-4 mr-2" /> At Risk / Inactive
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Search & Sort */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            placeholder="Search learner name or ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-[#afafaf] rounded-lg text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef]"
                        />
                        <Search className="w-4 h-4 text-[#afafaf] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <button 
                        onClick={() => setSortOrder(sortOrder === 'name' ? 'activity' : 'name')}
                        className="flex items-center px-3 py-2 bg-white border border-[#afafaf] rounded-lg text-sm font-medium text-[#6c6c6c] hover:text-[#01427a] hover:border-[#01427a]"
                    >
                        <ArrowUpDown className="w-4 h-4 mr-2" /> 
                        Sort by: {sortOrder === 'name' ? 'Name' : 'Activity'}
                    </button>
                </div>
            </div>

            {/* 2. Learner Table */}
            <div className="flex-1 overflow-y-auto">
                <table className="min-w-full divide-y divide-[#afafaf]/20">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Learner Details</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Total Progress</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Time Spent</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Last Active</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#afafaf]/20">
                        {sortedLearners.length > 0 ? (
                            sortedLearners.map(learner => (
                                <tr 
                                    key={learner.id} 
                                    onClick={() => navigate(`/assessor/learner/${learner.id}`)}
                                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-[#01427a] text-white flex items-center justify-center font-bold text-sm mr-4 shrink-0">
                                                {learner.avatar}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#0c0c0d] group-hover:text-[#01b3ef] transition-colors">{learner.name}</div>
                                                <div className="text-xs text-[#afafaf]">ID: #{learner.id}</div>
                                                <div className="text-xs text-slate-500 font-medium mt-0.5">{learner.group}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <div className="w-32">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-bold text-[#0c0c0d]">{learner.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${learner.progress < 30 ? 'bg-red-500' : learner.progress > 70 ? 'bg-green-500' : 'bg-[#01b3ef]'}`} 
                                                    style={{ width: `${learner.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm font-bold text-slate-700">
                                            <HistoryIcon className="w-4 h-4 mr-2 text-slate-400" />
                                            {(learner as any).timeSpent}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-[#0c0c0d]">
                                            <Clock className="w-4 h-4 mr-2 text-[#afafaf]" />
                                            {learner.lastLogin}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                                            learner.status === 'On Track' || learner.status === 'Ahead' ? 'bg-green-50 text-green-700 border-green-200' :
                                            learner.status === 'At Risk' || learner.status === 'Falling Behind' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-orange-50 text-orange-700 border-orange-200'
                                        }`}>
                                            {learner.status === 'On Track' && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {learner.status === 'At Risk' && <AlertCircle className="w-3 h-3 mr-1" />}
                                            {learner.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[#afafaf] group-hover:text-[#01b3ef] p-2 hover:bg-[#01b3ef]/10 rounded-full transition-colors">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center text-[#6c6c6c]">
                                    <div className="flex flex-col items-center justify-center opacity-50">
                                        <Users className="w-12 h-12 mb-3" />
                                        <p className="font-medium">No learners found matching criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default AssessorLearners;
