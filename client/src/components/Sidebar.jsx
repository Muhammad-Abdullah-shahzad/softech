import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = ({ navigation, currentRole }) => {
  const roleNav = navigation[currentRole] || [];
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 overflow-y-auto">
      <div className="p-8 flex items-center justify-center border-b border-slate-50 mb-4">
        <img 
            src="/logo.png" 
            alt="FairGig" 
            className="h-10 w-auto object-contain hover:scale-105 transition-transform cursor-pointer" 
            onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
            }}
        />
        <div className="hidden items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-brand-green font-bold text-xl leading-none">F</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter">FairGig</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-8">
        {roleNav.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.links.map((link, lidx) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                
                return (
                  <NavLink
                    key={lidx}
                    to={link.path}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'text-slate-900 font-bold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                  >
                    {Icon && (
                      <Icon 
                        size={20} 
                        className={`transition-colors duration-200 ${isActive ? 'text-brand-green' : 'text-slate-400 group-hover:text-slate-600'}`} 
                      />
                    )}
                    <span className="font-medium">{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-green"
                      />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-slate-700 capitalize">{currentRole} Portal</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;