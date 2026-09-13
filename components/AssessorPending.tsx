import React, { useState } from 'react';
import { 
    Clock, ChevronRight, Filter, ArrowUpDown, 
    CheckCircle, RotateCcw, FileText, Video, 
    Download, Send, Paperclip, Check, MoreHorizontal, BookOpen
} from 'lucide-react';

interface Submission {
    id: string;
    learnerName: string;
    learnerInitial: string;
    avatarColor: string;
    taskTitle: string;
    submittedDate: string;
    type: 'text' | 'video' | 'pdf';
    status: 'pending' | 'done';
    statusIcon?: 'check' | 'retry';
    content?: string;
    mediaUrl?: string;
    transcript?: string;
}

const MOCK_DATA: Submission[] = [
    { 
        id: '1', 
        learnerName: 'Tyriq Delpratt', 
        learnerInitial: 'TD',
        avatarColor: 'bg-indigo-600',
        taskTitle: 'Level 2 Summative: Resistance Machine',
        submittedDate: 'Mar 16, 2026, 12:37 PM',
        type: 'text',
        status: 'pending',
        statusIcon: 'retry',
        content: `One area I’d like to improve is my confidence with programme design...`
    },
    { 
        id: '2', 
        learnerName: 'Alex Knight', 
        learnerInitial: 'AK',
        avatarColor: 'bg-[#10b981]',
        taskTitle: 'Level 2 Summative: 2 Dynamic Stretches',
        submittedDate: 'Mar 16, 2026, 12:31 PM',
        type: 'video',
        status: 'pending',
        statusIcon: 'retry',
        mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop'
    },
    { 
        id: '3', 
        learnerName: 'Emma Collins', 
        learnerInitial: 'EC',
        avatarColor: 'bg-blue-600',
        taskTitle: 'Explain how you would protect yourself from accusati...',
        submittedDate: 'Yesterday at 9:51 PM',
        type: 'text',
        status: 'done',
        statusIcon: 'check',
        content: 'I would always ensure there is clear communication and documentation...'
    },
    { 
        id: '4', 
        learnerName: 'Alex Knight', 
        learnerInitial: 'AK',
        avatarColor: 'bg-teal-600',
        taskTitle: "What is your client's main outcome goal (long term 6-...",
        submittedDate: 'Yesterday at 12:27 PM',
        type: 'text',
        status: 'done',
        statusIcon: 'check'
    },
    { 
        id: '5', 
        learnerName: 'Tyriq Delpratt', 
        learnerInitial: 'TD',
        avatarColor: 'bg-purple-600',
        taskTitle: 'Level 2 Gym Instructing: Programme Card',
        submittedDate: 'Apr 23, 2026, 8:36 PM',
        type: 'text',
        status: 'done',
        statusIcon: 'retry'
    },
    { 
        id: '6', 
        learnerName: 'Brenda Boyd', 
        learnerInitial: 'BB',
        avatarColor: 'bg-violet-600',
        taskTitle: 'Main Session: Resistance Exercise(s) and Method(s)',
        submittedDate: 'Apr 22, 2026, 12:39 PM',
        type: 'text',
        status: 'done',
        statusIcon: 'check'
    }
];

const AssessorPending: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'pending' | 'done'>('pending');
    const [selectedId, setSelectedId] = useState<string>(MOCK_DATA[0].id);
    const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);
    const [feedback, setFeedback] = useState('');

    const pendingSubmissions = MOCK_DATA.filter(s => s.status === 'pending');
    const doneSubmissions = MOCK_DATA.filter(s => s.status === 'done');
    const activeSubmission = MOCK_DATA.find(s => s.id === selectedId) || MOCK_DATA[0];

    const SubmissionItem = ({ submission }: { submission: Submission, key?: string }) => (
        <button
            onClick={() => setSelectedId(submission.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                selectedId === submission.id ? 'bg-slate-100/80 shadow-inner ring-1 ring-slate-200' : 'hover:bg-slate-50'
            }`}
        >
            <div className="relative shrink-0">
                <div className={`w-14 h-14 rounded-full ${submission.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white`}>
                    {submission.learnerInitial}
                </div>
                <div className="absolute -right-1 -bottom-1 scale-110 translate-x-[2px] translate-y-[2px]">
                    {submission.statusIcon === 'check' ? (
                        <div className="bg-emerald-500 rounded-full p-0.5 border-2 border-white shadow-sm flex items-center justify-center w-6 h-6">
                            <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                        </div>
                    ) : (
                        <div className="bg-amber-400 rounded-full p-0.5 border-2 border-white shadow-sm flex items-center justify-center w-6 h-6">
                            <RotateCcw className="w-3.5 h-3.5 text-white stroke-[3px]" />
                        </div>
                    )}
                </div>
            </div>
            <div className="text-left min-w-0">
                <h4 className="text-[15px] font-bold text-slate-800 truncate leading-[1.2] mb-1.5">
                    {submission.taskTitle}
                </h4>
                <p className="text-xs text-slate-400 font-bold tracking-tight">
                    {submission.submittedDate}
                </p>
            </div>
        </button>
    );

    return (
        <div className="flex h-[calc(100vh-80px)] -m-8 overflow-hidden bg-white">
            {/* LEFT PANEL - Accordion Sidebar */}
            <div className="w-[420px] flex-shrink-0 border-r border-slate-100 flex flex-col bg-white">
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[#F8FAFC]/30">
                    
                    {/* PENDING SECTION */}
                    <div className="space-y-4">
                        <button 
                            onClick={() => setActiveSection('pending')}
                            className={`w-full text-left p-7 rounded-[2rem] transition-all duration-500 border relative group shadow-sm ${
                                activeSection === 'pending' 
                                ? 'bg-white border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] z-10' 
                                : 'bg-white border-slate-100 hover:shadow-md'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pending</h2>
                                        <Clock className="w-4.5 h-4.5 text-slate-400" />
                                    </div>
                                    <p className="text-[13px] text-slate-400 font-bold tracking-tight">5 learner submissions ready for review</p>
                                </div>
                                <ChevronRight className={`w-6 h-6 text-slate-300 transition-transform duration-500 ${activeSection === 'pending' ? 'rotate-[-90deg]' : 'rotate-0'}`} />
                            </div>
                        </button>

                        <div className={`transition-all duration-500 overflow-hidden ${activeSection === 'pending' ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_15px_50px_-20px_rgba(0,0,0,0.08)] p-6">
                                <div className="flex gap-3 mb-8">
                                    <button className="flex items-center gap-2.5 px-5 py-3 border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
                                        <Filter className="w-4 h-4" /> Filter
                                    </button>
                                    <button className="flex items-center gap-2.5 px-5 py-3 border border-slate-200 rounded-2xl text-[13px] font-bold text-amber-500 hover:bg-slate-50 transition-all shadow-sm group">
                                        <ArrowUpDown className="w-4 h-4" /> <span className="group-hover:text-amber-600">Session</span>
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {pendingSubmissions.map(s => <SubmissionItem key={s.id} submission={s} />)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DONE SECTION */}
                    <div className="space-y-4">
                        <button 
                            onClick={() => setActiveSection('done')}
                            className={`w-full text-left p-7 rounded-[2rem] transition-all duration-500 border relative group shadow-sm ${
                                activeSection === 'done' 
                                ? 'bg-white border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] z-10' 
                                : 'bg-slate-50 border-slate-100 hover:bg-slate-100 transition-colors'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-slate-900 tracking-tight text-slate-700">Done</h2>
                                        <div className="bg-slate-200/40 p-1.5 rounded-lg">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-slate-400 font-bold tracking-tight">5,248 submissions reviewed</p>
                                </div>
                                <ChevronRight className={`w-6 h-6 text-slate-300 transition-transform duration-500 ${activeSection === 'done' ? 'rotate-[-90deg]' : 'rotate-0'}`} />
                            </div>
                        </button>

                        <div className={`transition-all duration-500 overflow-hidden ${activeSection === 'done' ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_15px_50px_-20px_rgba(0,0,0,0.08)] p-6">
                                <div className="flex gap-3 mb-8">
                                    <button className="flex items-center gap-2.5 px-5 py-3 border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
                                        <Filter className="w-4 h-4" /> Filter
                                    </button>
                                    <button className="flex items-center gap-2.5 px-5 py-3 border border-slate-200 rounded-2xl text-[13px] font-bold text-amber-500 hover:bg-slate-50 transition-all shadow-sm group">
                                        <ArrowUpDown className="w-4 h-4" /> <span className="group-hover:text-amber-600">Session</span>
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {doneSubmissions.map(s => <SubmissionItem key={s.id} submission={s} />)}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* RIGHT PANEL - Viewer */}
            <div className="flex-1 flex flex-col bg-[#F8FAFC]/50 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-12 space-y-12 pb-32">
                    <div className="space-y-12">
                        {/* Header Info */}
                        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-[1.5rem] ${activeSubmission.avatarColor} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                                        {activeSubmission.learnerInitial}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-extrabold text-slate-900">{activeSubmission.learnerName}</h3>
                                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">tyriqdelpratt@gmail.com</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-[0.2em]">Answered to this question</p>
                                    </div>
                                </div>
                                <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100">
                                    <MoreHorizontal className="w-6 h-6" />
                                </button>
                             </div>

                             <div className="space-y-4 pb-8 border-b border-slate-100">
                                <p className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-[0.3em]">Task Descriptor</p>
                                <p className="text-sm font-bold text-slate-500 italic bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    From the topics covered in this unit, choose one area where you would like to improve your confidence. In your answer, please include:
                                </p>
                             </div>

                             {/* Content Render */}
                             <div className="mt-10">
                                {activeSubmission.type === 'text' ? (
                                    <div className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
                                        {activeSubmission.content}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden relative group border-8 border-slate-50 shadow-2xl">
                                            <img src={activeSubmission.mediaUrl} className="w-full h-full object-cover opacity-60" alt="" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <button className="w-20 h-20 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/30 transition-all scale-95 hover:scale-105 active:scale-95 shadow-2xl">
                                                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-white border-b-[12px] border-b-transparent ml-2" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <button className="text-xs font-bold text-slate-500 flex items-center gap-1.5 hover:text-[#8B5CF6]">
                                                <Download className="w-4 h-4" /> Download transcript
                                            </button>
                                            <button 
                                                onClick={() => setIsTranscriptVisible(!isTranscriptVisible)}
                                                className="text-xs font-bold text-amber-600 flex items-center gap-2 py-2 px-4 border border-amber-200 rounded-xl bg-amber-50 hover:bg-amber-100"
                                            >
                                                {isTranscriptVisible ? 'Hide transcript' : 'Show transcript'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                             </div>

                             {/* Marking Area */}
                             <div className="mt-16 pt-16 border-t border-slate-100 flex flex-col md:flex-row gap-6">
                                <button className="flex-1 flex items-center justify-center gap-3 py-6 border-2 border-amber-200 bg-amber-50/30 text-amber-800 rounded-[2rem] text-base font-bold hover:bg-amber-50 transition-all">
                                    <RotateCcw className="w-5 h-5" /> Ask to retry / Refer
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-3 py-6 bg-[#EAB308] text-white rounded-[2rem] text-base font-bold shadow-xl shadow-amber-200 hover:bg-[#CA8A04] transition-all hover:scale-105 active:scale-95">
                                    <CheckCircle className="w-5 h-5" /> Validate / Pass
                                </button>
                             </div>

                             {/* Feedback Area */}
                             <div className="mt-16 space-y-6">
                                <h4 className="text-xl font-bold text-slate-900">Feedback</h4>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                    Provide general comments to the learner. Your validation decision alongside this feedback will determine if they move forward in their unit.
                                </p>
                                <div className="relative">
                                    <textarea 
                                        className="w-full h-40 p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-[#8B5CF6]/5 focus:border-[#8B5CF6] outline-none transition-all resize-none text-base font-medium placeholder:text-slate-300"
                                        placeholder={`General feedback to ${activeSubmission.learnerName}...`}
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    />
                                    <div className="absolute bottom-6 right-6">
                                        <button 
                                            disabled={!feedback}
                                            className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${
                                                feedback ? 'bg-[#8B5CF6] text-white shadow-lg shadow-violet-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            Send Feedback
                                        </button>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Journal Section */}
                        <div className="space-y-8 pt-10 border-t border-slate-200">
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">Exchange forum</span>
                             </div>

                             <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                                 <div className="mb-8">
                                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Saved shortcuts</label>
                                     <div className="relative">
                                        <select className="w-full p-4 pr-12 bg-slate-50 border border-slate-100 rounded-2xl text-sm appearance-none outline-none focus:border-[#8B5CF6] font-bold text-slate-600">
                                            <option>Good self-reflection...</option>
                                            <option>Needs more depth on point 2...</option>
                                            <option>Excellent demonstration of safety...</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                                        </div>
                                     </div>
                                 </div>

                                 <div className="flex gap-6">
                                     <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold shrink-0 shadow-lg ring-4 ring-slate-100">
                                         DA
                                     </div>
                                     <div className="flex-1 space-y-4">
                                         <div className="w-full bg-white border border-slate-100 rounded-[2rem] shadow-sm p-6 space-y-4">
                                             <textarea 
                                                rows={1}
                                                className="w-full text-base font-medium outline-none resize-none"
                                                placeholder="Type your comment..."
                                             />
                                             <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                 <div className="flex items-center gap-6 font-bold text-slate-300 text-sm">
                                                     <button className="hover:text-slate-500">B</button>
                                                     <button className="hover:text-slate-500 italic">I</button>
                                                     <button className="hover:text-slate-500 underline">U</button>
                                                     <button className="hover:text-slate-500">List</button>
                                                 </div>
                                                 <div className="flex items-center gap-4">
                                                     <Paperclip className="w-5 h-5 text-slate-300 cursor-pointer hover:text-slate-500" />
                                                     <button className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:text-[#8B5CF6] hover:bg-violet-50 transition-all">
                                                         <Send className="w-5 h-5" />
                                                     </button>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="h-20 bg-white border-t border-slate-100 flex items-center justify-center shrink-0 z-20">
                    <div className="flex items-center gap-12">
                        <button 
                            className="p-3 text-slate-300 hover:text-[#8B5CF6] hover:bg-slate-50 rounded-2xl transition-all"
                            onClick={() => {
                                const list = activeSection === 'pending' ? pendingSubmissions : doneSubmissions;
                                const idx = list.findIndex(s => s.id === selectedId);
                                if (idx > 0) setSelectedId(list[idx - 1].id);
                            }}
                        >
                            <RotateCcw className="w-5 h-5 rotate-90" />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em] mb-1.5">Submission {activeSection === 'pending' ? pendingSubmissions.findIndex(s => s.id === selectedId) + 1 : doneSubmissions.findIndex(s => s.id === selectedId) + 1}/{activeSection === 'pending' ? pendingSubmissions.length : doneSubmissions.length}</span>
                            <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-200 w-1/2" />
                            </div>
                        </div>
                        <button 
                            className="p-3 text-slate-300 hover:text-[#8B5CF6] hover:bg-slate-50 rounded-2xl transition-all"
                            onClick={() => {
                                const list = activeSection === 'pending' ? pendingSubmissions : doneSubmissions;
                                const idx = list.findIndex(s => s.id === selectedId);
                                if (idx < list.length - 1) setSelectedId(list[idx + 1].id);
                            }}
                        >
                            <RotateCcw className="w-5 h-5 -rotate-90" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessorPending;
