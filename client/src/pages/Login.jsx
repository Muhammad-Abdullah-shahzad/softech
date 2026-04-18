import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Minimalist Login Page
 * Inspired by Mantine UI: Clean, high whitespace, no-nonsense typography.
 */
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.user.role === 'worker') navigate('/dashboard/worker');
        else if (data.user.role === 'advocate') navigate('/dashboard/advocate');
        else navigate('/dashboard/verifier');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden">
      {/* Left Column: Visual (70%) — full bleed, no right-to-white wash */}
      <div className="hidden lg:flex lg:w-[70%] relative overflow-hidden">
        <img 
            src="/workers.png" 
            alt="The Workforce" 
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&h=1200&fit=crop";
            }}
        />
        {/* Dark scrim only at the bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Bottom-left text block */}
        <div className="absolute bottom-16 left-16 z-10 max-w-lg">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">
                Empowering the<br />
                <span style={{ color: '#28e0b6' }}>Gig Community</span>
            </h1>
            <p className="text-white/75 font-semibold mt-4 text-base leading-relaxed">
                The global node for verified income and labor advocacy.
            </p>
        </div>
      </div>

      {/* Right Column: Identity Node (30%) — pure white, fully visible inputs */}
      <div className="w-full lg:w-[30%] bg-white flex flex-col justify-center px-12 xl:px-16 z-20">
        <div className="w-full max-w-sm mx-auto">

          <img src="/logo.png" alt="FairGig" className="h-9 w-auto mb-12 object-contain" />

          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Sign In
            </h2>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Access your advocacy portal.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@fairgig.io"
                className="block w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#28e0b6] focus:border-transparent transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="block w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#28e0b6] focus:border-transparent transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-900/20"
              >
                Confirm Identity
              </button>
            </div>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-semibold mb-4">New to the network?</p>
            <Link
              to="/signup"
              className="w-full inline-flex justify-center py-3.5 px-4 border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
            >
              Create Digital Identity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
