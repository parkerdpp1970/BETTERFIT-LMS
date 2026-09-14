
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Search, Filter, Download, Users, Zap, Clock, 
    TrendingUp, Award, User, BookOpen, Activity, ChevronDown, 
    X, BarChart as BarChartIcon, CheckCircle, AlertCircle, Sun, Moon, Sunrise, Sunset
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

// --- MOCK DATA ---

const ACTIVE_LEARNERS_DATA = [
    { 
        id: '101', name: 'Gary Mountjoy', type: 'Apprentice', group: 'L2 Gym - Sept', 
        tutor: 'Sarah Connor', lastActive: '5 mins ago', lastAction: 'Completed Unit 4 Quiz', 
        engagementScore: 98, sessionsThisWeek: 12 
    },
    { 
        id: '102', name: 'Dale Smith', type: 'Full Time', group: 'L3 PT - Oct', 
        tutor: 'Davos Seaworth', lastActive: '12 mins ago', lastAction: 'Uploaded Video Submission', 
        engagementScore: 95, sessionsThisWeek: 10 
    },
    { 
        id: '103', name: 'James King', type: 'Blended', group: 'L2 Gym - Sept', 
        tutor: 'Sarah Connor', lastActive: '1 hour ago', lastAction: 'Viewed "Nutrition Basics"', 
        engagementScore: 89, sessionsThisWeek: 8 
    },
    { 
        id: '104', name: 'Abisha Akongo', type: 'Part Time', group: 'L3 PT - Sept', 
        tutor: 'Elena Fisher', lastActive: '3 hours ago', lastAction: 'Posted in Forum', 
        engagementScore: 85, sessionsThisWeek: 7 
    },
    { 
        id: '105', name: 'Liam Hunter', type: 'Cohort', group: 'L3 PT - Oct', 
        tutor: 'Marcus Aurelius', lastActive: '5 hours ago', lastAction: 'Submitted Workbook', 
        engagementScore: 78, sessionsThisWeek: 5 
    },
    { 
        id: '106', name: 'Emma Brooks', type: 'Apprentice', group: 'L2 Gym - Oct', 
        tutor: 'Davos Seaworth', lastActive: 'Yesterday', lastAction: 'Watched "Safety" Webinar', 
        engagementScore: 72, sessionsThisWeek: 4 
    },
    { 
        id: '107', name: 'James Rodriguez', type: 'Blended', group: 'L2 Gym - Sept', 
        tutor: 'Elena Fisher', lastActive: 'Yesterday', lastAction: 'Login', 
        engagementScore: 65, sessionsThisWeek: 3 
    },
    { 
        id: '108', name: 'Noah Chen', type: 'Full Time', group: 'L3 PT - Sept', 
        tutor: 'Marcus Aurelius', lastActive: '2 days ago', lastAction: 'Downloaded Resources', 
        engagementScore: 60, sessionsThisWeek: 2 
    },
];

const ACTIVITY_TREND_DATA = [
    { day: 'Mon', active: 45, submissions: 12 },
    { day: 'Tue', active: 52, submissions: 15 },
    { day: 'Wed', active: 49, submissions: 20 },
    { day: 'Thu', active: 63, submissions: 25 },
    { day: 'Fri', active: 58, submissions: 18 },
    { day: 'Sat', active: 35, submissions: 8 },
    { day: 'Sun', active: 30, submissions: 5 },
];

const SESSION_DURATION_TREND = [
    { month: 'Jan', minutes: 28 },
    { month: 'Feb', minutes: 30 },
    { month: 'Mar', minutes: 32 },
    { month: 'Apr', minutes: 35 },
    { month: 'May', minutes: 34 },
    { month: 'Jun', minutes: 38 },
    { month: 'Jul', minutes: 36 },
    { month: 'Aug', minutes: 40 },
    { month: 'Sep', minutes: 45 },
    { month: 'Oct', minutes: 42 },
    { month: 'Nov', minutes: 42 }, // Current
];

// Helper to generate 24h intensity data
const generateHourlyIntensity = (dayType: 'weekday' | 'weekend') => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
        let intensity = 0;
        // Logic: Low at night, peaks in evening for weekdays, different for weekends
        if (dayType === 'weekday') {
            if (i < 6) intensity = 0; // Night (0 activity)
            else if (i < 9) intensity = 20 + Math.random() * 20; // Morning commute/start
            else if (i < 17) intensity = 30 + Math.random() * 30; // Work day
            else if (i < 22) intensity = 70 + Math.random() * 30; // Evening Peak
            else intensity = 10 + Math.random() * 10; // Late night
        } else {
            if (i < 8) intensity = 0; // Sleep in (0 activity)
            else if (i < 14) intensity = 60 + Math.random() * 40; // Mid-day peak
            else if (i < 20) intensity = 40 + Math.random() * 30; // Evening chill
            else intensity = 0;
        }
        hours.push(Math.floor(intensity));
    }
    return hours;
};

// Heatmap Data (Day x 24 Hours)
const LEARNING_HEATMAP = [
    { day: 'Mon', hours: generateHourlyIntensity('weekday') },
    { day: 'Tue', hours: generateHourlyIntensity('weekday') },
    { day: 'Wed', hours: generateHourlyIntensity('weekday') },
    { day: 'Thu', hours: generateHourlyIntensity('weekday') },
    { day: 'Fri', hours: generateHourlyIntensity('weekday') },
    { day: 'Sat', hours: generateHourlyIntensity('weekend') },
    { day: 'Sun', hours: generateHourlyIntensity('weekend') },
];

// Updated Distribution for New Types
const LEARNER_TYPE_DISTRIBUTION = [
    { name: 'Full Time', value: 35, color: '#01b3ef' },
    { name: 'Part Time', value: 20, color: '#6366f1' },
    { name: 'Blended', value: 25, color: '#A85A00' },
    { name: 'Apprentice', value: 15, color: '#e14177' },
    { name: 'Cohort', value: 5, color: '#10b981' },
];

const ActiveLearnersReport: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  // Drill Down State
  const [showTypeDrillDown, setShowTypeDrillDown] = useState(false);
  const [showSessionDrillDown, setShowSessionDrillDown] = useState(false);

  // Filter Logic
  const filteredLearners = ACTIVE_LEARNERS_DATA.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            l.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            l.group.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || l.type === filterType;
      return matchesSearch && matchesType;
  });

  const getBadgeColor = (type: string) => {
      switch(type) {
          case 'Full Time': return 'bg-cyan-100 text-cyan-800';
          case 'Part Time': return 'bg-indigo-100 text-indigo-800';
          case 'Blended': return 'bg-amber-100 text-amber-800';
          case 'Apprentice': return 'bg-pink-100 text-pink-800';
          case 'Cohort': return 'bg-emerald-100 text-emerald-800';
          default: return 'bg-slate-100 text-slate-800';
      }
  };

  // Heatmap Color Helper - 5 STEPS + NO ACTIVITY
  const getHeatmapColor = (value: number) => {
      if (value === 0) return 'bg-slate-100'; // No Activity
      if (value >= 90) return 'bg-[#01427a]'; // Level 5 (Darkest)
      if (value >= 70) return 'bg-[#005a9e]'; // Level 4
      if (value >= 50) return 'bg-[#01b3ef]'; // Level 3
      if (value >= 30) return 'bg-[#6dcffb]'; // Level 2
      return 'bg-[#bae6fd]';                  // Level 1 (Lightest)
  };

  // Tooltip Helper
  const getHourLabel = (hourIndex: number) => {
      const h = hourIndex;
      const suffix = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      return `${displayH}${suffix}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <button 
                  onClick={() => navigate('/reports')}
                  className="flex items-center text-[#6c6c6c] hover:text-[#01427a] font-bold mb-2 transition-colors text-sm"
              >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Analytics Center
              </button>
              <h1 className="text-3xl font-extrabold text-[#0c0c0d] flex items-center">
                  <Activity className="w-8 h-8 mr-3 text-[#01b3ef]" />
                  Active Learner Intelligence
              </h1>
              <p className="text-[#6c6c6c] mt-1 ml-11 max-w-2xl">
                  Detailed breakdown of student engagement, recent activity, and performance metrics across the academy.
              </p>
          </div>
          
          <div className="flex gap-2">
              <button className="flex items-center px-4 py-2 bg-white border border-[#afafaf] rounded-lg text-[#6c6c6c] font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                  <Download className="w-4 h-4 mr-2" /> Export Report
              </button>
          </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm">
              <p className="text-xs font-bold text-[#6c6c6c] uppercase tracking-wider mb-2">Total Active (30d)</p>
              <div className="flex items-baseline">
                  <span className="text-3xl font-extrabold text-[#01427a]">120</span>
                  <span className="text-sm text-[#afafaf] ml-2">/ 135 Enrolled</span>
              </div>
              <div className="mt-3 flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
                  <TrendingUp className="w-3 h-3 mr-1" /> 89% Engagement Rate
              </div>
          </div>

          {/* CLICKABLE Top Learner Type Card */}
          <div 
            onClick={() => setShowTypeDrillDown(true)}
            className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm cursor-pointer hover:border-[#01b3ef] hover:shadow-md transition-all group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-[#01b3ef]/10 text-[#01b3ef] p-1 rounded-full">
                      <ChevronDown className="w-4 h-4" />
                  </div>
              </div>
              <p className="text-xs font-bold text-[#6c6c6c] uppercase tracking-wider mb-2 group-hover:text-[#01b3ef] transition-colors">Top Learner Type</p>
              <div className="flex items-baseline">
                  <span className="text-2xl font-extrabold text-[#01b3ef]">Full Time</span>
              </div>
              <p className="text-xs text-[#6c6c6c] mt-1">Highest daily login frequency</p>
              <div className="mt-3 text-[10px] text-[#afafaf] italic">Click for details</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm">
              <p className="text-xs font-bold text-[#6c6c6c] uppercase tracking-wider mb-2">Submissions (Week)</p>
              <div className="flex items-baseline">
                  <span className="text-3xl font-extrabold text-[#e14177]">103</span>
                  <span className="text-sm text-[#afafaf] ml-2">Assignments</span>
              </div>
              <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#e14177] h-full w-[75%]"></div>
              </div>
          </div>

          {/* CLICKABLE Average Session Time Card */}
          <div 
            onClick={() => setShowSessionDrillDown(true)}
            className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm cursor-pointer hover:border-[#01b3ef] hover:shadow-md transition-all group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-[#01b3ef]/10 text-[#01b3ef] p-1 rounded-full">
                      <ChevronDown className="w-4 h-4" />
                  </div>
              </div>
              <p className="text-xs font-bold text-[#6c6c6c] uppercase tracking-wider mb-2 group-hover:text-[#01b3ef] transition-colors">Avg. Session Time</p>
              <div className="flex items-baseline">
                  <span className="text-3xl font-extrabold text-[#0c0c0d]">42m</span>
                  <span className="text-sm text-[#afafaf] ml-2">per login</span>
              </div>
              <div className="mt-3 flex items-center text-xs font-bold text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" /> +5m vs last month
              </div>
          </div>
      </div>

      {/* Graphical Representations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Activity Trend Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm">
              <h3 className="text-lg font-bold text-[#0c0c0d] mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-[#01427a]" /> Daily Activity Trend (Last 7 Days)
              </h3>
              <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ACTIVITY_TREND_DATA}>
                          <defs>
                              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#01b3ef" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#01b3ef" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6c6c6c', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6c6c6c', fontSize: 12}} />
                          <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area type="monotone" dataKey="active" stroke="#01b3ef" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" name="Active Users" />
                          <Area type="monotone" dataKey="submissions" stroke="#e14177" strokeWidth={3} fill="none" name="Submissions" />
                          <Legend verticalAlign="top" height={36} iconType="circle" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Learner Type Distribution */}
          <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-[#0c0c0d] mb-2">Engagement by Type</h3>
              <p className="text-xs text-[#6c6c6c] mb-6">Which learner types are most active?</p>
              
              <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={LEARNER_TYPE_DISTRIBUTION}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                          >
                              {LEARNER_TYPE_DISTRIBUTION.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '10px'}} />
                      </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                      <div className="text-center">
                          <span className="block text-xl font-extrabold text-[#0c0c0d]">100%</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Top Performers / Most Active */}
      <div className="bg-gradient-to-r from-[#01427a] to-[#003366] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
              <h3 className="text-lg font-bold mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" /> Most Active Students (This Week)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {ACTIVE_LEARNERS_DATA.slice(0, 3).map((learner, index) => (
                      <div key={learner.id} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 flex items-center">
                          <div className="mr-4 relative">
                              <div className="w-12 h-12 rounded-full bg-white text-[#01427a] flex items-center justify-center font-bold text-lg">
                                  {learner.name.charAt(0)}
                              </div>
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-black border-2 border-[#01427a]">
                                  #{index + 1}
                              </div>
                          </div>
                          <div>
                              <h4 className="font-bold text-white text-sm">{learner.name}</h4>
                              <p className="text-xs text-white/70">{learner.sessionsThisWeek} Sessions • Score: {learner.engagementScore}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          {/* Decoration */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12"></div>
      </div>

      {/* Detailed Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#afafaf]/50 overflow-hidden">
          
          {/* Table Toolbar */}
          <div className="p-6 border-b border-[#afafaf]/20 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="text-lg font-bold text-[#0c0c0d]">Detailed Activity Log</h3>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  {/* Filter Type */}
                  <div className="relative min-w-[160px]">
                      <select 
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="w-full pl-3 pr-8 py-2 border border-[#afafaf] rounded-lg text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-white appearance-none cursor-pointer"
                      >
                          <option value="All">All Learner Types</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Blended">Blended</option>
                          <option value="Apprentice">Apprentice</option>
                          <option value="Cohort">Cohort</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                  </div>

                  {/* Search */}
                  <div className="relative flex-1 md:w-64">
                      <input 
                          type="text" 
                          placeholder="Search learner, tutor or group..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-[#afafaf] rounded-lg text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef]"
                      />
                      <Search className="w-4 h-4 text-[#afafaf] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#afafaf]/20">
                  <thead className="bg-white">
                      <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Learner Name</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Type / Group</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Tutor</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-[#01427a]">Last Active</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Last Action</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Engagement</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#afafaf]/20">
                      {filteredLearners.length > 0 ? (
                          filteredLearners.map((learner) => (
                              <tr key={learner.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => navigate(`/learner/${learner.id}`)}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                          <div className="h-8 w-8 rounded-full bg-[#01b3ef]/10 text-[#01b3ef] flex items-center justify-center font-bold text-xs mr-3">
                                              {learner.name.charAt(0)}
                                          </div>
                                          <div>
                                              <div className="text-sm font-bold text-[#0c0c0d] group-hover:text-[#01b3ef] transition-colors">{learner.name}</div>
                                              <div className="text-[10px] text-[#afafaf]">#{learner.id}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex flex-col">
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-1 ${getBadgeColor(learner.type)}`}>
                                              {learner.type}
                                          </span>
                                          <span className="text-xs text-[#6c6c6c]">{learner.group}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center text-sm text-[#0c0c0d]">
                                          <User className="w-3 h-3 mr-1 text-[#afafaf]" />
                                          {learner.tutor}
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center text-xs font-bold text-[#01427a]">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {learner.lastActive}
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center text-xs text-[#6c6c6c]">
                                          <BookOpen className="w-3 h-3 mr-1 text-[#afafaf]" />
                                          {learner.lastAction}
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                                      <div className="inline-block w-16">
                                          <div className={`text-xs font-bold mb-1 ${
                                              learner.engagementScore >= 90 ? 'text-green-600' :
                                              learner.engagementScore >= 70 ? 'text-[#01b3ef]' : 'text-orange-500'
                                          }`}>
                                              {learner.engagementScore}%
                                          </div>
                                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                              <div 
                                                  className={`h-full rounded-full ${
                                                      learner.engagementScore >= 90 ? 'bg-green-500' :
                                                      learner.engagementScore >= 70 ? 'bg-[#01b3ef]' : 'bg-orange-500'
                                                  }`} 
                                                  style={{ width: `${learner.engagementScore}%` }}
                                              ></div>
                                          </div>
                                      </div>
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-[#6c6c6c]">
                                  <div className="flex flex-col items-center justify-center opacity-50">
                                      <Zap className="w-10 h-10 mb-2" />
                                      <p>No active learners found matching your filters.</p>
                                  </div>
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
          <div className="px-6 py-4 border-t border-[#afafaf]/20 bg-slate-50 flex justify-between items-center text-xs text-[#6c6c6c]">
              <span>Showing {filteredLearners.length} active learners</span>
              <div className="flex gap-2">
                  <button className="px-3 py-1 bg-white border border-[#afafaf] rounded hover:bg-slate-100">Previous</button>
                  <button className="px-3 py-1 bg-white border border-[#afafaf] rounded hover:bg-slate-100">Next</button>
              </div>
          </div>
      </div>

      {/* --- DRILL DOWN MODAL: LEARNER TYPE --- */}
      {showTypeDrillDown && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                  {/* Modal Header */}
                  <div className="bg-[#01427a] px-8 py-6 text-white flex justify-between items-start shrink-0">
                      <div>
                          <h2 className="text-2xl font-extrabold flex items-center">
                              <BarChartIcon className="w-6 h-6 mr-3 text-[#6dcffb]" />
                              Full Time Learner Analysis
                          </h2>
                          <p className="text-blue-100 mt-1 text-sm">Deep dive into performance metrics for your most active learner segment.</p>
                      </div>
                      <button onClick={() => setShowTypeDrillDown(false)} className="text-white/70 hover:text-white transition-colors">
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50">
                      
                      {/* Top Metrics Row */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#afafaf]/30">
                              <p className="text-xs font-bold text-[#6c6c6c] uppercase">Avg. Attendance</p>
                              <p className="text-2xl font-extrabold text-[#0c0c0d] mt-1">94%</p>
                              <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">+2% vs Academy</span>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#afafaf]/30">
                              <p className="text-xs font-bold text-[#6c6c6c] uppercase">Submission Rate</p>
                              <p className="text-2xl font-extrabold text-[#01b3ef] mt-1">98%</p>
                              <span className="text-[10px] text-[#6c6c6c]">On time submissions</span>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#afafaf]/30">
                              <p className="text-xs font-bold text-[#6c6c6c] uppercase">Pass Rate (1st Try)</p>
                              <p className="text-2xl font-extrabold text-[#0c0c0d] mt-1">87%</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#afafaf]/30">
                              <p className="text-xs font-bold text-[#6c6c6c] uppercase">At Risk</p>
                              <p className="text-2xl font-extrabold text-[#e14177] mt-1">3</p>
                              <span className="text-[10px] text-[#e14177] font-bold">Students Flagged</span>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          
                          {/* Left: Performance Chart */}
                          <div className="bg-white p-6 rounded-xl border border-[#afafaf]/30 shadow-sm">
                              <h3 className="font-bold text-[#0c0c0d] mb-4">Engagement vs Academy Average</h3>
                              <div className="h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={[
                                          { name: 'Week 1', fullTime: 85, academy: 70 },
                                          { name: 'Week 2', fullTime: 88, academy: 72 },
                                          { name: 'Week 3', fullTime: 92, academy: 75 },
                                          { name: 'Week 4', fullTime: 90, academy: 74 },
                                      ]}>
                                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                          <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                                          <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                          <Tooltip />
                                          <Legend />
                                          <Bar dataKey="fullTime" name="Full Time" fill="#01b3ef" radius={[4, 4, 0, 0]} />
                                          <Bar dataKey="academy" name="Academy Avg" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                                      </BarChart>
                                  </ResponsiveContainer>
                              </div>
                          </div>

                          {/* Right: Key Insights & Actions */}
                          <div className="space-y-4">
                              <div className="bg-white p-6 rounded-xl border border-[#afafaf]/30 shadow-sm">
                                  <h3 className="font-bold text-[#0c0c0d] mb-3">Key Insights</h3>
                                  <ul className="space-y-3">
                                      <li className="flex items-start text-sm text-[#6c6c6c]">
                                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                                          Full Time learners engage 30% more with video content than other groups.
                                      </li>
                                      <li className="flex items-start text-sm text-[#6c6c6c]">
                                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                                          Highest completion rate for "L3 Nutrition" module.
                                      </li>
                                      <li className="flex items-start text-sm text-[#6c6c6c]">
                                          <AlertCircle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 shrink-0" />
                                          Drop-off observed after "Week 6" - consider scheduling a check-in webinar.
                                      </li>
                                  </ul>
                              </div>

                              <div className="bg-[#01427a]/5 border border-[#01427a]/20 p-6 rounded-xl">
                                  <h3 className="font-bold text-[#01427a] mb-2">Recommended Actions</h3>
                                  <button className="w-full bg-[#01427a] text-white py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-[#003366] transition-colors mb-2">
                                      Schedule Cohort Webinar
                                  </button>
                                  <button className="w-full bg-white text-[#01427a] border border-[#01427a] py-2 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors">
                                      Download Full Report CSV
                                  </button>
                              </div>
                          </div>
                      </div>

                  </div>
              </div>
          </div>
      )}

      {/* --- DRILL DOWN MODAL: SESSION TIME & HABITS (NEW) --- */}
      {showSessionDrillDown && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[95vh]">
                  {/* Header */}
                  <div className="bg-[#0c0c0d] px-8 py-6 text-white flex justify-between items-start shrink-0">
                      <div>
                          <h2 className="text-2xl font-extrabold flex items-center">
                              <Clock className="w-6 h-6 mr-3 text-[#6dcffb]" />
                              Session Duration & Learning Habits
                          </h2>
                          <p className="text-slate-400 mt-1 text-sm">Analyze how and when your learners are engaging with the platform.</p>
                      </div>
                      <button onClick={() => setShowSessionDrillDown(false)} className="text-white/70 hover:text-white transition-colors">
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50">
                      
                      {/* Section 1: Monthly Trend */}
                      <div className="bg-white p-6 rounded-xl border border-[#afafaf]/30 shadow-sm mb-8">
                          <div className="flex justify-between items-center mb-6">
                              <div>
                                  <h3 className="text-lg font-bold text-[#0c0c0d]">Average Session Duration (Year to Date)</h3>
                                  <p className="text-sm text-[#6c6c6c]">Tracking average time spent per login session over 2023.</p>
                              </div>
                              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full font-bold text-sm border border-green-200">
                                  <TrendingUp className="w-4 h-4 mr-2" /> +35% Increase YTD
                              </div>
                          </div>
                          
                          <div className="h-64 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={SESSION_DURATION_TREND} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                      <defs>
                                          <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#01b3ef" stopOpacity={0.2}/>
                                              <stop offset="95%" stopColor="#01b3ef" stopOpacity={0}/>
                                          </linearGradient>
                                      </defs>
                                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6c6c6c', fontSize: 12}} dy={10} />
                                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6c6c6c', fontSize: 12}} domain={[0, 60]} />
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                      <Tooltip 
                                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                          formatter={(value) => [`${value} min`, 'Avg Session']}
                                      />
                                      <Area type="monotone" dataKey="minutes" stroke="#01b3ef" strokeWidth={3} fillOpacity={1} fill="url(#colorMinutes)" />
                                  </AreaChart>
                              </ResponsiveContainer>
                          </div>
                      </div>

                      {/* Section 2: Heatmap Grid (Hourly 24h) */}
                      <div className="bg-white p-6 rounded-xl border border-[#afafaf]/30 shadow-sm overflow-hidden">
                          <div className="flex justify-between items-start mb-6">
                              <div>
                                  <h3 className="text-lg font-bold text-[#0c0c0d]">24-Hour Learning Intensity Heatmap</h3>
                                  <p className="text-sm text-[#6c6c6c]">When are students most active? Darker colors indicate higher activity levels.</p>
                              </div>
                              
                              {/* Legend */}
                              <div className="flex items-center gap-2 text-xs text-[#6c6c6c]">
                                  <span>No Activity</span>
                                  <div className="flex gap-1">
                                      <div className="w-4 h-4 bg-slate-100 rounded border border-slate-200"></div> {/* Level 0 */}
                                      <div className="w-4 h-4 bg-[#bae6fd] rounded"></div> {/* Level 1 */}
                                      <div className="w-4 h-4 bg-[#6dcffb] rounded"></div> {/* Level 2 */}
                                      <div className="w-4 h-4 bg-[#01b3ef] rounded"></div> {/* Level 3 */}
                                      <div className="w-4 h-4 bg-[#005a9e] rounded"></div> {/* Level 4 */}
                                      <div className="w-4 h-4 bg-[#01427a] rounded"></div> {/* Level 5 */}
                                  </div>
                                  <span>High Activity</span>
                              </div>
                          </div>

                          {/* The Heatmap Grid */}
                          <div className="overflow-x-auto pb-2">
                              <div className="min-w-[800px]">
                                  {/* Super Header - Categories */}
                                  <div className="grid grid-cols-[50px_repeat(24,1fr)] gap-1 mb-1">
                                      <div className="text-xs font-bold text-[#6c6c6c]"></div> {/* Spacer */}
                                      {/* Night: 0-6 (6 cols) */}
                                      <div className="col-span-6 flex justify-center pb-2 border-b border-[#afafaf]/20">
                                          <div className="flex items-center text-xs font-bold text-[#01427a] uppercase">
                                              <Moon className="w-3 h-3 mr-1 text-[#6c6c6c]" /> Night
                                          </div>
                                      </div>
                                      {/* Morning: 6-12 (6 cols) */}
                                      <div className="col-span-6 flex justify-center pb-2 border-b border-[#afafaf]/20">
                                          <div className="flex items-center text-xs font-bold text-[#01427a] uppercase">
                                              <Sunrise className="w-3 h-3 mr-1 text-[#6c6c6c]" /> Morning
                                          </div>
                                      </div>
                                      {/* Afternoon: 12-18 (6 cols) */}
                                      <div className="col-span-6 flex justify-center pb-2 border-b border-[#afafaf]/20">
                                          <div className="flex items-center text-xs font-bold text-[#01427a] uppercase">
                                              <Sun className="w-3 h-3 mr-1 text-[#6c6c6c]" /> Afternoon
                                          </div>
                                      </div>
                                      {/* Evening: 18-24 (6 cols) */}
                                      <div className="col-span-6 flex justify-center pb-2 border-b border-[#afafaf]/20">
                                          <div className="flex items-center text-xs font-bold text-[#01427a] uppercase">
                                              <Sunset className="w-3 h-3 mr-1 text-[#6c6c6c]" /> Evening
                                          </div>
                                      </div>
                                  </div>

                                  {/* Hour Headers */}
                                  <div className="grid grid-cols-[50px_repeat(24,1fr)] gap-1 mb-2">
                                      <div className="text-xs font-bold text-[#6c6c6c]"></div> 
                                      {Array.from({ length: 24 }).map((_, i) => (
                                          <div key={i} className="text-[10px] text-center text-[#afafaf] font-mono">
                                              {i.toString().padStart(2, '0')}
                                          </div>
                                      ))}
                                  </div>

                                  {/* Rows */}
                                  <div className="space-y-1.5">
                                      {LEARNING_HEATMAP.map((row) => (
                                          <div key={row.day} className="grid grid-cols-[50px_repeat(24,1fr)] gap-1 items-center">
                                              <div className="text-xs font-bold text-[#0c0c0d]">{row.day}</div>
                                              {row.hours.map((intensity, hourIdx) => (
                                                  <div 
                                                      key={hourIdx} 
                                                      className={`h-8 rounded-sm transition-all hover:scale-110 hover:z-10 cursor-pointer ${getHeatmapColor(intensity)}`} 
                                                      title={`${row.day} @ ${getHourLabel(hourIdx)}: ${intensity}% Activity`}
                                                  ></div>
                                              ))}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>

                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default ActiveLearnersReport;
