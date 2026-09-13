import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ArrowLeft, 
    Search, 
    Filter, 
    CheckCircle, 
    Clock, 
    FileText, 
    ChevronRight,
    MessageSquare,
    ExternalLink,
    Mail,
    Download
} from 'lucide-react';

const ASSESSMENT_LEARNERS_DATA = {
    id: 'a1',
    title: 'Macro-nutrients Quiz',
    unit: 'Nutrition Basics',
    totalCompleted: 28,
    learners: [
        { id: '1', name: 'Tom Hanks', status: 'Passed', grade: '90%', submittedDate: '15 Sept 2023', avatar: 'TH', color: 'bg-emerald-50 text-emerald-600' },
        { id: '2', name: 'Leonardo DiCaprio', status: 'Passed', grade: '85%', submittedDate: '14 Sept 2023', avatar: 'LD', color: 'bg-emerald-50 text-emerald-600' },
        { id: '3', name: 'Meryl Streep', status: 'Grading Required', grade: '-', submittedDate: 'Today, 09:14 AM', avatar: 'MS', color: 'bg-blue-50 text-blue-600' },
        { id: '4', name: 'Heath Ledger', status: 'Refer', grade: '45%', submittedDate: '12 Sept 2023', avatar: 'HL', color: 'bg-red-50 text-red-600' },
        { id: '5', name: 'Marilyn Monroe', status: 'Passed', grade: '95%', submittedDate: '10 Sept 2023', avatar: 'MM', color: 'bg-emerald-50 text-emerald-600' },
        { id: '6', name: 'Marlon Brando', status: 'Grading Required', grade: '-', submittedDate: 'Yesterday', avatar: 'MB', color: 'bg-blue-50 text-blue-600' },
    ]
};

const AssessorAssessmentLearners: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLearners = ASSESSMENT_LEARNERS_DATA.learners.filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Passed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Grading Required': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Refer': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-colors text-sm"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
                </button>
                <div className="flex gap-3">
                    <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 flex items-center">
                        <Download className="w-4 h-4 mr-2" /> Export Summary
                    </button>
                </div>
            </div>

            {/* Assessment Title Header */}
            <div className="bg-slate-950 rounded-2xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                            <FileText className="w-10 h-10" />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Assessment View</span>
                            <h1 className="text-3xl font-black">{ASSESSMENT_LEARNERS_DATA.title}</h1>
                            <p className="text-pink-400 font-bold mt-1 uppercase tracking-wider text-xs">{ASSESSMENT_LEARNERS_DATA.unit}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-8 text-right">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Learners</span>
                            <span className="text-2xl font-black">{ASSESSMENT_LEARNERS_DATA.totalCompleted}</span>
                        </div>
                        <div className="w-px h-10 bg-slate-800"></div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Pass Rate</span>
                            <span className="text-2xl font-black text-emerald-400">92%</span>
                        </div>
                    </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 -skew-x-12"></div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Search learners for this assessment..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-500/5 focus:border-pink-500 transition-all text-sm"
                    />
                </div>
                <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 flex items-center whitespace-nowrap">
                    <Filter className="w-4 h-4 mr-2" /> Filter Status
                </button>
            </div>

            {/* Learners Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-20">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Learner</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grade</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitted Date</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredLearners.map((learner) => (
                            <tr key={learner.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${learner.color}`}>
                                            {learner.avatar}
                                        </div>
                                        <div className="font-bold text-slate-900">{learner.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getStatusColor(learner.status)}`}>
                                        {learner.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-700">
                                    {learner.grade}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                    {learner.submittedDate}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => navigate(`/messages`)}
                                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                                            title="Message Learner"
                                        >
                                            <Mail className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/assessor/assessment/${ASSESSMENT_LEARNERS_DATA.id}`)}
                                            className="bg-slate-900 text-white text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-pink-500 transition-all flex items-center shadow-sm"
                                        >
                                            Review <ExternalLink className="w-3 h-3 ml-2" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLearners.length === 0 && (
                    <div className="p-20 text-center text-slate-400 font-medium">
                        No learners found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssessorAssessmentLearners;
