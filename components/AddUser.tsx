import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, User, Shield, Briefcase, PenTool, GraduationCap, Zap, CheckCircle, Camera, Check, Info, Brain, Lock } from 'lucide-react';

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  
  // Role State - Now an array for multiple selection
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['LEARNER']);

  // Profile Image State
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    email: '',
    phone: '',
    emergencyContactName: '', 
    emergencyContact: '', 
    address: '',
    city: '',
    country: 'United Kingdom',
    postcode: '',
    // Learner Specifics
    dob: '',
    gender: '',
    disability: '',
    courseType: '',
    enrollmentDate: '', // Added enrollment date
    region: '',
    learnerType: '',
    paymentPlan: '',
    candidateNumber: '',
    addedBy: '',
    assessorName: '',
    assessorEmail: '',
    // Learning Support
    supportEnabled: false,
    supportExtraTime: false,
    supportFormat: false,
    supportCommStyle: false,
    supportDigitalLiteracy: false,
    supportNotes: '',
    // Staff Specifics
    jobTitle: '',
    department: '',
    bio: ''
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Role Definitions
  const AVAILABLE_ROLES = [
      { id: 'LEARNER', label: 'Learner', icon: GraduationCap, description: 'Access to courses and learning materials.' },
      { id: 'ASSESSOR', label: 'Assessor', icon: Briefcase, description: 'Grade work and manage learner progress.' },
      { id: 'MODERATOR', label: 'Moderator', icon: Shield, description: 'IQA sampling and quality assurance.' },
      { id: 'CREATOR', label: 'Creator', icon: PenTool, description: 'Build courses, forms, and banners.' },
      { id: 'ADMIN', label: 'Admin', icon: User, description: 'General user management.' },
      { id: 'SUPER_ADMIN', label: 'Super Admin', icon: Zap, description: 'Full system control.' },
  ];

  // Mock Data
  const courseTypes = ['Premier', 'Gold', 'Master', 'Platinum flexi', 'Black label'];
  const regions = [
    'North East', 'North West', 'Midlands', 'East Anglia', 'West London', 
    'South London', 'East London', 'North London', 'South East', 'South', 
    'South West', 'South Wales', 'North Wales', 'Scotland', 'Northern Ireland', 'International'
  ];
  const learnerTypes = ['Self study', 'Flexi', 'Full time'];
  const paymentPlans = ['Paid in Full', 'Installment Plan', 'Funded']; // Updated payment plans
  const assessors = [
    { name: 'Sarah Connor', email: 'sarah.connor@betterfit.com' },
    { name: 'Davos Seaworth', email: 'davos.seaworth@betterfit.com' },
    { name: 'Elena Fisher', email: 'elena.fisher@betterfit.com' },
    { name: 'Marcus Aurelius', email: 'marcus.aurelius@betterfit.com' }
  ];

  // Logic to determine active sections
  const isLearner = selectedRoles.includes('LEARNER');
  const isStaff = selectedRoles.some(role => role !== 'LEARNER'); // Any role other than Learner implies staff permissions

  useEffect(() => {
      validateForm();
  }, [formData, selectedRoles]);

  const validateForm = () => {
      const commonRequired = 
          formData.firstName.trim() !== '' &&
          formData.surname.trim() !== '' &&
          formData.email.trim() !== '' &&
          formData.phone.trim() !== '' &&
          formData.address.trim() !== '' &&
          formData.city.trim() !== '' &&
          formData.postcode.trim() !== '' &&
          formData.addedBy.trim() !== '';

      let learnerValid = true;
      if (isLearner) {
          learnerValid = 
              formData.dob !== '' &&
              formData.gender !== '' &&
              formData.courseType !== '' &&
              formData.enrollmentDate !== '' &&
              formData.region !== '' &&
              formData.learnerType !== '' &&
              formData.paymentPlan !== '' &&
              formData.assessorName !== '';
      }

      let staffValid = true;
      if (isStaff) {
          staffValid = formData.jobTitle.trim() !== '';
      }

      setIsFormValid(commonRequired && learnerValid && staffValid && selectedRoles.length > 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const finalValue = type === 'checkbox' ? target.checked : value;

    setFormData(prev => {
      const newData = { ...prev, [name]: finalValue };
      if (name === 'assessorName') {
        const selectedAssessor = assessors.find(a => a.name === value);
        newData.assessorEmail = selectedAssessor ? selectedAssessor.email : '';
      }
      return newData;
    });
  };

  const handleToggleSupport = () => {
      setFormData(prev => ({ ...prev, supportEnabled: !prev.supportEnabled }));
  };

  const toggleRole = (roleId: string) => {
      setSelectedRoles(prev => {
          if (prev.includes(roleId)) {
              return prev.filter(r => r !== roleId);
          } else {
              return [...prev, roleId];
          }
      });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log(`Submitting new user with roles: ${selectedRoles.join(', ')}`, { ...formData, profileImage });
    navigate('/dashboard');
  };

  const getRoleDisplayName = (role: string) => {
      const r = AVAILABLE_ROLES.find(r => r.id === role);
      return r ? r.label : role;
  };

  return (
    <div className="w-full mx-auto pb-12">
      {/* Header / Nav */}
      <div className="mb-6 flex items-center justify-between">
         <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-[#6c6c6c] hover:text-[#01427a] transition-colors"
        >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-[#afafaf]/50 overflow-hidden">
        
        {/* Form Header Area */}
        <div className="bg-slate-50 border-b border-[#afafaf]/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-xl font-bold text-[#0c0c0d]">
                    Create New User
                </h1>
                <p className="text-sm text-[#6c6c6c] mt-1">
                    Assign one or multiple roles to this user.
                </p>
            </div>
            {/* Search Placeholder */}
            <div className="flex items-center space-x-2 bg-white p-2 rounded-md border border-[#afafaf] shadow-sm">
                <Search className="w-4 h-4 text-[#afafaf]" />
                <input 
                    type="text" 
                    placeholder="Check existing..." 
                    className="text-sm border-none focus:ring-0 w-32"
                />
            </div>
        </div>

        <div className="p-8">
            {/* Profile Picture Upload Section */}
            <div className="mb-10 flex flex-col items-center justify-center">
                <div className="relative group">
                    <div className={`w-32 h-32 rounded-full border-4 border-slate-100 shadow-sm overflow-hidden flex items-center justify-center bg-slate-50 ${!profileImage && 'hover:bg-slate-100'}`}>
                        {profileImage ? (
                            <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-2">
                                <User className="w-10 h-10 mx-auto text-[#afafaf] mb-1" />
                                <span className="text-[10px] text-[#6c6c6c] font-bold uppercase">No Photo</span>
                            </div>
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-[#01b3ef] text-white p-2.5 rounded-full cursor-pointer hover:bg-[#01427a] shadow-md transition-colors border-2 border-white">
                        <Camera className="w-5 h-5" />
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg" 
                            className="hidden" 
                            onChange={handleImageUpload} 
                        />
                    </label>
                </div>
                <div className="mt-3 text-center">
                    <span className="block text-sm font-bold text-[#01427a]">Profile Photo</span>
                    <p className="text-xs text-[#afafaf]">Allowed *.jpeg, *.jpg, *.png, max 3MB</p>
                </div>
            </div>

            {/* Role Selection (Multi-Select) */}
            <div className="mb-8 border-b border-[#afafaf]/30 pb-8">
                <label className="block text-sm font-bold text-[#6c6c6c] uppercase tracking-wider mb-4">Select User Role(s)</label>
                
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                    {AVAILABLE_ROLES.map((role) => {
                        const isSelected = selectedRoles.includes(role.id);
                        return (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => toggleRole(role.id)}
                                className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 group h-full ${
                                    isSelected 
                                    ? 'border-[#01b3ef] bg-[#01b3ef]/5 shadow-sm' 
                                    : 'border-[#afafaf]/30 bg-white hover:border-[#01b3ef]/50 hover:bg-slate-50'
                                }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-2 right-2 bg-[#01b3ef] text-white rounded-full p-0.5">
                                        <Check className="w-3 h-3" />
                                    </div>
                                )}
                                <div className={`p-2 rounded-full mb-2 ${isSelected ? 'bg-[#01b3ef] text-white' : 'bg-slate-100 text-[#6c6c6c] group-hover:text-[#01b3ef]'}`}>
                                    <role.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-sm font-bold mb-1 ${isSelected ? 'text-[#01427a]' : 'text-[#0c0c0d]'}`}>
                                    {role.label}
                                </span>
                                <span className="text-[10px] text-center text-[#6c6c6c] leading-tight px-1">
                                    {role.description}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {selectedRoles.length === 0 && (
                    <p className="text-xs text-red-500 mt-2 font-bold flex items-center">
                        <Info className="w-3 h-3 mr-1" /> At least one role must be selected.
                    </p>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-bold text-[#01427a] mb-4 pb-2 border-b border-[#afafaf]/30">Personal Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Common Fields */}
                    <div>
                        <label className="block text-sm font-bold text-[#6c6c6c] mb-1">First Name <span className="text-red-600">*</span></label>
                        <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Middle Name</label>
                        <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Surname <span className="text-red-600">*</span></label>
                        <input type="text" name="surname" required value={formData.surname} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                    </div>
                    
                    {/* Conditional Learner Personal Fields */}
                    {isLearner && (
                        <>
                             <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Date of Birth <span className="text-red-600">*</span></label>
                                <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Gender <span className="text-red-600">*</span></label>
                                <select name="gender" required value={formData.gender} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 bg-white">
                                    <option value="">Select...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Email Address <span className="text-red-600">*</span></label>
                        <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Phone Number <span className="text-red-600">*</span></label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Emergency Contact Name</label>
                        <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" placeholder="Optional" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Emergency Contact Number</label>
                        <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" placeholder="Optional" />
                    </div>

                    {isStaff && (
                        <div>
                            <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Job Title <span className="text-red-600">*</span></label>
                            <input type="text" name="jobTitle" required={isStaff} value={formData.jobTitle} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" placeholder="e.g. Senior Assessor" />
                        </div>
                    )}
                </div>

                <h3 className="text-lg font-bold text-[#01427a] mb-4 pb-2 border-b border-[#afafaf]/30">Location & Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Street Address <span className="text-red-600">*</span></label>
                        <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#6c6c6c] mb-1">City / Town <span className="text-red-600">*</span></label>
                        <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Postcode / Zip <span className="text-red-600">*</span></label>
                        <input type="text" name="postcode" required value={formData.postcode} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Country <span className="text-red-600">*</span></label>
                        <select name="country" required value={formData.country} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 bg-white">
                            <option>United Kingdom</option>
                            <option>Ireland</option>
                            <option>United States</option>
                            <option>Canada</option>
                            <option>Australia</option>
                            <option>International</option>
                        </select>
                    </div>
                </div>

                {/* Conditional Sections based on Roles */}
                
                {/* 1. LEARNER SECTION */}
                {isLearner && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* LEARNING SUPPORT SECTION */}
                        <div className="bg-white rounded-xl border border-[#afafaf]/30 p-6 relative overflow-hidden mb-8 shadow-sm">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8b5cf6]"></div> {/* Purple strip */}
                            
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6 pl-2">
                                <h3 className="text-lg font-bold text-[#0c0c0d] flex items-center">
                                    <Brain className="w-5 h-5 mr-2 text-[#8b5cf6]" />
                                    Learning Support & Accessibility
                                </h3>
                                <span className="bg-slate-100 text-[#6c6c6c] text-xs font-bold px-3 py-1 rounded-full border border-[#afafaf]/20 flex items-center">
                                    <Lock className="w-3 h-3 mr-1" /> Confidential
                                </span>
                            </div>

                            {/* Toggle Section */}
                            <div className="bg-slate-50 border border-[#afafaf]/30 rounded-lg p-4 mb-6 flex items-center justify-between ml-2">
                                <div>
                                    <h4 className="font-bold text-[#0c0c0d] text-sm">Enable Support Options</h4>
                                    <p className="text-xs text-[#6c6c6c] mt-0.5">Does the learner have specific needs (Neurodiversity, Physical, or Sensory)?</p>
                                </div>
                                {/* Toggle Switch */}
                                <button 
                                    type="button"
                                    onClick={handleToggleSupport}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative focus:outline-none ${formData.supportEnabled ? 'bg-[#0c0c0d]' : 'bg-slate-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${formData.supportEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            {/* Conditional Fields */}
                            {formData.supportEnabled && (
                                <div className="space-y-6 ml-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Extra Time Checkbox Card */}
                                        <label className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${formData.supportExtraTime ? 'border-[#8b5cf6] bg-[#8b5cf6]/5' : 'border-[#afafaf]/30 hover:border-[#8b5cf6]/50'}`}>
                                            <input 
                                                type="checkbox" 
                                                name="supportExtraTime" 
                                                checked={formData.supportExtraTime}
                                                onChange={handleInputChange}
                                                className="mt-1 mr-3 w-4 h-4 text-[#8b5cf6] focus:ring-[#8b5cf6] rounded border-gray-300"
                                            />
                                            <div>
                                                <span className="block text-sm font-bold text-[#0c0c0d]">Extra Time / Flexibility</span>
                                                <span className="block text-xs text-[#6c6c6c] mt-0.5">Deadlines, quiz timers, breaks.</span>
                                            </div>
                                        </label>

                                        {/* Format Requirements Checkbox Card */}
                                        <label className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${formData.supportFormat ? 'border-[#8b5cf6] bg-[#8b5cf6]/5' : 'border-[#afafaf]/30 hover:border-[#8b5cf6]/50'}`}>
                                            <input 
                                                type="checkbox" 
                                                name="supportFormat"
                                                checked={formData.supportFormat}
                                                onChange={handleInputChange}
                                                className="mt-1 mr-3 w-4 h-4 text-[#8b5cf6] focus:ring-[#8b5cf6] rounded border-gray-300"
                                            />
                                            <div>
                                                <span className="block text-sm font-bold text-[#0c0c0d]">Format Requirements</span>
                                                <span className="block text-xs text-[#6c6c6c] mt-0.5">Screen reader, high contrast, captions.</span>
                                            </div>
                                        </label>

                                        {/* Communication Style Checkbox Card */}
                                        <label className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${formData.supportCommStyle ? 'border-[#8b5cf6] bg-[#8b5cf6]/5' : 'border-[#afafaf]/30 hover:border-[#8b5cf6]/50'}`}>
                                            <input 
                                                type="checkbox" 
                                                name="supportCommStyle"
                                                checked={formData.supportCommStyle}
                                                onChange={handleInputChange}
                                                className="mt-1 mr-3 w-4 h-4 text-[#8b5cf6] focus:ring-[#8b5cf6] rounded border-gray-300"
                                            />
                                            <div>
                                                <span className="block text-sm font-bold text-[#0c0c0d]">Communication Style</span>
                                                <span className="block text-xs text-[#6c6c6c] mt-0.5">Direct instructions, no cold-calling, etc.</span>
                                            </div>
                                        </label>

                                        {/* Digital Literacy Checkbox Card */}
                                        <label className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${formData.supportDigitalLiteracy ? 'border-[#8b5cf6] bg-[#8b5cf6]/5' : 'border-[#afafaf]/30 hover:border-[#8b5cf6]/50'}`}>
                                            <input 
                                                type="checkbox" 
                                                name="supportDigitalLiteracy" 
                                                checked={formData.supportDigitalLiteracy}
                                                onChange={handleInputChange}
                                                className="mt-1 mr-3 w-4 h-4 text-[#8b5cf6] focus:ring-[#8b5cf6] rounded border-gray-300"
                                            />
                                            <div>
                                                <span className="block text-sm font-bold text-[#0c0c0d]">Digital Literacy Support</span>
                                                <span className="block text-xs text-[#6c6c6c] mt-0.5">Assistance for low digital confidence/skills.</span>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Textarea */}
                                    <div>
                                        <label className="block text-sm font-bold text-[#0c0c0d] mb-2">Specific Adjustments Needed</label>
                                        <textarea 
                                            name="supportNotes"
                                            value={formData.supportNotes}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full border border-[#afafaf]/50 rounded-lg p-3 text-sm focus:border-[#8b5cf6] focus:ring-[#8b5cf6] resize-none placeholder:text-[#afafaf]"
                                            placeholder="E.g., Learner prefers written instructions over verbal. Sensitive to loud notification sounds. Requires 25% extra time on exams."
                                        ></textarea>
                                    </div>
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-[#01427a] mb-4 pb-2 border-b border-[#afafaf]/30">Course & Enrollment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Course Package <span className="text-red-600">*</span></label>
                                <select name="courseType" required value={formData.courseType} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 bg-white">
                                    <option value="">Select Package...</option>
                                    {courseTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Enrollment Date <span className="text-red-600">*</span></label>
                                <input type="date" name="enrollmentDate" required value={formData.enrollmentDate} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Learner Type <span className="text-red-600">*</span></label>
                                <select name="learnerType" required value={formData.learnerType} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 bg-white">
                                    <option value="">Select Type...</option>
                                    {learnerTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Region <span className="text-red-600">*</span></label>
                                <select name="region" required value={formData.region} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 bg-white">
                                    <option value="">Select Region...</option>
                                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Payment Plan <span className="text-red-600">*</span></label>
                                <select name="paymentPlan" required value={formData.paymentPlan} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 bg-white">
                                    <option value="">Select Plan...</option>
                                    {paymentPlans.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Assign Mentor/Assessor <span className="text-red-600">*</span></label>
                                <select name="assessorName" required value={formData.assessorName} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 bg-white">
                                    <option value="">Select Assessor...</option>
                                    {assessors.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Candidate No.</label>
                                <input type="text" name="candidateNumber" placeholder="Generated if empty" value={formData.candidateNumber} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 bg-slate-50" />
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. STAFF / PERMISSIONS SECTION */}
                {isStaff && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <h3 className="text-lg font-bold text-[#01427a] mb-4 pb-2 border-b border-[#afafaf]/30">System Permissions & Staff Details</h3>
                         
                         <div className="bg-[#01b3ef]/10 p-4 rounded-md border border-[#01b3ef]/20 mb-6">
                             <div className="flex items-start">
                                 <Shield className="w-5 h-5 text-[#01b3ef] mr-3 mt-0.5" />
                                 <div>
                                     <h4 className="font-bold text-[#01427a] text-sm mb-1">Active Roles</h4>
                                     <div className="flex flex-wrap gap-2">
                                         {selectedRoles.filter(r => r !== 'LEARNER').map(r => (
                                             <span key={r} className="text-xs bg-white text-[#01427a] border border-[#01b3ef]/30 px-2 py-1 rounded font-bold">
                                                 {getRoleDisplayName(r)}
                                             </span>
                                         ))}
                                     </div>
                                     {selectedRoles.includes('SUPER_ADMIN') && (
                                         <p className="text-xs text-red-600 mt-2 font-bold">
                                             Warning: Super Admin role grants full system control.
                                         </p>
                                     )}
                                 </div>
                             </div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Added By <span className="text-red-600">*</span></label>
                                <input type="text" name="addedBy" required value={formData.addedBy} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" placeholder="Admin Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Department</label>
                                <input type="text" name="department" value={formData.department} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" placeholder="e.g. Submission Team" />
                            </div>
                         </div>

                         <div className="mb-6">
                            <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Bio / Internal Notes</label>
                            <textarea name="bio" rows={3} value={formData.bio} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" placeholder="Add notes about this staff member..."></textarea>
                         </div>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-[#afafaf]/30 flex justify-end gap-3">
                    <button 
                        type="button" 
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 border border-[#afafaf] text-[#6c6c6c] font-bold rounded-lg hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={!isFormValid}
                        className={`px-8 py-3 font-bold rounded-lg shadow-md transition-all transform flex items-center ${
                            isFormValid 
                            ? 'bg-[#01427a] text-white hover:bg-[#003366] hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-[#01b3ef]' 
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                        {isFormValid && <CheckCircle className="w-4 h-4 mr-2" />}
                        Create User
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;