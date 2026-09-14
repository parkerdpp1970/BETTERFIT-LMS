import React, { useState } from 'react';
import { Search, Calendar as CalendarIcon, Download, FileText, X, CheckCircle, AlertTriangle, User, Briefcase, ChevronRight, FileCheck } from 'lucide-react';
import Button from './ui/Button';

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
                    <h1 className="text-2xl font-bold text-on-surface">IQA Report Archive</h1>
                    <p className="text-on-surface-muted text-xs">Search and review past internal quality assurance reports.</p>
                </div>
                <Button size="sm" icon={Download} arrow={false} onClick={downloadCSV}>
                    Export to CSV
                </Button>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-outline-variant">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Assessor Search */}
                    <div>
                        <label className="block text-xs font-medium text-on-surface uppercase mb-1">Assessor Name</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={assessorSearch}
                                onChange={(e) => setAssessorSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-outline-variant rounded-shape-md text-xs focus:ring-1 focus:ring-primary focus:border-primary text-on-surface" 
                                placeholder="Search assessor..."
                            />
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted" />
                        </div>
                    </div>

                    {/* Learner Search */}
                    <div>
                        <label className="block text-xs font-medium text-on-surface uppercase mb-1">Student / Learner</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={learnerSearch}
                                onChange={(e) => setLearnerSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-outline-variant rounded-shape-md text-xs focus:ring-1 focus:ring-primary focus:border-primary text-on-surface" 
                                placeholder="Search student..."
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted" />
                        </div>
                    </div>

                    {/* Date From */}
                    <div>
                        <label className="block text-xs font-medium text-on-surface uppercase mb-1">From Date</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-outline-variant rounded-shape-md text-xs focus:ring-1 focus:ring-primary focus:border-primary text-on-surface" 
                            />
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted pointer-events-none" />
                        </div>
                    </div>

                    {/* Date To */}
                    <div>
                        <label className="block text-xs font-medium text-on-surface uppercase mb-1">To Date</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-outline-variant rounded-shape-md text-xs focus:ring-1 focus:ring-primary focus:border-primary text-on-surface" 
                            />
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted pointer-events-none" />
                        </div>
                    </div>
                </div>
                
                {/* Clear Filter Action */}
                {(assessorSearch || learnerSearch || startDate || endDate) && (
                    <div className="mt-3 flex justify-end">
                        <button 
                            onClick={() => { setAssessorSearch(''); setLearnerSearch(''); setStartDate(''); setEndDate(''); }}
                            className="text-xs text-error font-medium hover:underline"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Results Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-outline-variant">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-outline-variant">
                        <thead className="bg-surface">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-on-surface-muted uppercase tracking-wider">Report ID</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-on-surface-muted uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-on-surface-muted uppercase tracking-wider">Assessor</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-on-surface-muted uppercase tracking-wider">Learner</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-on-surface-muted uppercase tracking-wider">Outcome</th>
                                <th className="px-5 py-3 text-right text-xs font-semibold text-on-surface-muted uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-outline-variant">
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <tr 
                                        key={report.id} 
                                        onClick={() => setSelectedReport(report)}
                                        className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                                    >
                                        <td className="px-5 py-3.5 whitespace-nowrap text-xs font-mono text-primary font-semibold">
                                            {report.id}
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-xs text-on-surface-muted">
                                            {report.date}
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-xs font-medium text-on-surface">
                                            {report.assessor}
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-xs text-on-surface-muted">
                                            {report.learner}
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded-full ${
                                                report.decision === 'Pass' 
                                                ? 'bg-[#D1FAE5] text-[#059669]' 
                                                : 'bg-error-container text-error'
                                            }`}>
                                                {report.decision === 'Pass' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                                                {report.decision}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-right text-xs font-medium">
                                            <span className="text-primary font-semibold flex items-center justify-end group-hover:underline">
                                                View Report <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-on-surface-muted">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="w-10 h-10 text-outline mb-2 opacity-50" />
                                            <p className="font-semibold text-sm text-on-surface">No reports found</p>
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200 max-h-[90vh] flex flex-col border border-outline-variant">
                        <div className="bg-tertiary px-5 py-3.5 flex justify-between items-center shrink-0">
                            <h2 className="text-sm font-semibold text-white flex items-center">
                                <FileCheck className="w-4 h-4 mr-2 text-white" /> IQA Report: {selectedReport.id}
                            </h2>
                            <button onClick={() => setSelectedReport(null)} className="text-white/80 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            {/* Meta Data */}
                            <div className="bg-surface p-3.5 rounded-lg border border-outline-variant grid grid-cols-2 gap-3 mb-5 text-xs">
                                <div><span className="text-on-surface-muted font-medium">Date:</span> <span className="text-on-surface">{selectedReport.date}</span></div>
                                <div><span className="text-on-surface-muted font-medium">Type:</span> <span className="text-on-surface">{selectedReport.type}</span></div>
                                <div><span className="text-on-surface-muted font-medium">Assessor:</span> <span className="text-on-surface">{selectedReport.assessor}</span></div>
                                <div><span className="text-on-surface-muted font-medium">Learner:</span> <span className="text-on-surface">{selectedReport.learner}</span></div>
                                <div className="col-span-2"><span className="text-on-surface-muted font-medium">Unit/Module:</span> <span className="text-on-surface">{selectedReport.unit}</span></div>
                            </div>

                            {/* VARS Check */}
                            <div className="mb-5">
                                <h3 className="text-xs font-semibold text-on-surface uppercase tracking-wider mb-2.5 border-b border-outline-variant pb-1">VARS Checks</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {Object.entries(selectedReport.vars).map(([key, value]) => (
                                        <div key={key} className={`text-center p-2 rounded-md border ${value ? 'bg-[#D1FAE5] border-[#A7F3D0] text-[#059669]' : 'bg-error-container border-[#FECACA] text-error'}`}>
                                            <div className="text-[10px] font-semibold uppercase mb-0.5">{key}</div>
                                            {value ? <CheckCircle className="w-4 h-4 mx-auto" /> : <AlertTriangle className="w-4 h-4 mx-auto" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="space-y-3.5 mb-5">
                                <div>
                                    <h3 className="text-xs font-semibold text-on-surface uppercase tracking-wider mb-1.5">Strengths Identified</h3>
                                    <div className="p-3 bg-surface border border-outline-variant rounded-md text-xs text-on-surface">
                                        {selectedReport.strengths}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold text-on-surface uppercase tracking-wider mb-1.5">Areas for Improvement</h3>
                                    <div className="p-3 bg-surface border border-outline-variant rounded-md text-xs text-on-surface">
                                        {selectedReport.improvements}
                                    </div>
                                </div>
                            </div>

                            {/* Decision */}
                            <div className={`p-3.5 rounded-lg border flex justify-between items-center ${selectedReport.decision === 'Pass' ? 'bg-[#D1FAE5] border-[#A7F3D0]' : 'bg-error-container border-[#FECACA]'}`}>
                                <span className="font-semibold text-xs text-on-surface">Final Decision</span>
                                <span className={`font-bold text-sm ${selectedReport.decision === 'Pass' ? 'text-[#059669]' : 'text-error'}`}>
                                    {selectedReport.decision.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="p-3.5 border-t border-outline-variant bg-surface flex justify-end gap-2.5 shrink-0">
                            <button 
                                onClick={() => setSelectedReport(null)}
                                className="px-3.5 py-2 border border-outline-variant bg-white text-on-surface rounded-md font-medium text-xs hover:bg-surface transition-colors"
                            >
                                Close
                            </button>
                            <Button size="sm" icon={Download} arrow={false}>
                                Download PDF
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IQAReportsHistory;