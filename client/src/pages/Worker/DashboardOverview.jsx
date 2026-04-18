import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Clock, 
  ArrowUpRight, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { getWorkerAnalytics, getMedianAnalytics } from '../../api/earnings';

const StatCard = ({ title, value, subtext, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    <p className="text-slate-400 text-xs mt-2 italic">{subtext}</p>
  </div>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [cityMedian, setCityMedian] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const workerId = user.id || user.email || 'worker_01';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, medianRes] = await Promise.all([
          getWorkerAnalytics(workerId),
          getMedianAnalytics(user.city)
        ]);
        
        const data = analyticsRes.data.data;
        setStats({ ...data.stats, platformBreakdown: data.platformComparison });
        setTrends(data.earningsTrend);
        setAnomalies(data.anomalies);
        setCityMedian(medianRes.data.data.cityMedian);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back!</h2>
          <p className="text-slate-500 mt-1">Here's what's happening with your earnings lately.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-400">Current Period</p>
          <p className="text-lg font-bold text-indigo-600">April 2026</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Earnings" 
          value={`₹${stats?.totalEarnings || 0}`} 
          subtext="Net payout after deductions"
          icon={IndianRupee}
          color="bg-indigo-600"
          trend={stats?.earningsTrend}
        />
        <StatCard 
          title="Gross Income" 
          value={`₹${stats?.grossEarnings || 0}`} 
          subtext={`Exc. ₹${stats?.totalDeductions || 0} deductions`}
          icon={TrendingUp}
          color="bg-violet-600"
        />
        <StatCard 
          title="Avg. Hourly Rate" 
          value={`₹${stats?.hourlyRate || 0}/hr`} 
          subtext={`City Avg: ₹${cityMedian || 150}/hr`}
          icon={Clock}
          color="bg-blue-600"
          trend={stats?.rateTrend}
        />
        <StatCard 
          title="Anomalies Found" 
          value={anomalies?.length || 0} 
          subtext={anomalies?.length > 0 ? "Requires your attention" : "All records look good"}
          icon={AlertCircle}
          color={anomalies?.length > 0 ? "bg-red-500" : "bg-teal-500"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900">Earnings Trend</h3>
          </div>
          <div className="h-80 min-h-[320px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorEarn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  cursor={{stroke: '#4f46e5', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorEarn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Platform Split</h3>
          <div className="h-80 min-h-[320px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.platformBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="platform" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {stats?.platformBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#a855f7', '#3b82f6', '#10b981'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {stats?.platformBreakdown?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-slate-500">{item.platform}</span>
                <span className="font-bold text-slate-900">₹{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anomalies Highlight */}
      {anomalies.length > 0 && (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 justify-between shadow-sm">
           <div className="flex gap-6 items-center">
             <div className="bg-rose-500 p-4 rounded-2xl shrink-0 text-white shadow-lg shadow-rose-200">
               <AlertCircle size={32} />
             </div>
             <div>
               <h4 className="text-rose-900 font-bold text-xl border-none">Integrity Alerts Detected</h4>
               <p className="text-rose-700">The AI Engine found {anomalies.length} unusual pattern(s). Please review them in the anomaly center.</p>
             </div>
           </div>
           
           <button 
             onClick={() => navigate('/dashboard/worker/anomalies')}
             className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
           >
             View Anomalies <ChevronRight size={18} />
           </button>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
