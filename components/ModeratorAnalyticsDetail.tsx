import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, CheckCircle, Clock, AlertTriangle, Users, ChevronRight, FileText, Download } from 'lucide-react';

// Types for our lists
interface AnalyticsItem {
    id: string;
    learner: string;
    assessor: string;
    course: string;
    unit?: string;
    date: string;
    status: 'Pending' | 'Passed' | 'Referred' | 'Active';
    samplingStatus?: string;
}

// Mock Data
const ALL_DATA: AnalyticsItem[] = [
    { id: '1', learner: 'Abisha Akongo', assessor: 'Sarah Connor', course: 'L3 Personal Training', unit: 'Unit 1: A&P', date: '2023-11-14', status: 'Pending', samplingStatus: 'Selected' },
    { id: '2', learner: 'Liam Hunter', assessor: 'Sarah Connor', course: 'L3 Personal Training', unit: 'Unit 2: Nutrition', date: '2023-11-12', status: 'Passed', samplingStatus: 'Completed' },
    { id: '3', learner: 'Emma Brooks', assessor: 'Davos Seaworth', course: 'L2 Gym Instructor', unit: 'Unit 4: Program', date: '2023-11-10', status: 'Referred', samplingStatus: 'Action Required' },
    { id: '4', learner: 'Noah Chen', assessor: 'Elena Fisher', course: 'L3 Exercise Referral', unit: '-', date: 'Active since Sept', status: 'Active', samplingStatus: 'Eligible' },
    { id: '5', learner: 'James Rodriguez', assessor: 'Marcus Aurelius', course: 'L2 Gym Instructor', unit: 'Unit 1: Anatomy', date: '2023-11-13', status: 'Pending', samplingStatus: 'Selected' },
    { id: '6', learner: 'Olivia Smith', assessor: 'Sarah Connor', course: 'L4 Obesity', unit: '-', date: 'Active since Oct', status: 'Active', samplingStatus: 'Not Selected' },
    { id: '7', learner: 'Thomas Anderson', assessor: 'Davos Seaworth', course: 'L2 Gym Instructor', unit: 'Unit 3: Health', date: '2023-11-09', status: 'Referred', samplingStatus: 'Action Required' },
    { id: '8', learner: 'Sarah Jones', assessor: 'Elena Fisher', course: 'L3 Personal Training', unit: 'Unit 2: Nutrition', date: '2023-11-01', status: 'Passed', samplingStatus: 'Completed' },
];

const ModeratorAnalyticsDetail: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Determine content based on type
    let title = '';
    let description = '';
    let items: AnalyticsItem[] = [];
    let themeColor = '';
    let Icon = FileText;

    switch (type) {
        case 'pending':
            title = 'Pending Moderation Queue';
            description = 'Items awaiting Internal Quality Assurance sampling.';
            items = ALL_DATA.filter(i => i.status === 'Pending');
            themeColor = 'text-orange-500';
            Icon = Clock;
            break;
        case 'passed':
            title = 'Passed Moderation History';
            description = 'Archive of successfully sampled and approved submissions.';
            items = ALL_DATA.filter(i => i.status === 'Passed');
            themeColor = 'text-green-600';
            Icon = CheckCircle;
            break;
        case 'referred':
            title = 'Referred Items';
            description = 'Submissions returned to assessors for further action or correction.';
            items = ALL_DATA.filter(i => i.status === 'Referred');
            themeColor = 'text-red-500';
            Icon = AlertTriangle;
            break;
        case 'scope':
            title = 'Learners in Scope';
            description = 'Total pool of learners currently eligible for sampling across all active cohorts.';
            items = ALL_DATA; // Scope implies everyone
            themeColor = 'text-[#01427a]';
            Icon = Users;
            break;
        default:
            title = 'Analytics Detail';
            items = [];
    }

    // Filter by search
    const filteredItems = items.filter(item => 
        item.learner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assessor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <button 
                        onClick={() => navigate('/moderator-dashboard')}
                        className="flex items-center text-[#6c6c6c] hover:text-[#01427a] font-bold mb-2 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-extrabold text-[#0c0c0d] flex items-center">
                        <Icon className={`w-8 h-8 mr-3 ${themeColor}`} />
                        {title}
                    </h1>
                    <p className="text-[#6c6c6c] mt-1 ml-11 max-w-2xl">{description}</p>
                </div>
                
                <div className="flex gap-2">
                    <button className="flex items-center px-4 py-2 bg-white border border-[#afafaf] rounded-lg text-[#6c6c6c] font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                        <Download className="w-4 h-4 mr-2" /> Export List
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-[#afafaf]/50 overflow-hidden">
                
                {/* Toolbar */}
                <div className="p-6 border-b border-[#afafaf]/20 bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <input 
                            type="text" 
                            placeholder="Search learner, assessor or course..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-[#afafaf] rounded-lg text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef]"
                        />
                        <Search className="w-4 h-4 text-[#afafaf] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex items-center text-sm text-[#6c6c6c]">
                        <Filter className="w-4 h-4 mr-2" />
                        Showing {filteredItems.length} records
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#afafaf]/20">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Learner Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Assessor</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Course / Unit</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Date / Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Sampling Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#afafaf]/20">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr 
                                        key={item.id} 
                                        className={`hover:bg-slate-50 transition-colors group ${type === 'referred' ? 'bg-red-50/30 hover:bg-red-50/60' : ''}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-[#0c0c0d] text-sm">{item.learner}</div>
                                            <div className="text-xs text-[#6c6c6c]">ID: #{1000 + parseInt(item.id)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6c6c6c]">
                                            {item.assessor}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-[#0c0c0d]">{item.course}</div>
                                            <div className="text-xs text-[#6c6c6c]">{item.unit}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-[#6c6c6c] mb-1">{item.date}</div>
                                            <span className={`px-2 py-0.5 inline-flex text-[10px] leading-4 font-bold rounded-full uppercase tracking-wide ${
                                                item.status === 'Passed' ? 'bg-green-100 text-green-800' :
                                                item.status === 'Referred' ? 'bg-red-100 text-red-800' :
                                                item.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6c6c6c]">
                                            {type === 'scope' ? (
                                                <span className="text-xs italic">Eligible for sampling</span>
                                            ) : (
                                                item.samplingStatus
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                className={`font-bold flex items-center justify-end ${type === 'referred' ? 'text-red-600 hover:text-red-800' : 'text-[#01b3ef] hover:text-[#01427a]'}`}
                                                onClick={() => { /* Navigate to detail view or open modal */ }}
                                            >
                                                {type === 'scope' ? 'View Profile' : 'View Report'} <ChevronRight className="w-4 h-4 ml-1" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[#6c6c6c]">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="w-12 h-12 text-[#afafaf] mb-3 opacity-50" />
                                            <p className="font-bold text-lg">No records found</p>
                                            <p className="text-sm">No items match the current filter or category.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ModeratorAnalyticsDetail;