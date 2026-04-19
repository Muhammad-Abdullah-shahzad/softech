import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  AlertCircle,
  ChevronRight,
  Wallet,
  BarChart3,
  Timer
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
import { PlatformDisplay } from '../../components/CompanyLogo';

const StatCard = ({ title, value, subtext, icon: Icon, color, trend, darkTheme }) => (
  <div className={`${darkTheme ? 'bg-slate-900 border-none shadow-xl' : 'bg-white border-slate-100 shadow-sm'} p-6 rounded-3xl border transition-all relative overflow-hidden group min-h-[160px] flex flex-col justify-between`}>
    <Icon size={120} strokeWidth={1} className={`absolute -top-2 -right-4 opacity-[0.12] group-hover:scale-110 group-hover:opacity-[0.18] transition-all duration-700 pointer-events-none ${darkTheme ? 'text-white' : 'text-slate-900'}`} />
    <div className="relative z-10">
        <p className={`${darkTheme ? 'text-indigo-200' : 'text-slate-500'} text-[10px] font-bold uppercase tracking-widest mb-1`}>{title}</p>
        <h3 className={`text-3xl font-bold ${darkTheme ? 'text-[#28e0b6]' : 'text-slate-900'} tracking-tight`}>{value}</h3>
    </div>
    <div className="relative z-10 flex justify-between items-end mt-4">
        <p className={`${darkTheme ? 'text-indigo-300 opacity-60' : 'text-slate-400'} text-[11px] font-medium italic`}>{subtext}</p>
        {trend != null && (
          <span className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-md ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend >= 0 ? <ArrowUpRight size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {Math.abs(trend)}%
          </span>
        )}
    </div>
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
          value={`Rs. ${stats?.totalEarnings || 0}`} 
          subtext="Net payout after deductions"
          icon={Wallet}
          color="bg-indigo-600"
          trend={stats?.earningsTrend}
        />
        <StatCard 
          title="Gross Income" 
          value={`Rs. ${stats?.grossEarnings || 0}`} 
          subtext={`Exc. Rs. ${stats?.totalDeductions || 0} deductions`}
          icon={BarChart3}
          color="bg-violet-600"
        />
        <StatCard 
          title="Avg. Hourly Rate" 
          value={`Rs. ${stats?.hourlyRate || 0}/hr`} 
          subtext={`City Avg: Rs. ${cityMedian || 150}/hr`}
          icon={Timer}
          color="bg-blue-600"
          trend={stats?.rateTrend}
        />
        <StatCard 
          title="Anomalies Found" 
          value={anomalies?.length || 0} 
          subtext={anomalies?.length > 0 ? "Requires your attention" : "All records look good"}
          icon={AlertCircle}
          color={anomalies?.length > 0 ? "bg-red-500" : "bg-teal-500"}
          darkTheme={true}
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
                    <stop offset="5%" stopColor="#28e0b6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#28e0b6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#28e0b6', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="amount" stroke="#28e0b6" strokeWidth={3} fillOpacity={1} fill="url(#colorEarn)" />
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
                <XAxis dataKey="platform" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {stats?.platformBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#28e0b6', '#0f172a', '#10b981', '#94a3b8'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {stats?.platformBreakdown?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-xl border border-slate-100">
                <PlatformDisplay platform={item.platform} size="sm" />
                <span className="font-bold text-slate-900">Rs. {item.amount}</span>
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
