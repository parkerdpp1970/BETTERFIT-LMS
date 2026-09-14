import React, { useState } from 'react';
import { MOCK_EVENTS, LEARNER_GROUPS } from '../constants';
import { ChevronLeft, ChevronRight, MapPin, Clock, Plus, X, Users, Filter, Calendar as CalendarIcon, Edit2, Trash2 } from 'lucide-react';
import { CalendarEvent } from '../types';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import Button from './ui/Button';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // New Event Form State
  const [currentEvent, setCurrentEvent] = useState<Partial<CalendarEvent>>({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'Class',
      location: '',
      description: '',
      targetGroups: []
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysInMonth = 30; // Mocking Nov 2023
  const startDay = 3; // Wednesday

  // Filtering Logic
  const filteredEvents = events.filter(event => {
      if (selectedGroup === 'all') return true;
      return event.targetGroups?.includes(selectedGroup);
  });

  // Handlers
  const handleDayClick = (day: number) => {
    const dayStr = day < 10 ? `0${day}` : day.toString();
    const dateStr = `2023-11-${dayStr}`;
    
    setCurrentEvent({
        title: '',
        date: dateStr,
        startTime: '09:00',
        endTime: '10:00',
        type: 'Class',
        location: '',
        description: '',
        targetGroups: ['all']
    });
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation(); // Prevent triggering the day click
    setCurrentEvent({ ...event });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Trigger Delete Confirmation
  const handleDeleteClick = () => {
      setIsDeleteModalOpen(true);
  };

  // Execute Delete
  const handleConfirmDelete = () => {
      if (currentEvent.id) {
          setEvents(events.filter(e => e.id !== currentEvent.id));
          setIsDeleteModalOpen(false);
          setIsModalOpen(false);
      }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (modalMode === 'create') {
        const eventToAdd: CalendarEvent = {
            ...currentEvent as CalendarEvent,
            id: Date.now().toString(),
            targetGroups: currentEvent.targetGroups && currentEvent.targetGroups.length > 0 ? currentEvent.targetGroups : ['all']
        };
        setEvents([...events, eventToAdd]);
      } else {
        // Edit Mode
        setEvents(events.map(ev => ev.id === currentEvent.id ? { ...currentEvent as CalendarEvent } : ev));
      }

      setIsModalOpen(false);
  };

  const toggleGroupSelection = (groupId: string) => {
      const currentGroups = currentEvent.targetGroups || [];
      const updatedGroups = currentGroups.includes(groupId) 
        ? currentGroups.filter(g => g !== groupId)
        : [...currentGroups, groupId];
      setCurrentEvent({...currentEvent, targetGroups: updatedGroups});
  };

  // Helper function for event chip colors
  const getEventChipStyle = (type?: string) => {
      switch (type) {
          case 'Class':
              return 'bg-emerald-50 text-[#059669] border-emerald-200 hover:bg-[#10B981] hover:text-white';
          case 'CPD':
          case 'Workshop':
              return 'bg-purple-50 text-[#7C3AED] border-purple-200 hover:bg-[#7C3AED] hover:text-white';
          case 'Submission':
              return 'bg-amber-50 text-[#92400E] border-amber-200 hover:bg-[#F59E0B] hover:text-white';
          case 'Meeting':
              return 'bg-cyan-50 text-[#0891B2] border-cyan-200 hover:bg-[#06B6D4] hover:text-white';
          default:
              return 'bg-emerald-50 text-[#059669] border-emerald-200 hover:bg-[#10B981] hover:text-white';
      }
  };

  // Calendar Rendering
  const renderDays = () => {
    const calendarDays = [];
    // Empty cells for days before start of month
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="min-h-[10rem] bg-surface/50"></div>);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `2023-11-${d < 10 ? '0' + d : d}`;
        const dayEvents = filteredEvents.filter(e => e.date === dateStr);
        const isToday = d === 15; // Mock today

        calendarDays.push(
            <div 
                key={d} 
                onClick={() => handleDayClick(d)}
                className={`min-h-[10rem] p-2 transition-colors relative group overflow-hidden cursor-pointer flex flex-col ${isToday ? 'bg-primary-container/40 ring-1 ring-inset ring-primary' : 'bg-white hover:bg-surface'}`}
            >
                <div className={`text-right text-xs font-semibold mb-1.5 ${isToday ? 'text-primary font-bold' : 'text-on-surface'}`}>
                    {d} {isToday && <span className="text-[10px] uppercase font-semibold text-primary ml-1">(Today)</span>}
                </div>
                
                {/* Plus Icon on Hover */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-3.5 h-3.5 text-gray-400 hover:text-primary" />
                </div>

                <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar">
                    {dayEvents.map(event => (
                        <div 
                            key={event.id} 
                            onClick={(e) => handleEventClick(e, event)}
                            className={`text-[11px] p-1.5 rounded-md border truncate cursor-pointer transition-all ${getEventChipStyle(event.type)}`}
                            title={`${event.startTime} - ${event.title}`}
                        >
                             <span className="font-semibold mr-1">{event.startTime}</span>{event.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return calendarDays;
  };

  return (
    <div className="space-y-6 relative h-full animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Events & Activities</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage schedules, workshops, CPD, and submission deadlines.</p>
            </div>
            
            <div className="flex items-center space-x-3">
                 <Button
                    size="sm"
                    icon={Plus}
                    onClick={() => {
                        setCurrentEvent({
                            title: '', date: '2023-11-15', startTime: '', endTime: '', type: 'Class', location: '', description: '', targetGroups: []
                        });
                        setModalMode('create');
                        setIsModalOpen(true);
                    }}
                 >
                     Add Event
                 </Button>
                 <div className="flex items-center bg-white rounded-lg border border-outline-variant px-2 py-1 shadow-xs">
                    <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"><ChevronLeft className="w-4 h-4"/></button>
                    <span className="text-xs font-semibold text-on-surface px-2">November 2023</span>
                    <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"><ChevronRight className="w-4 h-4"/></button>
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* MAIN CALENDAR GRID */}
            <div className="lg:col-span-3 bf-card overflow-hidden flex flex-col p-0">
                {/* Days Header */}
                <div className="grid grid-cols-7 bg-surface gap-px border-b border-outline-variant">
                    {days.map(day => (
                        <div key={day} className="py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{day}</div>
                    ))}
                </div>
                {/* Calendar Grid - Using gap-px for clean borders */}
                <div className="grid grid-cols-7 bg-outline-variant gap-px flex-1">
                    {renderDays()}
                </div>
            </div>

            {/* SIDEBAR: FILTERS & UPCOMING */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* 1. Filter By Audience */}
                <div className="bf-card p-4 sm:p-5">
                    <h3 className="font-semibold text-on-surface mb-3 flex items-center text-xs uppercase tracking-wider">
                        <Filter className="w-4 h-4 mr-2 text-primary" /> Filter by Audience
                    </h3>
                    <div className="space-y-1.5">
                        <button 
                            onClick={() => setSelectedGroup('all')}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${selectedGroup === 'all' ? 'bg-primary-container text-on-primary-container font-semibold border border-primary-fixed-dim' : 'hover:bg-gray-50 text-gray-600'}`}
                        >
                            <span>All Events</span>
                            {selectedGroup === 'all' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </button>
                        {LEARNER_GROUPS.map(group => (
                            <button 
                                key={group.id}
                                onClick={() => setSelectedGroup(group.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${selectedGroup === group.id ? 'bg-primary-container text-on-primary-container font-semibold border border-primary-fixed-dim' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                                <span className="truncate pr-2">{group.name}</span>
                                {selectedGroup === group.id && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Upcoming Events List */}
                <div className="bf-card p-4 sm:p-5 max-h-[480px] overflow-y-auto">
                    <h3 className="font-semibold text-on-surface mb-3 flex items-center text-xs uppercase tracking-wider">
                        <CalendarIcon className="w-4 h-4 mr-2 text-on-surface-variant" /> Upcoming Events
                    </h3>
                    
                    {filteredEvents.length === 0 ? (
                        <p className="text-xs text-gray-400 italic text-center py-6">No events found for this selection.</p>
                    ) : (
                        <div className="space-y-3">
                             {filteredEvents.map(event => (
                                 <div 
                                    key={event.id} 
                                    onClick={(e) => handleEventClick(e, event)}
                                    className="border-l-3 border-primary pl-3 py-1.5 group hover:bg-gray-50/70 rounded-r-md transition-colors cursor-pointer"
                                 >
                                     <div className="flex justify-between items-start">
                                         <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full mb-1 inline-block">{event.type}</span>
                                         <span className="text-[11px] text-primary font-semibold">{event.date}</span>
                                     </div>
                                     <h4 className="font-semibold text-xs text-on-surface leading-tight mb-1 group-hover:text-primary transition-colors">{event.title}</h4>
                                     <div className="flex items-center text-[11px] text-gray-500 mb-0.5">
                                         <Clock className="w-3 h-3 mr-1 text-gray-400" /> {event.startTime} - {event.endTime}
                                     </div>
                                     <div className="flex items-center text-[11px] text-gray-400">
                                         <MapPin className="w-3 h-3 mr-1 text-gray-400" /> {event.location}
                                     </div>
                                 </div>
                             ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* ADD/EDIT EVENT MODAL */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200">
                    <div className="bg-tertiary px-6 py-4 flex justify-between items-center text-white">
                        <h2 className="text-base font-semibold text-white flex items-center">
                            {modalMode === 'create' ? <Plus className="w-5 h-5 mr-2" /> : <Edit2 className="w-5 h-5 mr-2" />}
                            {modalMode === 'create' ? 'Add New Event' : 'Edit Event Details'}
                        </h2>
                        <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSaveEvent} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                        <div>
                            <label className="block text-xs font-semibold text-on-surface mb-1.5">Event Title <span className="text-error">*</span></label>
                            <input 
                                type="text" 
                                required
                                value={currentEvent.title}
                                onChange={e => setCurrentEvent({...currentEvent, title: e.target.value})}
                                className="w-full border border-gray-200 rounded-shape-md p-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" 
                                placeholder="e.g. L3 Anatomy Workshop"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-on-surface mb-1.5">Date <span className="text-error">*</span></label>
                                <input 
                                    type="date" 
                                    required
                                    value={currentEvent.date}
                                    onChange={e => setCurrentEvent({...currentEvent, date: e.target.value})}
                                    className="w-full border border-gray-200 rounded-shape-md p-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-on-surface mb-1.5">Type</label>
                                <select 
                                    value={currentEvent.type}
                                    onChange={e => setCurrentEvent({...currentEvent, type: e.target.value as any})}
                                    className="w-full border border-gray-200 rounded-shape-md p-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                                >
                                    <option>Activity</option>
                                    <option>Class</option>
                                    <option>CPD</option>
                                    <option>Submission</option>
                                    <option>Meeting</option>
                                    <option>Workshop</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-on-surface mb-1.5">Start Time <span className="text-error">*</span></label>
                                <input 
                                    type="time" 
                                    required
                                    value={currentEvent.startTime}
                                    onChange={e => setCurrentEvent({...currentEvent, startTime: e.target.value})}
                                    className="w-full border border-gray-200 rounded-shape-md p-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-on-surface mb-1.5">End Time <span className="text-error">*</span></label>
                                <input 
                                    type="time" 
                                    required
                                    value={currentEvent.endTime}
                                    onChange={e => setCurrentEvent({...currentEvent, endTime: e.target.value})}
                                    className="w-full border border-gray-200 rounded-shape-md p-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-on-surface mb-1.5">Location <span className="text-error">*</span></label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    required
                                    value={currentEvent.location}
                                    onChange={e => setCurrentEvent({...currentEvent, location: e.target.value})}
                                    className="w-full border border-gray-200 rounded-shape-md pl-9 pr-3 py-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" 
                                    placeholder="e.g. Room 301 or Zoom Link"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-on-surface mb-1.5">Description & Details</label>
                            <textarea 
                                rows={3}
                                value={currentEvent.description}
                                onChange={e => setCurrentEvent({...currentEvent, description: e.target.value})}
                                className="w-full border border-gray-200 rounded-shape-md p-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white resize-none" 
                                placeholder="Add agenda or requirements..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-on-surface mb-2 flex items-center">
                                <Users className="w-4 h-4 mr-1.5 text-on-surface-variant" /> Target Audience <span className="text-[10px] font-normal normal-case ml-2 text-gray-400">(Click to select)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {LEARNER_GROUPS.map(group => {
                                    const isSelected = currentEvent.targetGroups?.includes(group.id);
                                    return (
                                        <button
                                            type="button"
                                            key={group.id}
                                            onClick={() => toggleGroupSelection(group.id)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                                isSelected 
                                                ? 'bg-primary text-white border-primary' 
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-fixed-dim'
                                            }`}
                                        >
                                            {group.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-between gap-3 border-t border-gray-100 mt-4">
                            {modalMode === 'edit' && (
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    className="px-4 py-2 border border-error text-error rounded-lg text-xs font-semibold hover:bg-rose-50 flex items-center transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                                </button>
                            )}
                            <div className="flex gap-3 ml-auto">
                                <Button variant="outlined" size="sm" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" size="sm" arrow={false}>
                                    {modalMode === 'create' ? 'Create Event' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Global Delete Confirmation Modal */}
        <DeleteConfirmationModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            itemName={currentEvent.title}
        />
    </div>
  );
};

export default Calendar;