import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Mail, Star, User, ShieldCheck, Briefcase, PenTool, FileCheck, Zap, Quote, LogIn } from 'lucide-react';
import Button from './ui/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Default to super_admin to make the workflow evident
  const [role, setRole] = useState<string>('super_admin');

  const roleCaptions: Record<string, string> = {
    learner: "The expert in anything was once a beginner. Don't give up!",
    assessor: "Feedback is the breakfast of champions. Guide them to greatness.",
    creator: "Knowledge shared is knowledge multiplied. Create to inspire.",
    moderator: "Quality means doing it right when no one is looking.",
    admin: "Success is the sum of small efforts, repeated day in and day out.",
    super_admin: "Leadership is the capacity to translate vision into reality."
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Store role for session persistence across shared routes (like messages)
    localStorage.setItem('betterfit_role', role);

    // Role-based routing logic
    if (role === 'moderator') {
      navigate('/moderator-dashboard');
    } else if (role === 'creator') {
      navigate('/creator-dashboard');
    } else if (role === 'assessor') {
      navigate('/assessor-dashboard');
    } else if (role === 'learner') {
      navigate('/learner-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const RoleChip = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button
        type="button"
        onClick={() => setRole(id)}
        aria-pressed={role === id}
        className={`bf-chip ${role === id ? 'bf-chip--selected' : ''}`}
    >
        <Icon className="w-4 h-4" aria-hidden="true" />
        {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 font-sans text-on-surface">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg border border-outline-variant overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Left Side - Brand Panel & Quotes */}
        <div className="md:w-5/12 bg-tertiary p-8 md:p-10 text-white flex flex-col justify-between relative">
             {/* Decorative subtle pattern */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

             {/* Top Section */}
            <div className="relative z-10">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-white/90 hover:text-white transition-colors text-xs font-medium mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </button>

                <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">BETTERFIT LMS</h1>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold uppercase tracking-wider mb-3">
                    {role === 'moderator' ? 'IQA Portal' : role === 'creator' ? 'Creator Studio' : role === 'assessor' ? 'Assessor Portal' : role === 'learner' ? 'Student Portal' : 'Admin Portal'}
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                    {role === 'moderator'
                        ? 'Internal Quality Assurance and Compliance.'
                        : role === 'creator'
                        ? 'Build courses, submissions, and reports.'
                        : role === 'assessor'
                        ? 'Track learner progress and mark submissions.'
                        : role === 'learner'
                        ? 'Access your courses and track your progress.'
                        : 'Centralized control for your training academy.'}
                </p>
            </div>

            {/* Middle Section - Dynamic Motivational Quote */}
            <div className="relative z-10 bg-white/15 backdrop-blur-md rounded-lg p-6 border border-white/20 my-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-white/90">
                   <Quote className="w-5 h-5" />
                   <span className="text-xs font-semibold uppercase tracking-wider">Motto</span>
                </div>
                <p className="text-display-sm text-white">
                    "{roleCaptions[role]}"
                </p>
            </div>

            {/* Bottom Section - Status */}
            <div className="relative z-10 text-xs text-white/80 font-medium">
                System v2.5.4 | Server Status: Stable
            </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-on-surface">
                        {role === 'moderator' ? 'Moderator Access' : role === 'creator' ? 'Creator Login' : role === 'assessor' ? 'Assessor Login' : role === 'learner' ? 'Student Login' : 'Super Admin Login'}
                    </h2>
                    <p className="text-on-surface-muted text-sm mt-1">
                        {role === 'moderator'
                         ? 'Sign in to access IQA reports and sampling plans.'
                         : role === 'creator'
                         ? 'Sign in to manage course content and forms.'
                         : role === 'assessor'
                         ? 'Sign in to view your cohort progress.'
                         : role === 'learner'
                         ? 'Sign in to continue your learning journey.'
                         : 'Please sign in to access master controls.'}
                    </p>
                </div>

                {/* Role Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <RoleChip id="learner" label="Learner" icon={User} />
                    <RoleChip id="assessor" label="Assessor" icon={Briefcase} />
                    <RoleChip id="creator" label="Creator" icon={PenTool} />
                    <RoleChip id="moderator" label="Moderator" icon={FileCheck} />
                    <RoleChip id="admin" label="Admin" icon={ShieldCheck} />
                    <RoleChip id="super_admin" label="Super Admin" icon={Zap} />
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-on-surface mb-1.5">
                            {role === 'learner' ? 'Student Email' : 'Email Address'} <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-on-surface-muted" />
                            </div>
                            <input
                                type="email"
                                className="block w-full pl-9 pr-3 py-2.5 border border-outline-variant rounded-shape-md text-sm text-on-surface placeholder-on-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                placeholder={role === 'learner' ? 'student@betterfit.com' : 'user@betterfit.com'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                     <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-medium text-on-surface">
                                Password <span className="text-error">*</span>
                            </label>
                            <a href="#" className="text-xs font-medium text-secondary hover:text-primary transition-colors">Forgot Password?</a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-on-surface-muted" />
                            </div>
                            <input
                                type="password"
                                className="block w-full pl-9 pr-3 py-2.5 border border-outline-variant rounded-shape-md text-sm text-on-surface placeholder-on-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" size="lg" block icon={LogIn} disabled={!isFormValid} className="mt-2 disabled:opacity-100 disabled:bg-on-surface-muted">
                        Sign In
                    </Button>
                </form>

                <div className="mt-8 text-center text-xs text-on-surface-muted">
                    Authorized personnel only. Need help? <button className="font-semibold text-primary hover:underline">Contact Support</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
