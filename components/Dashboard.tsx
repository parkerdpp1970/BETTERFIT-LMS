import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, UserPlus, FileText, ChevronRight, Package, MessageSquare, Calendar as CalendarIcon, FileBarChart, PlusCircle, ShieldCheck, PenTool, Check, RotateCcw, Send, Clock } from 'lucide-react';
import { MOCK_LEARNERS } from '../constants';
import { Learner } from '../types';
import Button from './ui/Button';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQualification, setFilterQualification] = useState('all');
  
  // Mock logged-in user name
  const adminName = "Sam";

  const filteredLearners = MOCK_LEARNERS.filter((learner) => {
    const matchesSearch =
      learner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.learnerNo.includes(searchTerm);
    
    if (filterQualification === 'all') return matchesSearch;
    return matchesSearch && learner.mainCourse.includes(filterQualification);
  });

  // Passed keeps its green pill; the other statuses use the rebrand's semantic tokens.
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-[#D1FAE5] text-[#059669]';
      case 'Referral': return 'bg-error-container text-error';
      case 'Submitted': return 'bg-info-container text-on-info-container';
      case 'In Progress': return 'bg-warning-container text-on-warning-container';
      default: return 'bg-surface-container-high text-on-surface';
    }
  };

  // Pair each status colour with an icon so meaning never relies on colour alone.
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed': return <Check className="w-3.5 h-3.5" aria-hidden="true" />;
      case 'Referral': return <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />;
      case 'Submitted': return <Send className="w-3.5 h-3.5" aria-hidden="true" />;
      case 'In Progress': return <Clock className="w-3.5 h-3.5" aria-hidden="true" />;
      default: return null;
    }
  };

  const quickActions = [
      { 
          title: "Analytics", 
          icon: FileBarChart, 
          path: "/reports", 
          desc: "View academy analytics",
          color: "text-on-surface-variant",
          bg: "bg-gray-100"
      },
      { 
          title: "Add New User", 
          icon: UserPlus, 
          path: "/add-user", 
          desc: "Add staff, assessors or students",
          color: "text-primary",
          bg: "bg-gray-100"
      },
      { 
          title: "Reports", 
          icon: FileText, 
          path: "/admin/reports", 
          desc: "IQA & Moderation logs",
          color: "text-primary",
          bg: "bg-gray-100"
      },
      { 
          title: "Send Message", 
          icon: MessageSquare, 
          path: "/messages", 
          desc: "Email or push notification",
          color: "text-secondary",
          bg: "bg-gray-100"
      },
      { 
          title: "Add Diary Event", 
          icon: CalendarIcon, 
          path: "/calendar", 
          desc: "Schedule CPD or classes",
          color: "text-on-surface-variant",
          bg: "bg-gray-100"
      },
      { 
          title: "Create Course", 
          icon: PenTool, 
          path: "/courses", 
          desc: "Design course structures",
          color: "text-secondary",
          bg: "bg-gray-100"
      }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Welcome Section */}
      <div className="bg-white rounded-lg p-6 text-on-surface shadow-sm border border-outline-variant relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                  <div className="flex items-center mb-2">
                      <span className="bg-primary-container text-on-primary-container text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center mr-3">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Super Admin
                      </span>
                      <span className="text-on-surface-muted text-xs font-medium">Session: Active Today</span>
                  </div>
                  <h1 className="text-2xl font-bold text-on-surface tracking-tight">Welcome back, {adminName}</h1>
                  <p className="text-on-surface-muted text-sm mt-1">Overview of academy performance, learner metrics, and administrative controls.</p>
              </div>
              <div className="flex items-center gap-3">
                  <Button icon={UserPlus} onClick={() => navigate('/add-user')}>
                      Add New User
                  </Button>
              </div>
          </div>
      </div>

      {/* 2. Quick Actions Grid */}
      <div>
          <h2 className="text-base font-semibold text-on-surface mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => (
                  <button 
                      key={index}
                      onClick={() => navigate(action.path)}
                      className="flex flex-col items-center justify-center p-5 bg-white rounded-lg shadow-sm border border-outline-variant hover:border-primary-fixed-dim hover:-translate-y-0.5 hover:shadow-elevation-2 transition-all group text-center h-full cursor-pointer"
                  >
                      <div className={`p-3 rounded-full mb-2.5 ${action.bg} ${action.color} group-hover:scale-105 transition-transform`}>
                          <action.icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-on-surface text-sm mb-1">{action.title}</span>
                      <span className="text-xs text-on-surface-muted leading-snug">{action.desc}</span>
                  </button>
              ))}
          </div>
      </div>

      {/* 3. Learner Directory */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
                <h2 className="text-lg font-semibold text-on-surface">Learner Directory</h2>
                <p className="text-on-surface-muted text-xs">Search, filter, and manage registered learners</p>
            </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-outline-variant flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-on-surface-muted" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2 border border-outline-variant rounded-shape-md leading-5 bg-white placeholder-on-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-on-surface transition duration-150 ease-in-out"
                    placeholder="Search by name or learner number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center w-full md:w-auto space-x-2">
                <Filter className="h-4 w-4 text-on-surface-muted" />
                <select
                    value={filterQualification}
                    onChange={(e) => setFilterQualification(e.target.value)}
                    className="block w-full py-2 px-3 border border-outline-variant bg-white rounded-shape-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-on-surface"
                >
                    <option value="all">All Qualifications</option>
                    <option value="L2 Gym">L2 Gym Instructor</option>
                    <option value="L3 PT">L3 Personal Trainer</option>
                    <option value="L3 Ex Referral">L3 Exercise Referral</option>
                    <option value="L4 Obesity">L4 Obesity & Diabetes</option>
                </select>
            </div>
        </div>

        {/* Main Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-outline-variant">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-outline-variant">
                <thead className="bg-surface">
                <tr>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-on-surface uppercase tracking-wider">Learner Name</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-on-surface uppercase tracking-wider">Learner No.</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-on-surface uppercase tracking-wider">Assessor</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-on-surface uppercase tracking-wider">Course</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-on-surface uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-on-surface uppercase tracking-wider">Reg. AO</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-on-surface uppercase tracking-wider">IQA Status</th>
                    <th scope="col" className="px-5 py-3 text-right text-xs font-semibold text-on-surface uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-outline-variant">
                {filteredLearners.map((learner) => (
                    <tr 
                        key={learner.id} 
                        onClick={() => navigate(`/learner/${learner.id}`)}
                        className="hover:bg-surface-container-low cursor-pointer transition-colors"
                    >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-semibold text-xs mr-3">
                                {learner.firstName[0]}{learner.lastName[0]}
                            </div>
                            <div className="text-sm font-semibold text-on-surface">{learner.firstName} {learner.lastName}</div>
                        </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-on-surface-muted font-mono">{learner.learnerNo}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-on-surface">{learner.assessor}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-on-surface">{learner.mainCourse}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-surface-container-high text-on-surface">
                            {learner.courseType}
                        </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-on-surface-muted">{learner.regAO}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 inline-flex items-center gap-1 text-xs leading-5 font-medium rounded-full ${getStatusColor(learner.iqaStatus)}`}>
                            {getStatusIcon(learner.iqaStatus)}
                            {learner.iqaStatus}
                        </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right text-sm font-medium">
                        <div className="text-primary hover:text-primary-deep font-medium flex items-center justify-end">
                            Manage <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </td>
                    </tr>
                ))}
                {filteredLearners.length === 0 && (
                    <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-sm text-on-surface-muted">
                        No learners found matching your search.
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

export default Dashboard;