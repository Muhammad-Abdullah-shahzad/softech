import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { Check, X } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    cnic: '',
    password: '', 
    role: 'worker',
    city: 'Lahore'
  });
  const navigate = useNavigate();

  const handleCnicChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    if (value.length > 13) value = value.slice(0, 13);
    
    // Add dashes automatically
    let formatted = value;
    if (value.length > 5 && value.length <= 12) {
      formatted = `${value.slice(0, 5)}-${value.slice(5)}`;
    } else if (value.length > 12) {
      formatted = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12)}`;
    }
    
    setFormData({ ...formData, cnic: formatted });
  };

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[a-zA-Z0-0._%+-]+@gmail\.com$/; // Specific check for @gmail.com as requested
    const generalEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!generalEmailRegex.test(formData.email)) {
      notifications.show({
        title: 'Invalid Email',
        message: 'Please enter a valid digital mail address.',
        color: 'red',
        icon: <X size={16} />,
        radius: 'md'
      });
      return false;
    }

    if (!formData.email.endsWith('@gmail.com')) {
        notifications.show({
          title: 'Email Provider Restricted',
          message: 'Currently, only @gmail.com addresses are supported for verification.',
          color: 'orange',
          icon: <X size={16} />,
          radius: 'md'
        });
        return false;
      }

    // CNIC validation
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(formData.cnic)) {
      notifications.show({
        title: 'Invalid CNIC',
        message: 'CNIC must be in 00000-0000000-0 format.',
        color: 'red',
        icon: <X size={16} />,
        radius: 'md'
      });
      return false;
    }

    // Password validation (simple)
    if (formData.password.length < 6) {
      notifications.show({
        title: 'Weak Identity Lock',
        message: 'Password must be at least 6 characters long.',
        color: 'red',
        icon: <X size={16} />,
        radius: 'md'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        notifications.show({
          title: 'Identity Created',
          message: 'Signup successful! Please login.',
          color: 'fairgig',
          icon: <Check size={16} />,
          radius: 'md'
        });
        navigate('/login');
      } else {
        notifications.show({
          title: 'Signup Failed',
          message: data.message || 'Verification rejected',
          color: 'red',
          icon: <X size={16} />,
          radius: 'md'
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      notifications.show({
        title: 'System Error',
        message: 'Could not connect to registration node',
        color: 'red',
        icon: <X size={16} />,
        radius: 'md'
      });
    }
  };

  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1";
  const inputClass = "block w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#28e0b6] focus:border-transparent transition-all";

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden">

      {/* Left Column: Visual (70%) — full bleed, dark bottom scrim */}
      <div className="hidden lg:flex lg:w-[70%] relative overflow-hidden">
        <img
          src="/workers.png"
          alt="The Workforce"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&h=1200&fit=crop";
          }}
        />
        {/* Dark scrim at bottom only for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Bottom-left text block */}
        <div className="absolute bottom-16 left-16 z-10 max-w-lg">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">
            Join the<br />
            <span style={{ color: '#28e0b6' }}>Revolution</span>
          </h1>
          <p className="text-white/75 font-semibold mt-4 text-base leading-relaxed">
            Verified work. Guaranteed rights. Global advocacy.
          </p>
        </div>
      </div>

      {/* Right Column: Registration Node (30%) — pure white, no borders */}
      <div className="w-full lg:w-[30%] bg-white flex flex-col justify-center px-12 xl:px-16 overflow-y-auto">
        <div className="w-full max-w-xs mx-auto py-10">

          <img src="/logo.png" alt="FairGig" className="h-9 w-auto mb-10 object-contain" />

          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              Initialize Node
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Create your digital identity.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Role + City row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Role</label>
                <select
                  className="block w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#28e0b6] focus:border-transparent transition-all"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="worker">Worker</option>
                  <option value="advocate">Advocate</option>
                  <option value="verifier">Verifier</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>City</label>
                <select
                  className="block w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#28e0b6] focus:border-transparent transition-all"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Full Legal Name</label>
              <input type="text" required placeholder="John Doe" className={inputClass}
                value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>Government CNIC</label>
              <input type="text" required placeholder="00000-0000000-0" className={inputClass}
                value={formData.cnic} onChange={handleCnicChange} />
            </div>

            <div>
              <label className={labelClass}>Digital Mail</label>
              <input type="email" required placeholder="name@gmail.com" className={inputClass}
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>Identity Lock</label>
              <input type="password" required placeholder="••••••••" className={inputClass}
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-900/20"
              >
                Create Identity
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50">
            <Link
              to="/login"
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
            >
              ← Return to Login Node
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
