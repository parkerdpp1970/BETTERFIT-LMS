import React, { useState } from 'react';
import { Scale, Plus, Calendar as CalendarIcon, Video, Clock, Users, MoreHorizontal, CheckCircle, FileText, X, Search, ChevronRight, User, Mail, Check, Loader2 } from 'lucide-react';

interface Meeting {
    id: string;
    title: string;
    date: string;
    time: string;
    attendees: string[]; // List of Assessor Names
    platform: 'Zoom' | 'Teams' | 'In-Person';
    link?: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    topic: string;
}

// Enhanced Mock Data for Visuals
const ASSESSOR_DETAILS = [
    { name: 'Sarah Connor', role: 'Lead Assessor', initials: 'SC', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Davos Seaworth', role: 'Gym Instructor Assessor', initials: 'DS', color: 'bg-teal-100 text-teal-800' },
    { name: 'Marcus Aurelius', role: 'PT Assessor', initials: 'MA', color: 'bg-amber-100 text-amber-800' },
    { name: 'Elena Fisher', role: 'Nutrition Specialist', initials: 'EF', color: 'bg-purple-100 text-purple-800' },
    { name: 'John Snow', role: 'Trainee Assessor', initials: 'JS', color: 'bg-slate-100 text-slate-700' },
    { name: 'Arya Stark', role: 'External IQA', initials: 'AS', color: 'bg-cyan-100 text-cyan-800' }
];

const MOCK_MEETINGS: Meeting[] = [
    {
        id: 'm1',
        title: 'Q4 Grading Standardization',
        date: '2023-11-20',
        time: '14:00',
        attendees: ['Sarah Connor', 'Davos Seaworth', 'Marcus Aurelius'],
        platform: 'Zoom',
        link: 'https://zoom.us/j/123456789',
        status: 'Scheduled',
        topic: 'Reviewing L3 PT Practical Observation criteria.'
    },
    {
        id: 'm2',
        title: 'L2 Anatomy MCQ Review',
        date: '2023-11-25',
        time: '10:00',
        attendees: ['Elena Fisher', 'John Snow'],
        platform: 'Teams',
        link: 'https://teams.microsoft.com/l/meetup-join/19...',
        status: 'Scheduled',
        topic: 'Discussing high fail rate on Skeleton unit.'
    },
    {
        id: 'm3',
        title: 'September Intake Initial Review',
        date: '2023-10-15',
        time: '09:00',
        attendees: ['Sarah Connor', 'Davos Seaworth', 'Elena Fisher'],
        platform: 'Zoom',
        status: 'Completed',
        topic: 'Ensuring consistency in initial submission feedback.'
    }
];

const StandardizationMeetings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
    const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // UI States for Modal
    const [attendeeSearch, setAttendeeSearch] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Form State
    const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
        title: '',
        date: '',
        time: '',
        attendees: [],
        platform: 'Zoom',
        link: '',
        topic: ''
    });

    const filteredMeetings = meetings.filter(m => 
        activeTab === 'upcoming' 
        ? m.status === 'Scheduled' 
        : (m.status === 'Completed' || m.status === 'Cancelled')
    );

    const toggleAttendee = (name: string) => {
        const current = newMeeting.attendees || [];
        if (current.includes(name)) {
            setNewMeeting({ ...newMeeting, attendees: current.filter(n => n !== name) });
        } else {
            setNewMeeting({ ...newMeeting, attendees: [...current, name] });
        }
    };

    const toggleSelectAll = () => {
        const current = newMeeting.attendees || [];
        // If all are selected (filtered by search), deselect all. Otherwise select all visible.
        const visibleAssessors = ASSESSOR_DETAILS.filter(a => a.name.toLowerCase().includes(attendeeSearch.toLowerCase()));
        const allVisibleSelected = visibleAssessors.every(a => current.includes(a.name));

        if (allVisibleSelected) {
            // Remove visible ones from selection
            const newSelection = current.filter(name => !visibleAssessors.find(a => a.name === name));
            setNewMeeting({ ...newMeeting, attendees: newSelection });
        } else {
            // Add visible ones to selection (avoiding duplicates)
            const newSelection = [...new Set([...current, ...visibleAssessors.map(a => a.name)])];
            setNewMeeting({ ...newMeeting, attendees: newSelection });
        }
    };

    const handleSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Simulation of sending invites
        setIsSending(true);

        setTimeout(() => {
            const created: Meeting = {
                id: Date.now().toString(),
                title: newMeeting.title || 'Untitled Meeting',
                date: newMeeting.date || '',
                time: newMeeting.time || '',
                attendees: newMeeting.attendees || [],
                platform: newMeeting.platform as 'Zoom' | 'Teams' | 'In-Person',
                link: newMeeting.link,
                topic: newMeeting.topic || '',
                status: 'Scheduled'
            };
            setMeetings([created, ...meetings]);
            setIsSending(false);
            setIsModalOpen(false);
            // Reset form
            setNewMeeting({ title: '', date: '', time: '', attendees: [], platform: 'Zoom', link: '', topic: '' });
            setAttendeeSearch('');
        }, 1500); // 1.5s delay to simulate API call/email sending
    };

    // Filter assessors for the list
    const filteredAssessors = ASSESSOR_DETAILS.filter(a => 
        a.name.toLowerCase().includes(attendeeSearch.toLowerCase())
    );

    const isAllSelected = filteredAssessors.length > 0 && filteredAssessors.every(a => newMeeting.attendees?.includes(a.name));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A2E] flex items-center">
                        <Scale className="w-6 h-6 mr-2.5 text-[#10B981]" />
                        Standardization Events
                    </h1>
                    <p className="text-[#6B7280] text-xs mt-0.5">Schedule and manage submission consistency meetings.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center text-xs py-2 px-3.5"
                >
                    <Plus className="w-4 h-4 mr-1.5" /> Schedule Meeting
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                
                {/* Tabs */}
                <div className="flex border-b border-[#E5E7EB]">
                    <button 
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-5 py-3 text-xs font-semibold flex items-center transition-colors border-b-2 ${activeTab === 'upcoming' ? 'border-[#10B981] text-[#10B981] bg-[#F0FDFA]' : 'border-transparent text-[#6B7280] hover:bg-[#F8FAFB]'}`}
                    >
                        <CalendarIcon className="w-3.5 h-3.5 mr-1.5" /> Upcoming Schedule
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-5 py-3 text-xs font-semibold flex items-center transition-colors border-b-2 ${activeTab === 'history' ? 'border-[#10B981] text-[#10B981] bg-[#F0FDFA]' : 'border-transparent text-[#6B7280] hover:bg-[#F8FAFB]'}`}
                    >
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> History & Logs
                    </button>
                </div>

                {/* List View */}
                <div className="p-5">
                    {filteredMeetings.length === 0 ? (
                        <div className="text-center py-10 text-[#6B7280]">
                            <div className="bg-[#F8FAFB] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 border border-[#E5E7EB]">
                                <CalendarIcon className="w-6 h-6 text-[#9CA3AF]" />
                            </div>
                            <p className="text-xs">No {activeTab} standardization meetings found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredMeetings.map(meeting => (
                                <div key={meeting.id} className="border border-[#E5E7EB] rounded-lg p-4 hover:shadow-sm hover:border-[#10B981] transition-all group bg-white">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        
                                        {/* Date Block */}
                                        <div className="flex items-center md:w-48 shrink-0">
                                            <div className="bg-[#F8FAFB] rounded-lg p-2.5 text-center min-w-[65px] mr-3.5 border border-[#E5E7EB]">
                                                <span className="block text-[10px] font-semibold text-[#6B7280] uppercase">{new Date(meeting.date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="block text-xl font-bold text-[#1A1A2E]">{new Date(meeting.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center text-xs text-[#10B981] font-semibold mb-0.5">
                                                    <Clock className="w-3 h-3 mr-1" /> {meeting.time}
                                                </div>
                                                <div className="flex items-center text-xs text-[#6B7280]">
                                                    <Video className="w-3 h-3 mr-1" /> {meeting.platform}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Block */}
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-0.5 group-hover:text-[#10B981] transition-colors">{meeting.title}</h3>
                                            <p className="text-xs text-[#6B7280] mb-2.5">{meeting.topic}</p>
                                            
                                            {/* Attendees */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-1.5">
                                                    {meeting.attendees.map((att, i) => (
                                                        <div key={i} className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-semibold border-2 border-white" title={att}>
                                                            {att.charAt(0)}
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-[11px] text-[#6B7280] ml-1">{meeting.attendees.length} Assessors</span>
                                            </div>
                                        </div>

                                        {/* Action Block */}
                                        <div className="flex flex-row md:flex-col gap-2 shrink-0 md:border-l md:border-[#E5E7EB] md:pl-5 md:w-36 justify-end md:justify-center">
                                            {meeting.status === 'Scheduled' ? (
                                                <>
                                                    <a 
                                                        href={meeting.link} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="btn-accent text-xs py-1.5 px-3 text-center transition-colors flex items-center justify-center"
                                                    >
                                                        Join Call
                                                    </a>
                                                    <button className="bg-white border border-[#E5E7EB] text-[#6B7280] text-xs font-medium px-3 py-1.5 rounded-md hover:bg-[#F8FAFB] transition-colors">
                                                        Reschedule
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="bg-white border border-[#E5E7EB] text-[#1A1A2E] text-xs font-medium px-3 py-1.5 rounded-md hover:bg-[#F8FAFB] transition-colors flex items-center justify-center">
                                                    <FileText className="w-3 h-3 mr-1.5 text-[#7C3AED]" /> View Minutes
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* SCHEDULE MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh] border border-[#E5E7EB]">
                        <div className="bg-[#10B981] px-5 py-3.5 flex justify-between items-center shrink-0">
                            <h2 className="text-sm font-semibold text-white flex items-center">
                                <Plus className="w-4 h-4 mr-2 text-white" /> Schedule Standardization
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSchedule} className="p-5 space-y-3.5 overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-xs font-medium text-[#1A1A2E] mb-1">Meeting Title <span className="text-[#DC2626]">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    value={newMeeting.title}
                                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                                    className="w-full border border-[#E5E7EB] rounded-md p-2 text-xs focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-[#1A1A2E]"
                                    placeholder="e.g. L3 PT Portfolio Review"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#1A1A2E] mb-1">Date <span className="text-[#DC2626]">*</span></label>
                                    <input 
                                        type="date" 
                                        required
                                        value={newMeeting.date}
                                        onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                                        className="w-full border border-[#E5E7EB] rounded-md p-2 text-xs focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-[#1A1A2E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#1A1A2E] mb-1">Time <span className="text-[#DC2626]">*</span></label>
                                    <input 
                                        type="time" 
                                        required
                                        value={newMeeting.time}
                                        onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                                        className="w-full border border-[#E5E7EB] rounded-md p-2 text-xs focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-[#1A1A2E]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#1A1A2E] mb-1">Platform & Link</label>
                                <div className="flex gap-2">
                                    <select 
                                        className="border border-[#E5E7EB] rounded-md p-2 bg-white text-xs text-[#1A1A2E]"
                                        value={newMeeting.platform}
                                        onChange={(e) => setNewMeeting({...newMeeting, platform: e.target.value as any})}
                                    >
                                        <option>Zoom</option>
                                        <option>Teams</option>
                                        <option>In-Person</option>
                                    </select>
                                    <input 
                                        type="text" 
                                        value={newMeeting.link}
                                        onChange={(e) => setNewMeeting({...newMeeting, link: e.target.value})}
                                        className="flex-1 border border-[#E5E7EB] rounded-md p-2 text-xs focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-[#1A1A2E]"
                                        placeholder="Meeting URL or Location"
                                    />
                                </div>
                            </div>

                            {/* UPDATED: ATTENDEE SELECTOR */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-medium text-[#1A1A2E]">Select Attendees</label>
                                    <div className="badge-pending text-[10px] py-0.5 px-2 font-medium">
                                        {newMeeting.attendees?.length || 0} Selected
                                    </div>
                                </div>
                                
                                <div className="border border-[#E5E7EB] rounded-md overflow-hidden bg-[#F8FAFB]">
                                    
                                    {/* Search & Actions Header */}
                                    <div className="p-2 border-b border-[#E5E7EB] bg-white flex items-center justify-between gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B7280]" />
                                            <input 
                                                type="text" 
                                                placeholder="Search assessors..." 
                                                value={attendeeSearch}
                                                onChange={(e) => setAttendeeSearch(e.target.value)}
                                                className="w-full pl-7 pr-2 py-1.5 text-xs border border-[#E5E7EB] rounded-md focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-[#1A1A2E]"
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={toggleSelectAll}
                                            className="text-xs font-medium text-[#10B981] hover:underline px-2 py-1 rounded transition-colors whitespace-nowrap"
                                        >
                                            {isAllSelected ? 'Deselect All' : 'Select All'}
                                        </button>
                                    </div>

                                    {/* Attendees List */}
                                    <div className="max-h-44 overflow-y-auto p-1.5 space-y-1 custom-scrollbar">
                                        {filteredAssessors.length > 0 ? (
                                            filteredAssessors.map(assessor => {
                                                const isSelected = newMeeting.attendees?.includes(assessor.name);
                                                return (
                                                    <div 
                                                        key={assessor.name} 
                                                        onClick={() => toggleAttendee(assessor.name)}
                                                        className={`flex items-center p-2 rounded-md cursor-pointer border transition-all ${
                                                            isSelected 
                                                            ? 'bg-[#F0FDFA] border-[#10B981]' 
                                                            : 'bg-white border-transparent hover:border-[#E5E7EB] hover:bg-[#F8FAFB]'
                                                        }`}
                                                    >
                                                        <div className={`w-3.5 h-3.5 mr-2.5 border rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-[#10B981] border-[#10B981]' : 'border-[#D1D5DB] bg-white'}`}>
                                                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                                        </div>
                                                        
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium mr-2.5 ${assessor.color}`}>
                                                            {assessor.initials}
                                                        </div>
                                                        
                                                        <div className="flex-1">
                                                            <div className={`text-xs font-medium ${isSelected ? 'text-[#10B981]' : 'text-[#1A1A2E]'}`}>{assessor.name}</div>
                                                            <div className="text-[10px] text-[#6B7280]">{assessor.role}</div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="p-3 text-center text-xs text-[#6B7280] italic">No assessors found.</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#1A1A2E] mb-1">Focus Topic / Agenda</label>
                                <textarea 
                                    rows={2}
                                    value={newMeeting.topic}
                                    onChange={(e) => setNewMeeting({...newMeeting, topic: e.target.value})}
                                    className="w-full border border-[#E5E7EB] rounded-md p-2 text-xs focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] resize-none text-[#1A1A2E]"
                                    placeholder="Brief description of what will be covered..."
                                ></textarea>
                            </div>

                            <div className="pt-3 flex justify-end gap-2.5 border-t border-[#E5E7EB]">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-3.5 py-2 border border-[#E5E7EB] text-[#1A1A2E] font-medium text-xs rounded-md hover:bg-[#F8FAFB] transition-colors"
                                    disabled={isSending}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSending}
                                    className="btn-primary text-xs py-2 px-3.5 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSending ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Sending Invites...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-3.5 h-3.5 mr-1.5" /> Confirm & Send
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default StandardizationMeetings;