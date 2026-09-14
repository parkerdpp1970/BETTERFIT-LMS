
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ArrowLeft, 
    BookOpen, 
    ChevronRight, 
    CheckCircle, 
    Clock, 
    FileText,
    Users,
    Activity,
    Target
} from 'lucide-react';

const QUALIFICATIONS: Record<string, any> = {
    'g1': {
        name: 'Level 3 Personal Training',
        code: 'L3PT-SEP23',
        description: 'Advanced qualification for fitness professionals focusing on one-to-one training, nutrition, and advanced anatomy.',
        units: [
            { id: 'u1', name: 'Applied Anatomy and Physiology', code: 'A/617/4012', status: 'Completed', learnersDone: 10, totalLearners: 12, avgScore: '85%' },
            { id: 'u2', name: 'Nutritional Principles for Personal Training', code: 'F/617/4013', status: 'Completed', learnersDone: 12, totalLearners: 12, avgScore: '92%' },
            { id: 'u3', name: 'Programming Personal Training Sessions', code: 'J/617/4014', status: 'In Progress', learnersDone: 8, totalLearners: 12, avgScore: '78%' },
            { id: 'u4', name: 'Delivering Personal Training Sessions', code: 'L/617/4015', status: 'In Progress', learnersDone: 5, totalLearners: 12, avgScore: '88%' },
            { id: 'u5', name: 'Business Acumen for Personal Trainers', code: 'R/617/4016', status: 'Not Started', learnersDone: 0, totalLearners: 12, avgScore: '-' },
        ]
    },
    'g2': {
        name: 'Level 2 Gym Instructor',
        code: 'L2GYM-OCT23',
        description: 'Entry-level qualification for those starting their career in fitness, covering basic anatomy and gym machine orientation.',
        units: [
            { id: 'u21', name: 'Anatomy and Physiology for Exercise', code: 'H/616/7499', status: 'Completed', learnersDone: 8, totalLearners: 8, avgScore: '75%' },
            { id: 'u22', name: 'Supporting Clients in Exercise', code: 'M/616/7501', status: 'In Progress', learnersDone: 6, totalLearners: 8, avgScore: '82%' },
            { id: 'u23', name: 'Health and Safety in the Fitness Environment', code: 'T/616/7502', status: 'In Progress', learnersDone: 7, totalLearners: 8, avgScore: '90%' },
            { id: 'u24', name: 'Principles of Exercise and Fitness', code: 'A/616/7503', status: 'Not Started', learnersDone: 0, totalLearners: 8, avgScore: '-' },
        ]
    },
    'g3': {
        name: 'Combined Level 2 / Level 3',
        code: 'FT-COMB-24',
        description: 'Fast track cohort progressing directly from Level 2 basics through to full Level 3 certification.',
        units: [
            { id: 'u31', name: 'L2 Foundation Anatomy', code: 'L2-ANAT', status: 'Completed', learnersDone: 5, totalLearners: 5, avgScore: '95%' },
            { id: 'u32', name: 'L3 Advanced Physiology', code: 'L3-PHYS', status: 'In Progress', learnersDone: 4, totalLearners: 5, avgScore: '89%' },
            { id: 'u33', name: 'Nutrition for Sports Performance', code: 'L3-NUTR', status: 'In Progress', learnersDone: 2, totalLearners: 5, avgScore: '85%' },
        ]
    }
};

const AssessorQualificationUnits: React.FC = () => {
    const { id = 'g1' } = useParams();
    const navigate = useNavigate();
    const qual = QUALIFICATIONS[id] || QUALIFICATIONS['g1'];

    return (
        <div className="animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-colors text-sm mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" /> Return back to view by groups
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900">{qual.name}</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{qual.code}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                <span className="text-xs font-bold text-secondary uppercase tracking-widest">{qual.units.length} Units</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => navigate('/assessor/learners')}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Users className="w-5 h-5" />
                        View Learners
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-full font-bold hover:bg-black transition-all shadow-md">
                        <Activity className="w-5 h-5" />
                        Group Analytics
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Average Progress</p>
                            <h3 className="text-3xl font-black text-slate-900">82%</h3>
                        </div>
                        <Target className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: '82%' }}></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Units Certified</p>
                            <h3 className="text-3xl font-black text-emerald-600">2 / {qual.units.length}</h3>
                        </div>
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-xs text-slate-500 mt-4 font-medium">All learners have completed 2 core units.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Items Pending Marking</p>
                            <h3 className="text-3xl font-black text-amber-600">14</h3>
                        </div>
                        <Clock className="w-6 h-6 text-amber-500" />
                    </div>
                    <p className="text-xs text-slate-500 mt-4 font-medium">Across all units for this group.</p>
                </div>
            </div>

            {/* Units List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="font-bold text-slate-900">Qualification Syllabus / Units</h2>
                    <span className="text-xs font-bold text-slate-400">Showing {qual.units.length} components</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {qual.units.map((unit: any) => (
                        <div 
                            key={unit.id} 
                            onClick={() => navigate(`/assessor/learners?groupId=${id}`)}
                            className="p-6 hover:bg-slate-50 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                        >
                            <div className="flex items-start gap-4 flex-1">
                                <div className="p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-secondary transition-colors">{unit.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{unit.code}</span>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1.5 ${
                                            unit.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                            unit.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                            'bg-slate-100 text-slate-500'
                                        }`}>
                                            {unit.learnersDone} Students {unit.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-8 pr-4">
                                <div className="text-center min-w-[80px]">
                                    <div className="flex items-center justify-center gap-1">
                                        <Users className="w-3 h-3 text-slate-400" />
                                        <span className="block text-xs font-black text-slate-900">{unit.learnersDone} / {unit.totalLearners}</span>
                                    </div>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Enrolled Status</span>
                                </div>
                                <div className="text-center min-w-[80px]">
                                    <span className="block text-xs font-black text-secondary">{unit.avgScore}</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Average Grade</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg group-hover:bg-secondary/10 transition-colors">
                                    <span className="text-[9px] font-black text-slate-500 group-hover:text-secondary uppercase">View Learners</span>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-secondary" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AssessorQualificationUnits;
