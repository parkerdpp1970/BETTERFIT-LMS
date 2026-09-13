import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Search, ChevronDown } from 'lucide-react';

const AddLearner: React.FC = () => {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    dob: '',
    gender: '',
    email: '',
    address: '',
    disability: '',
    courseType: '',
    region: '',
    learnerType: '',
    paymentPlan: '',
    contactNumber: '',
    candidateNumber: '',
    addedBy: '',
    assessorName: '',
    assessorEmail: ''
  });

  // Mock Data for Dropdowns
  const courseTypes = ['Premier', 'Gold', 'Master', 'Platinum flexi', 'Black label'];
  const regions = [
    'North East', 'North West', 'Midlands', 'East Anglia', 'West London', 
    'South London', 'East London', 'North London', 'South East', 'South', 
    'South West', 'South Wales', 'North Wales', 'Scotland', 'Northern Ireland', 'International'
  ];
  const learnerTypes = ['Self study', 'Flexi', 'Full time'];
  const paymentPlans = ['Paid in full', 'Payment plan'];
  
  const assessors = [
    { name: 'Sarah Connor', email: 'sarah.connor@betterfit.com' },
    { name: 'Davos Seaworth', email: 'davos.seaworth@betterfit.com' },
    { name: 'Elena Fisher', email: 'elena.fisher@betterfit.com' },
    { name: 'Marcus Aurelius', email: 'marcus.aurelius@betterfit.com' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Linked dropdown logic for Assessor
      if (name === 'assessorName') {
        const selectedAssessor = assessors.find(a => a.name === value);
        if (selectedAssessor) {
          newData.assessorEmail = selectedAssessor.email;
        } else {
            newData.assessorEmail = '';
        }
      }
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log('Submitting Learner:', formData);
    navigate('/dashboard');
  };

  return (
    <div className="w-full mx-auto">
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
                <h1 className="text-xl font-bold text-[#0c0c0d]">Add new learner <span className="text-sm font-normal text-[#6c6c6c] ml-2">(name to appear on certificate)</span></h1>
            </div>

            {/* Search Area (Top Right) */}
            <div className="flex items-center space-x-2 bg-white p-2 rounded-md border border-[#afafaf] shadow-sm">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="pl-2 pr-8 py-1 text-sm border-b border-transparent focus:border-[#01b3ef] focus:outline-none w-40"
                    />
                    <Search className="w-3 h-3 text-[#afafaf] absolute right-2 top-1/2 -translate-y-1/2" />
                </div>
                <div className="h-4 w-px bg-[#afafaf]"></div>
                <select className="text-sm text-[#6c6c6c] bg-transparent border-none focus:ring-0 cursor-pointer">
                    <option>Search by</option>
                    <option>First name</option>
                    <option>Full name</option>
                    <option>Phone number</option>
                    <option>Email address</option>
                    <option>Admin team member</option>
                </select>
            </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Row 1: Names */}
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">First name</label>
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Middle name</label>
                    <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Surname</label>
                    <input type="text" name="surname" required value={formData.surname} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                </div>

                {/* Row 2: Personal Details */}
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">DOB</label>
                    <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Gender</label>
                    <select name="gender" required value={formData.gender} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-white">
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Email address</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                </div>

                {/* Row 3: Address & Disability */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Home address</label>
                    <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Disability/Learning difficulty</label>
                    <input type="text" name="disability" value={formData.disability} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" placeholder="If appropriate" />
                </div>

                {/* Row 4: Course Info */}
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Course type</label>
                    <div className="relative">
                        <select name="courseType" required value={formData.courseType} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-white appearance-none">
                            <option value="">Select...</option>
                            {courseTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Learner region</label>
                     <div className="relative">
                        <select name="region" required value={formData.region} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-white appearance-none">
                            <option value="">Select...</option>
                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Type of learner</label>
                     <div className="relative">
                        <select name="learnerType" required value={formData.learnerType} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-white appearance-none">
                            <option value="">Select...</option>
                            {learnerTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                    </div>
                </div>

                {/* Row 5: Contact & Admin */}
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Type of payment plan</label>
                     <div className="relative">
                        <select name="paymentPlan" required value={formData.paymentPlan} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-white appearance-none">
                            <option value="">Select...</option>
                            {paymentPlans.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Contact number</label>
                    <input type="tel" name="contactNumber" required value={formData.contactNumber} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Candidate number</label>
                    <input type="text" name="candidateNumber" required pattern="\d{6}" title="Must be 6 digits" placeholder="6 digits" value={formData.candidateNumber} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Added by</label>
                    <input type="text" name="addedBy" required value={formData.addedBy} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef]" placeholder="Admin name" />
                </div>
                
                {/* Row 6: Assessor Details (Linked) */}
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Assessor name</label>
                     <div className="relative">
                        <select name="assessorName" required value={formData.assessorName} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-white appearance-none">
                            <option value="">Select Assessor...</option>
                            {assessors.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Assessor email</label>
                     <div className="relative">
                        {/* Auto-filled/Linked dropdown simulation */}
                        <select name="assessorEmail" required value={formData.assessorEmail} onChange={handleInputChange} className="w-full border border-[#afafaf] rounded-md p-2 focus:ring-[#01b3ef] focus:border-[#01b3ef] bg-slate-50 appearance-none">
                             <option value="">Linked to Assessor...</option>
                             {assessors.map(a => <option key={a.email} value={a.email}>{a.email}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#afafaf] pointer-events-none" />
                    </div>
                </div>

            </div>

            <div className="mt-8 pt-6 border-t border-[#afafaf]/30 flex justify-end">
                <button 
                    type="submit" 
                    className="px-8 py-3 bg-[#01427a] text-white font-bold rounded-lg shadow-md hover:bg-[#003366] transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-[#01b3ef]"
                >
                    Submit
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddLearner;