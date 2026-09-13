import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, UserPlus, FileText, ChevronRight, Package, MessageSquare, Calendar as CalendarIcon, FileBarChart, PlusCircle, ShieldCheck, PenTool } from 'lucide-react';
import { MOCK_LEARNERS } from '../constants';
import { Learner } from '../types';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-[#D1FAE5] text-[#059669]';
      case 'Referral': return 'bg-[#FEE2E2] text-[#DC2626]';
      case 'Submitted': return 'bg-[#E0E7FF] text-[#4C1D95]';
      case 'In Progress': return 'bg-[#FEF3C7] text-[#92400E]';
      default: return 'bg-[#F3F4F6] text-[#4B5563]';
    }
  };

  const quickActions = [
      { 
          title: "Analytics", 
          icon: FileBarChart, 
          path: "/reports", 
          desc: "View academy analytics",
          color: "text-[#7C3AED]",
          bg: "bg-[#7C3AED]/10"
      },
      { 
          title: "Add New User", 
          icon: UserPlus, 
          path: "/add-user", 
          desc: "Add staff, assessors or students",
          color: "text-[#10B981]",
          bg: "bg-[#10B981]/10"
      },
      { 
          title: "Reports", 
          icon: FileText, 
          path: "/admin/reports", 
          desc: "IQA & Moderation logs",
          color: "text-[#059669]",
          bg: "bg-[#059669]/10"
      },
      { 
          title: "Send Message", 
          icon: MessageSquare, 
          path: "/messages", 
          desc: "Email or push notification",
          color: "text-[#06B6D4]",
          bg: "bg-[#06B6D4]/10"
      },
      { 
          title: "Add Diary Event", 
          icon: CalendarIcon, 
          path: "/calendar", 
          desc: "Schedule CPD or classes",
          color: "text-[#7C3AED]",
          bg: "bg-[#7C3AED]/10"
      },
      { 
          title: "Create Course", 
          icon: PenTool, 
          path: "/courses", 
          desc: "Design course structures",
          color: "text-[#06B6D4]",
          bg: "bg-[#06B6D4]/10"
      }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Welcome Section */}
      <div className="bg-white rounded-lg p-6 text-[#1A1A2E] shadow-sm border border-[#E5E7EB] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                  <div className="flex items-center mb-2">
                      <span className="bg-[#D1FAE5] text-[#059669] text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center mr-3">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Super Admin
                      </span>
                      <span className="text-[#6B7280] text-xs font-medium">Session: Active Today</span>
                  </div>
                  <h1 className="text-2xl font-bold text-[#1A1A2E] tracking-tight">Welcome back, {adminName}</h1>
                  <p className="text-[#6B7280] text-sm mt-1">Overview of academy performance, learner metrics, and administrative controls.</p>
              </div>
              <div className="flex items-center gap-3">
                  <button 
                      onClick={() => navigate('/add-user')}
                      className="btn-primary flex items-center gap-2"
                  >
                      <UserPlus className="w-4 h-4" />
                      Add New User
                  </button>
              </div>
          </div>
      </div>

      {/* 2. Quick Actions Grid */}
      <div>
          <h2 className="text-base font-semibold text-[#1A1A2E] mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => (
                  <button 
                      key={index}
                      onClick={() => navigate(action.path)}
                      className="flex flex-col items-center justify-center p-5 bg-white rounded-lg shadow-sm border border-[#E5E7EB] hover:border-[#10B981] hover:bg-[#F0FDFA] transition-all group text-center h-full cursor-pointer"
                  >
                      <div className={`p-3 rounded-full mb-2.5 ${action.bg} ${action.color} group-hover:scale-105 transition-transform`}>
                          <action.icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-[#1A1A2E] text-sm mb-1">{action.title}</span>
                      <span className="text-xs text-[#6B7280] leading-snug">{action.desc}</span>
                  </button>
              ))}
          </div>
      </div>

      {/* 3. Learner Directory */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
                <h2 className="text-lg font-semibold text-[#1A1A2E]">Learner Directory</h2>
                <p className="text-[#6B7280] text-xs">Search, filter, and manage registered learners</p>
            </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E5E7EB] flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-[#6B7280]" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-md leading-5 bg-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] text-sm text-[#1A1A2E] transition duration-150 ease-in-out"
                    placeholder="Search by name or learner number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center w-full md:w-auto space-x-2">
                <Filter className="h-4 w-4 text-[#6B7280]" />
                <select
                    value={filterQualification}
                    onChange={(e) => setFilterQualification(e.target.value)}
                    className="block w-full py-2 px-3 border border-[#E5E7EB] bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] text-sm text-[#1A1A2E]"
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
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-[#E5E7EB]">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB]">
                <thead className="bg-[#F8FAFB]">
                <tr>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider">Learner Name</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider">Learner No.</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider">Assessor</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider">Course</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider">Reg. AO</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider">IQA Status</th>
                    <th scope="col" className="px-5 py-3 text-right text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                {filteredLearners.map((learner) => (
                    <tr 
                        key={learner.id} 
                        onClick={() => navigate(`/learner/${learner.id}`)}
                        className="hover:bg-[#F0FDFA] cursor-pointer transition-colors"
                    >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-[#D1FAE5] flex items-center justify-center text-[#059669] font-semibold text-xs mr-3">
                                {learner.firstName[0]}{learner.lastName[0]}
                            </div>
                            <div className="text-sm font-semibold text-[#1A1A2E]">{learner.firstName} {learner.lastName}</div>
                        </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-[#6B7280] font-mono">{learner.learnerNo}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-[#1A1A2E]">{learner.assessor}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-[#1A1A2E]">{learner.mainCourse}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-[#E0E7FF] text-[#4C1D95]">
                            {learner.courseType}
                        </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-[#6B7280]">{learner.regAO}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(learner.iqaStatus)}`}>
                            {learner.iqaStatus}
                        </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right text-sm font-medium">
                        <div className="text-[#10B981] hover:text-[#059669] font-medium flex items-center justify-end">
                            Manage <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </td>
                    </tr>
                ))}
                {filteredLearners.length === 0 && (
                    <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-sm text-[#6B7280]">
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