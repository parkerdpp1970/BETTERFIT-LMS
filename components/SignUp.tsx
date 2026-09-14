import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronDown, CheckCircle2 } from 'lucide-react';
import Button from './ui/Button';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate account creation
    navigate('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 font-sans text-on-surface">
      
      {/* Logo Section */}
      <div className="mb-6 flex items-center justify-center cursor-pointer" onClick={() => navigate('/')}>
         <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center font-bold text-white mr-2.5 shadow-xs">
            B
         </div>
         <span className="font-bold text-xl tracking-tight text-on-surface">BETTERFIT LMS</span>
      </div>

      <div className="max-w-[480px] w-full bg-white rounded-2xl shadow-sm border border-outline-variant p-8">
        <h1 className="text-2xl font-bold text-on-surface mb-1.5">Create your account</h1>
        <p className="text-gray-500 text-xs mb-6">Start managing regulated qualifications with audit-ready confidence.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Work Email */}
            <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">Work email <span className="text-error">*</span></label>
                <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="name@organisation.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-outline-variant rounded-shape-md text-xs text-on-surface placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">First name <span className="text-error">*</span></label>
                    <input 
                        type="text" 
                        name="firstName"
                        required
                        placeholder="Jane"
                        className="w-full px-3.5 py-2.5 bg-white border border-outline-variant rounded-shape-md text-xs text-on-surface placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Last name <span className="text-error">*</span></label>
                    <input 
                        type="text" 
                        name="lastName"
                        required
                        placeholder="Doe"
                        className="w-full px-3.5 py-2.5 bg-white border border-outline-variant rounded-shape-md text-xs text-on-surface placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Phone Number */}
            <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">Phone number <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="flex">
                    <div className="relative">
                        <select className="appearance-none h-full pl-3 pr-7 border border-r-0 border-outline-variant rounded-l-lg bg-surface text-on-surface text-xs font-medium focus:outline-none focus:ring-0 focus:border-outline-variant">
                            <option>🇬🇧 +44</option>
                            <option>🇺🇸 +1</option>
                            <option>🇪🇺 +33</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    </div>
                    <input 
                        type="tel" 
                        name="phone"
                        placeholder="7123 456789"
                        className="flex-1 px-3.5 py-2.5 bg-white border border-outline-variant rounded-r-lg text-xs text-on-surface placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all z-10"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">Password <span className="text-gray-400 font-normal">(min 8 characters)</span> <span className="text-error">*</span></label>
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password"
                        required
                        minLength={8}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-white border border-outline-variant rounded-shape-md text-xs text-on-surface placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start pt-1">
                <div className="flex items-center h-4 mt-0.5">
                    <input 
                        id="consent" 
                        name="consent" 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.consent}
                        onChange={handleChange}
                    />
                </div>
                <div className="ml-2.5 text-xs text-gray-500 leading-relaxed">
                    <label htmlFor="consent" className="cursor-pointer">
                        I agree to receive training updates and platform notifications from BETTERFIT LMS.
                    </label>
                </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" block className="mt-2">
                Create free account
            </Button>
        </form>

        {/* Footer Text */}
        <div className="mt-5 text-[11px] text-gray-400 leading-relaxed">
            By creating an account you agree to BETTERFIT LMS's <a href="#" className="text-secondary hover:underline">Terms & Conditions</a> and <a href="#" className="text-secondary hover:underline">Privacy Policy</a>.
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
            Already have an account? <button onClick={() => navigate('/login')} className="font-semibold text-primary hover:underline">Log in</button>
        </div>

      </div>
    </div>
  );
};

export default SignUp;