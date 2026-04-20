import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Sidebar = ({ navigation, currentRole, isOpen, onClose }) => {
  const roleNav = navigation[currentRole] || [];
  const location = useLocation();

  const sidebarContent = (
    <aside className={`
      w-72 bg-white border-r border-slate-100 flex flex-col h-screen overflow-y-auto z-50
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      fixed lg:sticky top-0 transition-transform duration-300 ease-in-out
    `}>
      <div className="p-8 flex items-center justify-between border-b border-slate-50 mb-4">
        <div className="flex items-center justify-center flex-1">
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
        
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-500"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-6 py-2 space-y-8">
        {roleNav.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                {section.title}
              </h3>
            )}
            <div className="space-y-1.5">
              {section.links.map((link, lidx) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                
                return (
                  <NavLink
                    key={lidx}
                    to={link.path}
                    onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) => `
                      flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-indigo-50/50 text-indigo-600 font-bold shadow-sm shadow-indigo-100/50' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                  >
                    {Icon && (
                      <Icon 
                        size={18} 
                        className={`transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} 
                      />
                    )}
                    <span className="text-sm font-semibold tracking-tight">{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"
                      />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-50">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System Status</p>
          <div className="flex items-center gap-2.5">
            <div className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-bold text-slate-700 capitalize">{currentRole} Portal Active</span>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {sidebarContent}
    </>
  );
};

export default Sidebar;