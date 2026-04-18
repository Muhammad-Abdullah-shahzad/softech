import React, { useState } from 'react';
import { addEarning } from '../api/earnings';

const AddEarningForm = ({ onEarningAdded }) => {
  const [formData, setFormData] = useState({
    workerId: 'worker_01', 
    platform: 'Uber',
    grossAmount: '',
    shiftStart: '',
    shiftEnd: '',
    evidenceUrls: ['http://example.com/screenshot.png']
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await addEarning({
        ...formData,
        grossAmount: parseFloat(formData.grossAmount)
      });
      setMessage({ type: 'success', text: 'Activity logged successfully.' });
      onEarningAdded();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to sync activity' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-300";
  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-indigo-100/20 border border-slate-100">
      <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800">Log Activity</h2>
      </div>
      
      {message && (
        <div className={`p-4 mb-8 rounded-2xl text-xs font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={labelClass}>Gig Platform</label>
          <div className="relative">
              <select
                className={`${inputClass} appearance-none cursor-pointer`}
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
              >
                <option>Uber</option>
                <option>Deliveroo</option>
                <option>DoorDash</option>
                <option>Other</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Gross Earnings ($)</label>
          <input
            type="number"
            step="0.01"
            required
            className={inputClass}
            placeholder="0.00"
            value={formData.grossAmount}
            onChange={(e) => setFormData({...formData, grossAmount: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Shift Start</label>
            <input
              type="datetime-local"
              required
              className={inputClass}
              value={formData.shiftStart}
              onChange={(e) => setFormData({...formData, shiftStart: e.target.value})}
            />
          </div>
          <div>
            <label className={labelClass}>Shift End</label>
            <input
              type="datetime-local"
              required
              className={inputClass}
              value={formData.shiftEnd}
              onChange={(e) => setFormData({...formData, shiftEnd: e.target.value})}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 mt-4 group"
        >
          {loading ? 'Processing...' : (
              <span className="flex items-center justify-center gap-2">
                  Sync Data
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddEarningForm;
