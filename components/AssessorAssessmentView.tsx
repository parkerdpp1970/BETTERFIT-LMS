import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ArrowLeft, 
    MessageSquare, 
    Send, 
    FileText, 
    CheckCircle, 
    Clock, 
    User,
    Award,
    Download,
    ExternalLink,
    Paperclip
} from 'lucide-react';

const ASSESSMENT_DETAIL = {
    id: 'a1',
    title: 'Macro-nutrients Quiz',
    type: 'Quiz',
    status: 'Passed',
    submittedDate: '15 Sept 2023 14:30',
    markedDate: '15 Sept 2023 16:45',
    grade: '90%',
    learnerName: 'Tom Hanks',
    unit: 'Hardcore Diet & Nutrition',
    questions: [
        { id: 1, question: "What is the primary function of carbohydrates in the body?", learnerAnswer: "Energy production and storage.", isCorrect: true, feedback: "Correct. Specifically glucose for immediate energy." },
        { id: 2, question: "Which macro-nutrient has the highest caloric density per gram?", learnerAnswer: "Fats (9 kcal/g)", isCorrect: true },
        { id: 3, question: "How many essential amino acids are there?", learnerAnswer: "7", isCorrect: false, correctAnswer: "9", feedback: "There are 9 essential amino acids that the body cannot synthesize." }
    ],
    communications: [
        { 
            id: 'c1',
            sender: 'Learner',
            name: 'Tom Hanks',
            message: "I found the question about amino acids quite tricky. I thought some were conditionally essential?",
            timestamp: '15 Sept 2023 15:00',
            avatar: 'TH'
        },
        { 
            id: 'c2',
            sender: 'Assessor',
            name: 'David Assessor',
            message: "Great point, Tom. You're thinking of 'conditionally essential' amino acids which are needed during specific times like illness. However, for the core 9, they are always essential. I've left some extra reading in your unit resources.",
            timestamp: '15 Sept 2023 16:50',
            avatar: 'DA',
            isOwn: true
        },
        {
            id: 'c3',
            sender: 'Learner',
            name: 'Tom Hanks',
            message: "Ah, that makes sense. Thank you for the clarification!",
            timestamp: '16 Sept 2023 09:15',
            avatar: 'TH'
        }
    ]
};

const AssessorAssessmentView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        // In a real app, this would push to the array or API
        setNewMessage('');
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-colors text-sm"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Learner Detail
                </button>
                <div className="flex gap-3">
                    <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 flex items-center">
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                    </button>
                    <button className="bg-[#00AEEF] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-900 flex items-center transition-colors">
                        <Award className="w-4 h-4 mr-2" /> Certify Unit
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Assessment Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-950 p-6 text-white">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-[#00AEEF] rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Assessment Detail</span>
                                    </div>
                                    <h1 className="text-2xl font-extrabold">{ASSESSMENT_DETAIL.title}</h1>
                                    <p className="text-slate-400 text-sm mt-1">{ASSESSMENT_DETAIL.unit}</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#00AEEF] rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                                        TH
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">Learner</span>
                                        <p className="text-lg font-black text-white">{ASSESSMENT_DETAIL.learnerName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Stats Summary */}
                            <div className="grid grid-cols-3 gap-4 pb-8 border-b border-slate-100">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Grade</span>
                                    <span className="text-2xl font-black text-emerald-600">{ASSESSMENT_DETAIL.grade}</span>
                                </div>
                                <div className="border-l border-slate-100 pl-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-xs font-bold border border-emerald-100">
                                        {ASSESSMENT_DETAIL.status}
                                    </span>
                                </div>
                                <div className="border-l border-slate-100 pl-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Submitted</span>
                                    <span className="text-sm font-bold text-slate-700">{ASSESSMENT_DETAIL.submittedDate}</span>
                                </div>
                            </div>

                            {/* Questions */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-bold text-slate-900">Submission Review</h2>
                                {ASSESSMENT_DETAIL.questions.map((q) => (
                                    <div key={q.id} className="p-6 rounded-xl border border-slate-100 bg-slate-50/50">
                                        <div className="flex items-start gap-4">
                                            <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{q.id}</span>
                                            <div className="space-y-3 flex-1">
                                                <p className="font-bold text-slate-800">{q.question}</p>
                                                <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Learner Answer</span>
                                                    <p className="text-slate-700 font-medium">{q.learnerAnswer}</p>
                                                </div>
                                                {q.feedback && (
                                                    <div className={`p-3 rounded-lg text-xs font-medium border ${q.isCorrect ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                        <span className="font-bold uppercase mr-1">{q.isCorrect ? 'Assessor Feedback:' : 'Correction:'}</span>
                                                        {q.feedback}
                                                        {!q.isCorrect && q.correctAnswer && <p className="mt-1 font-bold">Correct Answer: {q.correctAnswer}</p>}
                                                    </div>
                                                )}
                                            </div>
                                            {q.isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> : <Clock className="w-5 h-5 text-red-400 shrink-0" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Communication Chain */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[700px]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Communication Chain</h3>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Thread</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                            {ASSESSMENT_DETAIL.communications.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] space-y-1 ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            {!msg.isOwn && <span className="text-[10px] font-bold text-slate-500">{msg.name}</span>}
                                            <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                                            {msg.isOwn && <span className="text-[10px] font-bold text-[#00AEEF]">You</span>}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                                            msg.isOwn 
                                            ? 'bg-[#111827] text-white rounded-tr-none' 
                                            : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                        }`}>
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-slate-100 bg-white rounded-b-2xl">
                            <div className="relative">
                                <textarea 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Add feedback to the communication chain..."
                                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF] transition-all text-sm resize-none h-24"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    className="absolute right-3 bottom-3 p-2 bg-[#00AEEF] text-white rounded-lg hover:bg-slate-900 transition-colors shadow-sm"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                                <button className="absolute right-14 bottom-3 p-2 text-slate-400 hover:text-slate-600">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-[10px] text-slate-400 font-medium">Press Enter to send</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Learner is Online</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Info */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start">
                        <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-blue-900">Next Review Scheduled</h4>
                            <p className="text-xs text-blue-700 mt-1">Learner requested a check-in for Tomorrow at 10:00 AM.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessorAssessmentView;
