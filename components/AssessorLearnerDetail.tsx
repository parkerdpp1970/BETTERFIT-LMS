
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Mail, Phone, MapPin, Calendar, 
    CheckCircle, Circle, AlertCircle, ChevronDown, ChevronUp, HelpCircle,
    FileText, PlayCircle, Award, Clock, ExternalLink, BookOpen,
    BarChart2, Map as MapIcon, Activity, Zap, TrendingUp, AlertTriangle, Timer as TimerIcon, CalendarClock, History as HistoryIcon,
    Brain, MousePointerClick, Repeat, Users, MessageSquare, Share2, Smile, Frown, Network, AlertOctagon, Sparkles, X, Copy, Save, Bot, Info
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, Legend, ReferenceLine, ScatterChart, Scatter, ComposedChart, Area, AreaChart,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// --- MOCK DATA ---
const LEARNER_DATA = {
    id: '101',
    name: 'Tom Hanks',
    course: 'Certificate in gym instructing level two',
    learnerType: 'Cohort',
    email: 'tom.hanks@example.com',
    phone: '07700 900123',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=250&h=250&auto=format&fit=crop',
    startDate: '01 Sept 2023',
    lastActive: '2 hours ago',
    overallProgress: 68,
    status: 'On Track',
    attendance: 92,
    engagementIndex: 0.85,
    procrastinationIndex: 0.32,
    qualifications: [
        {
            id: 'q1',
            title: 'Certificate in Gym Instruction Level 2',
            status: 'On Track',
            progress: 68,
            completedAssessments: 18,
            totalAssessments: 24,
            timeSpent: '42h 15m',
            lastActive: '2 hours ago',
            attendance: 92,
            engagementIndex: 0.85,
            procrastinationIndex: 0.32,
            group: 'L2 Gym - Sept Cohort',
            units: [
                {
                    id: 'u1',
                    title: 'Hardcore Diet & Nutrition',
                    status: 'Completed',
                    progress: 100,
                    completedActivities: 3,
                    totalActivities: 3,
                    timeSpent: '12h 30m',
                    score: 88,
                    sections: [
                        {
                            id: 's1-1',
                            title: 'Nutrition Basics',
                            items: [
                                { id: 'a1', title: 'Macro-nutrients Quiz', type: 'Quiz', status: 'Passed', submittedDate: '15 Sept 2023', markedDate: '15 Sept 2023', grade: '90%' },
                                { id: 'a2', title: 'Caloric Balance Worksheet', type: 'Assignment', status: 'Passed', submittedDate: '16 Sept 2023', markedDate: '17 Sept 2023', grade: 'Pass' },
                            ]
                        },
                        {
                            id: 's1-2',
                            title: 'Hydration Strategies',
                            items: [
                                { id: 'a3', title: 'Hydration Exam', type: 'Exam', status: 'Passed', submittedDate: '18 Sept 2023', markedDate: '19 Sept 2023', grade: '85%' },
                            ]
                        }
                    ]
                },
                {
                    id: 'u2',
                    title: 'Unit 1: Anatomy & Physiology',
                    status: 'In Progress',
                    progress: 75,
                    completedActivities: 3,
                    totalActivities: 4,
                    timeSpent: '18h 45m',
                    score: 72,
                    sections: [
                        {
                            id: 's2-1',
                            title: 'Skeletal System',
                            items: [
                                { id: 'a4', title: 'Skeletal System Worksheet', type: 'Assignment', status: 'Passed', submittedDate: '15 Sept 2023', markedDate: '16 Sept 2023', grade: 'Pass' },
                                { id: 'a5', title: 'Bone Structure Quiz', type: 'Quiz', status: 'Passed', submittedDate: '18 Sept 2023', markedDate: '18 Sept 2023', grade: '88%' },
                            ]
                        },
                        {
                            id: 's2-2',
                            title: 'Muscular System',
                            items: [
                                { id: 'a6', title: 'Muscular System Quiz', type: 'Quiz', status: 'Grading Required', submittedDate: 'Yesterday', markedDate: '-', grade: '-' },
                            ]
                        },
                        {
                            id: 's2-3',
                            title: 'Customer Service in Fitness',
                            items: [
                                { id: 'a7', title: 'Client Interaction Case Study', type: 'Project', status: 'Pending', submittedDate: '-', markedDate: '-', grade: '-' },
                            ]
                        }
                    ]
                },
            ]
        },
        {
            id: 'q2',
            title: 'Level 3 CIPT',
            status: 'Not Started',
            progress: 0,
            completedAssessments: 0,
            totalAssessments: 32,
            timeSpent: '0h 0m',
            lastActive: 'Never',
            attendance: 0,
            engagementIndex: 0,
            procrastinationIndex: 0,
            group: 'L3 PT - Jan Cohort',
            units: [
                {
                    id: 'u3-1',
                    title: 'Applied Anatomy and Physiology',
                    status: 'Not Started',
                    progress: 0,
                    completedActivities: 0,
                    totalActivities: 1,
                    timeSpent: '0h 0m',
                    sections: [
                        {
                            id: 's3-1-1',
                            title: 'Circulatory & Respiratory Systems',
                            items: [
                                { id: 'a10', title: 'System Overview Quiz', type: 'Quiz', status: 'Pending', submittedDate: '-', markedDate: '-', grade: '-' },
                            ]
                        }
                    ]
                },
                {
                    id: 'u3-2',
                    title: 'Nutritional Principles',
                    status: 'Not Started',
                    progress: 0,
                    completedActivities: 0,
                    totalActivities: 1,
                    timeSpent: '0h 0m',
                    sections: [
                        {
                            id: 's3-2-1',
                            title: 'Advanced Nutrition',
                            items: [
                                { id: 'a11', title: 'Nutrition Case Study', type: 'Assignment', status: 'Pending', submittedDate: '-', markedDate: '-', grade: '-' },
                            ]
                        }
                    ]
                },
                {
                    id: 'u3-3',
                    title: 'Programming Personal Training Sessions',
                    status: 'Not Started',
                    progress: 0,
                    completedActivities: 0,
                    totalActivities: 1,
                    timeSpent: '0h 0m',
                    sections: [
                        {
                            id: 's3-3-1',
                            title: 'Designing Long-term Plans',
                            items: [
                                { id: 'a12', title: 'Session Plan Template', type: 'Assignment', status: 'Pending', submittedDate: '-', markedDate: '-', grade: '-' },
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

// --- BEHAVIORAL ANALYTICS DATA ---
const LATENCY_DATA = [
    { session: 1, date: '01 Nov', gap: 24 }, 
    { session: 2, date: '03 Nov', gap: 26 }, 
    { session: 3, date: '05 Nov', gap: 22 },
    { session: 4, date: '08 Nov', gap: 48 }, 
    { session: 5, date: '12 Nov', gap: 96 }, 
    { session: 6, date: '15 Nov', gap: 72 },
    { session: 7, date: '20 Nov', gap: 120 } 
];

const SESSION_DURATION_DATA = [
    { date: '01 Nov', duration: 45 }, 
    { date: '03 Nov', duration: 30 },
    { date: '05 Nov', duration: 60 }, 
    { date: '08 Nov', duration: 55 },
    { date: '12 Nov', duration: 20 }, 
    { date: '15 Nov', duration: 15 }, 
    { date: '20 Nov', duration: 10 } 
];

const REGULARITY_DATA = [
    { date: '01 Nov', index: 1, hour: 18, day: 'Mon' }, 
    { date: '03 Nov', index: 2, hour: 18.5, day: 'Wed' },
    { date: '05 Nov', index: 3, hour: 19, day: 'Fri' }, 
    { date: '08 Nov', index: 4, hour: 18, day: 'Mon' },
    { date: '12 Nov', index: 5, hour: 14, day: 'Fri' }, 
    { date: '15 Nov', index: 6, hour: 21, day: 'Mon' }, 
    { date: '20 Nov', index: 7, hour: 0.5, day: 'Sat' } 
];

const SUBMISSION_VELOCITY_DATA = [
    { submission: 'Unit 1 Quiz', days: 5, status: 'Early' },
    { submission: 'Unit 1 Exam', days: 2, status: 'Early' },
    { submission: 'Unit 2 Worksheet', days: 0, status: 'On Time' },
    { submission: 'Unit 3 Video', days: -1, status: 'Late' },
    { submission: 'Unit 4 Plan', days: 3, status: 'Early' },
];

// --- COGNITIVE ANALYTICS DATA ---
const NAVIGATION_LINEARITY_DATA = [
    { name: 'Linear Progression (Surface)', value: 40, color: '#94a3b8' },
    { name: 'Synthesis / Review (Deep)', value: 60, color: '#01427a' },
];

const ATTEMPT_PATTERN_DATA = [
    { attempt: 1, score: 45, interval: 0, type: 'Initial' },
    { attempt: 2, score: 48, interval: 2, type: 'Gaming' }, 
    { attempt: 3, score: 50, interval: 3, type: 'Gaming' }, 
    { attempt: 4, score: 85, interval: 120, type: 'Constructive' }, 
];

const RESPONSE_TIME_DATA = [
    { question: 1, time: 45, status: 'Optimal' },
    { question: 2, time: 2, status: 'Guessing' }, 
    { question: 3, time: 120, status: 'Struggle' }, 
    { question: 4, time: 35, status: 'Optimal' },
    { question: 5, time: 5, status: 'Guessing' },
    { question: 6, time: 50, status: 'Optimal' },
    { question: 7, time: 40, status: 'Optimal' },
    { question: 8, time: 110, status: 'Struggle' },
];

// --- SOCIAL ANALYTICS DATA ---
const SOCIAL_PROFILE_DATA = [
    { subject: 'Degree Centrality', A: 90, fullMark: 100 },
    { subject: 'Brokerage', A: 65, fullMark: 100 },
    { subject: 'Post Volume', A: 80, fullMark: 100 },
    { subject: 'Reciprocity', A: 70, fullMark: 100 },
    { subject: 'EVT Quality', A: 45, fullMark: 100 },
];

const EVT_DATA = [
    { name: 'Low EVT (Agreement)', value: 65, color: '#94a3b8' },
    { name: 'High EVT (Synthesis)', value: 35, color: '#8b5cf6' },
];

const SENTIMENT_DATA = [
    { date: 'Week 1', score: 0.8 },
    { date: 'Week 2', score: 0.6 },
    { date: 'Week 3', score: 0.7 },
    { date: 'Week 4', score: -0.2 },
    { date: 'Week 5', score: 0.4 },
    { date: 'Week 6', score: 0.9 },
];

import Messaging from './Messaging';

const AssessorLearnerDetail: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'progress' | 'behavioral' | 'cognitive' | 'social'>('progress');
  const [selectedQualId, setSelectedQualId] = useState<string | null>(null);
  const [showQualWarning, setShowQualWarning] = useState(false);
  
  // Behavioral Analytics Time Ranges
  const [latencyRange, setLatencyRange] = useState('7d');
  const [durationRange, setDurationRange] = useState('7d');
  const [regularityRange, setRegularityRange] = useState('7d');
  const [velocityRange, setVelocityRange] = useState('7d');
  const selectedQual = LEARNER_DATA.qualifications.find(q => q.id === selectedQualId) || LEARNER_DATA.qualifications[0];
  
  const [expandedQuals, setExpandedQuals] = useState<string[]>([]);
  const [expandedUnits, setExpandedUnits] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  // AI Report State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [reportStep, setReportStep] = useState<'select' | 'generate'>('select');
  const [reportOptions, setReportOptions] = useState({
      progress: true,
      behavioral: true,
      cognitive: true,
      social: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [activeMetricModal, setActiveMetricModal] = useState<null | 'social' | 'evt' | 'sentiment'>(null);
  
  const toggleQual = (qualId: string) => {
      setSelectedQualId(qualId);
      setExpandedQuals(prev => {
          const isExpanding = !prev.includes(qualId);
          if (isExpanding) {
              return [qualId]; // Keep only one open ideally, or at least ensure stats sync
          }
          return prev.filter(id => id !== qualId);
      });
  };

  const toggleUnit = (unitId: string) => {
      setExpandedUnits(prev => 
          prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
      );
  };

  const toggleSection = (sectionId: string) => {
      setExpandedSections(prev => 
          prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
      );
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Passed': return 'bg-green-100 text-green-700 border-green-200';
          case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
          case 'Grading Required': return 'bg-orange-100 text-orange-700 border-orange-200';
          case 'Submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'Referral': return 'bg-red-100 text-red-700 border-red-200';
          case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-100';
          default: return 'bg-slate-100 text-slate-500 border-slate-200';
      }
  };

  const getIconForType = (type: string) => {
      switch(type) {
          case 'Video': return <PlayCircle className="w-4 h-4" />;
          case 'Exam': return <FileText className="w-4 h-4" />;
          case 'Practical': return <Award className="w-4 h-4" />;
          default: return <FileText className="w-4 h-4" />;
      }
  };

  // --- AI GENERATION LOGIC ---
  const handleOpenReportModal = (arg?: string | React.MouseEvent) => {
      const qualId = typeof arg === 'string' ? arg : null;

      if (qualId) {
          setSelectedQualId(qualId);
          if (!expandedQuals.includes(qualId)) {
              setExpandedQuals([qualId]);
          }
          setReportStep('select');
          setIsReportModalOpen(true);
          setReportContent('');
      } else if (selectedQualId) {
          setReportStep('select');
          setIsReportModalOpen(true);
          setReportContent('');
      } else {
          setShowQualWarning(true);
      }
  };

  const handleGenerateReport = () => {
      setReportStep('generate');
      setIsGenerating(true);

      // Simulate API delay and generation
      setTimeout(() => {
          const name = LEARNER_DATA.name;
          const engIndex = selectedQual.engagementIndex;
          const procIndex = selectedQual.procrastinationIndex;
          const attend = selectedQual.attendance;
          const qualTitle = selectedQual.title;
          
          // Determine overall performance and risk
          let performanceStatus = '';
          let riskStatus = '';
          const isHighRisk = (selectedQual.progress < 30 && selectedQual.status === 'Active' && engIndex < 0.2) || engIndex < -0.3;
          const isExcellent = selectedQual.progress > 70 && engIndex > 0.6;

          if (isHighRisk) {
              performanceStatus = 'STAGNANT / AT RISK';
              riskStatus = 'HIGH RISK: Immediate intervention recommended due to declining engagement and sub-optimal progress velocity.';
          } else if (isExcellent) {
              performanceStatus = 'EXEMPLARY';
              riskStatus = 'LOW RISK: Demonstrating strong self-regulation and consistent progress toward completion.';
          } else {
              performanceStatus = 'SATISFACTORY';
              riskStatus = 'MODERATE RISK: Steady progress, though engagement patterns suggest room for optimization in social and cognitive interaction.';
          }
          
          let generatedSections = [];

          // Dynamic text construction based on metrics and selected options
          if (reportOptions.progress) {
            const progressDetail = selectedQual.progress > 50 
              ? `Velocity is tracking ahead of the expected cohort median. ${name} is consistently meeting assessment milestones with minimal friction in the learning pathway.`
              : `Progress is currently at ${selectedQual.progress}%. While foundational units are complete, the velocity has decelerated in the current module, requiring a review of current roadblocks.`;

            generatedSections.push(`**1. PROGRESS ANALYTICS**
${name} is currently ${selectedQual.status} for ${qualTitle} with an overall completion of ${selectedQual.progress}%. They have completed ${selectedQual.completedAssessments} of ${selectedQual.totalAssessments} required assessments.
${progressDetail}`);
          }

          if (reportOptions.behavioral) {
            const behavioralSummary = engIndex > 0.5 
              ? `${name} demonstrates high behavioral engagement, with a Z-Score of +${engIndex}, placing them in the top 15% of the student body. This is characterized by daily LMS logins and high resource-to-assessment interaction ratios.`
              : engIndex === 0 && selectedQual.status === 'Not Started'
              ? `${name} has not yet commenced interactions with ${qualTitle}. Engagement metrics remain at baseline, indicating a potential barrier to project commencement.`
              : `${name} is showing signs of behavioral drift (Z-Score: ${engIndex}). Login frequency has dropped by 30% over the last 14 days, suggesting a potential loss of momentum or external distraction.`;
            
            generatedSections.push(`**2. BEHAVIORAL ANALYTICS**
${behavioralSummary}
Current attendance record: ${attend}%. Regularity of sessions indicates a ${attend > 85 ? 'strong' : 'variable'} commitment to the scheduled learning hours.`);
          }

          if (reportOptions.cognitive) {
            const cogIndex = (NAVIGATION_LINEARITY_DATA[1].value / 100).toFixed(2);
            const cognitiveDetail = selectedQual.status === 'Not Started'
              ? 'Insufficient data to map cognitive load.'
              : `Navigation analysis shows a non-linear pathing pattern (Cognitive Index: ${cogIndex}), which is typical of high-performing learners who cross-reference modules for deeper synthesis. Procrastination Index of ${procIndex} indicates ${procIndex > 0.6 ? 'at-risk submission habits (just-in-time)' : 'proactive time management with early submissions'}.`;

            generatedSections.push(`**3. COGNITIVE ANALYTICS**
Analysis of meta-cognitive strategies indicates a preference for conceptual mapping over rote navigation. 
${cognitiveDetail}`);
          }

          if (reportOptions.social) {
            const socialSummary = selectedQual.status === 'Not Started'
              ? `${name} has not yet established social presence within this course specific learning community.`
              : `Social analytics indicate ${name} is ${SOCIAL_PROFILE_DATA[0].A > 50 ? 'a core influencer (Central)' : 'a casual observer (Peripheral)'} within the peer network. Interaction quality (EVT Score: ${(SOCIAL_PROFILE_DATA[4].A / 100).toFixed(2)}) suggests high-value contributions to group discussions and peer review cycles.`;

            generatedSections.push(`**4. SOCIAL DYNAMICS**
${socialSummary}
Sentiment analysis of forum posts and chat logs reflects a consistently ${SENTIMENT_DATA[SENTIMENT_DATA.length - 1].score > 0 ? 'positive' : 'neutral'} professional tone.`);
          }

          const report = `**AI SUMMARY REPORT: ${qualTitle.toUpperCase()}**
**Learner:** ${name}
**Generated Date:** ${new Date().toLocaleDateString()}

**OVERALL PERFORMANCE: ${performanceStatus}**
**RISK ASSESSMENT:** ${riskStatus}

**EXECUTIVE SUMMARY**
A synthesis of cross-platform data indicates that ${name}'s current trajectory in ${qualTitle} is ${selectedQual.status.toLowerCase()}. Analysis reveals the following key insights:

${generatedSections.join('\n\n')}

**INTERVENTION STRATEGY**
${isHighRisk ? 'URGENT: Initiate a 1-on-1 progress review within 48 hours to identify and mitigate barriers to engagement.' : isExcellent ? 'MAINTAIN: Acknowledge high performance. Consider offering extension materials or peer-mentoring opportunities to leverage current momentum.' : 'MONITOR: Schedule a check-in to discuss time management habits and encourage more active social participation.'}
`;
          setReportContent(report);
          setIsGenerating(false);
      }, 2000);
  };

    // Chart Data for Progress
    const pieData = [
        { name: 'Completed', value: selectedQual.progress },
        { name: 'Remaining', value: 100 - selectedQual.progress }
    ];
  const COLORS = ['#01b3ef', '#e2e8f0'];

  // Calculated Analytics Stats
  const totalSessions = SESSION_DURATION_DATA.length;
  const meanDuration = Math.round(SESSION_DURATION_DATA.reduce((acc, curr) => acc + curr.duration, 0) / totalSessions);
  const currentLatency = LATENCY_DATA[LATENCY_DATA.length - 1].gap;
  
  // Calculate Average Latency
  const avgLatencyRaw = LATENCY_DATA.reduce((acc, curr) => acc + curr.gap, 0) / LATENCY_DATA.length;
  const avgLatHours = Math.floor(avgLatencyRaw);
  const avgLatMins = Math.round((avgLatencyRaw - avgLatHours) * 60);
  const formattedAvgLatency = `${avgLatHours}h ${avgLatMins}m`;

  const TimeRangeSelector = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
    <div className="relative group/time">
        <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded cursor-pointer outline-none hover:bg-slate-100 transition-colors pr-6"
        >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="12m">Last 12 Months</option>
        </select>
        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );

  const MetricInfo = ({ title, description }: { title: string, description: string }) => (
    <div className="relative group/info ml-2 shrink-0">
        <Info className="w-3.5 h-3.5 text-slate-300 hover:text-[#00AEEF] transition-colors cursor-help" />
        <div className="absolute right-0 bottom-full mb-2 w-64 bg-slate-900 text-white text-[10px] p-3 rounded-lg shadow-2xl opacity-0 group-hover/info:opacity-100 pointer-events-none transition-opacity duration-200 z-50 border border-slate-700 leading-relaxed">
            <div className="font-bold text-[#00AEEF] mb-1.5 border-b border-slate-700/50 pb-1 uppercase tracking-wider">{title}</div>
            <div className="text-slate-300">{description}</div>
            <div className="absolute -bottom-1 right-2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700/50"></div>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
            <button 
                onClick={() => navigate('/assessor/results-by/learners')}
                className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-colors text-sm"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to view by learners
            </button>
            <div className="flex space-x-3">
                <button 
                    onClick={handleOpenReportModal}
                    className="bg-[#6366f1] text-white px-5 py-2.5 rounded-lg font-bold shadow-sm hover:bg-[#4f46e5] flex items-center transition-all"
                >
                    <Sparkles className="w-4 h-4 mr-2" /> AI Summary Report
                </button>
                <button 
                    onClick={() => setIsMessagingOpen(true)}
                    className="bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg font-bold shadow-sm hover:bg-slate-50 flex items-center"
                >
                    <Mail className="w-4 h-4 mr-2" /> Message
                </button>
                <button className="bg-[#0f4c81] text-white px-5 py-2.5 rounded-lg font-bold shadow-sm hover:bg-[#0c3c66] flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> View ILP
                </button>
            </div>
        </div>

        {/* 1. LEARNER SUMMARY CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00AEEF]"></div>
            
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Profile Info */}
                <div className="flex-1 flex gap-6 items-center">
                    <div className="w-12 h-12 rounded-full bg-[#111827] text-white flex items-center justify-center text-base font-bold shrink-0 shadow-inner overflow-hidden border-2 border-slate-100 relative group/pic cursor-pointer">
                        {LEARNER_DATA.image ? (
                            <img src={LEARNER_DATA.image} alt={LEARNER_DATA.name} className="w-full h-full object-cover group-hover/pic:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                        ) : (
                            <span>{LEARNER_DATA.name.split(' ').map(n => n[0]).join('')}</span>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/pic:opacity-100 transition-opacity duration-300">
                             <Sparkles className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-2xl font-black text-black leading-tight flex items-center gap-2">
                            {LEARNER_DATA.name}
                            {expandedQuals.length > 0 && (
                                <span className={`px-2 py-0.5 text-[10px] uppercase font-black rounded-md border ${selectedQual.status === 'Not Started' ? 'bg-slate-50 text-slate-500 border-slate-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                    {selectedQual.status}
                                </span>
                            )}
                        </h1>
                        
                        {expandedQuals.length > 0 && (
                            <>
                                <div className="relative group/sel">
                                    <select 
                                        value={selectedQualId} 
                                        onChange={(e) => setSelectedQualId(e.target.value)}
                                        className="appearance-none bg-transparent text-[#00AEEF] text-base font-bold mb-1 cursor-pointer outline-none hover:bg-slate-50 px-1 -ml-1 rounded transition-colors pr-6"
                                    >
                                        {LEARNER_DATA.qualifications.map(q => (
                                            <option key={q.id} value={q.id}>{q.title}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-[#00AEEF] absolute right-0 top-1 pointer-events-none group-hover/sel:scale-110 transition-transform" />
                                </div>
                                <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4 pt-4 border-t border-slate-100">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Progress</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-[#00AEEF] h-full" style={{ width: `${selectedQual.progress}%` }}></div>
                                    </div>
                                    <span className="text-sm font-black text-slate-800">{selectedQual.progress}%</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time Spent</span>
                                <div className="flex items-center gap-1.5">
                                    <HistoryIcon className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-black text-slate-800">{selectedQual.timeSpent}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Active</span>
                                <div className="flex items-center gap-1.5">
                                    <TimerIcon className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm font-black text-emerald-600">{LEARNER_DATA.lastActive}</span>
                                </div>
                            </div>
                        </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats / Metrics */}
                {expandedQuals.length > 0 && (
                    <div className="flex gap-8 items-center lg:pl-8 lg:border-l border-slate-100 animate-in fade-in slide-in-from-right-2 duration-300">
                        {/* Progress Pie */}
                        <div className="flex flex-col items-center">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">Overall Progress</div>
                            <div className="relative w-16 h-16">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={24}
                                            outerRadius={32}
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-800">
                                    {selectedQual.progress}%
                                </div>
                            </div>
                        </div>

                        {/* Compound Indices */}
                        <div className="flex flex-col gap-3 min-w-[240px]">
                            <div className="flex justify-between gap-6">
                                {/* Engagement Index */}
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">ENGAGEMENT INDEX</span>
                                    <div className="flex items-center">
                                        <Activity className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                                        <span className="text-xl font-black text-black">
                                            {selectedQual.engagementIndex > 0 ? '+' : ''}{selectedQual.engagementIndex}
                                        </span>
                                    </div>
                                </div>

                                {/* Procrastination Index */}
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">PROCRASTINATION INDEX</span>
                                    <div className="flex items-center">
                                        <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                                        <span className="text-xl font-black text-black">{selectedQual.procrastinationIndex}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col text-right">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">ATTENDANCE</span>
                                    <span className="text-xl font-black text-black">{selectedQual.attendance}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* TABS Navigation */}
        <div className="flex border-b border-slate-200 gap-8 pt-4 relative z-40 overflow-visible">
            <div className="relative group flex items-center">
                <button 
                    onClick={() => setActiveTab('progress')}
                    className={`pb-4 px-2 text-[15px] font-bold flex items-center transition-all border-b-4 whitespace-nowrap ${activeTab === 'progress' ? 'border-[#00AEEF] text-[#00AEEF]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <BookOpen className="w-5 h-5 mr-2.5" /> Progress Analytics
                </button>
                <div className="pb-4 flex items-center mb-1">
                    <div className="relative group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 cursor-help transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[100] pointer-events-none border border-slate-700 font-medium">
                            Tracking qualification status, completion rates, and assessment metrics relative to your current enrollment goals.
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative group flex items-center">
                <button 
                    onClick={() => setActiveTab('behavioral')}
                    className={`pb-4 px-2 text-[15px] font-bold flex items-center transition-all border-b-4 whitespace-nowrap ${activeTab === 'behavioral' ? 'border-[#00AEEF] text-[#00AEEF]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <BarChart2 className="w-5 h-5 mr-2.5" /> Behavioral Analytics
                </button>
                <div className="pb-4 flex items-center mb-1">
                    <div className="relative group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 cursor-help transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[100] pointer-events-none border border-slate-700 font-medium">
                            Monitoring login frequency, session duration, and regularity scores to identify patterns in student engagement.
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative group flex items-center">
                <button 
                    onClick={() => setActiveTab('cognitive')}
                    className={`pb-4 px-2 text-[15px] font-bold flex items-center transition-all border-b-4 whitespace-nowrap ${activeTab === 'cognitive' ? 'border-[#00AEEF] text-[#00AEEF]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <Brain className="w-5 h-5 mr-2.5" /> Cognitive Analytics
                </button>
                <div className="pb-4 flex items-center mb-1">
                    <div className="relative group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 cursor-help transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[100] pointer-events-none border border-slate-700 font-medium">
                            Inferring mental effort and processing quality by analyzing how students navigate materials and complete complex tasks.
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative group flex items-center">
                <button 
                    onClick={() => setActiveTab('social')}
                    className={`pb-4 px-2 text-[15px] font-bold flex items-center transition-all border-b-4 whitespace-nowrap ${activeTab === 'social' ? 'border-[#00AEEF] text-[#00AEEF]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <Users className="w-5 h-5 mr-2.5" /> Social Analytics
                </button>
                <div className="pb-4 flex items-center mb-1">
                    <div className="relative group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 cursor-help transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[100] pointer-events-none border border-slate-700 font-medium">
                            Measuring peer community interaction, collaboration frequency, and overall sentiment within learning forums.
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. TAB CONTENT: PROGRESS MAP (Refactored for 4-level Nesting) */}
        {activeTab === 'progress' && (
            <div className="space-y-8 pt-4">
                {/* Level 1: Qualification Accordion */}
                <div className="space-y-8">
                    {LEARNER_DATA.qualifications.map((qual) => {
                        const isQualExpanded = expandedQuals.includes(qual.id);
                        
                        return (
                            <div key={qual.id} className={`bg-white rounded-2xl border transition-all duration-500 ${isQualExpanded ? 'border-slate-800 shadow-xl' : selectedQualId === qual.id ? 'border-indigo-500 ring-2 ring-indigo-500/10 shadow-md scale-[1.01]' : 'border-slate-200 shadow-sm'}`}>
                                
                                {/* Qualification Header (Level 1) */}
                                <div 
                                    onClick={() => toggleQual(qual.id)}
                                    className={`px-6 py-5 flex items-center justify-between cursor-pointer transition-all duration-300 active:scale-[0.995] active:brightness-95 ${isQualExpanded ? 'bg-slate-950 text-white rounded-t-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]' : selectedQualId === qual.id ? 'bg-indigo-50/50 border-b border-indigo-100' : 'hover:bg-slate-50 hover:shadow-md border-b border-slate-100'}`}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-2 items-center w-full">
                                        {/* Active Qualification */}
                                        <div className="flex flex-col md:col-span-7 min-w-0">
                                            <span className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5 ${isQualExpanded ? 'text-slate-400' : 'text-slate-500'}`}>Active Qualification</span>
                                            <h3 className={`text-[13px] font-black tracking-tight leading-tight truncate ${isQualExpanded ? 'text-white' : 'text-slate-900'}`}>{qual.title}</h3>
                                        </div>

                                        {/* Status */}
                                        <div className="flex flex-col md:col-span-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5 ${isQualExpanded ? 'text-slate-400' : 'text-slate-500'}`}>Status</span>
                                            <span className={`text-[11px] font-black uppercase ${isQualExpanded ? 'text-emerald-400' : 'text-emerald-600'}`}>{qual.status}</span>
                                        </div>

                                        {/* Completed */}
                                        <div className="flex flex-col md:col-span-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5 ${isQualExpanded ? 'text-slate-400' : 'text-slate-500'}`}>Completed</span>
                                            <span className={`text-[12px] font-black ${isQualExpanded ? 'text-white' : 'text-slate-900'}`}>{qual.completedAssessments}/{qual.totalAssessments}</span>
                                        </div>

                                        {/* Time Spent */}
                                        <div className="flex flex-col md:col-span-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5 ${isQualExpanded ? 'text-slate-400' : 'text-slate-500'}`}>Time Spent</span>
                                            <span className={`text-[12px] font-black ${isQualExpanded ? 'text-white' : 'text-slate-900'}`}>{qual.timeSpent}</span>
                                        </div>

                                        {/* Last Active */}
                                        <div className="flex flex-col md:col-span-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5 ${isQualExpanded ? 'text-slate-400' : 'text-slate-500'}`}>Last Active</span>
                                            <span className={`text-[12px] font-black ${isQualExpanded ? 'text-white' : 'text-slate-900'}`}>{qual.lastActive || 'N/A'}</span>
                                        </div>

                                        {/* Total Progress */}
                                        <div className="flex justify-between items-center md:col-span-2">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col" onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedQualId(qual.id);
                                                    if (!expandedQuals.includes(qual.id)) toggleQual(qual.id);
                                                }}>
                                                    <span className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5 ${isQualExpanded ? 'text-slate-400' : 'text-slate-500'}`}>Total Progress</span>
                                                    <span className={`text-[15px] font-black ${isQualExpanded ? 'text-[#00AEEF]' : 'text-[#00AEEF]'}`}>{qual.progress}%</span>
                                                </div>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenReportModal(qual.id);
                                                    }}
                                                    className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all group/report"
                                                    title="Generate AI Report for this Qualification"
                                                >
                                                    <Sparkles className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className={`transition-transform duration-300 ${isQualExpanded ? 'rotate-180' : ''}`}>
                                                <ChevronDown className={`w-5 h-5 ${isQualExpanded ? 'text-white' : 'text-slate-300'}`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Level 2: Units Accordion (Nested) */}
                                {isQualExpanded && (
                                    <div className="px-0 md:px-0 py-6 space-y-6 bg-slate-50/50 rounded-b-2xl animate-in slide-in-from-top-4 duration-500">
                                        {qual.units.map((unit) => {
                                            const isUnitExpanded = expandedUnits.includes(unit.id);
                                            
                                            return (
                                                <div key={unit.id} className={`mx-4 md:mx-6 bg-white rounded-xl border transition-all duration-300 ${isUnitExpanded ? 'border-[#00AEEF] ring-1 ring-[#00AEEF]/10 shadow-md' : 'border-slate-200'}`}>
                                                    
                                                    {/* Unit Header (Level 2) */}
                                                    <div 
                                                        onClick={() => toggleUnit(unit.id)}
                                                        className={`px-5 py-2.5 flex items-center justify-between cursor-pointer transition-all active:scale-[0.998] active:brightness-95 ${isUnitExpanded ? 'bg-slate-50/50' : 'hover:bg-slate-50/80 rounded-xl'}`}
                                                    >
                                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${unit.progress === 100 ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-blue-50 text-blue-500'}`}>
                                                                {unit.progress === 100 ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 flex-1 min-w-0">
                                                                <h3 className="font-bold text-[#111827] text-sm leading-tight truncate flex-1 min-w-[180px]">{unit.title}</h3>
                                                                
                                                                <div className="flex items-center gap-4 text-[11px] font-bold border-l border-slate-200/30 pl-4 h-4 shrink-0">
                                                                    <span className={`px-2 py-0.5 rounded-md border tracking-wide uppercase text-[9px] ${getStatusColor(unit.status)}`}>{unit.status}</span>
                                                                    {unit.score && <span className="text-slate-400">Score: <span className="text-slate-700">{unit.score}%</span></span>}
                                                                    
                                                                    <span className="flex items-center gap-1 text-slate-500">
                                                                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                                                                        {unit.completedActivities}/{unit.totalActivities}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-slate-500">
                                                                        <Clock className="w-3 h-3 text-blue-400" />
                                                                        {unit.timeSpent}
                                                                    </span>
                                                                    <span className="text-slate-900">{unit.progress}%</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className={`p-1 rounded-full transition-colors ${isUnitExpanded ? 'bg-[#00AEEF]/10 text-[#00AEEF]' : 'text-slate-300'}`}>
                                                            {isUnitExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </div>
                                                    </div>

                                                    {/* Level 3: Sections Accordion (Nested) */}
                                                    {isUnitExpanded && (
                                                        <div className="border-t border-slate-100 px-0 md:px-0 py-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                                            {unit.sections.map(section => {
                                                                const isSectionExpanded = expandedSections.includes(section.id);
                                                                return (
                                                                    <div key={section.id} className={`mx-4 md:mx-6 border rounded-xl transition-all duration-300 ${isSectionExpanded ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-100 bg-slate-50/50'}`}>
                                                                        
                                                                         {/* Section Header (Level 3) */}
                                                                        <div 
                                                                            onClick={() => toggleSection(section.id)}
                                                                            className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-50 active:scale-[0.998] active:brightness-95 transition-all"
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isSectionExpanded ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                                                    <BookOpen className="w-3.5 h-3.5" />
                                                                                </div>
                                                                                <h4 className="font-bold text-[13px] text-slate-800">{section.title}</h4>
                                                                            </div>
                                                                            <div className="flex items-center gap-4">
                                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{section.items.length} Elements</span>
                                                                                {isSectionExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                                                                            </div>
                                                                        </div>

                                                                        {/* Level 4: Activities List */}
                                                                        {isSectionExpanded && (
                                                                            <div className="border-t border-slate-100 px-0 md:px-0 py-3 bg-slate-50/20 animate-in slide-in-from-top-1 duration-200">
                                                                                {section.items.map(item => (
                                                                                    <div 
                                                                                        key={item.id} 
                                                                                        onClick={() => navigate(`/assessor/assessment/${item.id}`)}
                                                                                        className="mx-3 md:mx-4 mb-2 bg-white border border-slate-100 rounded-lg py-2.5 px-4 flex flex-col md:flex-row items-center justify-between group shadow-sm hover:border-[#00AEEF] hover:shadow-md active:scale-[0.98] active:brightness-95 cursor-pointer transition-all duration-200 last:mb-0"
                                                                                    >
                                                                                        <div className="flex items-center gap-3 w-full md:w-[280px]">
                                                                                            <div className="w-7 h-7 bg-slate-50 rounded-md flex items-center justify-center text-slate-400 group-hover:text-[#00AEEF] transition-colors shrink-0">
                                                                                                {getIconForType(item.type)}
                                                                                            </div>
                                                                                            <div className="min-w-0">
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <h5 className="font-bold text-[13px] text-slate-900 leading-tight truncate">{item.title}</h5>
                                                                                                    <span className="text-[8px] text-slate-400 uppercase tracking-widest font-extrabold px-1.5 py-0.5 bg-slate-50 rounded border border-slate-100 shrink-0">{item.type}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="flex items-center gap-x-8 text-[11px] font-medium text-slate-500 w-full md:flex-1 py-1 md:py-0 justify-end">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <span className="text-[9px] text-slate-300 uppercase font-bold tracking-wider">Sub:</span>
                                                                                                <span className="text-slate-700 font-bold">{item.submittedDate}</span>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-2 border-l border-slate-100 pl-4 h-4">
                                                                                                <span className="text-[9px] text-slate-300 uppercase font-bold tracking-wider">Marked:</span>
                                                                                                <span className="text-slate-700 font-bold">{item.markedDate}</span>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-2 border-l border-slate-100 pl-4 h-4">
                                                                                                <span className="text-[9px] text-slate-300 uppercase font-bold tracking-wider">Grade:</span>
                                                                                                <span className={`font-black ${item.grade === '-' || item.grade === 'Refer' ? 'text-slate-400' : 'text-[#00AEEF]'}`}>{item.grade === '-' ? 'N/A' : item.grade}</span>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-2 border-l border-slate-100 pl-4 h-4">
                                                                                                <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase ${getStatusColor(item.status)}`}>{item.status}</span>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="ml-4 flex items-center shrink-0">
                                                                                            {item.status === 'Grading Required' ? (
                                                                                                <button className="bg-[#00AEEF] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded hover:bg-slate-900 transition-colors shadow-sm tracking-widest">
                                                                                                    Mark
                                                                                                </button>
                                                                                            ) : (
                                                                                                <div className="p-1.5 text-slate-200 group-hover:text-[#00AEEF] transition-colors">
                                                                                                    <FileText className="w-4 h-4" />
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* 3. BEHAVIORAL ANALYTICS TAB CONTENT */}
        {activeTab === 'behavioral' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* TOP METRICS KPI */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-[#afafaf]/50 shadow-sm flex flex-col relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[#6c6c6c] uppercase">Login Frequency</span>
                            <MetricInfo 
                                title="Login Frequency" 
                                description="Measures how often a student accesses the platform. Consistent logins indicate high engagement, which is the strongest predictor of successful course completion and better knowledge retention." 
                            />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-extrabold text-[#0c0c0d]">{totalSessions}</span>
                            <Zap className="w-5 h-5 text-[#01b3ef]" />
                        </div>
                        <span className="text-xs text-[#6c6c6c] mt-1">Total distinct sessions</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#afafaf]/50 shadow-sm flex flex-col relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[#6c6c6c] uppercase">Mean Session Time</span>
                            <MetricInfo 
                                title="Mean Session Time" 
                                description="The average time spent per session. Longer sessions often reflect deep focus and active engagement with learning materials, while shorter sessions might indicate quick resource checks." 
                            />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-extrabold text-[#0c0c0d]">{meanDuration}m</span>
                            <TimerIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-xs text-[#6c6c6c] mt-1">Average duration</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#afafaf]/50 shadow-sm flex flex-col relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[#6c6c6c] uppercase">Current Latency</span>
                            <MetricInfo 
                                title="Current Latency" 
                                description="The time elapsed since the student's last interaction. High latency alerts assessors to potential disengagement or academic hurdles that may require immediate intervention." 
                            />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className={`text-2xl font-extrabold ${currentLatency > 72 ? 'text-[#e14177]' : 'text-[#0c0c0d]'}`}>
                                {currentLatency}h
                            </span>
                            <Clock className="w-5 h-5 text-orange-500" />
                        </div>
                        <span className="text-xs text-[#6c6c6c] mt-1">Since last interaction</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#afafaf]/50 shadow-sm flex flex-col relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[#6c6c6c] uppercase">Average Latency</span>
                            <MetricInfo 
                                title="Average Latency" 
                                description="The mean interval between interactions over time. This establishes the learner's preferred study rhythm, helping you identify deviations that signal changes in motivation." 
                            />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-extrabold text-[#0c0c0d]">
                                {formattedAvgLatency}
                            </span>
                            <HistoryIcon className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="text-xs text-[#6c6c6c] mt-1">Mean gap between logins</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#afafaf]/50 shadow-sm flex flex-col relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[#6c6c6c] uppercase">Regularity Score</span>
                            <MetricInfo 
                                title="Regularity Score" 
                                description="Evaluates consistency in study patterns (e.g., studying at the same time daily). High regularity indicates disciplined study habits, improving long-term academic outcomes." 
                            />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-extrabold text-[#0c0c0d]">Med</span>
                            <Activity className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="text-xs text-[#6c6c6c] mt-1">Consistency rating</span>
                    </div>
                </div>

                {/* ROW 2: LATENCY & DURATION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Latency Curve */}
                    <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm transition-all duration-300">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-[#e14177]" /> Recency & Latency Curve
                            </h3>
                            <div className="flex items-center">
                                <TimeRangeSelector value={latencyRange} onChange={setLatencyRange} />
                                <MetricInfo 
                                    title="Recency & Latency" 
                                    description="Visualizes the gap between interactions over time. An upward curve indicates increasing delays between study sessions, which is a major risk factor for learning loss." 
                                />
                            </div>
                        </div>
                        <p className="text-xs text-[#6c6c6c] mb-6">Elapsed time since last interaction. Upward trend = Risk.</p>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={LATENCY_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tick={{fontSize: 10}} />
                                    <YAxis label={{ value: 'Hours Gap', angle: -90, position: 'insideLeft', fontSize: 10 }} tick={{fontSize: 10}} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="gap" stroke="#e14177" strokeWidth={3} dot={{r: 4}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Session Duration Distribution */}
                    <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm transition-all duration-300">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                                <TimerIcon className="w-5 h-5 mr-2 text-green-600" /> Session Duration History
                            </h3>
                            <div className="flex items-center">
                                <TimeRangeSelector value={durationRange} onChange={setDurationRange} />
                                <MetricInfo 
                                    title="Session Duration" 
                                    description="Tracks the evolution of focus time. Stability in session length suggests a sustainable learning pace, while drastic drops may indicate external stressors." 
                                />
                            </div>
                        </div>
                        <p className="text-xs text-[#6c6c6c] mb-6">Minutes spent per session over time.</p>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={SESSION_DURATION_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tick={{fontSize: 10}} />
                                    <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fontSize: 10 }} tick={{fontSize: 10}} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <ReferenceLine y={meanDuration} stroke="#0c0c0d" strokeDasharray="3 3" label={{ value: 'Avg', position: 'right', fontSize: 10 }} />
                                    <Bar dataKey="duration" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* ROW 3: REGULARITY & VELOCITY */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Regularity (Scatter) */}
                    <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm transition-all duration-300">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                                <CalendarClock className="w-5 h-5 mr-2 text-purple-600" /> Study Regularity
                            </h3>
                            <div className="flex items-center">
                                <TimeRangeSelector value={regularityRange} onChange={setRegularityRange} />
                                <MetricInfo 
                                    title="Study Regularity" 
                                    description="Maps daily access times. Clustered data points reveal established 'study blocks'—rhythmic habits that facilitate easier entry into deep work and better consolidation of info." 
                                />
                            </div>
                        </div>
                        <p className="text-xs text-[#6c6c6c] mb-6">Time of day access pattern. Clustered = Regular habit.</p>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="category" dataKey="date" tick={{fontSize: 10}} name="Date" />
                                    <YAxis type="number" dataKey="hour" name="Hour" unit="h" domain={[0, 24]} tick={{fontSize: 10}} />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Scatter name="Logins" data={REGULARITY_DATA} fill="#8884d8" shape="circle" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Submission Velocity (Existing) */}
                    <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm transition-all duration-300">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-[#01427a]" /> Submission Velocity
                            </h3>
                            <div className="flex items-center">
                                <TimeRangeSelector value={velocityRange} onChange={setVelocityRange} />
                                <MetricInfo 
                                    title="Submission Velocity" 
                                    description="Measures how early students submit work. Consistently early submissions correlate with higher confidence and better time-management skills." 
                                />
                            </div>
                        </div>
                        <p className="text-xs text-[#6c6c6c] mb-6">Days submitted relative to deadline. Positive = Early.</p>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={SUBMISSION_VELOCITY_DATA} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="submission" type="category" width={100} tick={{fontSize: 11}} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <ReferenceLine x={0} stroke="#000" />
                                    <Bar dataKey="days" name="Days Variance" radius={[0, 4, 4, 0]}>
                                        {SUBMISSION_VELOCITY_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.days < 0 ? '#ef4444' : entry.days === 0 ? '#f59e0b' : '#22c55e'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </div>
        )}

        {/* 4. COGNITIVE ANALYTICS TAB */}
        {activeTab === 'cognitive' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                    
                    {/* 1. Deep vs. Surface Learning (Navigation Linearity) */}
                    <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                                    <MapIcon className="w-5 h-5 mr-2 text-[#01b3ef]" /> 
                                    Navigation Linearity
                                    <div className="relative group/tooltip ml-2">
                                        <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 cursor-help transition-colors" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[100] pointer-events-none border border-slate-700 font-medium">
                                            Measures the "linearity" of movement through materials. High non-linearity suggests synthesis and deep learning, while pure linearity often indicates surface-level consumption.
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                                        </div>
                                    </div>
                                </h3>
                                <p className="text-xs text-[#6c6c6c] mt-1">
                                    <strong>Surface:</strong> Linear next-clicking. <br/>
                                    <strong>Deep:</strong> Non-linear synthesis (back-and-forth).
                                </p>
                            </div>
                        </div>
                        <div className="h-64 w-full flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={NAVIGATION_LINEARITY_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {NAVIGATION_LINEARITY_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                                <span className="text-lg font-bold text-[#01427a]">Deep<br/>Learner</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Submission Behaviors (Gaming vs Iteration) */}
                    <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                                    <Repeat className="w-5 h-5 mr-2 text-[#e14177]" /> 
                                    Submission Persistence
                                    <div className="relative group/tooltip ml-2">
                                        <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 cursor-help transition-colors" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[100] pointer-events-none border border-slate-700 font-medium text-center">
                                            Distinguishes between "Gaming" (rapid, low-effort retakes to find correct answers) and "Constructive Iteration" (reviewing feedback and studying before re-attempting).
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                                        </div>
                                    </div>
                                </h3>
                                <p className="text-xs text-[#6c6c6c] mt-1">
                                    Detecting "Gaming" (Rapid retakes) vs "Constructive Iteration" (Review then retake).
                                </p>
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={ATTEMPT_PATTERN_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="attempt" label={{ value: 'Attempt #', position: 'insideBottom', offset: -5, fontSize: 10 }} tick={{fontSize: 10}} />
                                    <YAxis label={{ value: 'Score %', angle: -90, position: 'insideLeft', fontSize: 10 }} tick={{fontSize: 10}} />
                                    <Tooltip 
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-white p-2 border border-[#afafaf] shadow-md rounded text-xs">
                                                        <p className="font-bold">Attempt {data.attempt}</p>
                                                        <p>Score: {data.score}%</p>
                                                        <p>Interval: {data.interval} mins</p>
                                                        <p className={`font-bold ${data.type === 'Gaming' ? 'text-red-500' : 'text-green-600'}`}>{data.type}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="score" barSize={30}>
                                        {ATTEMPT_PATTERN_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.type === 'Gaming' ? '#e14177' : '#22c55e'} />
                                        ))}
                                    </Bar>
                                    <Area type="monotone" dataKey="interval" fill="none" stroke="#01427a" strokeWidth={2} name="Review Time (min)" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 3. Response Time (TimeCost) */}
                    <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm lg:col-span-2">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                                    <MousePointerClick className="w-5 h-5 mr-2 text-purple-600" /> 
                                    Response Time (TimeCost)
                                    <div className="relative group/tooltip ml-2">
                                        <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 cursor-help transition-colors" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[100] pointer-events-none border border-slate-700 font-medium">
                                            Analyzes the hidden "time cost" of each question. Outliers help identify where students are guessing (unusually fast) or struggling (unusually slow) relative to difficulty.
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                                        </div>
                                    </div>
                                </h3>
                                <p className="text-xs text-[#6c6c6c] mt-1">
                                    Inferring cognitive engagement per question. <br/>
                                    <span className="text-red-500 font-bold">Short time = Guessing.</span> <span className="text-green-600 font-bold">Mid time = Optimal.</span> <span className="text-orange-500 font-bold">Long time = Struggle.</span>
                                </p>
                            </div>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" dataKey="question" name="Question" unit="#" tick={{fontSize: 10}} label={{ value: 'Question Sequence', position: 'bottom', offset: 0, fontSize: 12 }} />
                                    <YAxis type="number" dataKey="time" name="Time" unit="s" tick={{fontSize: 10}} label={{ value: 'Response Time (Seconds)', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    
                                    {/* Reference Lines for Zones */}
                                    <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Guessing Threshold', position: 'right', fontSize: 10, fill: '#ef4444' }} />
                                    <ReferenceLine y={90} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'Struggle Threshold', position: 'right', fontSize: 10, fill: '#f97316' }} />

                                    <Scatter name="Responses" data={RESPONSE_TIME_DATA} shape="circle">
                                        {RESPONSE_TIME_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.status === 'Guessing' ? '#ef4444' : entry.status === 'Struggle' ? '#f97316' : '#22c55e'} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        )}

        {/* 5. NEW: SOCIAL ANALYTICS TAB */}
        {activeTab === 'social' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Top Social KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                    <div className="bg-white p-4 rounded-xl border border-[#afafaf]/50 shadow-sm flex flex-col relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[#6c6c6c] uppercase">Network Status</span>
                            <MetricInfo 
                                title="Network Status" 
                                description="Indicates if the learner is socially integrated or an 'isolate'. Socially integrated students benefit from peer support and collaborative learning, which significantly boosts course completion rates." 
                            />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-extrabold text-[#0c0c0d]">Connected</span>
                            <Network className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-xs text-[#6c6c6c] mt-1">Not an Isolate</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#afafaf]/50 shadow-sm flex flex-col relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[#6c6c6c] uppercase">Degree Centrality</span>
                            <MetricInfo 
                                title="Degree Centrality" 
                                description="Measures the volume of direct peer interactions. High centrality identifies students who are key collaborators or information hubs, often reflecting deep subject mastery and leadership." 
                            />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-extrabold text-[#01b3ef]">High</span>
                            <Share2 className="w-5 h-5 text-[#01b3ef]" />
                        </div>
                        <span className="text-xs text-[#6c6c6c] mt-1">Interacts with many peers</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#afafaf]/50 shadow-sm flex flex-col relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[#6c6c6c] uppercase">Forum Posts</span>
                            <MetricInfo 
                                title="Forum Posts" 
                                description="Tracks academic contributions to discussion boards. Regular posting shows active cognitive engagement and the ability to articulate complex ideas, reinforcing the student's own retention." 
                            />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-extrabold text-[#0c0c0d]">42</span>
                            <MessageSquare className="w-5 h-5 text-[#8b5cf6]" />
                        </div>
                        <span className="text-xs text-[#6c6c6c] mt-1">Total Contributions</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#afafaf]/50 shadow-sm flex flex-col relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[#6c6c6c] uppercase">Avg Sentiment</span>
                            <MetricInfo 
                                title="Average Sentiment" 
                                description="Analyzes the emotional tone of written interactions. A positive sentiment is linked to a healthy learning mindset, while declining sentiment can be an early warning of frustration or dropout risk." 
                            />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-extrabold text-green-600">Positive</span>
                            <Smile className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-xs text-[#6c6c6c] mt-1">Emotional Tone</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* 1. Social Profile Radar (Network Dynamics) */}
                    <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm relative">
                        <button 
                            onClick={() => setActiveMetricModal('social')}
                            className="absolute top-4 right-4 p-1 rounded-full text-slate-300 hover:text-[#8b5cf6] hover:bg-[#8b5cf6]/10 transition-all z-10"
                            title="Learn more about Social Profile"
                        >
                            <Info className="w-5 h-5" />
                        </button>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                                    <Network className="w-5 h-5 mr-2 text-[#8b5cf6]" /> 
                                    Social Profile
                                </h3>
                                <p className="text-xs text-[#6c6c6c] mt-1">
                                    Learner's footprint within the class network.
                                </p>
                            </div>
                        </div>
                        <div className="h-64 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SOCIAL_PROFILE_DATA}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Learner"
                                        dataKey="A"
                                        stroke="#8b5cf6"
                                        fill="#8b5cf6"
                                        fillOpacity={0.3}
                                    />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 2. EVT Quality Analysis */}
                    <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm relative">
                        <button 
                            onClick={() => setActiveMetricModal('evt')}
                            className="absolute top-4 right-4 p-1 rounded-full text-slate-300 hover:text-[#01b3ef] hover:bg-[#01b3ef]/10 transition-all z-10"
                            title="Learn more about EVT"
                        >
                            <Info className="w-5 h-5" />
                        </button>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                                    <MessageSquare className="w-5 h-5 mr-2 text-[#01b3ef]" /> 
                                    Educationally Valuable Talk (EVT)
                                </h3>
                                <p className="text-xs text-[#6c6c6c] mt-1">
                                    Quality of interaction: Agreement vs. Synthesis.
                                </p>
                            </div>
                        </div>
                        <div className="h-64 w-full flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={EVT_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {EVT_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                                <span className="text-lg font-bold text-[#0c0c0d]">Quality<br/>Ratio</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Sentiment Trend */}
                    <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm lg:col-span-2 relative">
                        <button 
                            onClick={() => setActiveMetricModal('sentiment')}
                            className="absolute top-4 right-4 p-1 rounded-full text-slate-300 hover:text-green-600 hover:bg-green-600/10 transition-all z-10"
                            title="Learn more about Sentiment Analysis"
                        >
                            <Info className="w-5 h-5" />
                        </button>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                                    <Smile className="w-5 h-5 mr-2 text-green-600" /> 
                                    Sentiment Analysis Trend
                                </h3>
                                <p className="text-xs text-[#6c6c6c] mt-1">
                                    Tracking emotional tone over time to detect frustration. <span className="text-green-600 font-bold">Positive (&gt;0)</span> vs <span className="text-red-500 font-bold">Negative (&lt;0)</span>.
                                </p>
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={SENTIMENT_DATA}>
                                    <defs>
                                        <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tick={{fontSize: 10}} />
                                    <YAxis domain={[-1, 1]} tick={{fontSize: 10}} />
                                    <Tooltip />
                                    <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
                                    <Area type="monotone" dataKey="score" stroke="#22c55e" fillOpacity={1} fill="url(#colorSentiment)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        )}

        {/* AI REPORT MODAL */}
        {isReportModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
                    <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white shrink-0">
                        <div className="flex items-center">
                            <Bot className="w-6 h-6 mr-3" />
                            <div>
                                <h2 className="text-lg font-bold">AI Learning Insight</h2>
                                <p className="text-xs text-indigo-200">Automated synthesis for {LEARNER_DATA.name}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsReportModalOpen(false)} className="text-white/70 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="flex-1 p-6 overflow-y-auto">
                        {reportStep === 'select' ? (
                            <div className="space-y-6">
                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                                    <h3 className="font-bold text-indigo-900 mb-2">Configure Report Scope</h3>
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Target Qualification</label>
                                            <div className="relative">
                                                <select 
                                                    value={selectedQualId || ''}
                                                    onChange={(e) => setSelectedQualId(e.target.value)}
                                                    className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                                                >
                                                    <option value="" disabled>Select a qualification...</option>
                                                    {LEARNER_DATA.qualifications.map(q => (
                                                        <option key={q.id} value={q.id}>{q.title}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="w-4 h-4 text-indigo-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>
                                        
                                        {/* Performance/Risk Preview Snapshot */}
                                        {selectedQualId && (
                                            <div className="bg-white/80 rounded-xl p-3 border border-indigo-100/50 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        (selectedQual.progress < 30 && selectedQual.engagementIndex < 0.2) || selectedQual.engagementIndex < -0.3
                                                            ? 'bg-red-50 text-red-500' 
                                                            : selectedQual.progress > 70 
                                                              ? 'bg-emerald-50 text-emerald-500' 
                                                              : 'bg-indigo-50 text-indigo-500'
                                                    }`}>
                                                        {(selectedQual.progress < 30 && selectedQual.engagementIndex < 0.2) || selectedQual.engagementIndex < -0.3 ? (
                                                            <AlertTriangle className="w-5 h-5" />
                                                        ) : (
                                                            <CheckCircle className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Status Snapshot</div>
                                                        <div className="text-xs font-bold text-slate-700">
                                                            {(selectedQual.progress < 30 && selectedQual.engagementIndex < 0.2) || selectedQual.engagementIndex < -0.3 
                                                                ? 'At Risk / Needs Intervention' 
                                                                : 'Good Progress / On Track'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Progress</div>
                                                    <div className="text-xs font-bold text-indigo-600">{selectedQual.progress}% Velocity</div>
                                                </div>
                                            </div>
                                        )}

                                        <p className="text-[10px] text-indigo-700 font-medium">Generating report for learner <strong>{LEARNER_DATA.name}</strong> based on live interaction logs.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setReportOptions(prev => ({ ...prev, progress: !prev.progress }))}
                                        className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${reportOptions.progress ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${reportOptions.progress ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-sm text-slate-900 text-left">Progress Analytics</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">Completion rates, status, and assessment metrics.</div>
                                        </div>
                                    </button>

                                    <button 
                                        onClick={() => setReportOptions(prev => ({ ...prev, behavioral: !prev.behavioral }))}
                                        className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${reportOptions.behavioral ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${reportOptions.behavioral ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-sm text-slate-900 text-left">Behavioral Analytics</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">Login frequency, duration, and session regularity.</div>
                                        </div>
                                    </button>

                                    <button 
                                        onClick={() => setReportOptions(prev => ({ ...prev, cognitive: !prev.cognitive }))}
                                        className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${reportOptions.cognitive ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${reportOptions.cognitive ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <Brain className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-sm text-slate-900 text-left">Cognitive Analytics</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">Navigation linearity and submission pattern synthesis.</div>
                                        </div>
                                    </button>

                                    <button 
                                        onClick={() => setReportOptions(prev => ({ ...prev, social: !prev.social }))}
                                        className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${reportOptions.social ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${reportOptions.social ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-sm text-slate-900 text-left">Social Analytics</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">Network centrality, quality of contributions (EVT).</div>
                                        </div>
                                    </button>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-100 italic">
                                    <div className="text-[10px] text-slate-400 flex items-center">
                                        <Info className="w-3 h-3 mr-1" />
                                        Only selected sections will be processed by the AI.
                                    </div>
                                    <button 
                                        onClick={() => setReportOptions({ progress: true, behavioral: true, cognitive: true, social: true })}
                                        className="text-[10px] font-bold text-indigo-600 hover:underline"
                                    >
                                        Select All
                                    </button>
                                </div>
                            </div>
                        ) : isGenerating ? (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                <h3 className="text-lg font-bold text-[#0c0c0d]">Generating Insight...</h3>
                                <p className="text-sm text-[#6c6c6c]">Analyzing {selectedQual.title} metrics for {LEARNER_DATA.name}.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
                                    <p className="text-xs text-indigo-800">
                                        <strong>Note:</strong> This report for <strong>{LEARNER_DATA.name}</strong> was synthesized from selected metrics. Please review and edit before sharing with the learner.
                                    </p>
                                </div>
                                <textarea 
                                    className="w-full h-96 p-4 border border-[#afafaf] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono leading-relaxed resize-none"
                                    value={reportContent}
                                    onChange={(e) => setReportContent(e.target.value)}
                                ></textarea>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-[#afafaf]/20 bg-slate-50 flex justify-end gap-3 shrink-0">
                        {reportStep === 'select' ? (
                            <>
                                <button 
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="px-6 py-2.5 bg-white border border-[#afafaf] text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleGenerateReport}
                                    disabled={!Object.values(reportOptions).some(val => val)}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Generate AI Report
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={() => setReportStep('select')}
                                    disabled={isGenerating}
                                    className="px-4 py-2 bg-white border border-[#afafaf] text-[#6c6c6c] rounded-lg font-bold hover:bg-slate-100 transition-colors flex items-center"
                                >
                                    Change Options
                                </button>
                                <button 
                                    onClick={() => {navigator.clipboard.writeText(reportContent)}}
                                    disabled={isGenerating}
                                    className="px-4 py-2 bg-white border border-[#afafaf] text-[#6c6c6c] rounded-lg font-bold hover:bg-slate-100 transition-colors flex items-center"
                                >
                                    <Copy className="w-4 h-4 mr-2" /> Copy
                                </button>
                                <button 
                                    onClick={() => setIsReportModalOpen(false)}
                                    disabled={isGenerating}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center"
                                >
                                    <Save className="w-4 h-4 mr-2" /> Save to ILP
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* MESSAGING MODAL */}
        {isMessagingOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="w-full max-w-7xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-700/10">
                    <div className="flex-1 h-full min-h-0">
                        <Messaging 
                           initialTargetName={LEARNER_DATA.name} 
                           onClose={() => setIsMessagingOpen(false)} 
                        />
                    </div>
                </div>
            </div>
        )}

        {/* SELECTION WARNING MODAL */}
        {showQualWarning && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-300 border border-slate-200">
                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Selection Required</h3>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                        You need to select an active course that you want to write the report about. Please highlight a qualification first.
                    </p>
                    <button 
                        onClick={() => setShowQualWarning(false)}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition-all active:scale-95 transition-all"
                    >
                        Got it, thanks
                    </button>
                </div>
            </div>
        )}

        {/* METRIC INFO MODALS */}
        {activeMetricModal && (
            <MetricInfoModal 
                type={activeMetricModal} 
                onClose={() => setActiveMetricModal(null)} 
            />
        )}
    </div>
  );
};

// --- METRIC INFO MODAL COMPONENT ---
const MetricInfoModal: React.FC<{ 
    type: 'social' | 'evt' | 'sentiment', 
    onClose: () => void 
}> = ({ type, onClose }) => {
    
    // CONTENT REPOSITORY
    const CONTENT = {
        social: {
            title: "Understanding Social Profile",
            color: "text-[#8b5cf6]",
            bgColor: "bg-[#8b5cf6]",
            videoUrl: "https://player.vimeo.com/video/769798715",
            sections: {
                a: "The Social Profile metric maps a student's position within the learning community's network. It uses Social Network Analysis (SNA) metrics like Degree Centrality (total connections) and Brokerage (bridging different groups) to visualize how a student interacts with peers in forums and collaborative spaces.",
                b: "High social centrality often correlates with better learning outcomes as students exchange ideas and engage in peer teaching. Conversely, an 'isolate' profile (low centrality) can be a leading indicator of disengagement or a student who feels disconnected from the cohort, potentially increasing dropout risk.",
                c: "Compare this with Educational Value Talk (EVT). A student might be socially central (talking a lot) but have low EVT (not saying meaningful things). Or, a student with high Sentiment Analysis Trend but low Social Profile might be positive but shy, needing encouragement to lead.",
                d: "Assign the student to a small-group project, encourage them to 'reply to 2 peers' in discussion threads, or ask them to summarize a topic for the class to boost their brokerage score."
            }
        },
        evt: {
            title: "Understanding Educational Value Talk",
            color: "text-[#01b3ef]",
            bgColor: "bg-[#01b3ef]",
            videoUrl: "https://player.vimeo.com/video/769798715",
            sections: {
                a: "EVT measures the quality of a student's contributions. It distinguishes between simple social moves (agreement, off-topic) and 'High EVT' moves like synthesis (combining ideas), critical challenge (respectfully debating), and constructive questioning.",
                b: "High EVT scores indicate deep learning and higher-order thinking skills. It shows a student isn't just consuming information but is actively processing and applying it through collaborative knowledge construction.",
                c: "Read this alongside Sentiment Analysis Trend. If a student has high EVT but negative sentiment, they might be constructively critical and engaged but frustrated with the material. If they have high EVT and high Social Profile, they are likely a 'Peer Leader' in the cohort.",
                d: "Provide prompts that require more than one-word answers, model high EVT behaviors in your own posts, or offer specific feedback that praises their 'synthesis of peer ideas' to reinforce the behavior."
            }
        },
        sentiment: {
            title: "Understanding Sentiment Analysis Trend",
            color: "text-green-600",
            bgColor: "bg-green-600",
            videoUrl: "https://player.vimeo.com/video/769798715",
            sections: {
                a: "This metric uses Natural Language Processing (NLP) to track the emotional tone of a student’s written communications over time. It assigns a score from -1 (Extremely Negative) to +1 (Extremely Positive) to each post and plots the average trend.",
                b: "Emotions are critical to learning. A sharp downward trend in sentiment often precedes a drop in grades. It can detect 'frustration points' in the curriculum—tasks that are too difficult or unclear—before the student actually fails.",
                c: "Look for patterns where Sentiment falls while Submission Persistence (under Cognitive) rises; this indicates a student is working hard but becoming stressed. Combined with a low Social Profile, it suggests an isolated, struggling student who needs immediate support.",
                d: "Reach out with a 'check-in' message when you see a dip, simplify the instructions for the current unit, or offer a 1-on-1 support session to address the specific pain points causing the frustration."
            }
        }
    };

    const data = CONTENT[type];

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`${data.bgColor} px-6 py-5 flex justify-between items-center text-white shrink-0`}>
                    <div className="flex items-center">
                        <Info className="w-6 h-6 mr-3" />
                        <h2 className="text-xl font-black tracking-tight">{data.title}</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Video Player */}
                    <div className="aspect-video w-full bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200">
                        <iframe 
                            src={data.videoUrl} 
                            className="w-full h-full"
                            frameBorder="0" 
                            allow="autoplay; fullscreen; picture-in-picture" 
                            allowFullScreen
                            title={data.title}
                        ></iframe>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Section A: What It Is</h4>
                            <p className="text-slate-700 leading-relaxed font-medium">{data.sections.a}</p>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Section B: How It Relates to Learning</h4>
                            <p className="text-slate-700 leading-relaxed font-medium">{data.sections.b}</p>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Section C: Pattern Recognition (Multi-metric)</h4>
                            <p className="text-slate-700 leading-relaxed font-medium italic border-l-2 border-slate-100 pl-4 bg-slate-50 py-2 rounded-r-lg">{data.sections.c}</p>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Section D: Actionable Strategies</h4>
                            <p className="text-slate-700 leading-relaxed font-medium">{data.sections.d}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition-all"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssessorLearnerDetail;
