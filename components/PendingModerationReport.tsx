
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
    ArrowLeft, Clock, TrendingUp, Download, Filter, CheckCircle, AlertTriangle, 
    ChevronDown, User, FileText, Search, MoreHorizontal 
} from 'lucide-react';

// --- MOCK DATA ---
const MODERATION_QUEUE = [
    { id: 'm1', learner: 'Waqar Khan', assessor: 'Sarah Connor', unit: 'L3 PT - Unit 4 (Video)', submitted: '2023-11-08', daysWaiting: 7, status: 'Critical' },
    { id: 'm2', learner: 'Mike Sage', assessor: 'Davos Seaworth', unit: 'L2 Gym - Anatomy Exam', submitted: '2023-11-10', daysWaiting: 5, status: 'Warning' },
    { id: 'm3', learner: 'Sarah Jones', assessor: 'Sarah Connor', unit: 'L3 PT - Nutrition Case Study', submitted: '2023-11-11', daysWaiting: 4, status: 'Warning' },
    { id: 'm4', learner: 'Sam Deeley', assessor: 'Elena Fisher', unit: 'L2 Gym - Program Design', submitted: '2023-11-12', daysWaiting: 3, status: 'Warning' },
    { id: 'm5', learner: 'Adam Kiani', assessor: 'Marcus Aurelius', unit: 'L3 PT - Business Plan', submitted: '2023-11-14', daysWaiting: 1, status: 'On Track' },
    { id: 'm6', learner: 'Lois Morris', assessor: 'Elena Fisher', unit: 'L2 Gym - Client Interview', submitted: '2023-11-14', daysWaiting: 1, status: 'On Track' },
    { id: 'm7', learner: 'Tom Hardy', assessor: 'Davos Seaworth', unit: 'L3 PT - Unit 1', submitted: '2023-11-15', daysWaiting: 0, status: 'On Track' },
];

const WAIT_TIME_TREND = [
    { day: '1', days: 2.1 }, { day: '3', days: 2.3 }, { day: '5', days: 2.8 },
    { day: '7', days: 3.5 }, { day: '9', days: 4.2 }, { day: '11', days: 3.8 },
    { day: '13', days: 3.1 }, { day: '15', days: 2.5 }, { day: '17', days: 2.2 },
    { day: '19', days: 2.4 }, { day: '21', days: 2.9 }, { day: '23', days: 3.2 },
    { day: '25', days: 3.0 }, { day: '27', days: 2.8 }, { day: '29', days: 3.0 }
];

const PendingModerationReport: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQueue = MODERATION_QUEUE.filter(item => 
      item.learner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assessor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
       
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
                  <Clock className="w-8 h-8 mr-3 text-warning" />
                  Pending Moderation Analysis
              </h1>
              <p className="text-[#6c6c6c] mt-1 ml-11 max-w-2xl">
                  Review wait times, prioritize the moderation queue, and manage SLA compliance across the academy.
              </p>
          </div>
          
          <div className="flex gap-2">
              <button className="flex items-center px-4 py-2 bg-white border border-[#afafaf] rounded-lg text-[#6c6c6c] font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                  <Download className="w-4 h-4 mr-2" /> Export Queue
              </button>
          </div>
      </div>

      {/* Top Section: Charts & KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm">
              <h3 className="text-lg font-bold text-[#0c0c0d] mb-1">Average Wait Time Trend (30 Days)</h3>
              <p className="text-sm text-[#6c6c6c] mb-6">Daily average time from submission to moderation decision.</p>
              <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={WAIT_TIME_TREND}>
                          <defs>
                              <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#A85A00" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#A85A00" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6c6c6c', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6c6c6c', fontSize: 12}} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Area type="monotone" dataKey="days" stroke="#A85A00" strokeWidth={3} fillOpacity={1} fill="url(#colorWait)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm flex flex-col justify-center h-[calc(50%-12px)]">
                  <p className="text-xs font-bold text-[#6c6c6c] uppercase mb-2">Current Avg. Wait</p>
                  <div className="flex items-baseline">
                      <p className="text-5xl font-extrabold text-warning">3.0</p>
                      <span className="text-lg text-[#afafaf] font-medium ml-2">Days</span>
                  </div>
                  <div className="mt-4 text-xs font-bold text-red-500 flex items-center bg-red-50 px-3 py-2 rounded w-fit">
                      <TrendingUp className="w-4 h-4 mr-2" /> +0.5 days vs last week
                  </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm flex flex-col justify-center h-[calc(50%-12px)]">
                  <p className="text-xs font-bold text-[#6c6c6c] uppercase mb-2">Items &gt; 5 Days</p>
                  <div className="flex items-baseline">
                      <p className="text-5xl font-extrabold text-[#ef4444]">7</p>
                      <span className="text-lg text-[#afafaf] font-medium ml-2">Items</span>
                  </div>
                  <div className="mt-4 text-xs font-bold text-[#ef4444] bg-red-50 px-3 py-2 rounded w-fit flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" /> Critical Breach
                  </div>
              </div>
          </div>
      </div>

      {/* Queue Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-[#afafaf]/50 overflow-hidden">
          
          {/* Table Header / Toolbar */}
          <div className="p-6 border-b border-[#afafaf]/20 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                  <h3 className="text-lg font-bold text-[#0c0c0d]">Pending Queue</h3>
                  <p className="text-sm text-[#6c6c6c]">Sorted by longest wait time first.</p>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                      <input 
                          type="text" 
                          placeholder="Search learner, assessor..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-[#afafaf] rounded-lg text-sm focus:ring-warning focus:border-warning"
                      />
                      <Search className="w-4 h-4 text-[#afafaf] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button className="bg-white border border-[#afafaf] text-[#6c6c6c] text-sm font-bold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center">
                      <Filter className="w-4 h-4 mr-2" /> Filter
                  </button>
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#afafaf]/20">
                  <thead className="bg-white">
                      <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Learner</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Course / Unit</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Assessor</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Submitted</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Days Waiting</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Action</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#afafaf]/20">
                      {filteredQueue.length > 0 ? (
                          filteredQueue.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-[#6c6c6c] mr-3">
                                              {item.learner.charAt(0)}
                                          </div>
                                          <span className="font-bold text-[#0c0c0d] text-sm">{item.learner}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6c6c6c]">
                                      <div className="flex items-center">
                                          <FileText className="w-3 h-3 mr-2 text-[#afafaf]" />
                                          {item.unit}
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6c6c6c]">
                                      <div className="flex items-center">
                                          <User className="w-3 h-3 mr-2 text-[#afafaf]" />
                                          {item.assessor}
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6c6c6c]">
                                      {item.submitted}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                          item.daysWaiting > 5 ? 'bg-red-50 text-red-700 border-red-200' :
                                          item.daysWaiting >= 3 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                          'bg-blue-50 text-blue-700 border-blue-200'
                                      }`}>
                                          {item.daysWaiting} Days
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                      <button className="text-[#01b3ef] font-bold text-xs hover:underline flex items-center justify-end">
                                          Prioritize <MoreHorizontal className="w-4 h-4 ml-1" />
                                      </button>
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-[#6c6c6c]">
                                  <div className="flex flex-col items-center justify-center opacity-50">
                                      <CheckCircle className="w-12 h-12 mb-3 text-green-500" />
                                      <p className="font-medium">No pending items found.</p>
                                  </div>
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
          
          <div className="px-6 py-4 border-t border-[#afafaf]/20 bg-slate-50 flex justify-between items-center text-xs text-[#6c6c6c]">
              <span>Showing {filteredQueue.length} items</span>
              <div className="flex gap-2">
                  <button className="px-3 py-1 bg-white border border-[#afafaf] rounded hover:bg-slate-100">Previous</button>
                  <button className="px-3 py-1 bg-white border border-[#afafaf] rounded hover:bg-slate-100">Next</button>
              </div>
          </div>
      </div>

    </div>
  );
};

export default PendingModerationReport;
