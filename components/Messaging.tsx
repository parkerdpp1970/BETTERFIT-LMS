import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, MoreVertical, Phone, Video, 
  Smile, Paperclip, Mic, Send, ArrowLeft, 
  Check, CheckCheck, Users, User, Shield, 
  Briefcase, Zap, X, FileCheck, PenTool
} from 'lucide-react';

// --- Types ---

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
}

interface Chat {
  id: string;
  name: string;
  avatar?: string; // Initials or image URL
  type: 'individual' | 'group' | 'broadcast';
  role?: string; // For role-based group icons
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  messages: Message[];
}

// --- Mock Data ---

const CURRENT_USER_ID = 'me';

const MOCK_CHATS: Chat[] = [
  {
    id: 'c1',
    name: 'DL Swindon Social Group',
    type: 'group',
    lastMessage: 'Paul Tempo: I set an alarm at 6:59 at...',
    lastMessageTime: '19:29',
    unreadCount: 45,
    messages: [
      { id: 'm1', senderId: 'other', text: 'Has everyone submitted their L3 workbooks?', timestamp: '19:10', isOwn: false, status: 'read' },
      { id: 'm2', senderId: 'me', text: 'I just uploaded mine. Let me know if you can see it.', timestamp: '19:12', isOwn: true, status: 'read' },
      { id: 'm3', senderId: 'paul', text: 'I set an alarm at 6:59 at the gym just to be safe 😅', timestamp: '19:29', isOwn: false, status: 'read' }
    ]
  },
  {
    id: 'c2',
    name: 'Jessica Fairs PTA',
    type: 'individual',
    avatar: 'JF',
    isOnline: true,
    lastMessage: 'Hey, I am still unable to add anythi...',
    lastMessageTime: '18:53',
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'other', text: 'Hi, are you around to help with the portal?', timestamp: '18:50', isOwn: false, status: 'read' },
      { id: 'm2', senderId: 'other', text: 'Hey, I am still unable to add anything to my evidence folder.', timestamp: '18:53', isOwn: false, status: 'read' }
    ]
  },
  {
    id: 'c3',
    name: 'Assessors Group',
    type: 'group',
    role: 'ASSESSOR',
    lastMessage: 'Meeting rescheduled to Friday.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'me', text: 'Are we still on for the standardisation meeting?', timestamp: 'Yesterday', isOwn: true, status: 'read' },
      { id: 'm2', senderId: 'sarah', text: 'Meeting rescheduled to Friday.', timestamp: 'Yesterday', isOwn: false, status: 'read' }
    ]
  },
  {
    id: 'c4',
    name: 'Lauren Arber',
    type: 'individual',
    avatar: 'LA',
    lastMessage: 'I\'ve been cracking on with the L3 workb...',
    lastMessageTime: '18:28',
    unreadCount: 0,
    messages: []
  },
  {
    id: 'c5',
    name: 'Tracy Parker',
    type: 'individual',
    avatar: 'TP',
    lastMessage: 'https://www.instagram.com/reel/DSw...',
    lastMessageTime: '18:11',
    unreadCount: 0,
    messages: []
  },
  {
    id: 'c6',
    name: 'Tom Davies BOF',
    type: 'individual',
    avatar: 'TD',
    lastMessage: '🎤 0:20',
    lastMessageTime: '17:12',
    unreadCount: 0,
    messages: []
  }
];

const MOCK_CONTACTS = [
    { id: 'u1', name: 'Sarah Connor', role: 'ASSESSOR', avatar: 'SC' },
    { id: 'u2', name: 'Davos Seaworth', role: 'ASSESSOR', avatar: 'DS' },
    { id: 'u3', name: 'Elena Fisher', role: 'MODERATOR', avatar: 'EF' },
    { id: 'u4', name: 'Abisha Akongo', role: 'LEARNER', avatar: 'AA' },
    { id: 'u5', name: 'Liam Hunter', role: 'LEARNER', avatar: 'LH' },
    { id: 'u6', name: 'Emma Brooks', role: 'LEARNER', avatar: 'EB' },
];

interface MessagingProps {
  initialTargetName?: string;
  onClose?: () => void;
}

const Messaging: React.FC<MessagingProps> = ({ initialTargetName, onClose }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Chat Modal State
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');

  useEffect(() => {
    if (initialTargetName) {
      const existingChat = chats.find(c => c.name.toLowerCase() === initialTargetName.toLowerCase());
      if (existingChat) {
        setActiveChatId(existingChat.id);
      } else {
        const newChatId = 'temp-' + Date.now();
        const newChat: Chat = {
          id: newChatId,
          name: initialTargetName,
          type: 'individual',
          avatar: initialTargetName.split(' ').map(n => n[0]).join('').substring(0, 2),
          lastMessage: 'Start a new conversation',
          lastMessageTime: '',
          unreadCount: 0,
          messages: []
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChatId);
      }
    } else if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [initialTargetName]);

  const activeChat = chats.find(c => c.id === activeChatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: CURRENT_USER_ID,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      status: 'sent'
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: messageInput,
          lastMessageTime: 'Just now'
        };
      }
      return chat;
    }));

    setMessageInput('');
  };

  const startNewChat = (name: string, type: 'individual' | 'group' | 'broadcast', role?: string) => {
      // Check if chat exists
      const existing = chats.find(c => c.name === name);
      if (existing) {
          setActiveChatId(existing.id);
      } else {
          const newChat: Chat = {
              id: Date.now().toString(),
              name: name,
              type: type,
              role: role,
              avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2),
              lastMessage: 'Draft',
              lastMessageTime: '',
              unreadCount: 0,
              messages: []
          };
          setChats([newChat, ...chats]);
          setActiveChatId(newChat.id);
      }
      setIsNewChatOpen(false);
  };

  // --- Components ---

  const Avatar = ({ name, url, className = "w-10 h-10" }: { name: string, url?: string, className?: string }) => {
      return (
          <div className={`${className} rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center font-semibold text-xs overflow-hidden flex-shrink-0 border border-emerald-100`}>
              {url ? (
                  <img src={url} alt={name} className="w-full h-full object-cover" />
              ) : (
                  <span>{name}</span>
              )}
          </div>
      );
  };

  const RoleIcon = ({ role }: { role?: string }) => {
      switch (role) {
          case 'ADMIN': return <Shield className="w-4 h-4 text-[#7C3AED]" />;
          case 'ASSESSOR': return <Briefcase className="w-4 h-4 text-[#10B981]" />;
          case 'MODERATOR': return <FileCheck className="w-4 h-4 text-[#06B6D4]" />;
          case 'SUPER_ADMIN': return <Zap className="w-4 h-4 text-[#F59E0B]" />;
          case 'BROADCAST': return <Users className="w-4 h-4 text-[#10B981]" />;
          default: return <User className="w-4 h-4 text-gray-500" />;
      }
  };

  return (
    <div className="flex h-full bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E5E7EB] font-sans">
      
      {/* ----------------------------------------------------------------------------------
          LEFT SIDEBAR (Chat List)
      ---------------------------------------------------------------------------------- */}
      <div className="w-full md:w-[350px] lg:w-[380px] flex flex-col border-r border-[#E5E7EB] bg-white">
          
          {/* Sidebar Header */}
          <div className="h-16 bg-[#F8FAFB] px-4 flex justify-between items-center shrink-0 border-b border-[#E5E7EB]">
              <div className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      ME
                  </div>
              </div>
              <div className="flex gap-2 text-gray-500">
                  {onClose && (
                      <button 
                        onClick={onClose}
                        className="p-2 hover:bg-rose-50 hover:text-[#DC2626] rounded-lg transition-colors text-gray-400" title="Close Messaging"
                      >
                          <X className="w-5 h-5" />
                      </button>
                  )}
                  <button 
                    onClick={() => setIsNewChatOpen(true)}
                    className="p-2 hover:bg-emerald-50 hover:text-[#10B981] rounded-lg transition-colors" title="New Chat"
                  >
                      <PenTool className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                  </button>
              </div>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-[#E5E7EB] bg-white">
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                      type="text"
                      className="block w-full pl-9 pr-3 py-2 bg-[#F8FAFB] border border-[#E5E7EB] rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10B981] placeholder-gray-400 text-[#1A1A2E] outline-none"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
          </div>

          {/* Filter Chips */}
          <div className="flex px-3 py-2 gap-1.5 overflow-x-auto border-b border-[#E5E7EB] scrollbar-hide bg-[#F8FAFB]/50">
              <button className="px-3 py-1 rounded-full bg-[#10B981] text-white text-xs font-medium whitespace-nowrap shadow-xs">All</button>
              <button className="px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">Unread</button>
              <button className="px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">Favourites</button>
              <button className="px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">Groups</button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-gray-100">
              {chats
                .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(chat => (
                  <div 
                      key={chat.id} 
                      onClick={() => setActiveChatId(chat.id)}
                      className={`flex items-center px-4 py-3 cursor-pointer transition-colors hover:bg-[#F8FAFB] ${activeChatId === chat.id ? 'bg-[#F0FDFA] border-l-4 border-[#10B981]' : ''}`}
                  >
                      {/* Avatar */}
                      <div className="relative">
                          <Avatar name={chat.avatar || chat.name.substring(0,2)} className="w-11 h-11 text-xs" />
                          {chat.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#059669] rounded-full border-2 border-white"></div>
                          )}
                      </div>

                      {/* Info */}
                      <div className="ml-3 flex-1 overflow-hidden">
                          <div className="flex justify-between items-baseline">
                              <h3 className="text-xs font-semibold text-[#1A1A2E] truncate">{chat.name}</h3>
                              <span className={`text-[11px] ${chat.unreadCount > 0 ? 'text-[#10B981] font-bold' : 'text-gray-400'}`}>
                                  {chat.lastMessageTime}
                              </span>
                          </div>
                          <div className="flex justify-between items-center mt-0.5">
                              <p className="text-gray-500 text-xs truncate pr-2 flex-1">
                                  {chat.lastMessage}
                              </p>
                              {chat.unreadCount > 0 && (
                                  <span className="bg-[#10B981] text-white text-[10px] font-bold px-1.5 min-w-[18px] h-4.5 rounded-full flex items-center justify-center">
                                      {chat.unreadCount}
                                  </span>
                              )}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* ----------------------------------------------------------------------------------
          RIGHT MAIN AREA (Conversation)
      ---------------------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col bg-[#F8FAFB] relative">
          {activeChat ? (
              <>
                  {/* Chat Header */}
                  <div className="h-16 bg-white px-5 flex justify-between items-center border-b border-[#E5E7EB] relative z-10">
                      <div className="flex items-center cursor-pointer">
                          <Avatar name={activeChat.avatar || activeChat.name.substring(0,2)} className="w-10 h-10" />
                          <div className="ml-3">
                              <h2 className="text-[#1A1A2E] font-semibold text-sm">{activeChat.name}</h2>
                              <p className="text-gray-400 text-xs flex items-center">
                                  {activeChat.type === 'group' ? 'Group conversation' : (
                                      <span className="flex items-center text-[#059669]">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mr-1.5 inline-block"></span> Online
                                      </span>
                                  )}
                              </p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Search className="w-4 h-4 cursor-pointer text-gray-500 hover:text-[#1A1A2E]" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 cursor-pointer text-gray-500 hover:text-[#1A1A2E]" />
                          </button>
                      </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 relative z-10 custom-scrollbar bg-[#F8FAFB]">
                      {/* Date Separator */}
                      <div className="flex justify-center mb-4">
                          <span className="bg-white text-gray-400 text-[11px] px-3 py-1 rounded-full border border-[#E5E7EB] font-medium shadow-xs">
                              Today
                          </span>
                      </div>

                      {activeChat.messages.map((msg) => (
                          <div 
                              key={msg.id} 
                              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} group`}
                          >
                              <div 
                                  className={`max-w-[80%] md:max-w-[60%] relative px-4 py-2.5 rounded-xl shadow-xs text-xs leading-relaxed ${
                                      msg.isOwn 
                                      ? 'bg-[#10B981] text-white rounded-tr-none' 
                                      : 'bg-white text-[#1A1A2E] border border-[#E5E7EB] rounded-tl-none'
                                  }`}
                              >
                                  {!msg.isOwn && activeChat.type === 'group' && (
                                      <div className="text-[10px] font-bold text-[#7C3AED] mb-1">
                                          {msg.senderId === 'paul' ? 'Paul Tempo' : 'Other User'}
                                      </div>
                                  )}
                                  <div className={`pr-10 whitespace-pre-wrap ${msg.isOwn ? 'text-white' : 'text-[#1A1A2E]'}`}>
                                      {msg.text}
                                  </div>
                                  <div className="absolute bottom-1.5 right-2.5 flex items-center gap-1">
                                      <span className={`text-[10px] ${msg.isOwn ? 'text-white/80' : 'text-gray-400'}`}>{msg.timestamp}</span>
                                      {msg.isOwn && (
                                          <CheckCheck className="w-3 h-3 text-white/90" />
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))}
                      <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="bg-white px-4 py-3 flex items-center gap-2 relative z-10 border-t border-[#E5E7EB]">
                      <div className="flex gap-1 text-gray-400">
                          <button type="button" className="p-2 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
                              <Smile className="w-5 h-5 cursor-pointer" />
                          </button>
                          <button type="button" className="p-2 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
                              <Paperclip className="w-5 h-5 cursor-pointer" />
                          </button>
                      </div>
                      
                      <form onSubmit={handleSendMessage} className="flex-1">
                          <input 
                              type="text" 
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              placeholder="Type a message..." 
                              className="w-full py-2.5 px-4 rounded-lg border border-[#E5E7EB] focus:border-[#10B981] focus:ring-2 focus:ring-emerald-500/20 text-[#1A1A2E] placeholder-gray-400 bg-[#F8FAFB] text-xs outline-none transition-all"
                          />
                      </form>

                      {messageInput.trim() ? (
                          <button onClick={handleSendMessage} className="p-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg transition-colors shadow-xs">
                              <Send className="w-4 h-4" />
                          </button>
                      ) : (
                          <button type="button" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Mic className="w-5 h-5 cursor-pointer" />
                          </button>
                      )}
                  </div>
              </>
          ) : (
              // Empty State
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#F8FAFB]">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
                      <Users className="w-10 h-10 text-[#10B981]" />
                  </div>
                  <h1 className="text-xl font-bold text-[#1A1A2E] mb-2">BetterFit Messages</h1>
                  <p className="text-gray-500 text-xs max-w-sm leading-relaxed">
                      Connect with assessors, learners, and moderation teams seamlessly in real-time.
                  </p>
                  <div className="mt-6 flex items-center text-gray-400 text-xs">
                      <Shield className="w-3.5 h-3.5 mr-1.5 text-[#10B981]" /> End-to-end encrypted messaging
                  </div>
              </div>
          )}
      </div>

      {/* ----------------------------------------------------------------------------------
          NEW CHAT MODAL
      ---------------------------------------------------------------------------------- */}
      {isNewChatOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden h-[80vh] flex flex-col animate-in fade-in duration-200 border border-gray-200">
                  
                  {/* Header */}
                  <div className="bg-[#10B981] px-5 py-4 flex items-center text-white shrink-0">
                      <button onClick={() => setIsNewChatOpen(false)} className="mr-3 p-1 hover:bg-white/10 rounded-lg transition-colors">
                          <ArrowLeft className="w-5 h-5 text-white" />
                      </button>
                      <div>
                          <h2 className="font-semibold text-base text-white">Start New Conversation</h2>
                          <p className="text-xs text-white/80">{MOCK_CONTACTS.length} contacts available</p>
                      </div>
                  </div>

                  {/* Search */}
                  <div className="p-3 border-b border-[#E5E7EB]">
                      <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                              type="text" 
                              placeholder="Search name or group..." 
                              value={newChatSearch}
                              onChange={(e) => setNewChatSearch(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-[#F8FAFB] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10B981] text-xs outline-none"
                          />
                      </div>
                  </div>

                  {/* List */}
                  <div className="flex-1 overflow-y-auto">
                      
                      {/* Broad Groups */}
                      <div className="px-4 pt-4 pb-2">
                          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Broadcast & Teams</div>
                          <div className="space-y-1">
                              <button onClick={() => startNewChat('All Users', 'broadcast', 'BROADCAST')} className="w-full flex items-center p-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left group">
                                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center mr-3 group-hover:bg-emerald-100 transition-colors border border-emerald-100">
                                      <Users className="w-4 h-4 text-[#10B981]" />
                                  </div>
                                  <span className="text-xs font-semibold text-[#1A1A2E]">All Users</span>
                              </button>
                              <button onClick={() => startNewChat('Administrators', 'group', 'ADMIN')} className="w-full flex items-center p-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left group">
                                  <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center mr-3 group-hover:bg-purple-100 transition-colors border border-purple-100">
                                      <Shield className="w-4 h-4 text-[#7C3AED]" />
                                  </div>
                                  <span className="text-xs font-semibold text-[#1A1A2E]">Administrators</span>
                              </button>
                              <button onClick={() => startNewChat('Assessors', 'group', 'ASSESSOR')} className="w-full flex items-center p-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left group">
                                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center mr-3 group-hover:bg-emerald-100 transition-colors border border-emerald-100">
                                      <Briefcase className="w-4 h-4 text-[#10B981]" />
                                  </div>
                                  <span className="text-xs font-semibold text-[#1A1A2E]">Assessors</span>
                              </button>
                              <button onClick={() => startNewChat('Moderators', 'group', 'MODERATOR')} className="w-full flex items-center p-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left group">
                                  <div className="w-9 h-9 rounded-full bg-cyan-50 flex items-center justify-center mr-3 group-hover:bg-cyan-100 transition-colors border border-cyan-100">
                                      <FileCheck className="w-4 h-4 text-[#06B6D4]" />
                                  </div>
                                  <span className="text-xs font-semibold text-[#1A1A2E]">Moderators</span>
                              </button>
                              <button onClick={() => startNewChat('Super Admins', 'group', 'SUPER_ADMIN')} className="w-full flex items-center p-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left group">
                                  <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center mr-3 group-hover:bg-amber-100 transition-colors border border-amber-100">
                                      <Zap className="w-4 h-4 text-[#F59E0B]" />
                                  </div>
                                  <span className="text-xs font-semibold text-[#1A1A2E]">Super Admins</span>
                              </button>
                          </div>
                      </div>

                      <div className="h-px bg-gray-100 mx-4 my-2"></div>

                      {/* Individuals */}
                      <div className="px-4 pb-4">
                          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Individual Contacts</div>
                          <div className="space-y-1">
                              {MOCK_CONTACTS
                                .filter(u => u.name.toLowerCase().includes(newChatSearch.toLowerCase()))
                                .map(user => (
                                  <button 
                                      key={user.id} 
                                      onClick={() => startNewChat(user.name, 'individual')}
                                      className="w-full flex items-center p-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                                  >
                                      <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center mr-3 overflow-hidden font-semibold text-xs border border-emerald-100 group-hover:border-[#10B981]">
                                          {user.avatar}
                                      </div>
                                      <div>
                                          <span className="block font-semibold text-xs text-[#1A1A2E]">{user.name}</span>
                                          <span className="block text-[11px] text-gray-400">{user.role}</span>
                                      </div>
                                  </button>
                              ))}
                          </div>
                      </div>

                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Messaging;