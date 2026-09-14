
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileCheck, AlertTriangle, Users, ArrowRight, Clock, CheckCircle2, Layers, Scale, TrendingUp } from 'lucide-react';
import Button from './ui/Button';

const ModeratorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');

  const moderatorName = "Alex";

  // Mock IQA Data
  const samplingPlan = [
      { id: '2', assessor: 'Davos Seaworth', groups: ['Group A', 'L2 Gym'], learners: 8, risk: 'High', lastSample: '2023-09-01', status: 'Overdue' },
      { id: '3', assessor: 'Elena Fisher', groups: ['Group B'], learners: 5, risk: 'Medium', lastSample: '2023-10-01', status: 'Due Soon' },
      { id: '1', assessor: 'Sarah Connor', groups: ['Group A', 'L3 PT'], learners: 12, risk: 'Low', lastSample: '2023-10-15', status: 'On Track' },
      { id: '4', assessor: 'Marcus Aurelius', groups: ['Fast Track'], learners: 20, risk: 'Low', lastSample: '2023-10-20', status: 'On Track' },
  ];

  // Sort: Oldest submission first
  const sortedPlan = [...samplingPlan].sort((a, b) => new Date(a.lastSample).getTime() - new Date(b.lastSample).getTime());

  const filteredPlan = sortedPlan.filter(item => {
      const matchesSearch = item.assessor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = searchGroup === '' || item.groups.some(g => g.toLowerCase().includes(searchGroup.toLowerCase()));
      const matchesRisk = filterRisk === 'all' || item.risk.toLowerCase() === filterRisk.toLowerCase();
      return matchesSearch && matchesGroup && matchesRisk;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Welcome / IQA Header */}
      <div className="bg-primary rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10">
              <div className="flex items-center mb-3">
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider flex items-center mr-3">
                      <FileCheck className="w-3.5 h-3.5 mr-1.5" /> Internal Quality Assurance
                  </span>
                  <span className="text-white/90 text-xs font-medium">Cycle: Nov 2023</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold mb-1.5 tracking-tight text-white">Welcome back, {moderatorName}</h1>
              <p className="text-emerald-50 text-sm sm:text-base font-normal mb-5">Looks like a great day to drive quality standards!</p>
              
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20 max-w-3xl">
                  <p className="text-white text-xs sm:text-sm leading-relaxed flex items-start">
                      <CheckCircle2 className="w-4 h-4 mr-2.5 text-white shrink-0 mt-0.5" />
                      <span>
                          <strong>Focus for today:</strong> Grab a coffee ☕ and let's check in on the team! Take a look at the queue below and help our assessors shine by ensuring their feedback is spot-on and VARS compliant.
                      </span>
                  </p>
              </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform origin-bottom-right"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* 2. IQA Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pending Reviews */}
          <div 
            onClick={() => navigate('/moderator/analytics/pending')}
            className="bf-card p-6 flex flex-col justify-between cursor-pointer hover:border-warning transition-all group"
          >
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <p className="text-gray-500 font-medium text-xs uppercase tracking-wide">Pending Moderation</p>
                      <h3 className="text-3xl font-bold text-on-surface mt-1 group-hover:text-warning transition-colors">12</h3>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg text-warning group-hover:bg-amber-100 transition-colors">
                      <Clock className="w-5 h-5" />
                  </div>
              </div>
              <div className="badge-warning w-fit flex items-center text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Action Required
              </div>
          </div>

          {/* Past Moderation (Passed) */}
          <div 
            onClick={() => navigate('/moderator/analytics/passed')}
            className="bf-card p-6 flex flex-col justify-between cursor-pointer hover:border-[#10B981] transition-all group"
          >
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <p className="text-gray-500 font-medium text-xs uppercase tracking-wide">Passed Moderation</p>
                      <h3 className="text-3xl font-bold text-on-surface mt-1 group-hover:text-[#10B981] transition-colors">45</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg text-[#10B981] group-hover:bg-emerald-100 transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                  </div>
              </div>
              <div className="badge-success w-fit flex items-center text-xs">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> +12% this month
              </div>
          </div>

          {/* Referred */}
          <div 
            onClick={() => navigate('/moderator/analytics/referred')}
            className="bf-card p-6 flex flex-col justify-between cursor-pointer hover:border-error transition-all group"
          >
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <p className="text-gray-500 font-medium text-xs uppercase tracking-wide">Referred</p>
                      <h3 className="text-3xl font-bold text-on-surface mt-1 group-hover:text-error transition-colors">8</h3>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-lg text-error group-hover:bg-rose-100 transition-colors">
                      <AlertTriangle className="w-5 h-5" />
                  </div>
              </div>
              <div className="px-2.5 py-1 bg-rose-50 text-error border border-rose-200 text-xs font-semibold rounded-full w-fit">
                  15% Referral Rate
              </div>
          </div>

          {/* Learners in Scope */}
          <div 
            onClick={() => navigate('/moderator/analytics/scope')}
            className="bf-card p-6 flex flex-col justify-between cursor-pointer hover:border-[#06B6D4] transition-all group"
          >
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <p className="text-gray-500 font-medium text-xs uppercase tracking-wide">Learners in Scope</p>
                      <h3 className="text-3xl font-bold text-[#1A1A2E] mt-1 group-hover:text-[#06B6D4] transition-colors">128</h3>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-lg text-[#06B6D4] group-hover:bg-cyan-100 transition-colors">
                      <Users className="w-5 h-5" />
                  </div>
              </div>
              <div className="text-xs text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-full w-fit">
                  Across 4 active cohorts
              </div>
          </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bf-card p-6 flex items-center justify-between">
              <div>
                  <h3 className="text-base font-semibold text-on-surface">Standardization Meetings</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Schedule reviews and maintain consistency.</p>
              </div>
              <Button variant="outlined" size="sm" icon={Scale} onClick={() => navigate('/moderator/standardization')}>
                  Manage Events
              </Button>
          </div>
          
          <div className="bf-card p-6 flex items-center justify-between">
              <div>
                  <h3 className="text-base font-semibold text-on-surface">Generate Reports</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Build sampling plans based on cohort & risk.</p>
              </div>
              <Button size="sm" icon={FileCheck} onClick={() => navigate('/moderator/generate-report')}>
                  Generate
              </Button>
          </div>
      </div>

      {/* 4. Sampling Plan & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-lg font-semibold text-on-surface flex items-center">
                    Assessor Sampling Queue
                    <span className="ml-3 text-xs font-normal text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full">
                        Sorted by: Oldest Submission
                    </span>
                </h2>
            </div>
        </div>

        {/* Search Bar */}
        <div className="bf-card p-4 flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Assessor */}
            <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-shape-md text-xs leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition duration-150 ease-in-out text-on-surface"
                    placeholder="Search Assessor by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Search Group */}
            <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Layers className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-shape-md text-xs leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition duration-150 ease-in-out text-on-surface"
                    placeholder="Search by Group (e.g. Group A)..."
                    value={searchGroup}
                    onChange={(e) => setSearchGroup(e.target.value)}
                />
            </div>

            {/* Filter Risk */}
            <div className="flex items-center w-full lg:w-auto space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-200 bg-white rounded-shape-md text-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface font-medium"
                >
                    <option value="all">All Risk Levels</option>
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                </select>
            </div>
        </div>

        {/* Table */}
        <div className="bf-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/70">
                        <tr>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assessor Name</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Groups</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cohort Size</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Rating</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission Date</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredPlan.map((item) => (
                            <tr 
                                key={item.id} 
                                className="hover:bg-emerald-50/30 transition-colors group cursor-pointer"
                                onClick={() => navigate(`/moderator/sampling/${item.id}`)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-9 w-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs mr-3 group-hover:bg-primary-deep transition-colors shadow-sm">
                                            {item.assessor.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-on-surface">{item.assessor}</div>
                                            <div className="text-xs text-gray-500">Assessor ID: #{1000 + parseInt(item.id)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {item.groups.map(g => (
                                            <span key={g} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-1.5 text-gray-400" />
                                        {item.learners} Learners
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                                        item.risk === 'High' ? 'bg-rose-50 text-error border border-rose-200' : 
                                        item.risk === 'Medium' ? 'badge-warning' : 
                                        'badge-success'
                                    }`}>
                                        {item.risk}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs">
                                    <div className="flex items-center text-gray-500">
                                        <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                        {item.lastSample}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                     <span className={`text-xs font-semibold ${
                                         item.status === 'Overdue' ? 'text-error' : 
                                         item.status === 'Due Soon' ? 'text-warning' : 
                                         'text-[#059669]'
                                     }`}>
                                         {item.status}
                                     </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        trailingIcon={ArrowRight}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/moderator/sampling/${item.id}`);
                                        }}
                                    >
                                        Sample Now
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {filteredPlan.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                    <p className="font-semibold text-base text-on-surface">No assessors found</p>
                                    <p className="text-xs text-gray-500 mt-1">Try adjusting your search terms or filters.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
