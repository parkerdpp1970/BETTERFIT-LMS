
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Trash2, ArrowLeft, CreditCard, AlertTriangle, CheckCircle, Ban, Clock, MessageSquare, X, Send, Eye, MapPin, User, Shield, Brain, ChevronDown, ChevronUp, FileText, Calendar, AlertOctagon } from 'lucide-react';
import { MOCK_LEARNERS } from '../constants';
import { Learner, FinancialStatus, LearnerUnit } from '../types';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const LearnerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [learner, setLearner] = useState<Learner | null>(null);
  
  // Modal State
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [isFullProfileOpen, setIsFullProfileOpen] = useState(false);
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  
  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Full Profile Modal Tab State
  const [profileTab, setProfileTab] = useState<'personal' | 'address' | 'support' | 'enrollment'>('personal');

  // Accordion State for Progress
  const [expandedUnits, setExpandedUnits] = useState<string[]>([]);

  useEffect(() => {
    // Simulate fetching data
    const found = MOCK_LEARNERS.find(l => l.id === id);
    if (found) {
        setLearner(found);
        // Default expand first unit if available
        if (found.progressData && found.progressData.length > 0) {
            setExpandedUnits([found.progressData[0].id]);
        }
    }
  }, [id]);

  if (!learner) return <div className="p-8 text-center text-[#6c6c6c]">Loading Learner Data...</div>;

  const handleStatusChange = (status: FinancialStatus) => {
    setLearner({ ...learner, financialStatus: status });
  };

  const handleFinancialDetailChange = (field: keyof Learner, value: string | number) => {
      setLearner({ ...learner, [field]: value });
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      setMsgSent(true);
      setTimeout(() => {
          setMsgSent(false);
          setIsMsgModalOpen(false);
          setMsgSubject('');
          setMsgBody('');
      }, 2000);
  };

  const handleDeleteClick = () => {
      setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
      console.log('Deleting learner:', learner.id);
      setIsDeleteModalOpen(false);
      navigate('/dashboard');
  };

  const toggleUnit = (unitId: string) => {
      setExpandedUnits(prev => 
          prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
      );
  };

  return (
    <div className="space-y-6 relative pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-[#6c6c6c] hover:text-[#01427a] transition-colors"
        >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>
        <div className="space-x-2 flex items-center">
            <button 
                onClick={() => setIsMsgModalOpen(true)}
                className="px-4 py-2 bg-white text-[#01427a] border border-[#01427a] rounded-md hover:bg-[#01427a]/10 flex items-center transition-colors font-medium shadow-sm"
            >
                <MessageSquare className="w-4 h-4 mr-2" /> Send Message
            </button>
            <button 
                onClick={handleDeleteClick}
                className="px-4 py-2 bg-white text-[#e14177] rounded-md hover:bg-[#e14177]/10 border border-[#e14177] flex items-center transition-colors font-medium shadow-sm"
            >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
            </button>
            <button className="px-4 py-2 bg-[#01b3ef] text-white rounded-md hover:bg-[#01427a] flex items-center transition-colors font-bold shadow-md">
                <Save className="w-4 h-4 mr-2" /> Save Changes
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Brief Details & Full Edit */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Main Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#afafaf]/50 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-[#afafaf]/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-[#01427a]">{learner.firstName} {learner.lastName}</h2>
                        <p className="text-sm text-[#6c6c6c]">Learner ID: {learner.learnerNo}</p>
                    </div>
                    <button 
                        onClick={() => setIsFullProfileOpen(true)}
                        className="flex items-center px-4 py-2 bg-[#01427a] text-white rounded-md hover:bg-[#003366] text-sm font-bold shadow-sm transition-colors"
                    >
                        <Eye className="w-4 h-4 mr-2" /> View/Edit Full Profile
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Email</label>
                        <p className="text-sm text-[#0c0c0d]">{learner.email}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Phone</label>
                        <p className="text-sm text-[#0c0c0d]">{learner.phone}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Main Course</label>
                        <p className="text-sm text-[#0c0c0d]">{learner.mainCourse} ({learner.courseType})</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Assessor</label>
                        <p className="text-sm text-[#0c0c0d]">{learner.assessor}</p>
                    </div>
                    {learner.supportEnabled && (
                        <div className="md:col-span-2 bg-yellow-50 border border-yellow-200 p-3 rounded-md flex items-start">
                            <Brain className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                            <div>
                                <span className="block text-sm font-bold text-yellow-800">Learning Support Required</span>
                                <span className="text-xs text-yellow-700">See full profile for details.</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Course Progress Section (Drill Down) */}
            <div className="bg-white rounded-lg shadow-sm border border-[#afafaf]/50">
                <div className="bg-slate-50 px-6 py-4 border-b border-[#afafaf]/50">
                    <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-[#01b3ef]" />
                        Qualification & CPD Progress
                    </h3>
                </div>
                <div className="p-0">
                    {learner.progressData && learner.progressData.length > 0 ? (
                        <div className="divide-y divide-[#afafaf]/30">
                            {learner.progressData.map((unit) => {
                                const isExpanded = expandedUnits.includes(unit.id);
                                return (
                                    <div key={unit.id} className="group">
                                        {/* Unit Header */}
                                        <div 
                                            onClick={() => toggleUnit(unit.id)}
                                            className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-full ${unit.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {unit.status === 'Pass' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-[#0c0c0d]">{unit.name}</h4>
                                                    <p className="text-xs text-[#6c6c6c]">
                                                        Status: <span className={`font-bold ${unit.status === 'Pass' ? 'text-green-600' : 'text-blue-600'}`}>{unit.status}</span>
                                                        {unit.completionDate && ` • Completed: ${unit.completionDate}`}
                                                    </p>
                                                </div>
                                            </div>
                                            {isExpanded ? <ChevronUp className="w-5 h-5 text-[#afafaf]" /> : <ChevronDown className="w-5 h-5 text-[#afafaf]" />}
                                        </div>                                        {/* Nested Submissions */}
                                        {isExpanded && (
                                            <div className="bg-slate-50/50 px-6 pb-4 pt-2 border-t border-[#afafaf]/10 animate-in slide-in-from-top-1 duration-200">
                                                {unit.submissions.length > 0 ? (
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-left text-xs font-bold text-[#afafaf] uppercase py-2">Activity / Submission</th>
                                                                <th className="text-left text-xs font-bold text-[#afafaf] uppercase py-2">Type</th>
                                                                <th className="text-right text-xs font-bold text-[#afafaf] uppercase py-2">Result</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-[#afafaf]/10">
                                                            {unit.submissions.map(submission => (
                                                                <tr key={submission.id}>
                                                                    <td className="py-2 text-[#0c0c0d] font-medium">{submission.name}</td>
                                                                    <td className="py-2 text-[#6c6c6c] text-xs">{submission.type}</td>
                                                                    <td className="py-2 text-right">
                                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                                            submission.status === 'Passed' ? 'bg-green-100 text-green-800' : 
                                                                            submission.status === 'Pending' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'
                                                                        }`}>
                                                                            {submission.status} {submission.grade ? `(${submission.grade})` : ''}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p className="text-xs text-[#afafaf] italic">No submission data available for this unit.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-[#6c6c6c] italic">
                            No progress data found for this learner.
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Financial & Actions */}
        <div className="space-y-6">
            
            {/* Financial Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#afafaf]/50 p-6">
                <h3 className="text-lg font-bold text-[#0c0c0d] mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-[#01b3ef]" />
                    Financial Status
                </h3>
                
                <div className="text-center mb-6 p-4 bg-slate-50 rounded-lg border border-[#afafaf]/30">
                    <span className="block text-sm text-[#6c6c6c]">Balance Remaining</span>
                    <span className="block text-3xl font-extrabold text-[#0c0c0d]">£{learner.balance}</span>
                    {learner.paymentPlan && <span className="text-xs text-[#01b3ef] font-bold mt-1 block">{learner.paymentPlan}</span>}
                </div>

                <div className="space-y-2 mb-4">
                     <p className="text-xs font-semibold text-[#afafaf] uppercase tracking-wider mb-2">Account Status</p>
                    
                    {/* Status Buttons - Updated Logic & Colors */}
                    <div className="space-y-2">
                        {/* Clear (Green) */}
                        <button 
                            onClick={() => handleStatusChange(FinancialStatus.CLEAR)}
                            className={`w-full flex items-center justify-between px-4 py-2 border rounded-md transition-all text-sm font-bold ${
                                learner.financialStatus === FinancialStatus.CLEAR 
                                ? 'bg-green-600 border-green-600 text-white shadow-md' 
                                : 'bg-white border-[#afafaf] text-[#6c6c6c] hover:bg-slate-50'
                            }`}
                        >
                            <span>Clear</span>
                            {learner.financialStatus === FinancialStatus.CLEAR && <CheckCircle className="w-4 h-4" />}
                        </button>

                        {/* Arrears (Red) */}
                        <button 
                            onClick={() => handleStatusChange(FinancialStatus.ARREARS)}
                            className={`w-full flex items-center justify-between px-4 py-2 border rounded-md transition-all text-sm font-bold ${
                                learner.financialStatus === FinancialStatus.ARREARS 
                                ? 'bg-red-600 border-red-600 text-white shadow-md' 
                                : 'bg-white border-[#afafaf] text-[#6c6c6c] hover:bg-slate-50'
                            }`}
                        >
                            <span>Arrears</span>
                            {learner.financialStatus === FinancialStatus.ARREARS && <AlertTriangle className="w-4 h-4" />}
                        </button>

                        {/* On Hold (Neutral/Dark) */}
                        <button 
                            onClick={() => handleStatusChange(FinancialStatus.ON_HOLD)}
                            className={`w-full flex items-center justify-between px-4 py-2 border rounded-md transition-all text-sm font-bold ${
                                learner.financialStatus === FinancialStatus.ON_HOLD 
                                ? 'bg-slate-700 border-slate-700 text-white shadow-md' 
                                : 'bg-white border-[#afafaf] text-[#6c6c6c] hover:bg-slate-50'
                            }`}
                        >
                            <span>On Hold</span>
                            {learner.financialStatus === FinancialStatus.ON_HOLD && <Clock className="w-4 h-4" />}
                        </button>

                        {/* Debt Collectors (Black) */}
                        <button 
                            onClick={() => handleStatusChange(FinancialStatus.DEBT_COLLECTORS)}
                            className={`w-full flex items-center justify-between px-4 py-2 border rounded-md transition-all text-sm font-bold ${
                                learner.financialStatus === FinancialStatus.DEBT_COLLECTORS 
                                ? 'bg-black border-black text-white shadow-md' 
                                : 'bg-white border-[#afafaf] text-[#6c6c6c] hover:bg-slate-50'
                            }`}
                        >
                            <span>Debt Collectors</span>
                            {learner.financialStatus === FinancialStatus.DEBT_COLLECTORS && <AlertOctagon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Conditional Dynamic Details View */}
                
                {/* 1. CLEAR DETAILS */}
                {learner.financialStatus === FinancialStatus.CLEAR && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 animate-in fade-in slide-in-from-top-2 mt-4">
                        <h4 className="text-xs font-bold text-green-800 uppercase mb-2">Clearance Details</h4>
                        <div>
                            <label className="block text-xs text-green-700 mb-1">Date Cleared</label>
                            <input 
                                type="date" 
                                value={learner.clearDate || ''} 
                                onChange={(e) => handleFinancialDetailChange('clearDate', e.target.value)}
                                className="w-full border border-green-300 rounded p-2 text-sm bg-white focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>
                )}

                {/* 2. ARREARS DETAILS */}
                {learner.financialStatus === FinancialStatus.ARREARS && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 animate-in fade-in slide-in-from-top-2 mt-4">
                        <h4 className="text-xs font-bold text-red-600 uppercase mb-2">Arrears Details</h4>
                        <div>
                            <label className="block text-xs text-red-700 mb-1">Months in Arrears</label>
                            <input 
                                type="number" 
                                value={learner.arrearsMonths || 0} 
                                onChange={(e) => handleFinancialDetailChange('arrearsMonths', parseInt(e.target.value))}
                                className="w-full border border-red-300 rounded p-2 text-sm bg-white focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                    </div>
                )}

                {/* 3. ON HOLD DETAILS */}
                {learner.financialStatus === FinancialStatus.ON_HOLD && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-[#afafaf]/20 animate-in fade-in slide-in-from-top-2 mt-4">
                        <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Hold Details</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-[#6c6c6c] mb-1">Date put on hold</label>
                                <input 
                                    type="date" 
                                    value={learner.onHoldDate || ''} 
                                    onChange={(e) => handleFinancialDetailChange('onHoldDate', e.target.value)}
                                    className="w-full border border-slate-300 rounded p-2 text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#6c6c6c] mb-1">Expected Resume Date</label>
                                <input 
                                    type="date" 
                                    value={learner.resumeDate || ''} 
                                    onChange={(e) => handleFinancialDetailChange('resumeDate', e.target.value)}
                                    className="w-full border border-slate-300 rounded p-2 text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#6c6c6c] mb-1">Authorized By (Staff Name)</label>
                                <input 
                                    type="text" 
                                    value={learner.onHoldBy || ''} 
                                    onChange={(e) => handleFinancialDetailChange('onHoldBy', e.target.value)}
                                    placeholder="e.g. Sam Admin"
                                    className="w-full border border-slate-300 rounded p-2 text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#6c6c6c] mb-1">Hold Notes</label>
                                <textarea 
                                    value={learner.onHoldNotes || ''} 
                                    onChange={(e) => handleFinancialDetailChange('onHoldNotes', e.target.value)}
                                    rows={2}
                                    className="w-full border border-slate-300 rounded p-2 text-sm bg-white resize-none"
                                    placeholder="Reason for hold..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. DEBT COLLECTOR DETAILS */}
                {learner.financialStatus === FinancialStatus.DEBT_COLLECTORS && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-[#afafaf]/20 animate-in fade-in slide-in-from-top-2 mt-4">
                        <h4 className="text-xs font-bold text-black uppercase mb-2">Collection Status</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-[#6c6c6c] mb-1">Communication Sent Date</label>
                                <input 
                                    type="date" 
                                    value={learner.debtCollectorSentDate || ''} 
                                    onChange={(e) => handleFinancialDetailChange('debtCollectorSentDate', e.target.value)}
                                    className="w-full border border-[#afafaf] rounded p-2 text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#6c6c6c] mb-1">Clear Date / Resolution</label>
                                <input 
                                    type="date" 
                                    value={learner.debtCollectorClearDate || ''} 
                                    onChange={(e) => handleFinancialDetailChange('debtCollectorClearDate', e.target.value)}
                                    className="w-full border border-[#afafaf] rounded p-2 text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#6c6c6c] mb-1">Additional Notes</label>
                                <textarea 
                                    value={learner.debtCollectorNotes || ''} 
                                    onChange={(e) => handleFinancialDetailChange('debtCollectorNotes', e.target.value)}
                                    rows={2}
                                    className="w-full border border-[#afafaf] rounded p-2 text-sm bg-white resize-none"
                                    placeholder="Case reference, agency details..."
                                />
                            </div>
                            <div className="p-2 bg-black text-white rounded text-xs font-medium flex items-center">
                                <AlertOctagon className="w-3 h-3 mr-1" /> External agency engaged.
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Admin Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-[#afafaf]/50 p-6">
                <h3 className="text-lg font-bold text-[#0c0c0d] mb-4">Admin Notes</h3>
                <div className="space-y-4">
                    <div className="bg-[#6dcffb]/10 p-3 rounded text-sm text-[#0c0c0d] border border-[#6dcffb]/30">
                        <p className="font-semibold text-xs text-[#01427a] mb-1">10 Oct 2023 - Sam Admin</p>
                        Learner requested extension for L3 Anatomy exam. Granted until Nov 1st.
                    </div>
                     <div className="bg-slate-50 p-3 rounded text-sm text-[#6c6c6c] border border-slate-100">
                        <p className="font-semibold text-xs text-[#afafaf] mb-1">15 Sep 2023 - System</p>
                        Learner registration completed. Welcome pack sent.
                    </div>
                    <textarea 
                        className="w-full border border-[#afafaf] rounded-md p-2 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef]" 
                        rows={3} 
                        placeholder="Add a new note..."
                    ></textarea>
                    <button className="w-full bg-[#01427a] text-white py-2 rounded-md text-sm hover:bg-[#003366] transition-colors">Add Note</button>
                </div>
            </div>

        </div>
      </div>

      {/* --- FULL PROFILE MODAL (Mirrors Add User) --- */}
      {isFullProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
                  
                  {/* Header */}
                  <div className="bg-[#01427a] px-6 py-4 flex justify-between items-center shrink-0">
                      <div className="flex items-center text-white">
                          <User className="w-6 h-6 mr-3 text-[#6dcffb]" />
                          <div>
                              <h2 className="text-xl font-bold">Learner Full Profile</h2>
                              <p className="text-xs text-[#6dcffb] opacity-80">Viewing all registered details</p>
                          </div>
                      </div>
                      <button onClick={() => setIsFullProfileOpen(false)} className="text-white/70 hover:text-white transition-colors">
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-[#afafaf]/30 bg-slate-50 shrink-0">
                      <button 
                        onClick={() => setProfileTab('personal')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${profileTab === 'personal' ? 'border-[#01b3ef] text-[#01b3ef] bg-white' : 'border-transparent text-[#6c6c6c] hover:bg-white'}`}
                      >
                          Personal Details
                      </button>
                      <button 
                        onClick={() => setProfileTab('address')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${profileTab === 'address' ? 'border-[#01b3ef] text-[#01b3ef] bg-white' : 'border-transparent text-[#6c6c6c] hover:bg-white'}`}
                      >
                          Location
                      </button>
                      <button 
                        onClick={() => setProfileTab('support')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${profileTab === 'support' ? 'border-[#01b3ef] text-[#01b3ef] bg-white' : 'border-transparent text-[#6c6c6c] hover:bg-white'}`}
                      >
                          Support & Needs
                      </button>
                      <button 
                        onClick={() => setProfileTab('enrollment')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${profileTab === 'enrollment' ? 'border-[#01b3ef] text-[#01b3ef] bg-white' : 'border-transparent text-[#6c6c6c] hover:bg-white'}`}
                      >
                          Enrollment & System
                      </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-8 bg-white">
                      
                      {profileTab === 'personal' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-2 duration-300">
                              <div>
                                  <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">First Name</label>
                                  <input type="text" defaultValue={learner.firstName} className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Last Name</label>
                                  <input type="text" defaultValue={learner.lastName} className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Middle Name</label>
                                  <input type="text" defaultValue={learner.middleName} placeholder="-" className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Date of Birth</label>
                                  <input type="date" defaultValue={learner.dob} className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Gender</label>
                                  <input type="text" defaultValue={learner.gender} className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Email</label>
                                  <input type="email" defaultValue={learner.email} className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Phone</label>
                                  <input type="tel" defaultValue={learner.phone} className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                              </div>
                              <div className="md:col-span-2 border-t border-[#afafaf]/20 mt-4 pt-4">
                                  <h4 className="font-bold text-[#01427a] mb-3">Emergency Contact</h4>
                                  <div className="grid grid-cols-2 gap-6">
                                      <div>
                                          <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Contact Name</label>
                                          <input type="text" defaultValue={learner.emergencyContactName} placeholder="Not provided" className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Contact Number</label>
                                          <input type="tel" defaultValue={learner.emergencyContactNumber} placeholder="Not provided" className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {profileTab === 'address' && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 max-w-2xl mx-auto">
                              <div>
                                  <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Street Address</label>
                                  <input type="text" defaultValue={learner.address} className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                  <div>
                                      <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">City / Town</label>
                                      <input type="text" defaultValue={learner.city} className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Postcode</label>
                                      <input type="text" defaultValue={learner.postcode} className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Country</label>
                                  <input type="text" defaultValue={learner.country} className="w-full border border-[#afafaf] rounded p-2.5 bg-slate-50 text-sm" />
                              </div>
                          </div>
                      )}

                      {profileTab === 'support' && (
                          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                              <div className={`p-6 rounded-lg border mb-6 ${learner.supportEnabled ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-[#afafaf]/20'}`}>
                                  <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center">
                                          <Brain className={`w-6 h-6 mr-3 ${learner.supportEnabled ? 'text-yellow-600' : 'text-[#afafaf]'}`} />
                                          <div>
                                              <h3 className={`font-bold text-lg ${learner.supportEnabled ? 'text-yellow-800' : 'text-[#6c6c6c]'}`}>
                                                  {learner.supportEnabled ? 'Learning Support Active' : 'No Learning Support Declared'}
                                              </h3>
                                          </div>
                                      </div>
                                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${learner.supportEnabled ? 'bg-yellow-200 text-yellow-800' : 'bg-slate-200 text-[#6c6c6c]'}`}>
                                          {learner.supportEnabled ? 'Enabled' : 'Disabled'}
                                      </div>
                                  </div>
                                  
                                  {learner.supportEnabled && (
                                      <div className="space-y-4">
                                          <div>
                                              <label className="block text-xs font-bold text-yellow-700 uppercase mb-1">Support Notes & Adjustments</label>
                                              <textarea 
                                                  readOnly 
                                                  rows={4} 
                                                  className="w-full border border-yellow-300 bg-yellow-100/50 rounded-lg p-3 text-sm text-yellow-900 resize-none focus:ring-0"
                                                  value={learner.supportNotes}
                                              ></textarea>
                                          </div>
                                          <div className="flex gap-2">
                                              <span className="text-xs bg-white border border-yellow-300 text-yellow-700 px-3 py-1 rounded-full">Extra Time</span>
                                              <span className="text-xs bg-white border border-yellow-300 text-yellow-700 px-3 py-1 rounded-full">Reader Pens</span>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                      )}

                      {profileTab === 'enrollment' && (
                          <div className="animate-in fade-in slide-in-from-right-2 duration-300 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="bg-slate-50 p-4 rounded-lg border border-[#afafaf]/20">
                                      <h4 className="font-bold text-[#01427a] mb-4 border-b border-[#afafaf]/20 pb-2">Course Details</h4>
                                      <div className="space-y-4">
                                          <div>
                                              <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Course Package</label>
                                              <p className="font-bold text-[#0c0c0d]">{learner.courseType} - {learner.mainCourse}</p>
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Enrollment Date</label>
                                              <p className="text-sm text-[#0c0c0d]">{learner.enrollmentDate}</p>
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Learner Type</label>
                                              <p className="text-sm text-[#0c0c0d]">{learner.learnerType || 'Standard'}</p>
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Region</label>
                                              <p className="text-sm text-[#0c0c0d]">{learner.region || 'Not set'}</p>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="bg-slate-50 p-4 rounded-lg border border-[#afafaf]/20">
                                      <h4 className="font-bold text-[#01427a] mb-4 border-b border-[#afafaf]/20 pb-2">System Audit</h4>
                                      <div className="space-y-4">
                                          <div>
                                              <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Added By</label>
                                              <div className="flex items-center mt-1">
                                                  <Shield className="w-4 h-4 mr-2 text-[#01b3ef]" />
                                                  <p className="font-bold text-[#0c0c0d]">{learner.addedBy || 'System Admin'}</p>
                                              </div>
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Assigned Assessor</label>
                                              <div className="flex items-center mt-1">
                                                  <User className="w-4 h-4 mr-2 text-[#01b3ef]" />
                                                  <p className="font-bold text-[#0c0c0d]">{learner.assessor}</p>
                                              </div>
                                              <p className="text-xs text-[#6c6c6c] ml-6">{learner.assessorEmail || 'email@example.com'}</p>
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Candidate Number</label>
                                              <p className="font-mono text-sm bg-white border border-[#afafaf]/30 px-2 py-1 rounded inline-block text-[#0c0c0d]">{learner.learnerNo}</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                  </div>

                  {/* Footer Actions */}
                  <div className="p-6 border-t border-[#afafaf]/20 bg-slate-50 flex justify-end gap-3 shrink-0">
                      <button 
                          onClick={() => setIsFullProfileOpen(false)}
                          className="px-6 py-2 border border-[#afafaf] text-[#6c6c6c] rounded-lg font-bold hover:bg-white transition-colors"
                      >
                          Close
                      </button>
                      <button className="px-6 py-2 bg-[#01b3ef] text-white rounded-lg font-bold hover:bg-[#01427a] transition-colors shadow-md">
                          Save Changes
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Send Message Modal */}
      {isMsgModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="bg-[#01427a] px-6 py-4 flex justify-between items-center">
                      <h2 className="text-lg font-bold text-white flex items-center">
                          <Send className="w-5 h-5 mr-2 text-[#6dcffb]" /> Send Message
                      </h2>
                      <button onClick={() => setIsMsgModalOpen(false)} className="text-white/70 hover:text-white">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <form onSubmit={handleSendMessage} className="p-6 space-y-4">
                      {msgSent ? (
                           <div className="flex flex-col items-center justify-center py-8 text-green-600 animate-in fade-in">
                               <CheckCircle className="w-12 h-12 mb-2" />
                               <p className="font-bold">Message Sent Successfully!</p>
                           </div>
                      ) : (
                          <>
                              <div className="p-3 bg-slate-50 border border-[#afafaf]/30 rounded text-sm">
                                  <span className="text-[#6c6c6c] font-bold">To:</span> {learner.firstName} {learner.lastName} <span className="text-[#afafaf]">({learner.email})</span>
                              </div>
                              
                              <div>
                                  <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Subject</label>
                                  <input 
                                      type="text" 
                                      required
                                      value={msgSubject}
                                      onChange={(e) => setMsgSubject(e.target.value)}
                                      className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" 
                                      placeholder="e.g. Submission Feedback"
                                  />
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Message</label>
                                  <textarea 
                                      required
                                      rows={6}
                                      value={msgBody}
                                      onChange={(e) => setMsgBody(e.target.value)}
                                      className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef] resize-none" 
                                      placeholder="Type your message here..."
                                  ></textarea>
                              </div>
                              
                              <div className="pt-2 flex justify-end gap-3">
                                  <button 
                                      type="button" 
                                      onClick={() => setIsMsgModalOpen(false)}
                                      className="px-4 py-2 border border-[#afafaf] text-[#6c6c6c] rounded-md font-bold hover:bg-slate-50"
                                  >
                                      Cancel
                                  </button>
                                  <button 
                                      type="submit" 
                                      className="px-6 py-2 bg-[#01b3ef] text-white rounded-md font-bold hover:bg-[#01427a] shadow-md flex items-center"
                                  >
                                      <Send className="w-4 h-4 mr-2" /> Send
                                  </button>
                              </div>
                          </>
                      )}
                  </form>
              </div>
          </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            itemName={`${learner.firstName} ${learner.lastName}`}
      />
    </div>
  );
};

export default LearnerProfile;
