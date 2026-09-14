
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Filter, ChevronRight, AlertTriangle, Briefcase, 
    Users, CheckCircle, Clock, TrendingUp, AlertCircle, 
    Mail, Calendar as CalendarIcon, FileText, Video, MoreHorizontal,
    BookOpen, MessageSquare, FileBarChart
} from 'lucide-react';
import Button from './ui/Button';
import { 
    AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Mock Data matching the screenshot context
const PENDING_SUBMISSIONS = [
    { id: 's1', learner: 'Tom Hanks', submission: 'Unit 1: Anatomy Workbook', submitted: '2 hrs ago', type: 'Workbook', status: 'Grading Required', avatarColor: 'bg-blue-100 text-blue-700' },
    { id: 's2', learner: 'Leonardo DiCaprio', submission: 'Client Interview Video', submitted: 'Yesterday', type: 'Video', status: 'Grading Required', avatarColor: 'bg-purple-100 text-purple-700' },
    { id: 's3', learner: 'Heath Ledger', submission: 'Program Design', submitted: '2 days ago', type: 'Document', status: 'Overdue Review', avatarColor: 'bg-orange-100 text-orange-700' },
    { id: 's4', learner: 'Marilyn Monroe', submission: 'Nutritional Analysis', submitted: '3 days ago', type: 'Document', status: 'Grading Required', avatarColor: 'bg-pink-100 text-pink-700' },
];

const UPCOMING_EVENTS = [
    { id: 'e1', title: '1-1 Review: Meryl Streep', time: '14:00', date: 'Today', type: 'Meeting', color: 'border-l-4 border-blue-500' },
    { id: 'e2', title: 'Group A: Q&A Session', time: '16:00', date: 'Today', type: 'Webinar', color: 'border-l-4 border-purple-500' },
    { id: 'e3', title: 'Submission Day: L2 Gym', time: '09:00', date: 'Tomorrow', type: 'Submission', color: 'border-l-4 border-emerald-500' },
    { id: 'e4', title: 'Staff Standardization', time: '11:00', date: 'Wed', type: 'Meeting', color: 'border-l-4 border-slate-500' },
];

const ASSESSOR_DATA = {
    name: 'David',
    lastLogin: 'Today, 09:14 AM',
    stats: {
        totalAllocated: 42,
        activeGroups: 3,
        pendingReviews: PENDING_SUBMISSIONS.length,
        assignedCourses: 6,
        hasNewLearners: true, // Trigger green panel
        hasNewGroups: true,   // Trigger amber panel
        qaReport: {
            status: 'mixed', // 'positive' | 'referrals' | 'mixed'
            allPassed: false,
            hasReferrals: true,
            title: 'QA Reports',
            summary: 'Mix: 8 Pass, 2 Referrals'
        }
    },
    alerts: [
        { id: 1, type: 'iqa', text: 'Report Available', subtext: 'Feedback returned by IQA', priority: 'high' },
    ],
    newMessages: 2,
    // At-risk learners for the panel
    leastActive: [
        { id: '106', name: 'Marlon Brando', group: 'L3 PT - Fast Track', lastLogin: '21 days ago' },
        { id: '104', name: 'Heath Ledger', group: 'L2 GYM - Oct', lastLogin: '14 days ago' },
        { id: '107', name: 'Marilyn Monroe', group: 'L3 PT - Fast Track', lastLogin: '5 days ago' },
    ],
    // Main Learner List
    learners: [
        { id: '000123456', name: 'Tom Hanks', group: 'L2 GYM - Sept', course: 'L2 Gym Instructor', progress: 80, status: 'Active', lastActive: '2 hrs ago' },
        { id: '151664616', name: 'Leonardo DiCaprio', group: 'L2 GYM - Sept', course: 'L2 Gym Instructor', progress: 80, status: 'Active', lastActive: '1 day ago' },
        { id: '236536738', name: 'Meryl Streep', group: 'L2 GYM - Oct', course: 'L2 Gym Instructor', progress: 80, status: 'Active', lastActive: '5 mins ago' },
        { id: '652662362', name: 'Heath Ledger', group: 'L2 GYM - Oct', course: 'L2 Gym Instructor', progress: 80, status: 'Active', lastActive: '14 days ago' },
        { id: '772662362', name: 'Denzel Washington', group: 'L3 PT - Fast Track', course: 'L3 Personal Training', progress: 45, status: 'Active', lastActive: '1 week ago' },
        { id: '882662362', name: 'Marlon Brando', group: 'L3 PT - Fast Track', course: 'L3 Personal Training', progress: 20, status: 'Lagging', lastActive: '21 days ago' },
    ],
    // Activity Data (Mocked for different contexts)
    activityData: [
        { day: 1, access: 20 }, { day: 5, access: 40 }, { day: 10, access: 30 }, 
        { day: 15, access: 60 }, { day: 20, access: 45 }, { day: 25, access: 55 }, { day: 30, access: 35 }
    ]
};

const AssessorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');

  // Filter Logic
  const filteredLearners = ASSESSOR_DATA.learners.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.id.includes(searchTerm);
      const matchesGroup = selectedGroup === 'All' || l.group === selectedGroup;
      return matchesSearch && matchesGroup;
  });

  // Extract unique groups for filter
  const uniqueGroups = Array.from(new Set(ASSESSOR_DATA.learners.map(l => l.group)));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. BRANDED HEADER */}
      <div className="bg-tertiary rounded-xl p-6 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10">
              <div className="flex items-center mb-2">
                  <span className="bg-white/20 border border-white/30 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center mr-3">
                      <Briefcase className="w-3 h-3 mr-1" /> Assessor Portal
                  </span>
                  <span className="text-white/80 text-xs font-medium">Last login: {ASSESSOR_DATA.lastLogin}</span>
              </div>
              <h1 className="text-2xl font-bold mb-1 text-white">Welcome back, {ASSESSOR_DATA.name}</h1>
              <p className="text-white/90 text-sm">Your guidance shapes the future of fitness and wellness professionals.</p>
          </div>
      </div>

      {/* 2. STATS & QUICK TOOLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
          <button 
            onClick={() => navigate('/assessor/learners')}
            className={`p-3.5 rounded-lg shadow-sm border flex flex-col justify-center min-h-[90px] transition-all group text-left ${
                ASSESSOR_DATA.stats.hasNewLearners 
                ? 'bg-warning-container/40 border-warning hover:bg-warning-container' 
                : 'bg-white border-outline-variant hover:border-primary-fixed-dim'
            }`}
          >
              <div className="flex items-center mb-1.5">
                  <div className={`p-2 rounded-md mr-2.5 ${
                      ASSESSOR_DATA.stats.hasNewLearners ? 'bg-warning-container text-on-warning-container' : 'bg-surface text-primary'
                  }`}>
                      <Users className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                      <span className="text-xs font-medium text-on-surface">
                          Allocated
                      </span>
                      {ASSESSOR_DATA.stats.hasNewLearners && (
                          <span className="text-[10px] font-semibold text-on-warning-container">NEW</span>
                      )}
                  </div>
              </div>
              <p className="text-xl font-bold pl-1 text-on-surface">
                  {ASSESSOR_DATA.stats.totalAllocated}
              </p>
          </button>

          <button 
            onClick={() => navigate('/assessor/learners')}
            className={`p-3.5 rounded-lg shadow-sm border flex flex-col justify-center min-h-[90px] transition-all group text-left ${
                ASSESSOR_DATA.stats.hasNewGroups 
                ? 'bg-warning-container/40 border-warning hover:bg-warning-container' 
                : 'bg-white border-outline-variant hover:border-primary-fixed-dim'
            }`}
          >
              <div className="flex items-center mb-1.5">
                  <div className={`p-2 rounded-md mr-2.5 ${
                      ASSESSOR_DATA.stats.hasNewGroups ? 'bg-warning-container text-on-warning-container' : 'bg-surface text-on-surface-variant'
                  }`}>
                      <Filter className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                      <span className="text-xs font-medium text-on-surface">
                          Groups
                      </span>
                      {ASSESSOR_DATA.stats.hasNewGroups && (
                          <span className="text-[10px] font-semibold text-on-warning-container">NEW GROUP</span>
                      )}
                  </div>
              </div>
              <p className="text-xl font-bold pl-1 text-on-surface">
                  {ASSESSOR_DATA.stats.activeGroups}
              </p>
          </button>
          
          <button 
            onClick={() => navigate('/assessor/pending')}
            className="bg-white p-3.5 rounded-lg shadow-sm border border-outline-variant hover:border-primary-fixed-dim transition-all group text-left flex flex-col justify-center min-h-[90px]"
          >
              <div className="flex items-center mb-1.5">
                  <div className="p-2 rounded-md mr-2.5 bg-primary-container text-on-primary-container">
                      <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                      <span className="text-xs font-medium text-on-surface">
                          Pending
                      </span>
                  </div>
              </div>
              <p className="text-xl font-bold pl-1 text-on-surface">
                  {PENDING_SUBMISSIONS.length}
              </p>
          </button>

          <button 
            onClick={() => navigate('/assessor/analytics')}
            className="bg-white p-3.5 rounded-lg shadow-sm border border-outline-variant hover:border-primary-fixed-dim transition-all group text-left flex flex-col justify-center min-h-[90px]"
          >
              <div className="flex items-center mb-1.5">
                  <div className="p-2 rounded-md mr-2.5 bg-surface-container-high text-on-surface-variant">
                      <FileBarChart className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                      <span className="text-xs font-medium text-on-surface">
                          Analytics
                      </span>
                  </div>
              </div>
              <p className="text-xl font-bold pl-1 text-on-surface">
                  84%
              </p>
          </button>

          <button 
            onClick={() => navigate('/assessor/results-by/courses')}
            className="bg-white p-3.5 rounded-lg shadow-sm border border-outline-variant hover:border-primary-fixed-dim transition-all group text-left flex flex-col justify-center min-h-[90px]"
          >
              <div className="flex items-center mb-1.5">
                  <div className="p-2 rounded-md mr-2.5 bg-secondary-container text-secondary">
                      <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                      <span className="text-xs font-medium text-on-surface">
                          Courses
                      </span>
                  </div>
              </div>
              <p className="text-xl font-bold pl-1 text-on-surface">
                  {ASSESSOR_DATA.stats.assignedCourses}
              </p>
          </button>

          <button 
            onClick={() => navigate('/reports')}
            className={`p-3.5 rounded-lg shadow-sm border flex flex-col justify-center min-h-[90px] transition-all group text-left ${
                ASSESSOR_DATA.stats.qaReport.status === 'positive' ? 'bg-[#D1FAE5]/40 border-[#10B981] hover:bg-[#D1FAE5]' :
                ASSESSOR_DATA.stats.qaReport.status === 'referrals' ? 'bg-error-container/40 border-error hover:bg-error-container' :
                ASSESSOR_DATA.stats.qaReport.status === 'mixed' ? 'bg-warning-container/40 border-warning hover:bg-warning-container' :
                'bg-white border-outline-variant hover:border-primary-fixed-dim'
            }`}
          >
              <div className="flex items-center mb-1.5">
                   <div className={`p-2 rounded-md mr-2.5 ${
                       ASSESSOR_DATA.stats.qaReport.status === 'positive' ? 'bg-[#D1FAE5] text-[#059669]' :
                       ASSESSOR_DATA.stats.qaReport.status === 'referrals' ? 'bg-error-container text-error' :
                       ASSESSOR_DATA.stats.qaReport.status === 'mixed' ? 'bg-warning-container text-on-warning-container' :
                       'bg-surface-container-high text-on-surface-variant'
                   }`}>
                      <FileText className="w-4 h-4" />
                   </div>
                   <div className="flex flex-col">
                       <span className="text-xs font-medium text-on-surface">
                           {ASSESSOR_DATA.stats.qaReport.title}
                       </span>
                   </div>
              </div>
              <div className="text-[11px] font-semibold pl-1 text-on-surface">
                  {ASSESSOR_DATA.stats.qaReport.status === 'positive' ? 'ALL PASSED' : ASSESSOR_DATA.stats.qaReport.summary}
              </div>
          </button>

          <button 
              onClick={() => navigate('/messages')}
              className="bg-white p-3.5 rounded-lg shadow-sm border border-outline-variant hover:border-primary-fixed-dim transition-all group text-left flex flex-col justify-center min-h-[90px]"
          >
              <div className="flex items-center mb-1.5">
                  <div className="p-2 rounded-md mr-2.5 bg-primary-container text-on-primary-container">
                      <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                      <span className="text-xs font-medium text-on-surface">
                          Messages
                      </span>
                  </div>
              </div>
              <p className="text-xl font-bold pl-1 text-on-surface">
                  {ASSESSOR_DATA.newMessages}
              </p>
          </button>
      </div>

      {/* 3. MAIN DASHBOARD GRID: SUBMISSIONS & SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* LEFT: PENDING SUBMISSIONS (2 Cols width) */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-outline-variant overflow-hidden flex flex-col">
              <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface">
                  <h3 className="text-base font-semibold text-on-surface flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-primary" />
                      Pending Submissions
                  </h3>
                  <button onClick={() => navigate('/assessor/pending')} className="text-xs font-medium text-primary hover:underline">View All Queue</button>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[400px] p-0">
                  <table className="w-full text-left border-collapse">
                        <thead className="bg-surface sticky top-0 z-10 border-b border-outline-variant text-xs font-medium text-on-surface-muted">
                            <tr>
                                <th className="px-5 py-3">Learner</th>
                                <th className="px-5 py-3">Submission</th>
                                <th className="px-5 py-3">Submitted</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant text-xs">
                            {PENDING_SUBMISSIONS.map(item => (
                                <tr key={item.id} className="hover:bg-surface transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-on-surface flex items-center gap-2.5">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${item.avatarColor}`}>
                                            {item.learner.charAt(0)}
                                        </div>
                                        {item.learner}
                                    </td>
                                    <td className="px-5 py-3.5 text-on-surface-muted">
                                        <div className="flex items-center gap-1.5">
                                            {item.type === 'Video' ? <Video className="w-3.5 h-3.5 text-on-surface-variant" /> : <FileText className="w-3.5 h-3.5 text-secondary" />}
                                            {item.submission}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={item.status === 'Overdue Review' ? 'text-error font-medium' : 'text-on-surface'}>{item.submitted}</span>
                                        {item.status === 'Overdue Review' && <span className="text-[10px] ml-2 badge-warning">Overdue</span>}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <Button size="sm" onClick={() => navigate('/assessor/pending')}>
                                            Mark Now
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                  </table>
              </div>
          </div>

          {/* RIGHT: SCHEDULE (1 Col width) */}
          <div className="bg-white rounded-lg shadow-sm border border-outline-variant overflow-hidden flex flex-col">
              <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface">
                  <h3 className="text-base font-semibold text-on-surface flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2 text-on-surface-variant" />
                      Your Schedule
                  </h3>
                  <button onClick={() => navigate('/calendar')} className="text-on-surface-muted hover:text-on-surface">
                      <MoreHorizontal className="w-4 h-4" />
                  </button>
              </div>
              <div className="p-4 space-y-2.5 flex-1 overflow-y-auto max-h-[400px]">
                  {UPCOMING_EVENTS.map(event => (
                      <div key={event.id} className={`bg-white border border-outline-variant rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow ${event.color}`}>
                          <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-medium text-on-surface-muted uppercase tracking-wide">{event.date} • {event.time}</span>
                              <span className="text-[10px] bg-surface px-2 py-0.5 rounded text-on-surface-muted border border-outline-variant">{event.type}</span>
                          </div>
                          <h4 className="font-semibold text-on-surface text-xs">{event.title}</h4>
                      </div>
                  ))}
                  <button onClick={() => navigate('/calendar')} className="w-full py-2 text-center text-xs font-medium text-primary hover:underline border border-dashed border-outline-variant rounded-lg mt-2 hover:bg-surface">
                      + Add New Event
                  </button>
              </div>
          </div>
      </div>

      {/* 4. ANALYTICS & INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Engagement Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-outline-variant p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-on-surface flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-primary" /> Activity Trends
                  </h3>
                  <select className="text-xs border border-outline-variant rounded-shape-md p-1.5 bg-white text-on-surface focus:ring-1 focus:ring-primary focus:border-primary">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                  </select>
              </div>
              <div className="h-40 w-full flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ASSESSOR_DATA.activityData}>
                          <defs>
                              <linearGradient id="colorEngagementMini" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#D70029" stopOpacity={0.25}/>
                                  <stop offset="95%" stopColor="#D70029" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D6D2D0" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#706B6A', fontSize: 10}} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #D6D2D0', fontSize: '12px' }} />
                          <Area type="monotone" dataKey="access" stroke="#D70029" strokeWidth={2} fillOpacity={1} fill="url(#colorEngagementMini)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* At Risk List */}
          <div className="bg-white rounded-lg shadow-sm border border-outline-variant p-5">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-on-surface flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-error" /> Attention Needed
                  </h3>
                  <button className="text-xs font-medium text-primary hover:underline">View All</button>
              </div>
              <div className="space-y-2.5">
                  {ASSESSOR_DATA.leastActive.slice(0, 3).map(learner => (
                      <div key={learner.id} className="flex items-center justify-between p-2.5 bg-[#FEF2F2] rounded-lg border border-error-container">
                          <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-xs font-bold text-error border border-[#FCA5A5]">
                                  {learner.name.charAt(0)}
                              </div>
                              <div>
                                  <p className="text-xs font-semibold text-on-surface">{learner.name}</p>
                                  <p className="text-[10px] text-error">Inactive: {learner.lastLogin}</p>
                              </div>
                          </div>
                          <button onClick={() => navigate('/messages')} className="p-1.5 bg-white text-on-surface rounded hover:text-primary shadow-sm border border-outline-variant">
                              <Mail className="w-3.5 h-3.5" />
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 5. LEARNER MANAGEMENT TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-outline-variant overflow-hidden">
          <div className="p-5 border-b border-outline-variant bg-surface flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                  <h2 className="text-base font-semibold text-on-surface">Learner Management</h2>
                  <p className="text-xs text-on-surface-muted">Monitor progress and submissions</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                      <select 
                          value={selectedGroup}
                          onChange={(e) => setSelectedGroup(e.target.value)}
                          className="w-full sm:w-48 pl-3 pr-8 py-2 border border-outline-variant rounded-shape-md text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary bg-white text-on-surface"
                      >
                          <option value="All">All Groups</option>
                          {uniqueGroups.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                  </div>
                  <div className="relative">
                      <input 
                          type="text" 
                          placeholder="Find learner..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full sm:w-64 pl-9 pr-3 py-2 border border-outline-variant rounded-shape-md text-xs focus:ring-1 focus:ring-primary focus:border-primary text-on-surface"
                      />
                      <Search className="w-3.5 h-3.5 text-on-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-outline-variant">
                  <thead className="bg-surface">
                      <tr>
                          <th className="px-5 py-3 text-left text-xs font-medium text-on-surface-muted">Learner Name</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-on-surface-muted">Group</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-on-surface-muted">Course</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-on-surface-muted">Course Progress</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-on-surface-muted">Last Active</th>
                          <th className="px-5 py-3 text-right text-xs font-medium text-on-surface-muted">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-outline-variant">
                      {filteredLearners.length > 0 ? (
                          filteredLearners.map(learner => (
                              <tr key={learner.id} className="hover:bg-surface transition-colors group">
                                  <td className="px-5 py-3.5 whitespace-nowrap">
                                      <div className="flex items-center">
                                          <div className="h-7 w-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-semibold text-xs mr-2.5">
                                              {learner.name.split(' ').map(n => n[0]).join('')}
                                          </div>
                                          <div>
                                              <div className="text-xs font-semibold text-on-surface">{learner.name}</div>
                                              <div className="text-[10px] text-on-surface-muted">#{learner.id}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-5 py-3.5 whitespace-nowrap">
                                      <span className="text-xs font-medium bg-surface border border-outline-variant px-2 py-0.5 rounded text-on-surface">
                                          {learner.group}
                                      </span>
                                  </td>
                                  <td className="px-5 py-3.5 whitespace-nowrap">
                                      <div className="text-xs text-on-surface">{learner.course}</div>
                                  </td>
                                  <td className="px-5 py-3.5 whitespace-nowrap align-middle">
                                      <div className="w-full max-w-[140px]">
                                          <div className="flex justify-between text-[11px] mb-1">
                                              <span className="font-semibold text-on-surface">{learner.progress}%</span>
                                          </div>
                                          <div className="w-full bg-outline-variant rounded-full h-1.5 overflow-hidden">
                                              <div 
                                                  className={`h-full rounded-full ${learner.status === 'Lagging' ? 'bg-error' : 'bg-[#10B981]'}`} 
                                                  style={{ width: `${learner.progress}%` }}
                                              ></div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-5 py-3.5 whitespace-nowrap text-xs text-on-surface-muted">
                                      {learner.lastActive}
                                  </td>
                                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                                      <button 
                                          onClick={() => navigate(`/assessor/learner/${learner.id}`)}
                                          className="text-primary hover:text-primary-deep font-medium text-xs flex items-center justify-end group-hover:underline"
                                      >
                                          View Profile <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                      </button>
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan={6} className="px-5 py-8 text-center text-xs text-on-surface-muted">
                                  No learners found matching your filter.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
          <div className="px-5 py-3.5 border-t border-outline-variant bg-surface flex justify-between items-center text-xs text-on-surface-muted">
              <span>Showing {filteredLearners.length} learners</span>
              <button className="font-medium text-primary hover:underline" onClick={() => navigate('/assessor/learners')}>View Full Roster</button>
          </div>
      </div>
    </div>
  );
};

export default AssessorDashboard;
