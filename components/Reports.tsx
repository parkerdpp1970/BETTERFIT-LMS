
import React, { useState, useMemo, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
    Download, Filter, Users, User, Layers, ChevronDown, FileText, 
    TrendingUp, TrendingDown, Clock, AlertCircle, CheckCircle, MoreHorizontal, Search, ArrowLeft,
    PieChart as PieChartIcon, BarChart as BarChartIcon, Calendar as CalendarIcon, Package, X, AlertTriangle, FileCheck, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_LEARNERS, LEARNER_GROUPS } from '../constants';
import Button from './ui/Button';

// Mock Data for Assessor Reports View
const ASSESSOR_MY_REPORTS = [
    {
        id: 'RPT-2023-001',
        date: '2023-11-20', // Newest
        learnerName: 'Waqar Khan',
        unit: 'Unit 4: Delivering Personal Training',
        type: 'Summative IQA',
        status: 'Action Required', // Triggers Orange
        read: false,
        feedbackSnippet: 'Video evidence requires clearer audio for the introduction segment.'
    },
    {
        id: 'RPT-2023-002',
        date: '2023-11-15',
        learnerName: 'Sam Deeley',
        unit: 'Unit 1: Anatomy & Physiology',
        type: 'Interim IQA',
        status: 'Pass',
        read: true,
        feedbackSnippet: 'Excellent feedback provided to the learner. Good use of VACS.'
    },
    {
        id: 'RPT-2023-003',
        date: '2023-11-10',
        learnerName: 'Lois Morris',
        unit: 'Unit 2: Nutrition',
        type: 'Summative IQA',
        status: 'Pass',
        read: true,
        feedbackSnippet: 'Submission decision is valid and reliable.'
    },
    {
        id: 'RPT-2023-004',
        date: '2023-10-28',
        learnerName: 'Adam Kiani',
        unit: 'Unit 1: Anatomy & Physiology',
        type: 'Formative IQA',
        status: 'Pass',
        read: true,
        feedbackSnippet: 'Good tracking of progress.'
    }
];

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [reportScope, setReportScope] = useState<'all' | 'group' | 'individual'>('all');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>('');
  
  // Role Check
  const [role, setRole] = useState<string>('');
  useEffect(() => {
      const storedRole = localStorage.getItem('betterfit_role');
      if (storedRole) setRole(storedRole);
  }, []);

  const isAssessor = role === 'assessor';

  // Drill-down state
  const [showEnrollmentDetails, setShowEnrollmentDetails] = useState(false);

  // --- ENROLLMENT DEMOGRAPHICS FILTER STATE ---
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterCategory, setFilterCategory] = useState<'All' | 'Package' | 'Qualification'>('All');
  const [selectedFilterId, setSelectedFilterId] = useState<string>('');

  // --- MOCK DATA DEFINITIONS ---
  const PACKAGES = [
      { id: 'pkg1', name: 'Master PT Package', items: ['L2 Gym', 'L3 PT', 'Business Skills'] },
      { id: 'pkg2', name: 'Fast Track Diploma', items: ['L2 Gym', 'L3 PT'] },
      { id: 'pkg3', name: 'Nutrition Specialist', items: ['L3 Nutrition', 'L4 Obesity'] },
  ];

  const QUALIFICATIONS = [
      { id: 'q1', name: 'L2 Gym Instructor' },
      { id: 'q2', name: 'L3 Personal Trainer' },
      { id: 'q3', name: 'L4 Obesity & Diabetes' },
      { id: 'q4', name: 'L3 Sports Massage' },
  ];

  // --- MOCK DATA FOR DASHBOARD CHARTS ---
  const enrollmentData = [
      { name: 'Jan', value: 45 }, { name: 'Feb', value: 52 }, { name: 'Mar', value: 48 },
      { name: 'Apr', value: 61 }, { name: 'May', value: 55 }, { name: 'Jun', value: 67 },
      { name: 'Jul', value: 71 }, { name: 'Aug', value: 85 }, { name: 'Sep', value: 122 },
      { name: 'Oct', value: 135 }, { name: 'Nov', value: 130 }, { name: 'Dec', value: 138 },
  ];

  const activityData = [
      { day: 1, users: 20 }, { day: 5, users: 45 }, { day: 10, users: 30 }, 
      { day: 15, users: 65 }, { day: 20, users: 48 }, { day: 25, users: 90 }, { day: 30, users: 85 }
  ];

  const PIE_DATA = [
      { name: 'Passed', value: 450, color: '#059669' },
      { name: 'Pending', value: 62, color: '#A85A00' },
      { name: 'Referred', value: 24, color: '#B91C1C' },
      { name: 'Waiting', value: 18, color: '#1D4ED8' },
  ];

  // --- DYNAMIC DATA GENERATOR FOR DRILL DOWN ---
  const getFilteredDemographics = () => {
      let baseTotal = 100;
      let qualData = [];
      let genderData = [];
      let demoData = [];
      let ageData = [];

      if (filterCategory === 'All') {
          baseTotal = 1250; // Total students
          qualData = [
              { name: 'L2 Gym Instructor', value: 35, color: '#10B981' },
              { name: 'L3 Personal Trainer', value: 40, color: '#06B6D4' },
              { name: 'L4 Obesity/Diabetes', value: 15, color: '#7C3AED' },
              { name: 'CPD Courses', value: 10, color: '#F59E0B' }
          ];
          genderData = [
              { name: 'Male', value: 60, color: '#1A1A2E' },
              { name: 'Female', value: 40, color: '#06B6D4' }
          ];
          ageData = [
            { name: '16-18', value: 150 }, 
            { name: '19-24', value: 520 }, 
            { name: '25-34', value: 300 }, 
            { name: '35-44', value: 180 },
            { name: '45-54', value: 70 },
            { name: '55+', value: 30 }
          ];
          demoData = [
            { name: 'White / British', value: 550 }, { name: 'Asian / Asian British', value: 300 },
            { name: 'Black / Black British', value: 200 }, { name: 'Mixed / Multiple', value: 150 },
            { name: 'Other Group', value: 80 }
          ];
      } else if (filterCategory === 'Package') {
          const pkg = PACKAGES.find(p => p.id === selectedFilterId) || PACKAGES[0];
          baseTotal = 320;
          qualData = pkg.items.map((item, idx) => ({
              name: item,
              value: Math.floor(100 / pkg.items.length),
              color: ['#10B981', '#06B6D4', '#7C3AED'][idx % 3]
          }));
          genderData = [
              { name: 'Male', value: 70, color: '#1A1A2E' },
              { name: 'Female', value: 30, color: '#06B6D4' }
          ];
          ageData = [
            { name: '16-18', value: 40 }, 
            { name: '19-24', value: 120 }, 
            { name: '25-34', value: 80 }, 
            { name: '35-44', value: 50 },
            { name: '45-54', value: 20 },
            { name: '55+', value: 10 }
          ];
          demoData = [
            { name: 'White / British', value: 150 }, { name: 'Asian / Asian British', value: 80 },
            { name: 'Black / Black British', value: 50 }, { name: 'Mixed / Multiple', value: 30 },
            { name: 'Other Group', value: 10 }
          ];
      } else {
          baseTotal = 150;
          qualData = [
              { name: 'Selected Qual', value: 100, color: '#D70029' }
          ];
          genderData = [
              { name: 'Male', value: 45, color: '#1A1A2E' },
              { name: 'Female', value: 55, color: '#06B6D4' }
          ];
          ageData = [
            { name: '16-18', value: 10 }, 
            { name: '19-24', value: 40 }, 
            { name: '25-34', value: 60 }, 
            { name: '35-44', value: 20 },
            { name: '45-54', value: 15 },
            { name: '55+', value: 5 }
          ];
          demoData = [
            { name: 'White / British', value: 60 }, { name: 'Asian / Asian British', value: 40 },
            { name: 'Black / Black British', value: 30 }, { name: 'Mixed / Multiple', value: 10 },
            { name: 'Other Group', value: 10 }
          ];
      }

      return { baseTotal, qualData, genderData, ageData, demoData };
  };

  const { baseTotal, qualData, genderData, ageData, demoData } = getFilteredDemographics();

  // Filter Logic for Main Dashboard
  const filteredLearners = useMemo(() => {
    if (reportScope === 'all') return MOCK_LEARNERS;
    
    if (reportScope === 'group' && selectedGroupId) {
        const group = LEARNER_GROUPS.find(g => g.id === selectedGroupId);
        if (!group) return MOCK_LEARNERS;
        if (group.name.includes('PT')) return MOCK_LEARNERS.filter(l => l.mainCourse.includes('PT'));
        if (group.name.includes('Gym')) return MOCK_LEARNERS.filter(l => l.mainCourse.includes('Gym'));
        return MOCK_LEARNERS; 
    }

    if (reportScope === 'individual' && selectedLearnerId) {
        return MOCK_LEARNERS.filter(l => l.id === selectedLearnerId);
    }

    return MOCK_LEARNERS;
  }, [reportScope, selectedGroupId, selectedLearnerId]);

  const selectedLearner = reportScope === 'individual' ? filteredLearners[0] : null;

  // ----------------------------------------------------------------------------------
  // VIEW 1: ASSESSOR "MY REPORTS" VIEW (Replaces Admin Analytics for Assessor Role)
  // ----------------------------------------------------------------------------------
  if (isAssessor) {
      return (
          <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                  <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-on-surface flex items-center gap-3">
                          <FileCheck className="w-8 h-8 text-secondary" />
                          My IQA Reports
                      </h1>
                      <p className="text-sm text-gray-500 mt-1 font-normal">Feedback and sampling reports received from the Moderation Team.</p>
                  </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                      {ASSESSOR_MY_REPORTS.map((report) => (
                          <div 
                              key={report.id} 
                              className={`p-5 transition-all hover:bg-emerald-50/40 cursor-pointer group ${
                                  !report.read ? 'bg-amber-50/60 border-l-4 border-l-warning' : 'border-l-4 border-l-transparent'
                              }`}
                          >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  
                                  {/* Left: Icon & Title */}
                                  <div className="flex items-start gap-4 flex-1">
                                      <div className={`p-3 rounded-lg shrink-0 ${!report.read ? 'bg-amber-100 text-warning' : 'bg-gray-100 text-gray-500'}`}>
                                          {!report.read ? <AlertTriangle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                      </div>
                                      <div>
                                          <div className="flex items-center gap-2 mb-1">
                                              {!report.read && (
                                                  <span className="badge-warning text-[10px] uppercase tracking-wider font-semibold">
                                                      Action Required
                                                  </span>
                                              )}
                                              <span className="text-xs text-gray-500 font-medium">{report.date}</span>
                                          </div>
                                          
                                          <h3 className={`text-base font-semibold ${!report.read ? 'text-[#B45309]' : 'text-on-surface'}`}>
                                              {!report.read ? 'Action Required: IQA Feedback Returned' : `IQA Report: ${report.type}`}
                                          </h3>
                                          
                                          <p className="text-sm text-gray-600 mt-1 font-normal">
                                              <span className="font-semibold text-on-surface">{report.learnerName}</span> • {report.unit}
                                          </p>
                                          
                                          <p className="text-sm text-gray-500 mt-1.5 italic line-clamp-1 max-w-xl">
                                              "{report.feedbackSnippet}"
                                          </p>
                                      </div>
                                  </div>

                                  {/* Right: Status & Action */}
                                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 md:w-48 shrink-0">
                                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                          report.status === 'Pass' ? 'bg-emerald-50 text-[#059669] border-emerald-200' : 'bg-rose-50 text-error border-rose-200'
                                      }`}>
                                          {report.status}
                                      </span>
                                      
                                      <button className="text-sm font-medium text-secondary hover:text-primary flex items-center transition-colors">
                                          View Full Report <ChevronRight className="w-4 h-4 ml-1" />
                                      </button>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // ----------------------------------------------------------------------------------
  // VIEW 2: DETAILED ENROLLMENT ANALYTICS (Drill-Down for Admin)
  // ----------------------------------------------------------------------------------
  if (showEnrollmentDetails) {
      return (
          <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                      <button 
                          onClick={() => setShowEnrollmentDetails(false)}
                          className="flex items-center text-gray-500 hover:text-primary text-sm font-medium mb-2 transition-colors"
                      >
                          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Overview
                      </button>
                      <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Enrollment Demographics</h1>
                      <p className="text-sm text-gray-500 font-normal">Drill down by qualification, package, or date range.</p>
                  </div>
                  <div className="flex gap-2">
                        <Button icon={Download} arrow={false}>Export Report</Button>
                  </div>
              </div>

              {/* FILTER BAR */}
              <div className="bf-card p-4 flex flex-col lg:flex-row gap-4 items-end lg:items-center justify-between">
                  
                  {/* Left Side: Category & Selection */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                      <div className="w-full sm:w-48">
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5">View By</label>
                          <div className="relative">
                              <select 
                                  value={filterCategory}
                                  onChange={(e) => {
                                      setFilterCategory(e.target.value as any);
                                      setSelectedFilterId(''); // Reset sub-selection
                                  }}
                                  className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-shape-md text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50 appearance-none cursor-pointer"
                              >
                                  <option value="All">All Data</option>
                                  <option value="Package">Package</option>
                                  <option value="Qualification">Qualification</option>
                              </select>
                              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                      </div>

                      {/* Dynamic Second Dropdown */}
                      {filterCategory !== 'All' && (
                          <div className="w-full sm:w-64 animate-in fade-in">
                              <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5">
                                  Select {filterCategory}
                              </label>
                              <div className="relative">
                                  <select 
                                      value={selectedFilterId}
                                      onChange={(e) => setSelectedFilterId(e.target.value)}
                                      className="w-full pl-9 pr-8 py-2.5 border border-primary ring-1 ring-primary/20 rounded-shape-md text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white appearance-none cursor-pointer"
                                  >
                                      <option value="">-- Select --</option>
                                      {filterCategory === 'Package' 
                                          ? PACKAGES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                                          : QUALIFICATIONS.map(q => <option key={q.id} value={q.id}>{q.name}</option>)
                                      }
                                  </select>
                                  {filterCategory === 'Package' 
                                      ? <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                      : <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                  }
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Right Side: Date Range */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                      <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5">Date Range</label>
                          <div className="flex items-center gap-2">
                              <div className="relative">
                                  <input 
                                      type="date" 
                                      value={dateRange.start}
                                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                      className="pl-8 pr-2 py-2 border border-gray-200 rounded-shape-md text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-36"
                                  />
                                  <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                              </div>
                              <span className="text-gray-400">-</span>
                              <div className="relative">
                                  <input 
                                      type="date" 
                                      value={dateRange.end}
                                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                      className="pl-8 pr-2 py-2 border border-gray-200 rounded-shape-md text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-36"
                                  />
                                  <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* 4-Quadrant Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* 1. Enrollment by Qualification */}
                  <div className="bf-card p-6 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                          <div>
                              <h3 className="text-lg font-semibold text-on-surface">Enrollment by Qualification</h3>
                              <p className="text-xs text-gray-500">
                                  {filterCategory === 'Package' ? 'Course Breakdown in Package' : 'Distribution across courses'}
                              </p>
                          </div>
                          <PieChartIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie
                                      data={qualData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={100}
                                      paddingAngle={2}
                                      dataKey="value"
                                  >
                                      {qualData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                              </PieChart>
                          </ResponsiveContainer>
                          {/* Center Text */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                              <div className="text-center">
                                  <span className="block text-3xl font-bold text-on-surface">{baseTotal}</span>
                                  <span className="text-xs text-gray-500 uppercase font-medium">Learners</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* 2. Enrollment by Gender */}
                  <div className="bf-card p-6 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                          <div>
                              <h3 className="text-lg font-semibold text-on-surface">Enrollment by Gender</h3>
                              <p className="text-xs text-gray-500">Gender balance for selected {filterCategory === 'All' ? 'academy' : 'view'}</p>
                          </div>
                          <PieChartIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-h-[300px] flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie
                                      data={genderData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={0}
                                      outerRadius={100}
                                      dataKey="value"
                                      labelLine={false}
                                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  >
                                      {genderData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                  </Pie>
                                  <Tooltip />
                              </PieChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* 3. Enrollment by Demographics */}
                  <div className="bf-card p-6 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                          <div>
                              <h3 className="text-lg font-semibold text-on-surface">Enrollment by Demographics</h3>
                              <p className="text-xs text-gray-500">Ethnicity distribution</p>
                          </div>
                          <BarChartIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={demoData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                                  <XAxis type="number" hide />
                                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fill: '#706B6A'}} interval={0} />
                                  <Tooltip cursor={{fill: 'transparent'}} />
                                  <Bar dataKey="value" fill="#D70029" radius={[0, 4, 4, 0]} barSize={24} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* 4. Enrollment by Age Group */}
                  <div className="bf-card p-6 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                          <div>
                              <h3 className="text-lg font-semibold text-on-surface">Enrollment by Age Group</h3>
                              <p className="text-xs text-gray-500">Age distribution of selected learners</p>
                          </div>
                          <BarChartIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={ageData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                                  <XAxis type="number" hide />
                                  <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 12, fill: '#706B6A'}} />
                                  <Tooltip cursor={{fill: 'transparent'}} />
                                  <Bar dataKey="value" fill="#D70029" radius={[0, 4, 4, 0]} barSize={24} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

              </div>
          </div>
      );
  }

  // ----------------------------------------------------------------------------------
  // VIEW 3: MAIN ANALYTICS CENTER (For Admins)
  // ----------------------------------------------------------------------------------
  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Analytics Center</h1>
            <p className="text-sm text-gray-500 mt-1 font-normal">Overview of learner progress, enrollment, and quality assurance.</p>
        </div>
        
        {/* Scope Selectors */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            
            {/* Main Scope */}
            <div className="relative min-w-[200px]">
                <select 
                    value={reportScope}
                    onChange={(e) => setReportScope(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-shape-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-sm text-on-surface shadow-sm"
                >
                    <option value="all">Entire Academy</option>
                    <option value="group">Group</option>
                    <option value="individual">Individual Learner</option>
                </select>
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Conditional Dropdowns */}
            {reportScope === 'group' && (
                <div className="relative min-w-[200px] animate-in fade-in">
                    <select 
                        value={selectedGroupId}
                        onChange={(e) => setSelectedGroupId(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-shape-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-sm text-on-surface shadow-sm"
                    >
                        <option value="">Select Group...</option>
                        {LEARNER_GROUPS.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            )}

            {reportScope === 'individual' && (
                <div className="relative min-w-[200px] animate-in fade-in">
                    <select 
                        value={selectedLearnerId}
                        onChange={(e) => setSelectedLearnerId(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-shape-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-sm text-on-surface shadow-sm"
                    >
                        <option value="">Find Learner...</option>
                        {MOCK_LEARNERS.map(l => (
                            <option key={l.id} value={l.id}>{l.firstName} {l.lastName}</option>
                        ))}
                    </select>
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            )}

            <Button icon={Download} arrow={false}>Export</Button>
        </div>
      </div>

      {/* =====================================================================================
          VIEW: ENTIRE ACADEMY
      ===================================================================================== */}
      {reportScope === 'all' && (
          <div className="space-y-6">
              
              {/* Top Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Total Enrolled - CLICKABLE */}
                  <div 
                      onClick={() => setShowEnrollmentDetails(true)}
                      className="bf-card p-6 relative overflow-hidden cursor-pointer hover:border-primary-fixed-dim transition-all group"
                  >
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <p className="text-gray-500 font-medium text-xs uppercase tracking-wide">Total Enrolled (Month)</p>
                              <h3 className="text-3xl font-bold text-on-surface mt-1 group-hover:text-primary transition-colors">135</h3>
                          </div>
                          <div className="p-3 bg-primary-container rounded-lg text-on-primary-container group-hover:bg-primary-fixed-dim transition-colors">
                              <Users className="w-5 h-5" />
                          </div>
                      </div>
                      <div className="flex items-center text-xs font-semibold text-[#059669]">
                          <TrendingUp className="w-3.5 h-3.5 mr-1" />
                          <span>+12% from last month</span>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-on-primary-container font-semibold bg-primary-container px-2 py-0.5 rounded border border-primary-fixed-dim transition-opacity">View Breakdown</div>
                  </div>

                  {/* Card 2: Pending Moderation - NAVIGATES TO PAGE */}
                  <div 
                      onClick={() => navigate('/admin/reports/pending-moderation')}
                      className="bf-card p-6 relative overflow-hidden cursor-pointer hover:border-warning transition-all group"
                  >
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <p className="text-gray-500 font-medium text-xs uppercase tracking-wide">Pending Moderation</p>
                              <h3 className="text-3xl font-bold text-on-surface mt-1 group-hover:text-warning transition-colors">62</h3>
                          </div>
                          <div className="p-3 bg-amber-50 rounded-lg text-warning">
                              <Clock className="w-5 h-5" />
                          </div>
                      </div>
                      <div className="flex items-center text-xs font-normal text-gray-500">
                          <span>Avg. wait time: 3 days</span>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-warning font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 transition-opacity">View Queue</div>
                  </div>

                  {/* Card 3: Referred Portfolios */}
                  <div className="bf-card p-6 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <p className="text-gray-500 font-medium text-xs uppercase tracking-wide">Referred Portfolios</p>
                              <h3 className="text-3xl font-bold text-on-surface mt-1">24</h3>
                          </div>
                          <div className="p-3 bg-rose-50 rounded-lg text-error">
                              <AlertCircle className="w-5 h-5" />
                          </div>
                      </div>
                      <div className="flex items-center text-xs font-semibold text-error">
                          <span>Requires immediate action</span>
                      </div>
                  </div>

                  {/* Card 4 - Active Learners - CLICKABLE */}
                  <div 
                      onClick={() => navigate('/admin/reports/active-learners')}
                      className="bf-card p-6 relative overflow-hidden cursor-pointer hover:border-[#10B981] transition-all group"
                  >
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <p className="text-gray-500 font-medium text-xs uppercase tracking-wide">Active Learners (30d)</p>
                              <h3 className="text-3xl font-bold text-on-surface mt-1 group-hover:text-[#10B981] transition-colors">89%</h3>
                          </div>
                          <div className="p-3 bg-emerald-50 rounded-lg text-[#10B981] group-hover:bg-emerald-100 transition-colors">
                              <CheckCircle className="w-5 h-5" />
                          </div>
                      </div>
                      <div className="flex items-center text-xs font-normal text-gray-500">
                          <span>High engagement rate</span>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-[#10B981] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 transition-opacity">View Details</div>
                  </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* IQA Status Distribution (Doughnut) */}
                  <div className="bf-card p-6">
                      <h3 className="text-lg font-semibold text-on-surface mb-1">IQA Status Distribution</h3>
                      <p className="text-xs text-gray-500 mb-6 font-normal">Current status of all submitted portfolios</p>
                      
                      <div className="h-64 relative">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie
                                      data={PIE_DATA}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={5}
                                      dataKey="value"
                                  >
                                      {PIE_DATA.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                  </Pie>
                                  <Tooltip />
                              </PieChart>
                          </ResponsiveContainer>
                          {/* Centered Total */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="text-center">
                                  <span className="block text-2xl font-bold text-on-surface">554</span>
                                  <span className="text-xs text-gray-500 uppercase font-medium">Total</span>
                              </div>
                          </div>
                      </div>

                      {/* Legend */}
                      <div className="grid grid-cols-2 gap-3 mt-4">
                          {PIE_DATA.map((item) => (
                              <div key={item.name} className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                                  <div className="flex items-center">
                                      <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                      <span className="text-xs font-medium text-gray-700">{item.name}</span>
                                  </div>
                                  <span className="text-xs font-bold text-on-surface">{item.value}</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Enrollment Trends (Bar Chart) - CLICKABLE */}
                  <div 
                      onClick={() => setShowEnrollmentDetails(true)}
                      className="lg:col-span-2 bf-card p-6 cursor-pointer hover:border-primary-fixed-dim transition-colors group relative"
                  >
                      <div className="flex justify-between items-start">
                          <div>
                              <h3 className="text-lg font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors">Enrollment Trends (12 Months)</h3>
                              <p className="text-xs text-gray-500 mb-6 font-normal">New learner registrations over time</p>
                          </div>
                          <button className="text-on-primary-container text-xs font-semibold bg-primary-container px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-primary-fixed-dim">
                              View Details
                          </button>
                      </div>
                      
                      <div className="h-80 pointer-events-none">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={enrollmentData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#706B6A', fontSize: 12}} dy={10} />
                                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#706B6A', fontSize: 12}} />
                                  <Bar dataKey="value" fill="#D70029" radius={[4, 4, 0, 0]} barSize={32} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>

              {/* Recent Activity List */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Student Activity Feed */}
                  <div className="lg:col-span-2 bf-card overflow-hidden">
                      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                          <div>
                              <h3 className="text-lg font-semibold text-on-surface">Recent Student Activity</h3>
                              <p className="text-xs text-gray-500 font-normal">Live feed of student interactions</p>
                          </div>
                          <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input type="text" placeholder="Search student..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-shape-md text-xs w-48 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                          </div>
                      </div>
                      
                      <div className="divide-y divide-gray-100">
                          {[
                              { name: 'Sarah Jenkins', course: 'L3 Management', action: 'Submitted Assignment 2', time: '2 hours ago', status: 'Active', initials: 'SJ', color: 'bg-emerald-100 text-[#059669]' },
                              { name: 'Michael Ross', course: 'L3 Management', action: 'Viewed Module 4', time: '1 day ago', status: 'Active', initials: 'MR', color: 'bg-gray-100 text-gray-700' },
                              { name: 'David Kim', course: 'L5 Leadership', action: 'Login', time: '14 days ago', status: 'At Risk', initials: 'DK', color: 'bg-amber-100 text-warning' },
                              { name: 'Emma Wood', course: 'L3 Management', action: 'Quiz Completion', time: '5 mins ago', status: 'Active', initials: 'EW', color: 'bg-teal-100 text-[#10B981]' },
                              { name: 'James Carter', course: 'L5 Leadership', action: 'Forum Post', time: '3 days ago', status: 'Active', initials: 'JC', color: 'bg-cyan-100 text-[#06B6D4]' },
                          ].map((activity, idx) => (
                              <div key={idx} className="p-4 flex items-center hover:bg-emerald-50/30 transition-colors">
                                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-xs mr-3.5 shrink-0 ${activity.color}`}>
                                      {activity.initials}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-semibold text-on-surface truncate">{activity.name}</h4>
                                      <p className="text-xs text-gray-500">{activity.course}</p>
                                  </div>
                                  <div className="hidden sm:block flex-1">
                                      <p className="text-[11px] text-gray-400 mb-0.5 font-medium uppercase">Last Activity</p>
                                      <p className="text-xs font-medium text-on-surface">{activity.action}</p>
                                  </div>
                                  <div className="text-right flex flex-col items-end gap-1 shrink-0">
                                      <span className="text-[11px] text-gray-400 font-medium">{activity.time}</span>
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${activity.status === 'At Risk' ? 'bg-rose-50 text-error border border-rose-200' : 'bg-emerald-50 text-[#059669] border border-emerald-200'}`}>
                                          {activity.status}
                                      </span>
                                  </div>
                                  <button className="ml-3 text-gray-400 hover:text-on-surface transition-colors">
                                      <MoreHorizontal className="w-4 h-4" />
                                  </button>
                              </div>
                          ))}
                      </div>
                      
                      <div className="p-3.5 border-t border-gray-100 text-center bg-gray-50/50">
                          <button className="text-xs font-semibold text-primary hover:text-primary-deep flex items-center justify-center w-full transition-colors">
                              View Full Access Logs <TrendingUp className="w-3.5 h-3.5 ml-1" />
                          </button>
                      </div>
                  </div>

                  {/* System Access (Right Col) */}
                  <div className="bf-card p-6">
                      <h3 className="text-lg font-semibold text-on-surface mb-1">System Access (30 Days)</h3>
                      <p className="text-xs text-gray-500 mb-6 font-normal">Daily active users</p>
                      
                      <div className="h-64 mb-6">
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={activityData}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#706B6A', fontSize: 10}} />
                                  <Tooltip />
                                  <Line type="monotone" dataKey="users" stroke="#D70029" strokeWidth={2.5} dot={false} />
                              </LineChart>
                          </ResponsiveContainer>
                      </div>

                      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                          <h4 className="text-xs font-semibold text-emerald-900 mb-1 flex items-center">
                              <FileText className="w-3.5 h-3.5 mr-1.5 text-primary" /> Activity Insight
                          </h4>
                          <p className="text-xs text-emerald-800 leading-relaxed font-normal">
                              Student logins peaked on the 25th, correlating with the "Leadership Module 3" assignment deadline.
                          </p>
                      </div>
                  </div>

              </div>
          </div>
      )}

      {/* =====================================================================================
          VIEW: GROUP (Similar Structure but Filtered Context)
      ===================================================================================== */}
      {reportScope === 'group' && (
          <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Group Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bf-card p-6">
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Cohort Size</p>
                      <h3 className="text-3xl font-bold text-on-surface mt-1">{filteredLearners.length}</h3>
                      <div className="mt-2 text-xs font-medium text-gray-400">Learners Enrolled</div>
                  </div>
                  <div className="bf-card p-6">
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Avg. Completion</p>
                      <h3 className="text-3xl font-bold text-primary mt-1">68%</h3>
                      <div className="mt-2 text-xs font-semibold text-[#059669] flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" /> +4% this week
                      </div>
                  </div>
                  <div className="bf-card p-6">
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">At Risk</p>
                      <h3 className="text-3xl font-bold text-error mt-1">
                          {filteredLearners.filter(l => l.iqaStatus === 'Referral').length}
                      </h3>
                      <div className="mt-2 text-xs font-semibold text-error">Low engagement</div>
                  </div>
                  <div className="bf-card p-6">
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Submissions Due</p>
                      <h3 className="text-3xl font-bold text-warning mt-1">12</h3>
                      <div className="mt-2 text-xs font-medium text-gray-400">Next 7 days</div>
                  </div>
              </div>

              {/* Group Activity Chart */}
              <div className="bf-card p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-on-surface">Group Engagement (30 Days)</h3>
                      <select className="text-xs border border-gray-200 rounded-shape-md text-gray-600 px-3 py-1.5 focus:outline-none focus:border-primary">
                          <option>Last 30 Days</option>
                          <option>Last Quarter</option>
                      </select>
                  </div>
                  <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={activityData}>
                              <defs>
                                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#D70029" stopOpacity={0.15}/>
                                      <stop offset="95%" stopColor="#D70029" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#706B6A', fontSize: 12}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#706B6A', fontSize: 12}} />
                              <Tooltip />
                              <Area type="monotone" dataKey="users" stroke="#D70029" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* Learner List (Table Style) */}
              <div className="bf-card overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-on-surface">Learner Roster</h3>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-100">
                          <thead className="bg-gray-50/70">
                              <tr>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Learner</th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                              </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                              {filteredLearners.map(learner => (
                                  <tr key={learner.id} className="hover:bg-emerald-50/30 transition-colors">
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                              <div className="h-8 w-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-semibold text-xs mr-3">
                                                  {learner.firstName[0]}{learner.lastName[0]}
                                              </div>
                                              <div>
                                                  <div className="text-sm font-semibold text-on-surface">{learner.firstName} {learner.lastName}</div>
                                                  <div className="text-xs text-gray-500">{learner.learnerNo}</div>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                              learner.iqaStatus === 'Passed' ? 'badge-success' : 
                                              learner.iqaStatus === 'Referral' ? 'bg-rose-50 text-error border border-rose-200' : 
                                              'badge-warning'
                                          }`}>
                                              {learner.iqaStatus === 'Referral' ? 'At Risk' : 'Active'}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                                              <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                                          2 days ago
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right">
                                          <button className="text-gray-400 hover:text-on-surface transition-colors">
                                              <MoreHorizontal className="w-4 h-4" />
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}

      {/* =====================================================================================
          VIEW: INDIVIDUAL LEARNER
      ===================================================================================== */}
      {reportScope === 'individual' && selectedLearner ? (
          <div className="space-y-6 animate-in fade-in duration-300">
              {/* Profile Card */}
              <div className="bf-card p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="h-16 w-16 rounded-xl bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                      {selectedLearner.firstName[0]}{selectedLearner.lastName[0]}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-on-surface">{selectedLearner.firstName} {selectedLearner.lastName}</h2>
                      <p className="text-sm text-gray-500 mt-0.5">{selectedLearner.mainCourse} • ID: {selectedLearner.learnerNo}</p>
                      <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                          <span className="badge-success text-xs">Active Status</span>
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">Cohort A</span>
                      </div>
                  </div>
                  <div className="text-right">
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Progress</div>
                      <div className="text-3xl font-bold text-primary mt-0.5">68%</div>
                  </div>
              </div>

              {/* Individual Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Activity Chart for Individual */}
                  <div className="bf-card p-6">
                      <h3 className="font-semibold text-on-surface mb-4">Learner Activity Log</h3>
                      <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={activityData}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#706B6A', fontSize: 10}} />
                                  <Tooltip />
                                  <Line type="monotone" dataKey="users" stroke="#D70029" strokeWidth={2.5} dot={false} />
                              </LineChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Submission List */}
                  <div className="bf-card overflow-hidden">
                      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                          <h3 className="font-semibold text-on-surface">Submission History</h3>
                      </div>
                      <div className="divide-y divide-gray-100">
                          <div className="p-4 flex justify-between items-center">
                              <div>
                                  <div className="text-sm font-semibold text-on-surface">L3 Anatomy Exam</div>
                                  <div className="text-xs text-gray-500">Completed 2 days ago</div>
                              </div>
                              <span className="badge-success text-xs font-semibold">Pass (88%)</span>
                          </div>
                          <div className="p-4 flex justify-between items-center">
                              <div>
                                  <div className="text-sm font-semibold text-on-surface">Practical Observation</div>
                                  <div className="text-xs text-gray-500">Submitted yesterday</div>
                              </div>
                              <span className="badge-warning text-xs font-semibold">Grading</span>
                          </div>
                          <div className="p-4 flex justify-between items-center">
                              <div>
                                  <div className="text-sm font-semibold text-on-surface">Portfolio Unit 1</div>
                                  <div className="text-xs text-gray-500">Submitted 1 week ago</div>
                              </div>
                              <span className="px-2.5 py-1 bg-rose-50 text-error border border-rose-200 text-xs font-semibold rounded-full">Referral</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      ) : null}

    </div>
  );
};

export default Reports;
