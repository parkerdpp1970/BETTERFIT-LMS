
import React, { useState } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis, ReferenceLine 
} from 'recharts';
import { Activity, Clock, TrendingUp, Users, CheckCircle, AlertCircle, FileBarChart, Brain, Target, AlertTriangle, Layers, BookOpen, FileText, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MetricTooltip = ({ title, description }: { title: string, description: string }) => (
  <div className="group relative inline-block ml-1.5 cursor-help align-middle">
    <Info className="w-3.5 h-3.5 text-slate-400 hover:text-secondary transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] shadow-xl pointer-events-none">
      <p className="font-bold mb-1 text-secondary uppercase tracking-wider">{title}</p>
      <p className="leading-relaxed opacity-90">{description}</p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

const AssessorAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('30d');

  // --- MOCK DATA BASED ON PDF METRICS ---

  // 1. SCATTER PLOT: Performance vs. Engagement (The "Holy Grail" visual)
  // X = Engagement Score (Time on task + Logins + Forum)
  // Y = Current Grade Average
  // Z = Procrastination Index (Size of bubble - larger = high procrastination)
  const LEARNER_SCATTER_DATA = [
      { id: '101', name: 'Tom H.', engagement: 95, grade: 88, procrastination: 10, status: 'High Performer' },
      { id: '102', name: 'Leo D.', engagement: 88, grade: 92, procrastination: 20, status: 'High Performer' },
      { id: '103', name: 'Meryl S.', engagement: 92, grade: 94, procrastination: 15, status: 'High Performer' },
      { id: '104', name: 'Heath L.', engagement: 30, grade: 45, procrastination: 90, status: 'At Risk' }, // Low Eng, Low Grade, High Proc
      { id: '106', name: 'Marlon B.', engagement: 15, grade: 30, procrastination: 95, status: 'At Risk' },
      { id: '107', name: 'Marilyn M.', engagement: 45, grade: 75, procrastination: 40, status: 'Coasting' }, // Low Eng, Good Grade (Coasting)
      { id: '108', name: 'Chadwick B.', engagement: 85, grade: 55, procrastination: 30, status: 'Wheel Spinning' }, // High Eng, Low Grade (Struggling)
      { id: '109', name: 'Audrey H.', engagement: 70, grade: 65, procrastination: 50, status: 'Steady' },
  ];

  // 2. SUBMISSION VELOCITY (Procrastination Index)
  const SUBMISSION_TIMING = [
      { name: '> 48h Early', value: 15, color: '#22c55e' }, // Low Risk
      { name: '24-48h Early', value: 35, color: '#3b82f6' }, // Good
      { name: 'Deadline Day', value: 30, color: '#A85A00' }, // Moderate Risk
      { name: 'Late', value: 20, color: '#ef4444' }, // High Risk
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-3xl font-extrabold text-[#0c0c0d] flex items-center">
                  <FileBarChart className="w-8 h-8 mr-3 text-secondary" />
                  Analytics
              </h1>
              <p className="text-slate-500 mt-1">
                  Actionable student insights and behavioral data to drive better learning outcomes.
              </p>
          </div>
          
          <div className="flex bg-white border border-[#afafaf] rounded-lg p-1">
              <button 
                  onClick={() => setDateRange('7d')}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${dateRange === '7d' ? 'bg-[#8B5CF6] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                  7 Days
              </button>
              <button 
                  onClick={() => setDateRange('30d')}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${dateRange === '30d' ? 'bg-[#8B5CF6] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                  30 Days
              </button>
          </div>
      </div>

      {/* KPI Cards - Focused on BEHAVIOR (from PDF) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div 
            onClick={() => navigate('/assessor/learners?filter=high_engagement')}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative cursor-pointer hover:border-primary-fixed-dim hover:shadow-md transition-all active:scale-[0.98] group"
          >
              <div className="flex justify-between items-start">
                  <div>
                      <div className="flex items-center mb-1">
                        <p className="text-xs font-bold text-slate-500 uppercase group-hover:text-secondary transition-colors">Learner Engagement</p>
                        <MetricTooltip 
                          title="Engagement" 
                          description="Measures the frequency and quality of student interactions with resources, assessments, and the platform over time." 
                        />
                      </div>
                      <h3 className="text-3xl font-extrabold text-slate-900">High</h3>
                  </div>
                  <Activity className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                  Avg. 3.2 logins per day (Low Entropy)
              </div>
          </div>

          <div 
            onClick={() => navigate('/assessor/learners?filter=procrastinating')}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative cursor-pointer hover:border-amber-500 hover:shadow-md transition-all active:scale-[0.98] group"
          >
              <div className="flex justify-between items-start">
                  <div>
                      <div className="flex items-center mb-1">
                        <p className="text-xs font-bold text-slate-500 uppercase group-hover:text-amber-600 transition-colors">Procrastination Index</p>
                        <MetricTooltip 
                          title="Procrastination" 
                          description="Quantifies how close to the deadline a student typically completes tasks. High values indicate last-minute rushing." 
                        />
                      </div>
                      <h3 className="text-3xl font-extrabold text-amber-600">0.65</h3>
                  </div>
                  <Clock className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                  40% of submissions on deadline day
              </div>
          </div>

          <div 
            onClick={() => navigate('/assessor/learners?filter=at_risk')}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative cursor-pointer hover:border-rose-500 hover:shadow-md transition-all active:scale-[0.98] group"
          >
              <div className="flex justify-between items-start">
                  <div>
                      <div className="flex items-center mb-1">
                        <p className="text-xs font-bold text-slate-500 uppercase group-hover:text-rose-600 transition-colors">At-Risk (Behavioral)</p>
                        <MetricTooltip 
                          title="Behavioral Risk" 
                          description="Identifies students whose login frequency, submission speed, or engagement patterns deviate significantly from the group norm." 
                        />
                      </div>
                      <h3 className="text-3xl font-extrabold text-[#F43F5E]">3</h3>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-[#F43F5E] group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                  High latency (&gt;7 days inactive)
              </div>
          </div>

          <div 
            onClick={() => navigate('/assessor/learners?filter=wheel_spinning')}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative cursor-pointer hover:border-[#8B5CF6] hover:shadow-md transition-all active:scale-[0.98] group"
          >
              <div className="flex justify-between items-start">
                  <div>
                      <div className="flex items-center mb-1">
                        <p className="text-xs font-bold text-slate-500 uppercase group-hover:text-[#8B5CF6] transition-colors">Wheel-Spinning</p>
                        <MetricTooltip 
                          title="Wheel-Spinning" 
                          description="Occurs when a learner is exerting high effort (long study time) but experiencing low performance, indicating a need for intervention." 
                        />
                      </div>
                      <h3 className="text-3xl font-extrabold text-[#8B5CF6]">1</h3>
                  </div>
                  <Brain className="w-6 h-6 text-[#8B5CF6] group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                  High effort, low performance
              </div>
          </div>
      </div>

      {/* Navigation Row for Drill-down Views */}
      <div className="flex flex-wrap gap-4 pt-2">
          <button 
              onClick={() => navigate('/assessor/results-by/learners')}
              className="group flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary-fixed-dim hover:shadow-md transition-all active:scale-95"
          >
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-700 group-hover:text-secondary">View by Learner</span>
          </button>
          <button 
              onClick={() => navigate('/assessor/results-by/groups')}
              className="group flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm hover:border-[#8B5CF6] hover:shadow-md transition-all active:scale-95"
          >
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-[#8B5CF6] group-hover:text-white transition-colors">
                  <Layers className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-700 group-hover:text-[#8B5CF6]">View by Group</span>
          </button>

          <button 
              onClick={() => navigate('/assessor/results-by/courses')}
              className="group flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all active:scale-95"
          >
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-700 group-hover:text-emerald-500">View by Course</span>
          </button>

          <button 
              onClick={() => navigate('/assessor/results-by/assessments')}
              className="group flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm hover:border-pink-500 hover:shadow-md transition-all active:scale-95"
          >
              <div className="p-2 rounded-lg bg-pink-50 text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-700 group-hover:text-pink-500">View by Assessment</span>
          </button>
      </div>

      {/* MAIN ANALYSIS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. PERFORMANCE VS ENGAGEMENT QUADRANT (Scatter) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-[#8B5CF6]" /> 
                      Performance vs. Engagement Matrix
                  </h3>
                  <div className="flex gap-4 text-xs">
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> High Performer</span>
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-rose-500 mr-1"></span> At Risk</span>
                  </div>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                  Identify "Coasting" students (High Grade/Low Activity) vs "Wheel Spinning" (Low Grade/High Activity). 
                  <br/>Bubble size represents <strong>Procrastination Risk</strong> (Larger = Higher Risk).
              </p>
              
              <div className="h-[400px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis type="number" dataKey="engagement" name="Engagement Score" unit="%" domain={[0, 100]} label={{ value: 'Engagement (Activity)', position: 'bottom', offset: 0, fontSize: 12 }} />
                          <YAxis type="number" dataKey="grade" name="Current Grade" unit="%" domain={[0, 100]} label={{ value: 'Performance (Grade)', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                          <ZAxis type="number" dataKey="procrastination" range={[50, 400]} name="Procrastination Risk" />
                          <Tooltip 
                              cursor={{ strokeDasharray: '3 3' }} 
                              content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                          <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
                                              <p className="font-bold text-[#8B5CF6]">{data.name}</p>
                                              <p className="text-xs text-slate-500">{data.status}</p>
                                              <div className="mt-2 border-t pt-2 space-y-1 text-xs">
                                                  <p>Grade: <strong>{data.grade}%</strong></p>
                                                  <p>Engagement: <strong>{data.engagement}%</strong></p>
                                                  <p>Procrastination: <strong>{data.procrastination}%</strong></p>
                                              </div>
                                              <p className="text-[10px] text-secondary mt-2 italic">Click to drill down</p>
                                          </div>
                                      );
                                  }
                                  return null;
                              }}
                          />
                          {/* Quadrant Lines */}
                          <ReferenceLine x={50} stroke="#cbd5e1" strokeDasharray="3 3" />
                          <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="3 3" />
                          
                          {/* Labels for Quadrants */}
                          <text x="95%" y="5%" textAnchor="end" className="text-[10px] font-bold fill-emerald-600 opacity-50">High Performers</text>
                          <text x="5%" y="95%" textAnchor="start" className="text-[10px] font-bold fill-rose-600 opacity-50">At Risk / Disengaged</text>
                          <text x="95%" y="95%" textAnchor="end" className="text-[10px] font-bold fill-amber-500 opacity-50">Wheel Spinning (Struggling)</text>
                          <text x="5%" y="5%" textAnchor="start" className="text-[10px] font-bold fill-indigo-500 opacity-50">Coasting (Low Effort)</text>

                          <Scatter 
                              name="Learners" 
                              data={LEARNER_SCATTER_DATA} 
                              fill="#06B6D4" 
                              shape="circle"
                              onClick={(data) => navigate(`/assessor/learner/${data.id}`)}
                              cursor="pointer"
                          >
                              {LEARNER_SCATTER_DATA.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={
                                      entry.grade < 50 ? '#F43F5E' : 
                                      entry.engagement < 50 && entry.grade > 70 ? '#F59E0B' : // Coasting
                                      entry.engagement > 70 && entry.grade < 60 ? '#8B5CF6' : // Wheel Spinning
                                      '#06B6D4'
                                  } />
                              ))}
                          </Scatter>
                      </ScatterChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* 2. SUBMISSION BEHAVIOR (Procrastination) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Submission Timing</h3>
              <p className="text-xs text-slate-500 mb-6">Are learners planning ahead or rushing?</p>
              
              <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={SUBMISSION_TIMING}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                          >
                              {SUBMISSION_TIMING.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '11px', color: '#64748b'}} />
                      </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                      <div className="text-center">
                          <span className="block text-xl font-extrabold text-slate-900">Deadline</span>
                          <span className="text-xs text-slate-400 uppercase font-bold">Analysis</span>
                      </div>
                  </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mt-4">
                  <h4 className="text-xs font-bold text-slate-900 mb-1 text-center">Actionable Insight</h4>
                  <p className="text-xs text-slate-500 text-center">
                      20% of submissions are late. The "At Risk" group typically submits assignments <span className="text-rose-500 font-bold">4 hours</span> before the deadline.
                  </p>
                  <div className="flex justify-center mt-2">
                    <button className="text-xs text-secondary font-bold hover:underline">Send "Early Bird" Nudge</button>
                  </div>
              </div>
          </div>
      </div>

      {/* 3. AT RISK LIST (Actionable) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-rose-500" /> Intervention Required
              </h3>
              <button className="text-xs text-secondary font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-rose-50/50 rounded-lg border border-rose-100 hover:bg-rose-100/50 transition-colors cursor-pointer" onClick={() => navigate('/assessor/learner/106')}>
                  <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm mr-3">MB</div>
                      <div>
                          <p className="text-sm font-bold text-slate-900">Marlon Brando</p>
                          <p className="text-xs text-rose-600">Latency: 21 days since last login</p>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <button className="text-xs bg-white text-rose-600 border border-rose-200 px-3 py-1.5 rounded font-bold hover:bg-rose-50">Email</button>
                      <button className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded font-bold hover:bg-rose-700">Call</button>
                  </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-amber-50/50 rounded-lg border border-amber-100 hover:bg-amber-100/50 transition-colors cursor-pointer" onClick={() => navigate('/assessor/learner/104')}>
                  <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mr-3">HL</div>
                      <div>
                          <p className="text-sm font-bold text-slate-900">Heath Ledger</p>
                          <p className="text-xs text-amber-600">Behavior: High Procrastination Index</p>
                      </div>
                  </div>
                  <button className="text-xs bg-white text-amber-600 border border-amber-200 px-3 py-1.5 rounded font-bold hover:bg-amber-50">Send Time Mgmt Tips</button>
              </div>
          </div>
      </div>

    </div>
  );
};

export default AssessorAnalytics;
