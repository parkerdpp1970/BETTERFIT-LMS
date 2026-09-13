import React, { useState } from 'react';
import { Search, Calendar as CalendarIcon, Download, FileText, X, CheckCircle, AlertTriangle, User, Briefcase, ChevronRight, FileCheck } from 'lucide-react';

interface IQAReport {
    id: string;
    date: string;
    assessor: string;
    learner: string;
    unit: string;
    type: string;
    decision: 'Pass' | 'Referral';
    vars: {
        valid: boolean;
        authentic: boolean;
        reliable: boolean;
        sufficient: boolean;
    };
    strengths: string;
    improvements: string;
}

const MOCK_REPORTS: IQAReport[] = [
    {
        id: 'RPT-1001',
        date: '2023-11-10',
        assessor: 'Sarah Connor',
        learner: 'Abisha Akongo',
        unit: 'L3 Anatomy & Physiology',
        type: 'Summative',
        decision: 'Pass',
        vars: { valid: true, authentic: true, reliable: true, sufficient: true },
        strengths: 'Excellent understanding of muscular system. Clear referencing.',
        improvements: 'None identified.'
    },
    {
        id: 'RPT-1002',
        date: '2023-11-08',
        assessor: 'Davos Seaworth',
        learner: 'Emma Brooks',
        unit: 'L2 Gym Instruction',
        type: 'Formative',
        decision: 'Referral',
        vars: { valid: true, authentic: true, reliable: false, sufficient: false },
        strengths: 'Good rapport with client in video submission.',
        improvements: 'Missing warm-up component in program card. Safety checks not verbalized clearly.'
    },
    {
        id: 'RPT-1003',
        date: '2023-10-25',
        assessor: 'Sarah Connor',
        learner: 'Liam Hunter',
        unit: 'L3 Nutrition',
        type: 'Summative',
        decision: 'Pass',
        vars: { valid: true, authentic: true, reliable: true, sufficient: true },
        strengths: 'Comprehensive food diary analysis.',
        improvements: 'Ensure macro calculations are double checked.'
    },
    {
        id: 'RPT-1004',
        date: '2023-10-15',
        assessor: 'Marcus Aurelius',
        learner: 'James Rodriguez',
        unit: 'L2 Health & Safety',
        type: 'Formative',
        decision: 'Pass',
        vars: { valid: true, authentic: true, reliable: true, sufficient: true },
        strengths: 'Risk submission document is industry standard.',
        improvements: 'Consider adding more detail on emergency procedures.'
    },
    {
        id: 'RPT-1005',
        date: '2023-11-01',
        assessor: 'Elena Fisher',
        learner: 'Noah Chen',
        unit: 'L3 Programming',
        type: 'Summative',
        decision: 'Pass',
        vars: { valid: true, authentic: true, reliable: true, sufficient: true },
        strengths: 'Creative periodization.',
        improvements: 'Rationale for plyometrics could be stronger.'
    }
];

const IQAReportsHistory: React.FC = () => {
    // Filter State
    const [assessorSearch, setAssessorSearch] = useState('');
    const [learnerSearch, setLearnerSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Modal State
    const [selectedReport, setSelectedReport] = useState<IQAReport | null>(null);

    // Filter Logic
    const filteredReports = MOCK_REPORTS.filter(report => {
        const matchesAssessor = report.assessor.toLowerCase().includes(assessorSearch.toLowerCase());
        const matchesLearner = report.learner.toLowerCase().includes(learnerSearch.toLowerCase());
        
        let matchesDate = true;
        if (startDate && endDate) {
            const reportDate = new Date(report.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            matchesDate = reportDate >= start && reportDate <= end;
        } else if (startDate) {
            matchesDate = new Date(report.date) >= new Date(startDate);
        } else if (endDate) {
            matchesDate = new Date(report.date) <= new Date(endDate);
        }

        return matchesAssessor && matchesLearner && matchesDate;
    });

    // CSV Download Handler
    const downloadCSV = () => {
        const headers = ["Report ID", "Date", "Assessor", "Learner", "Unit", "Type", "Decision", "Strengths", "Improvements"];
        const rows = filteredReports.map(r => [
            r.id,
            r.date,
            r.assessor,
            r.learner,
            r.unit,
            r.type,
            r.decision,
            `"${r.strengths}"`, // Quote strings to handle commas
            `"${r.improvements}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `iqa_reports_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A2E]">IQA Report Archive</h1>
                    <p className="text-[#6B7280] text-xs">Search and review past internal quality assurance reports.</p>
                </div>
                <button 
                    onClick={downloadCSV}
                    className="btn-primary flex items-center text-xs py-2 px-3.5"
                >
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Export to CSV
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-[#E5E7EB]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Assessor Search */}
                    <div>
                        <label className="block text-xs font-medium text-[#1A1A2E] uppercase mb-1">Assessor Name</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={assessorSearch}
                                onChange={(e) => setAssessorSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-md text-xs focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-[#1A1A2E]" 
                                placeholder="Search assessor..."
                            />
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        </div>
                    </div>

                    {/* Learner Search */}
                    <div>
                        <label className="block text-xs font-medium text-[#1A1A2E] uppercase mb-1">Student / Learner</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={learnerSearch}
                                onChange={(e) => setLearnerSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-md text-xs focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-[#1A1A2E]" 
                                placeholder="Search student..."
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        </div>
                    </div>

                    {/* Date From */}
                    <div>
                        <label className="block text-xs font-medium text-[#1A1A2E] uppercase mb-1">From Date</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-md text-xs focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-[#1A1A2E]" 
                            />
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                        </div>
                    </div>

                    {/* Date To */}
                    <div>
                        <label className="block text-xs font-medium text-[#1A1A2E] uppercase mb-1">To Date</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-md text-xs focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-[#1A1A2E]" 
                            />
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                        </div>
                    </div>
                </div>
                
                {/* Clear Filter Action */}
                {(assessorSearch || learnerSearch || startDate || endDate) && (
                    <div className="mt-3 flex justify-end">
                        <button 
                            onClick={() => { setAssessorSearch(''); setLearnerSearch(''); setStartDate(''); setEndDate(''); }}
                            className="text-xs text-[#DC2626] font-medium hover:underline"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Results Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-[#E5E7EB]">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E5E7EB]">
                        <thead className="bg-[#F8FAFB]">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Report ID</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Assessor</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Learner</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Outcome</th>
                                <th className="px-5 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#E5E7EB]">
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <tr 
                                        key={report.id} 
                                        onClick={() => setSelectedReport(report)}
                                        className="hover:bg-[#F0FDFA] transition-colors cursor-pointer group"
                                    >
                                        <td className="px-5 py-3.5 whitespace-nowrap text-xs font-mono text-[#10B981] font-semibold">
                                            {report.id}
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-xs text-[#6B7280]">
                                            {report.date}
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-xs font-medium text-[#1A1A2E]">
                                            {report.assessor}
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-xs text-[#6B7280]">
                                            {report.learner}
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded-full ${
                                                report.decision === 'Pass' 
                                                ? 'bg-[#D1FAE5] text-[#059669]' 
                                                : 'bg-[#FEE2E2] text-[#DC2626]'
                                            }`}>
                                                {report.decision === 'Pass' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                                                {report.decision}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-right text-xs font-medium">
                                            <span className="text-[#10B981] font-semibold flex items-center justify-end group-hover:underline">
                                                View Report <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-[#6B7280]">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="w-10 h-10 text-[#9CA3AF] mb-2 opacity-50" />
                                            <p className="font-semibold text-sm text-[#1A1A2E]">No reports found</p>
                                            <p className="text-xs">Try adjusting your search criteria or date range.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Read-Only Report Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200 max-h-[90vh] flex flex-col border border-[#E5E7EB]">
                        <div className="bg-[#10B981] px-5 py-3.5 flex justify-between items-center shrink-0">
                            <h2 className="text-sm font-semibold text-white flex items-center">
                                <FileCheck className="w-4 h-4 mr-2 text-white" /> IQA Report: {selectedReport.id}
                            </h2>
                            <button onClick={() => setSelectedReport(null)} className="text-white/80 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            {/* Meta Data */}
                            <div className="bg-[#F8FAFB] p-3.5 rounded-lg border border-[#E5E7EB] grid grid-cols-2 gap-3 mb-5 text-xs">
                                <div><span className="text-[#6B7280] font-medium">Date:</span> <span className="text-[#1A1A2E]">{selectedReport.date}</span></div>
                                <div><span className="text-[#6B7280] font-medium">Type:</span> <span className="text-[#1A1A2E]">{selectedReport.type}</span></div>
                                <div><span className="text-[#6B7280] font-medium">Assessor:</span> <span className="text-[#1A1A2E]">{selectedReport.assessor}</span></div>
                                <div><span className="text-[#6B7280] font-medium">Learner:</span> <span className="text-[#1A1A2E]">{selectedReport.learner}</span></div>
                                <div className="col-span-2"><span className="text-[#6B7280] font-medium">Unit/Module:</span> <span className="text-[#1A1A2E]">{selectedReport.unit}</span></div>
                            </div>

                            {/* VARS Check */}
                            <div className="mb-5">
                                <h3 className="text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2.5 border-b border-[#E5E7EB] pb-1">VARS Checks</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {Object.entries(selectedReport.vars).map(([key, value]) => (
                                        <div key={key} className={`text-center p-2 rounded-md border ${value ? 'bg-[#D1FAE5] border-[#A7F3D0] text-[#059669]' : 'bg-[#FEE2E2] border-[#FECACA] text-[#DC2626]'}`}>
                                            <div className="text-[10px] font-semibold uppercase mb-0.5">{key}</div>
                                            {value ? <CheckCircle className="w-4 h-4 mx-auto" /> : <AlertTriangle className="w-4 h-4 mx-auto" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="space-y-3.5 mb-5">
                                <div>
                                    <h3 className="text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider mb-1.5">Strengths Identified</h3>
                                    <div className="p-3 bg-[#F8FAFB] border border-[#E5E7EB] rounded-md text-xs text-[#1A1A2E]">
                                        {selectedReport.strengths}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider mb-1.5">Areas for Improvement</h3>
                                    <div className="p-3 bg-[#F8FAFB] border border-[#E5E7EB] rounded-md text-xs text-[#1A1A2E]">
                                        {selectedReport.improvements}
                                    </div>
                                </div>
                            </div>

                            {/* Decision */}
                            <div className={`p-3.5 rounded-lg border flex justify-between items-center ${selectedReport.decision === 'Pass' ? 'bg-[#D1FAE5] border-[#A7F3D0]' : 'bg-[#FEE2E2] border-[#FECACA]'}`}>
                                <span className="font-semibold text-xs text-[#1A1A2E]">Final Decision</span>
                                <span className={`font-bold text-sm ${selectedReport.decision === 'Pass' ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                                    {selectedReport.decision.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="p-3.5 border-t border-[#E5E7EB] bg-[#F8FAFB] flex justify-end gap-2.5 shrink-0">
                            <button 
                                onClick={() => setSelectedReport(null)}
                                className="px-3.5 py-2 border border-[#E5E7EB] bg-white text-[#1A1A2E] rounded-md font-medium text-xs hover:bg-[#F8FAFB] transition-colors"
                            >
                                Close
                            </button>
                            <button className="btn-primary text-xs py-2 px-3.5 flex items-center">
                                <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IQAReportsHistory;