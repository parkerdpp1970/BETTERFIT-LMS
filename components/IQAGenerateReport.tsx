
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, CheckSquare, Square, Download, Users, RefreshCw, FileText, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';

// Mock Data for the Generator
const COURSES = [
    { id: 'c1', title: 'L2 Gym Instructor' },
    { id: 'c2', title: 'L3 Personal Training' },
    { id: 'c3', title: 'L4 Obesity & Diabetes' }
];

const COHORTS = [
    { id: 'g1', name: 'Sept 2023 Intake - Group A' },
    { id: 'g2', name: 'Oct 2023 Intake - Group B' },
    { id: 'g3', name: 'Fast Track - Winter' }
];

interface Learner {
    id: string;
    name: string;
    risk: 'High' | 'Medium' | 'Low';
    progress: number;
    unitsCompleted: number;
    lastSampled: string;
}

// Generate some mock learners
const MOCK_LEARNERS: Learner[] = [
    { id: '1', name: 'Abisha Akongo', risk: 'Low', progress: 85, unitsCompleted: 4, lastSampled: '10 Oct 2023' },
    { id: '2', name: 'Liam Hunter', risk: 'Medium', progress: 60, unitsCompleted: 3, lastSampled: 'Never' },
    { id: '3', name: 'Emma Brooks', risk: 'High', progress: 95, unitsCompleted: 5, lastSampled: '01 Nov 2023' },
    { id: '4', name: 'Noah Chen', risk: 'Low', progress: 40, unitsCompleted: 2, lastSampled: 'Never' },
    { id: '5', name: 'James Rodriguez', risk: 'Medium', progress: 70, unitsCompleted: 3, lastSampled: '15 Sep 2023' },
    { id: '6', name: 'Olivia Smith', risk: 'High', progress: 20, unitsCompleted: 1, lastSampled: 'Never' },
    { id: '7', name: 'Thomas Anderson', risk: 'Low', progress: 90, unitsCompleted: 5, lastSampled: '20 Oct 2023' },
    { id: '8', name: 'Sarah Jones', risk: 'Low', progress: 55, unitsCompleted: 2, lastSampled: 'Never' },
];

const IQAGenerateReport: React.FC = () => {
    const navigate = useNavigate();
    
    // Filter State
    const [selectedCourse, setSelectedCourse] = useState(COURSES[1].id);
    const [selectedCohort, setSelectedCohort] = useState(COHORTS[0].id);
    
    // Selection State
    const [learners, setLearners] = useState<Learner[]>(MOCK_LEARNERS); // In real app, fetch based on cohort
    const [selectedLearnerIds, setSelectedLearnerIds] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false);

    // Stats
    const selectedCount = selectedLearnerIds.length;
    const totalCount = learners.length;

    // Handlers
    const toggleLearner = (id: string) => {
        setSelectedLearnerIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedCount === totalCount) {
            setSelectedLearnerIds([]);
        } else {
            setSelectedLearnerIds(learners.map(l => l.id));
        }
    };

    // "Smart Sample" logic - e.g. Random 25% + All High Risk
    const autoSample = () => {
        const highRisk = learners.filter(l => l.risk === 'High').map(l => l.id);
        const others = learners.filter(l => l.risk !== 'High');
        
        // Pick random 2 from others
        const random = others.sort(() => 0.5 - Math.random()).slice(0, 2).map(l => l.id);
        
        // Combine unique
        const sample = Array.from(new Set([...highRisk, ...random]));
        setSelectedLearnerIds(sample);
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setReportGenerated(true);
        }, 2000);
    };

    const getRiskColor = (risk: string) => {
        switch(risk) {
            case 'High': return 'bg-red-100 text-red-700 border-red-200';
            case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    if (reportGenerated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 text-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0c0c0d] mb-2">Sampling Report Ready</h2>
                    <p className="text-[#6c6c6c] mb-6">
                        The IQA sampling plan for <strong>{COHORTS.find(c => c.id === selectedCohort)?.name}</strong> has been generated successfully. It includes {selectedCount} learners.
                    </p>
                    
                    <div className="flex flex-col gap-3">
                        <button className="w-full py-3 bg-[#01427a] text-white rounded-lg font-bold shadow-md hover:bg-[#003366] transition-colors flex items-center justify-center">
                            <Download className="w-5 h-5 mr-2" /> Download PDF Report
                        </button>
                        <button 
                            onClick={() => { setReportGenerated(false); setSelectedLearnerIds([]); }}
                            className="w-full py-3 bg-white border border-[#afafaf] text-[#6c6c6c] rounded-lg font-bold hover:bg-slate-50 transition-colors"
                        >
                            Generate Another
                        </button>
                        <button 
                            onClick={() => navigate('/moderator-dashboard')}
                            className="text-sm text-[#01b3ef] font-bold hover:underline mt-2"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <button 
                        onClick={() => navigate('/moderator-dashboard')}
                        className="flex items-center text-[#6c6c6c] hover:text-[#01427a] font-bold mb-2 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-extrabold text-[#0c0c0d]">Generate Sampling Report</h1>
                    <p className="text-[#6c6c6c] mt-1">Select a cohort and learners to build your IQA sampling plan.</p>
                </div>
            </div>

            {/* 1. Configuration Panel */}
            <div className="bg-white p-6 rounded-xl border border-[#afafaf]/50 shadow-sm">
                <h3 className="text-lg font-bold text-[#0c0c0d] mb-4 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-[#01b3ef]" /> 1. Select Cohort
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Qualification</label>
                        <div className="relative">
                            <select 
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full border border-[#afafaf] rounded-lg p-3 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-slate-50 appearance-none"
                            >
                                {COURSES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Learner Group / Cohort</label>
                        <div className="relative">
                            <select 
                                value={selectedCohort}
                                onChange={(e) => setSelectedCohort(e.target.value)}
                                className="w-full border border-[#afafaf] rounded-lg p-3 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-slate-50 appearance-none"
                            >
                                {COHORTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Learner Selection */}
            <div className="bg-white rounded-xl border border-[#afafaf]/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#afafaf]/20 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                            <Users className="w-5 h-5 mr-2 text-[#01427a]" /> 2. Select Sample
                        </h3>
                        <p className="text-xs text-[#6c6c6c]">
                            Selected: <span className="font-bold text-[#01b3ef]">{selectedCount}</span> / {totalCount} learners
                        </p>
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={autoSample}
                            className="flex items-center px-4 py-2 bg-white border border-[#01b3ef] text-[#01b3ef] rounded-lg text-sm font-bold hover:bg-[#01b3ef]/5 transition-colors"
                            title="Auto-selects High Risk + Random %"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" /> Auto-Sample
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#afafaf]/20">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 w-12">
                                    <button onClick={toggleSelectAll} className="flex items-center justify-center text-[#afafaf] hover:text-[#0c0c0d]">
                                        {selectedCount === totalCount ? <CheckSquare className="w-5 h-5 text-[#01b3ef]" /> : <Square className="w-5 h-5" />}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Learner Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Risk Rating</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Progress</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Last Sampled</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#afafaf]/20">
                            {learners.map((learner) => {
                                const isSelected = selectedLearnerIds.includes(learner.id);
                                return (
                                    <tr 
                                        key={learner.id} 
                                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${isSelected ? 'bg-[#01b3ef]/5' : ''}`}
                                        onClick={() => toggleLearner(learner.id)}
                                    >
                                        <td className="px-6 py-4 text-center">
                                            {isSelected ? <CheckSquare className="w-5 h-5 text-[#01b3ef] mx-auto" /> : <Square className="w-5 h-5 text-[#afafaf] mx-auto" />}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`font-bold text-sm ${isSelected ? 'text-[#01427a]' : 'text-[#0c0c0d]'}`}>{learner.name}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${getRiskColor(learner.risk)}`}>
                                                {learner.risk}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6c6c6c]">
                                            {learner.progress}% ({learner.unitsCompleted} Units)
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6c6c6c]">
                                            {learner.lastSampled}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. Footer Action */}
            <div className="flex justify-end pt-4 border-t border-[#afafaf]/30">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-[#6c6c6c]">
                        Generating report for <span className="font-bold text-[#0c0c0d]">{selectedCount} learners</span>
                    </span>
                    <button 
                        onClick={handleGenerate}
                        disabled={selectedCount === 0 || isGenerating}
                        className={`px-8 py-3 rounded-lg font-bold text-white shadow-md flex items-center transition-all ${
                            selectedCount === 0 
                            ? 'bg-slate-300 cursor-not-allowed' 
                            : 'bg-[#01427a] hover:bg-[#003366] hover:-translate-y-0.5'
                        }`}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Sampling Report'}
                        {!isGenerating && <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default IQAGenerateReport;
