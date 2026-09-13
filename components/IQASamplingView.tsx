
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, CheckCircle, FileText, PlayCircle, Layers, BookOpen, Users, Search, ChevronRight, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import IQAReportForm from './IQAReportForm';

// --- MOCK DATA STRUCTURES ---

const COURSES = [
    { 
        id: 'c1', 
        title: 'Level 2 Gym Instructor',
        units: [
            { id: 'u1', title: 'Anatomy & Phys (L2)', type: 'MCQ', score: '90%' },
            { id: 'u2', title: 'Health & Safety', type: 'ShortAnswer' },
            { id: 'u3', title: 'Client Consultation', type: 'Document' },
            { id: 'u4', title: 'Gym Induction', type: 'Video' }
        ]
    },
    { 
        id: 'c2', 
        title: 'Level 3 Personal Training',
        units: [
            { id: 'u5', title: 'Adv Anatomy (L3)', type: 'MCQ', score: '88%' },
            { id: 'u6', title: 'Nutrition', type: 'MCQ', score: '92%' },
            { id: 'u7', title: 'Program Design', type: 'Document' },
            { id: 'u8', title: 'Delivering PT', type: 'Video' },
            { id: 'u9', title: 'Business Acumen', type: 'ShortAnswer' }
        ]
    },
    { 
        id: 'c3', 
        title: 'Level 4 Obesity & Diabetes',
        units: [
            { id: 'u10', title: 'Pathophysiology', type: 'MCQ', score: '85%' },
            { id: 'u11', title: 'Metabolic Programming', type: 'Document' },
            { id: 'u12', title: 'Client Risk Stratification', type: 'ShortAnswer' }
        ]
    }
];

const GROUPS = [
    { id: 'g1', name: 'Group A - Sept Intake' },
    { id: 'g2', name: 'Group B - Oct Intake' },
    { id: 'g3', name: 'Fast Track Cohort 1' }
];

const LEARNERS = [
    { id: 'l1', name: 'Abisha Akongo', status: 'Pending', groupId: 'g1', courseId: 'c2' },
    { id: 'l2', name: 'David Munoz Oroco', status: 'Completed', groupId: 'g1', courseId: 'c2' },
    { id: 'l3', name: 'Derrick Boateng', status: 'Pending', groupId: 'g2', courseId: 'c2' },
    { id: 'l4', name: 'Fatimah Mohammad', status: 'Pending', groupId: 'g3', courseId: 'c1' },
    { id: 'l5', name: 'Joshua Sellers', status: 'Submitted', groupId: 'g3', courseId: 'c1' },
    { id: 'l6', name: 'Naomi Crichlow', status: 'Pending', groupId: 'g1', courseId: 'c3' }
];

const IQASamplingView: React.FC = () => {
  const navigate = useNavigate();
  
  // -- Selection State --
  const [selectedCourseId, setSelectedCourseId] = useState(COURSES[1].id); // Default to L3 PT
  const [selectedGroupId, setSelectedGroupId] = useState('g1'); // Default to Group A
  const [selectedLearnerId, setSelectedLearnerId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  
  // View State: 'none' (split), 'left' (assessor expanded), 'right' (report expanded)
  const [expandedPanel, setExpandedPanel] = useState<'none' | 'left' | 'right'>('none');

  // -- Derived State & Helpers --
  
  const activeCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];
  
  // Filter Learners based on Course AND Group
  const filteredLearners = LEARNERS.filter(l => {
      const courseMatch = l.courseId === selectedCourseId;
      const groupMatch = selectedGroupId === 'all' || l.groupId === selectedGroupId;
      return courseMatch && groupMatch;
  });

  // Helper to get group name title
  const getGroupTitle = () => {
      if (selectedGroupId === 'all') return 'All Learners';
      const group = GROUPS.find(g => g.id === selectedGroupId);
      return group ? `${group.name} Learners` : 'Cohort Learners';
  };

  // Effect: Set default unit for the new course
  useEffect(() => {
      if (activeCourse.units.length > 0) {
          setSelectedUnitId(activeCourse.units[0].id);
      }
  }, [selectedCourseId]);

  const activeLearner = LEARNERS.find(l => l.id === selectedLearnerId);
  const activeUnit = activeCourse.units.find(u => u.id === selectedUnitId);

  const handleSubmit = () => {
      setTimeout(() => {
          navigate('/moderator-dashboard');
      }, 2000);
  };

  const handlePopOut = () => {
      // Open the report in a new window/tab
      const url = `#/moderator/report-standalone?learnerId=${selectedLearnerId}`;
      window.open(url, '_blank', 'width=1000,height=900,menubar=no,toolbar=no,location=no,status=no');
  };

  const renderEvidence = () => {
      if (!activeUnit) return <div className="p-8 text-center text-[#afafaf]">Select a unit to view evidence</div>;
      
      return (
          <div className="bg-white border border-[#afafaf]/50 rounded-lg p-6 shadow-sm flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 min-h-[300px]">
              {activeUnit.type === 'MCQ' ? (
                  <>
                    <div className="w-24 h-24 rounded-full border-4 border-[#01b3ef] flex items-center justify-center text-3xl font-bold text-[#01427a] mb-4">
                        {activeUnit.score || 'N/A'}
                    </div>
                    <h3 className="text-lg font-bold text-[#0c0c0d] mb-1">{activeUnit.title}</h3>
                    <p className="text-[#6c6c6c] text-sm">Automated Submission</p>
                    <div className="mt-4 flex items-center text-green-600 font-bold text-sm">
                        <CheckCircle className="w-4 h-4 mr-2" /> Passed on 12 Nov 2023
                    </div>
                  </>
              ) : activeUnit.type === 'Video' ? (
                  <div className="w-full h-full min-h-[300px] bg-black rounded-lg relative group overflow-hidden flex items-center justify-center">
                       <PlayCircle className="w-20 h-20 text-white opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer z-10" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                           <span className="text-white font-bold">{activeUnit.title}</span>
                           <span className="text-white/70 text-xs">Duration: 12:45 • Uploaded Nov 10</span>
                       </div>
                  </div>
              ) : activeUnit.type === 'Document' ? (
                  <>
                       <FileText className="w-16 h-16 text-[#afafaf] mb-4" />
                       <h3 className="font-bold text-[#0c0c0d]">{activeUnit.title}_Submission.pdf</h3>
                       <p className="text-sm text-[#6c6c6c] mb-6">2.4 MB • Uploaded 14 Nov 2023</p>
                       <button className="bg-[#01427a] text-white px-6 py-2 rounded-md font-bold hover:bg-[#003366] shadow-md">
                           Preview Document
                       </button>
                  </>
              ) : (
                   <div className="text-center">
                       <h3 className="font-bold text-[#0c0c0d]">{activeUnit.title}</h3>
                       <p className="text-sm text-[#6c6c6c] mt-2 italic">[Evidence Content Placeholder]</p>
                   </div>
              )}
          </div>
      );
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-row bg-slate-50 overflow-hidden">
      
      {/* ---------------------------------------------------------------------------
          LEFT COLUMN: ASSESSOR CONTEXT, FILTERS, AND LEARNER LIST / EVIDENCE
      --------------------------------------------------------------------------- */}
      <div className={`${expandedPanel === 'right' ? 'hidden' : expandedPanel === 'left' ? 'w-full' : 'w-5/12'} flex flex-col border-r border-[#afafaf]/30 bg-white h-full relative z-10 shadow-lg transition-all duration-300`}>
          
          {/* Top Section: Assessor & Filters (Always Visible) */}
          <div className="p-8 border-b border-[#afafaf]/30 shrink-0 bg-white relative">
              
              {/* MAXIMIZE / MINIMIZE BUTTON FOR ASSESSOR PANEL */}
              <button 
                onClick={() => setExpandedPanel(expandedPanel === 'left' ? 'none' : 'left')}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-[#6c6c6c] hover:text-[#01427a] transition-colors"
                title={expandedPanel === 'left' ? "Collapse View" : "Expand Assessor View"}
              >
                  {expandedPanel === 'left' ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>

              <button onClick={() => navigate('/moderator-dashboard')} className="mb-4 text-[#afafaf] hover:text-[#01427a] transition-colors flex items-center">
                  <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
              </button>
              
              <div className="mb-6">
                  <h1 className="text-3xl font-extrabold text-[#0c0c0d] tracking-tight leading-tight">Assessor: Sarah Connor</h1>
                  <p className="text-sm text-[#6c6c6c] mt-1">Reviewing submissions for {activeCourse.title}</p>
              </div>

              {/* Filters Stack */}
              <div className="space-y-4">
                  {/* Qualification Filter */}
                  <div>
                      <label className="block text-[10px] font-bold text-[#01427a] uppercase mb-1 tracking-wider flex items-center">
                          <BookOpen className="w-3 h-3 mr-1" /> Qualification
                      </label>
                      <div className="relative">
                          <select 
                              value={selectedCourseId}
                              onChange={(e) => setSelectedCourseId(e.target.value)}
                              className="w-full h-10 pl-3 pr-8 border border-[#afafaf] rounded-md text-sm font-medium text-[#0c0c0d] focus:ring-1 focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-slate-50 cursor-pointer shadow-sm appearance-none truncate"
                          >
                              {COURSES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                      </div>
                  </div>

                  {/* Cohort Group Filter */}
                  <div>
                      <label className="block text-[10px] font-bold text-[#01427a] uppercase mb-1 tracking-wider flex items-center">
                          <Layers className="w-3 h-3 mr-1" /> Cohort Group
                      </label>
                      <div className="relative">
                          <select 
                              value={selectedGroupId}
                              onChange={(e) => setSelectedGroupId(e.target.value)}
                              className="w-full h-10 pl-3 pr-8 border border-[#afafaf] rounded-md text-sm font-medium text-[#0c0c0d] focus:ring-1 focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-slate-50 cursor-pointer shadow-sm appearance-none truncate"
                          >
                              <option value="all">View All Cohorts</option>
                              {GROUPS.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                      </div>
                  </div>

                  {/* Individual Search */}
                  <div>
                      <label className="block text-[10px] font-bold text-[#01427a] uppercase mb-1 tracking-wider flex items-center">
                          <Users className="w-3 h-3 mr-1" /> Individual Search
                      </label>
                      <div className="relative">
                          <select 
                              value={selectedLearnerId}
                              onChange={(e) => setSelectedLearnerId(e.target.value)}
                              className="w-full h-10 pl-3 pr-8 border border-[#afafaf] rounded-md text-sm font-medium text-[#0c0c0d] focus:ring-1 focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-white cursor-pointer shadow-sm appearance-none truncate"
                          >
                              <option value="">-- Select or Search Learner --</option>
                              {filteredLearners.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                          </select>
                          <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                      </div>
                  </div>
              </div>
          </div>

          {/* Bottom Section: Swaps between List and Evidence View */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              
              {!selectedLearnerId ? (
                // MODE A: COHORT LIST
                <>
                    <div className="px-8 py-4 border-b border-[#afafaf]/10 shrink-0">
                        <h3 className="text-lg font-bold text-[#01427a] flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            {getGroupTitle()}
                        </h3>
                        <p className="text-xs text-[#6c6c6c] mt-1">Select a learner to view evidence and begin sampling.</p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-3">
                        {filteredLearners.length > 0 ? (
                            filteredLearners.map(learner => (
                                <div 
                                    key={learner.id}
                                    onClick={() => setSelectedLearnerId(learner.id)}
                                    className="bg-white border border-[#afafaf]/30 rounded-lg p-4 cursor-pointer transition-all flex items-center justify-between group hover:border-[#01b3ef] hover:shadow-sm"
                                >
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white mr-4 bg-[#01427a]">
                                            {learner.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0c0c0d] text-sm group-hover:text-[#01b3ef] transition-colors">{learner.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] bg-slate-100 text-[#6c6c6c] px-2 py-0.5 rounded border border-[#afafaf]/20">
                                                    {GROUPS.find(g => g.id === learner.groupId)?.name}
                                                </span>
                                                <span className="text-[10px] text-[#afafaf]">Status: {learner.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#afafaf] group-hover:text-[#01b3ef]" />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-[#afafaf]">No learners found in this group.</div>
                        )}
                    </div>
                </>
              ) : (
                // MODE B: LEARNER EVIDENCE VIEW (Drill Down)
                <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
                    <div className="px-8 py-4 border-b border-[#afafaf]/10 shrink-0 bg-slate-100">
                        <button 
                            onClick={() => setSelectedLearnerId('')}
                            className="text-xs font-bold text-[#6c6c6c] hover:text-[#01427a] flex items-center mb-3"
                        >
                            <ArrowLeft className="w-3 h-3 mr-1" /> Back to Learners
                        </button>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[#0c0c0d]">{activeLearner?.name}</h3>
                            <span className="text-xs font-bold bg-[#01b3ef] text-white px-2 py-1 rounded">Active Sampling</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Unit Selector */}
                        <div>
                            <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-2">Select Unit to Sample</label>
                            <div className="relative">
                                <select 
                                    value={selectedUnitId}
                                    onChange={(e) => setSelectedUnitId(e.target.value)}
                                    className="w-full h-10 pl-3 pr-8 border border-[#afafaf] rounded-md text-sm font-bold text-[#0c0c0d] focus:ring-1 focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-white cursor-pointer shadow-sm appearance-none"
                                >
                                    {activeCourse.units.map(u => (
                                        <option key={u.id} value={u.id}>{u.title} ({u.type})</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                            </div>
                        </div>

                        {/* Evidence Display Area */}
                        <div>
                            <h4 className="text-xs font-bold text-[#01427a] uppercase mb-2">Evidence Content</h4>
                            {renderEvidence()}
                        </div>
                    </div>
                </div>
              )}
          </div>
      </div>

      {/* ---------------------------------------------------------------------------
          RIGHT COLUMN: IQA REPORT FORM (Uses Shared Component)
      --------------------------------------------------------------------------- */}
      <div className={`${expandedPanel === 'left' ? 'hidden' : expandedPanel === 'right' ? 'w-full' : 'w-7/12'} flex flex-col bg-white h-full overflow-hidden transition-all duration-300`}>
          <IQAReportForm 
                learnerId={selectedLearnerId}
                onSubmit={handleSubmit}
                actions={
                    <>
                        <button 
                            onClick={handlePopOut}
                            className="p-2 hover:bg-slate-100 rounded-full text-[#6c6c6c] hover:text-[#01427a] transition-colors"
                            title="Pop Out (Open in New Window)"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setExpandedPanel(expandedPanel === 'right' ? 'none' : 'right')}
                            className="p-2 hover:bg-slate-100 rounded-full text-[#6c6c6c] hover:text-[#01427a] transition-colors"
                            title={expandedPanel === 'right' ? "Collapse View" : "Expand Report"}
                        >
                            {expandedPanel === 'right' ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                    </>
                }
          />
      </div>
    </div>
  );
};

export default IQASamplingView;
