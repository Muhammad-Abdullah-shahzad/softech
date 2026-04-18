import React, { useEffect, useState } from 'react';
import { getEarnings } from '../api/earnings';
import AddEarningForm from '../components/AddEarningForm';

const WorkerDashboard = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const workerId = 'worker_01'; // Simulated ID

  const fetchEarningsData = async () => {
    try {
      const response = await getEarnings(workerId);
      setEarnings(response.data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  // Simple stats calculation
  const totalEarned = earnings.reduce((acc, curr) => acc + curr.netAmount, 0);
  const flaggedCount = earnings.filter(e => e.verificationStatus === 'flagged').length;

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#1e293b] font-sans selection:bg-indigo-100">
      {/* Premium Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">F</div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight leading-none">FairGig</span>
            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Worker Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-sm font-semibold text-gray-400">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors border-b-2 border-indigo-600 pb-1 text-indigo-600 font-bold">Earnings</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors pb-1">Rights Hub</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors pb-1">Certificates</span>
          </div>
          <div className="h-8 w-[1px] bg-gray-100"></div>
          <div className="flex items-center gap-3 hover:bg-gray-50 p-1 pr-3 rounded-full transition-all cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-tr from-gray-200 to-gray-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=Worker&background=6366f1&color=fff`} alt="avatar" />
            </div>
            <span className="text-sm font-bold">A. Shahzad</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 mt-2 text-lg">Your activity, earnings, and protection status.</p>
          </div>
          
          <div className="flex gap-4">
              <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Verified</span>
                  <span className="text-2xl font-black text-indigo-600">${totalEarned.toFixed(2)}</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Flagged Shifts</span>
                  <span className={`text-2xl font-black ${flaggedCount > 0 ? 'text-rose-500' : 'text-slate-300'}`}>{flaggedCount}</span>
              </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form (Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
            <AddEarningForm onEarningAdded={fetchEarningsData} />
            
            <div className="mt-8 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                        <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <h4 className="text-xl font-black mb-2">Protection Live</h4>
                    <p className="text-indigo-200/80 text-sm leading-relaxed mb-4">Our Python engine is monitoring shift patterns in real-time to detect underpayments and systemic platform errors.</p>
                    <button className="text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-xl transition-all">View Rights Guide</button>
                </div>
            </div>
          </div>

          {/* Right Column: Earnings List */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <h3 className="font-black text-slate-800 tracking-tight">Recent Activity</h3>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4.5h18m-18 5h18m-18 5h18m-18 5h18" /></svg></button>
                </div>
              </div>

              <div className="divide-y divide-slate-50">
                {loading ? (
                  <div className="p-20 text-center flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="text-slate-400 font-bold text-sm tracking-widest uppercase">Fetching encrypted data</span>
                  </div>
                ) : earnings.length === 0 ? (
                  <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No activity recorded</p>
                  </div>
                ) : (
                  earnings.map((earning) => (
                    <div key={earning._id} className="p-8 hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 group">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border ${
                            earning.platform === 'Uber' ? 'bg-black text-white' : 
                            earning.platform === 'Deliveroo' ? 'bg-cyan-500 text-white' : 
                            'bg-orange-500 text-white'
                        }`}>
                            {earning.platform.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-2xl tracking-tighter text-slate-900">${earning.netAmount.toFixed(2)}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-md font-black text-slate-500 border border-slate-200/50 uppercase tracking-tighter">
                              {earning.platform}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-widest font-black">
                            {new Date(earning.shiftStart).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} • {new Date(earning.shiftStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {earning.verificationStatus === 'flagged' ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 shadow-sm shadow-rose-50 animate-pulse">
                              ANOMALY DETECTED
                            </span>
                            <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                                Risk Score: <span className="text-rose-500">{(earning.anomalyScore * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        ) : earning.verificationStatus === 'verified' ? (
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm shadow-emerald-50">
                            TRUSTED RECORD
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shadow-sm shadow-amber-50">
                            VERIFYING...
                          </span>
                        )}
                        <button className="text-[10px] font-bold text-indigo-600 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">View Details</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-6 bg-slate-50/50 text-center">
                  <button className="text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-all">Load Archive</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerDashboard;
