import React, { useState } from 'react';
import { Scale, Plus, Calendar as CalendarIcon, Video, Clock, Users, MoreHorizontal, CheckCircle, FileText, X, Search, ChevronRight, User, Mail, Check, Loader2 } from 'lucide-react';
import Button from './ui/Button';

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
                    <h1 className="text-2xl font-bold text-on-surface flex items-center">
                        <Scale className="w-6 h-6 mr-2.5 text-primary" />
                        Standardization Events
                    </h1>
                    <p className="text-on-surface-muted text-xs mt-0.5">Schedule and manage submission consistency meetings.</p>
                </div>
                <Button size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
                    Schedule Meeting
                </Button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-lg shadow-sm border border-outline-variant overflow-hidden">
                
                {/* Tabs */}
                <div className="flex border-b border-outline-variant">
                    <button 
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-5 py-3 text-xs font-semibold flex items-center transition-colors border-b-2 ${activeTab === 'upcoming' ? 'border-primary text-on-primary-container bg-primary-container' : 'border-transparent text-on-surface-muted hover:bg-surface'}`}
                    >
                        <CalendarIcon className="w-3.5 h-3.5 mr-1.5" /> Upcoming Schedule
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-5 py-3 text-xs font-semibold flex items-center transition-colors border-b-2 ${activeTab === 'history' ? 'border-primary text-on-primary-container bg-primary-container' : 'border-transparent text-on-surface-muted hover:bg-surface'}`}
                    >
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> History & Logs
                    </button>
                </div>

                {/* List View */}
                <div className="p-5">
                    {filteredMeetings.length === 0 ? (
                        <div className="text-center py-10 text-on-surface-muted">
                            <div className="bg-surface w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 border border-outline-variant">
                                <CalendarIcon className="w-6 h-6 text-outline" />
                            </div>
                            <p className="text-xs">No {activeTab} standardization meetings found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredMeetings.map(meeting => (
                                <div key={meeting.id} className="border border-outline-variant rounded-lg p-4 hover:shadow-sm hover:border-primary-fixed-dim transition-all group bg-white">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        
                                        {/* Date Block */}
                                        <div className="flex items-center md:w-48 shrink-0">
                                            <div className="bg-surface rounded-lg p-2.5 text-center min-w-[65px] mr-3.5 border border-outline-variant">
                                                <span className="block text-[10px] font-semibold text-on-surface-muted uppercase">{new Date(meeting.date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="block text-xl font-bold text-on-surface">{new Date(meeting.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center text-xs text-primary font-semibold mb-0.5">
                                                    <Clock className="w-3 h-3 mr-1" /> {meeting.time}
                                                </div>
                                                <div className="flex items-center text-xs text-on-surface-muted">
                                                    <Video className="w-3 h-3 mr-1" /> {meeting.platform}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Block */}
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-on-surface mb-0.5 group-hover:text-primary transition-colors">{meeting.title}</h3>
                                            <p className="text-xs text-on-surface-muted mb-2.5">{meeting.topic}</p>
                                            
                                            {/* Attendees */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-1.5">
                                                    {meeting.attendees.map((att, i) => (
                                                        <div key={i} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-semibold border-2 border-white" title={att}>
                                                            {att.charAt(0)}
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-[11px] text-on-surface-muted ml-1">{meeting.attendees.length} Assessors</span>
                                            </div>
                                        </div>

                                        {/* Action Block */}
                                        <div className="flex flex-row md:flex-col gap-2 shrink-0 md:border-l md:border-outline-variant md:pl-5 md:w-36 justify-end md:justify-center">
                                            {meeting.status === 'Scheduled' ? (
                                                <>
                                                    <Button variant="secondary" size="sm" href={meeting.link} target="_blank" rel="noreferrer">
                                                        Join Call
                                                    </Button>
                                                    <button className="bg-white border border-outline-variant text-on-surface-muted text-xs font-medium px-3 py-1.5 rounded-md hover:bg-surface transition-colors">
                                                        Reschedule
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="bg-white border border-outline-variant text-on-surface text-xs font-medium px-3 py-1.5 rounded-md hover:bg-surface transition-colors flex items-center justify-center">
                                                    <FileText className="w-3 h-3 mr-1.5 text-on-surface-variant" /> View Minutes
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh] border border-outline-variant">
                        <div className="bg-tertiary px-5 py-3.5 flex justify-between items-center shrink-0">
                            <h2 className="text-sm font-semibold text-white flex items-center">
                                <Plus className="w-4 h-4 mr-2 text-white" /> Schedule Standardization
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSchedule} className="p-5 space-y-3.5 overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-xs font-medium text-on-surface mb-1">Meeting Title <span className="text-error">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    value={newMeeting.title}
                                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                                    className="w-full border border-outline-variant rounded-shape-md p-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary text-on-surface"
                                    placeholder="e.g. L3 PT Portfolio Review"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-on-surface mb-1">Date <span className="text-error">*</span></label>
                                    <input 
                                        type="date" 
                                        required
                                        value={newMeeting.date}
                                        onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                                        className="w-full border border-outline-variant rounded-shape-md p-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary text-on-surface"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-on-surface mb-1">Time <span className="text-error">*</span></label>
                                    <input 
                                        type="time" 
                                        required
                                        value={newMeeting.time}
                                        onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                                        className="w-full border border-outline-variant rounded-shape-md p-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary text-on-surface"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-on-surface mb-1">Platform & Link</label>
                                <div className="flex gap-2">
                                    <select 
                                        className="border border-outline-variant rounded-md p-2 bg-white text-xs text-on-surface"
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
                                        className="flex-1 border border-outline-variant rounded-shape-md p-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary text-on-surface"
                                        placeholder="Meeting URL or Location"
                                    />
                                </div>
                            </div>

                            {/* UPDATED: ATTENDEE SELECTOR */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-medium text-on-surface">Select Attendees</label>
                                    <div className="badge-pending text-[10px] py-0.5 px-2 font-medium">
                                        {newMeeting.attendees?.length || 0} Selected
                                    </div>
                                </div>
                                
                                <div className="border border-outline-variant rounded-md overflow-hidden bg-surface">
                                    
                                    {/* Search & Actions Header */}
                                    <div className="p-2 border-b border-outline-variant bg-white flex items-center justify-between gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-on-surface-muted" />
                                            <input 
                                                type="text" 
                                                placeholder="Search assessors..." 
                                                value={attendeeSearch}
                                                onChange={(e) => setAttendeeSearch(e.target.value)}
                                                className="w-full pl-7 pr-2 py-1.5 text-xs border border-outline-variant rounded-shape-md focus:ring-1 focus:ring-primary focus:border-primary text-on-surface"
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={toggleSelectAll}
                                            className="text-xs font-medium text-primary hover:underline px-2 py-1 rounded transition-colors whitespace-nowrap"
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
                                                            ? 'bg-primary-container border-primary' 
                                                            : 'bg-white border-transparent hover:border-outline-variant hover:bg-surface'
                                                        }`}
                                                    >
                                                        <div className={`w-3.5 h-3.5 mr-2.5 border rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-[#D1D5DB] bg-white'}`}>
                                                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                                        </div>
                                                        
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium mr-2.5 ${assessor.color}`}>
                                                            {assessor.initials}
                                                        </div>
                                                        
                                                        <div className="flex-1">
                                                            <div className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{assessor.name}</div>
                                                            <div className="text-[10px] text-on-surface-muted">{assessor.role}</div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="p-3 text-center text-xs text-on-surface-muted italic">No assessors found.</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-on-surface mb-1">Focus Topic / Agenda</label>
                                <textarea 
                                    rows={2}
                                    value={newMeeting.topic}
                                    onChange={(e) => setNewMeeting({...newMeeting, topic: e.target.value})}
                                    className="w-full border border-outline-variant rounded-shape-md p-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary resize-none text-on-surface"
                                    placeholder="Brief description of what will be covered..."
                                ></textarea>
                            </div>

                            <div className="pt-3 flex justify-end gap-2.5 border-t border-outline-variant">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-3.5 py-2 border border-outline-variant text-on-surface font-medium text-xs rounded-md hover:bg-surface transition-colors"
                                    disabled={isSending}
                                >
                                    Cancel
                                </button>
                                <Button type="submit" size="sm" arrow={false} icon={Mail} loading={isSending}>
                                    {isSending ? 'Sending Invites...' : 'Confirm & Send'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default StandardizationMeetings;