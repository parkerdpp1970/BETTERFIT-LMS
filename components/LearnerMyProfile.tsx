import React, { useState } from 'react';
import { 
    User, Lock, Bell, FileText, Camera, Save, 
    Check, AlertCircle, Eye, EyeOff, Mail, MapPin, 
    Phone, Globe, Shield, Download
} from 'lucide-react';

const LearnerMyProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'preferences' | 'documents'>('personal');
  const [isEditing, setIsEditing] = useState(false);

  // Mock User Data
  const [userData, setUserData] = useState({
      firstName: 'Sam',
      lastName: 'Deeley',
      email: 'sam.deeley@example.com',
      phone: '07700 900123',
      address: '123 High Street, Birmingham, B1 1AA',
      bio: 'Aspiring Personal Trainer with a passion for functional fitness and nutrition.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'
  });

  // Password State
  const [passwords, setPasswords] = useState({
      current: '',
      new: '',
      confirm: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Preferences State
  const [preferences, setPreferences] = useState({
      emailNotifs: true,
      smsNotifs: false,
      marketing: false,
      highContrast: false,
      largeText: false
  });

  // Password Validation Logic
  const passwordChecks = {
      length: passwords.new.length >= 8,
      upper: /[A-Z]/.test(passwords.new),
      lower: /[a-z]/.test(passwords.new),
      special: /[0-9!@#$%^&*]/.test(passwords.new),
      match: passwords.new === passwords.confirm && passwords.new !== ''
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSave = () => {
      setIsEditing(false);
      // Logic to save profile would go here
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
        
        {/* Header Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#afafaf]/50 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#01427a] to-[#01b3ef]"></div>
            
            <div className="relative flex flex-col md:flex-row items-end md:items-center gap-6 mt-12 px-4">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200">
                        <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-2 right-2 p-2 bg-[#01b3ef] text-white rounded-full shadow-lg hover:bg-[#01427a] transition-colors border-2 border-white">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex-1 mb-2">
                    <h1 className="text-2xl font-extrabold text-[#0c0c0d]">{userData.firstName} {userData.lastName}</h1>
                    <p className="text-[#6c6c6c] flex items-center gap-2 text-sm">
                        <span className="bg-[#01b3ef]/10 text-[#01b3ef] px-2 py-0.5 rounded font-bold uppercase text-xs">Learner</span>
                        • Candidate No: 2023-8892
                    </p>
                </div>

                <div className="mb-2 flex gap-3">
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 border border-[#afafaf] bg-white text-[#6c6c6c] rounded-lg font-bold hover:bg-slate-50 transition-colors"
                    >
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                    {isEditing && (
                        <button onClick={handleSave} className="px-4 py-2 bg-[#01b3ef] text-white rounded-lg font-bold hover:bg-[#01427a] transition-colors shadow-md flex items-center">
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </button>
                    )}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2">
                <button 
                    onClick={() => setActiveTab('personal')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm flex items-center transition-all ${activeTab === 'personal' ? 'bg-[#01427a] text-white shadow-md' : 'bg-white text-[#6c6c6c] hover:bg-slate-50 border border-transparent'}`}
                >
                    <User className="w-4 h-4 mr-3" /> Personal Details
                </button>
                <button 
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm flex items-center transition-all ${activeTab === 'security' ? 'bg-[#01427a] text-white shadow-md' : 'bg-white text-[#6c6c6c] hover:bg-slate-50 border border-transparent'}`}
                >
                    <Lock className="w-4 h-4 mr-3" /> Security & Password
                </button>
                <button 
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm flex items-center transition-all ${activeTab === 'preferences' ? 'bg-[#01427a] text-white shadow-md' : 'bg-white text-[#6c6c6c] hover:bg-slate-50 border border-transparent'}`}
                >
                    <Bell className="w-4 h-4 mr-3" /> Preferences
                </button>
                <button 
                    onClick={() => setActiveTab('documents')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm flex items-center transition-all ${activeTab === 'documents' ? 'bg-[#01427a] text-white shadow-md' : 'bg-white text-[#6c6c6c] hover:bg-slate-50 border border-transparent'}`}
                >
                    <FileText className="w-4 h-4 mr-3" /> My Documents
                </button>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
                
                {/* 1. PERSONAL DETAILS TAB */}
                {activeTab === 'personal' && (
                    <div className="bg-white rounded-xl shadow-sm border border-[#afafaf]/50 p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-lg font-bold text-[#0c0c0d] mb-6 border-b border-[#afafaf]/20 pb-4">Personal Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">First Name</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={userData.firstName}
                                    onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                                    className="w-full border border-[#afafaf] rounded-lg p-3 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef] disabled:bg-slate-50 disabled:text-[#6c6c6c]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Last Name</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={userData.lastName}
                                    onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                                    className="w-full border border-[#afafaf] rounded-lg p-3 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef] disabled:bg-slate-50 disabled:text-[#6c6c6c]"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Bio / About Me</label>
                                <textarea 
                                    rows={3}
                                    disabled={!isEditing}
                                    value={userData.bio}
                                    onChange={(e) => setUserData({...userData, bio: e.target.value})}
                                    className="w-full border border-[#afafaf] rounded-lg p-3 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef] disabled:bg-slate-50 disabled:text-[#6c6c6c]"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1 flex items-center"><Mail className="w-3 h-3 mr-1"/> Email Address</label>
                                <input 
                                    type="email" 
                                    disabled={!isEditing}
                                    value={userData.email}
                                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                                    className="w-full border border-[#afafaf] rounded-lg p-3 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef] disabled:bg-slate-50 disabled:text-[#6c6c6c]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1 flex items-center"><Phone className="w-3 h-3 mr-1"/> Phone Number</label>
                                <input 
                                    type="tel" 
                                    disabled={!isEditing}
                                    value={userData.phone}
                                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                                    className="w-full border border-[#afafaf] rounded-lg p-3 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef] disabled:bg-slate-50 disabled:text-[#6c6c6c]"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1 flex items-center"><MapPin className="w-3 h-3 mr-1"/> Shipping Address</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={userData.address}
                                    onChange={(e) => setUserData({...userData, address: e.target.value})}
                                    className="w-full border border-[#afafaf] rounded-lg p-3 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef] disabled:bg-slate-50 disabled:text-[#6c6c6c]"
                                />
                                <p className="text-[10px] text-[#afafaf] mt-1 italic">Used for certificate delivery.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. SECURITY TAB */}
                {activeTab === 'security' && (
                    <div className="bg-white rounded-xl shadow-sm border border-[#afafaf]/50 p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-lg font-bold text-[#0c0c0d] mb-6 border-b border-[#afafaf]/20 pb-4">Change Password</h2>
                        
                        <div className="max-w-lg">
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Current Password</label>
                                <div className="relative">
                                    <input 
                                        type={showCurrent ? "text" : "password"}
                                        className="w-full border border-[#afafaf] rounded-lg p-3 pr-10 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef]"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                    />
                                    <button 
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#afafaf] hover:text-[#0c0c0d]"
                                    >
                                        {showCurrent ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">New Password</label>
                                <div className="relative">
                                    <input 
                                        type={showNew ? "text" : "password"}
                                        className="w-full border border-[#afafaf] rounded-lg p-3 pr-10 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef]"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                    />
                                    <button 
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#afafaf] hover:text-[#0c0c0d]"
                                    >
                                        {showNew ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements Checklist */}
                            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-[#afafaf]/30 grid grid-cols-2 gap-3">
                                <div className={`flex items-center text-xs ${passwordChecks.length ? 'text-green-600 font-bold' : 'text-[#6c6c6c]'}`}>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${passwordChecks.length ? 'bg-green-100 border-green-600' : 'border-[#afafaf]'}`}>
                                        {passwordChecks.length && <Check className="w-3 h-3" />}
                                    </div>
                                    Min 8 Characters
                                </div>
                                <div className={`flex items-center text-xs ${passwordChecks.upper ? 'text-green-600 font-bold' : 'text-[#6c6c6c]'}`}>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${passwordChecks.upper ? 'bg-green-100 border-green-600' : 'border-[#afafaf]'}`}>
                                        {passwordChecks.upper && <Check className="w-3 h-3" />}
                                    </div>
                                    Uppercase Letter
                                </div>
                                <div className={`flex items-center text-xs ${passwordChecks.lower ? 'text-green-600 font-bold' : 'text-[#6c6c6c]'}`}>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${passwordChecks.lower ? 'bg-green-100 border-green-600' : 'border-[#afafaf]'}`}>
                                        {passwordChecks.lower && <Check className="w-3 h-3" />}
                                    </div>
                                    Lowercase Letter
                                </div>
                                <div className={`flex items-center text-xs ${passwordChecks.special ? 'text-green-600 font-bold' : 'text-[#6c6c6c]'}`}>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${passwordChecks.special ? 'bg-green-100 border-green-600' : 'border-[#afafaf]'}`}>
                                        {passwordChecks.special && <Check className="w-3 h-3" />}
                                    </div>
                                    Number or Special Char
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Confirm New Password</label>
                                <input 
                                    type="password"
                                    className={`w-full border rounded-lg p-3 text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef] ${passwordChecks.match ? 'border-green-500 bg-green-50' : 'border-[#afafaf]'}`}
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                />
                                {passwords.new !== '' && !passwordChecks.match && (
                                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                )}
                            </div>

                            <button 
                                disabled={!isPasswordValid || passwords.current === ''}
                                className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all ${
                                    isPasswordValid && passwords.current !== '' 
                                    ? 'bg-[#01b3ef] hover:bg-[#01427a]' 
                                    : 'bg-slate-300 cursor-not-allowed'
                                }`}
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. PREFERENCES TAB */}
                {activeTab === 'preferences' && (
                    <div className="bg-white rounded-xl shadow-sm border border-[#afafaf]/50 p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-lg font-bold text-[#0c0c0d] mb-6 border-b border-[#afafaf]/20 pb-4">Account Preferences</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-[#01427a] mb-3 uppercase tracking-wide">Notifications</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-3 border border-[#afafaf]/30 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div>
                                            <span className="block text-sm font-bold text-[#0c0c0d]">Email Notifications</span>
                                            <span className="block text-xs text-[#6c6c6c]">Receive updates about assignments and feedback</span>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.emailNotifs}
                                            onChange={() => setPreferences({...preferences, emailNotifs: !preferences.emailNotifs})}
                                            className="w-5 h-5 text-[#01b3ef] rounded focus:ring-[#01b3ef]"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3 border border-[#afafaf]/30 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div>
                                            <span className="block text-sm font-bold text-[#0c0c0d]">SMS Notifications</span>
                                            <span className="block text-xs text-[#6c6c6c]">Get urgent alerts via text message</span>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.smsNotifs}
                                            onChange={() => setPreferences({...preferences, smsNotifs: !preferences.smsNotifs})}
                                            className="w-5 h-5 text-[#01b3ef] rounded focus:ring-[#01b3ef]"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3 border border-[#afafaf]/30 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div>
                                            <span className="block text-sm font-bold text-[#0c0c0d]">Marketing & Offers</span>
                                            <span className="block text-xs text-[#6c6c6c]">Receive news about new CPD courses and discounts</span>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.marketing}
                                            onChange={() => setPreferences({...preferences, marketing: !preferences.marketing})}
                                            className="w-5 h-5 text-[#01b3ef] rounded focus:ring-[#01b3ef]"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="border-t border-[#afafaf]/20 pt-4">
                                <h3 className="text-sm font-bold text-[#01427a] mb-3 uppercase tracking-wide">Accessibility</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-3 border border-[#afafaf]/30 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div>
                                            <span className="block text-sm font-bold text-[#0c0c0d]">High Contrast Mode</span>
                                            <span className="block text-xs text-[#6c6c6c]">Increase contrast for better visibility</span>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.highContrast}
                                            onChange={() => setPreferences({...preferences, highContrast: !preferences.highContrast})}
                                            className="w-5 h-5 text-[#01b3ef] rounded focus:ring-[#01b3ef]"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3 border border-[#afafaf]/30 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div>
                                            <span className="block text-sm font-bold text-[#0c0c0d]">Larger Text</span>
                                            <span className="block text-xs text-[#6c6c6c]">Increase font size across the platform</span>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.largeText}
                                            onChange={() => setPreferences({...preferences, largeText: !preferences.largeText})}
                                            className="w-5 h-5 text-[#01b3ef] rounded focus:ring-[#01b3ef]"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. DOCUMENTS TAB */}
                {activeTab === 'documents' && (
                    <div className="bg-white rounded-xl shadow-sm border border-[#afafaf]/50 p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-lg font-bold text-[#0c0c0d] mb-6 border-b border-[#afafaf]/20 pb-4">My Documents & Certificates</h2>
                        
                        <div className="space-y-4">
                            {/* Certificate Item */}
                            <div className="flex items-center p-4 bg-slate-50 border border-[#afafaf]/30 rounded-lg group hover:border-[#01b3ef] transition-colors">
                                <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg mr-4">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-[#0c0c0d] group-hover:text-[#01b3ef]">L2 Gym Instructor Certificate</h4>
                                    <p className="text-xs text-[#6c6c6c]">Issued: 15 Oct 2023 • Valid until: Lifetime</p>
                                </div>
                                <button className="p-2 text-[#01b3ef] hover:bg-[#01b3ef]/10 rounded-full transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>

                            {/* ID Document */}
                            <div className="flex items-center p-4 bg-slate-50 border border-[#afafaf]/30 rounded-lg group hover:border-[#01b3ef] transition-colors">
                                <div className="p-3 bg-blue-100 text-blue-700 rounded-lg mr-4">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-[#0c0c0d] group-hover:text-[#01b3ef]">Uploaded Photo ID (Passport)</h4>
                                    <p className="text-xs text-[#6c6c6c]">Uploaded: 01 Sept 2023 • Status: <span className="text-green-600 font-bold">Verified</span></p>
                                </div>
                                <button className="p-2 text-[#6c6c6c] hover:bg-slate-200 rounded-full transition-colors">
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Enrollment Agreement */}
                            <div className="flex items-center p-4 bg-slate-50 border border-[#afafaf]/30 rounded-lg group hover:border-[#01b3ef] transition-colors">
                                <div className="p-3 bg-slate-200 text-slate-600 rounded-lg mr-4">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-[#0c0c0d] group-hover:text-[#01b3ef]">Learner Agreement</h4>
                                    <p className="text-xs text-[#6c6c6c]">Signed: 01 Sept 2023</p>
                                </div>
                                <button className="p-2 text-[#01b3ef] hover:bg-[#01b3ef]/10 rounded-full transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

export default LearnerMyProfile;