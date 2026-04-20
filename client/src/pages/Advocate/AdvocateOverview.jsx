import React, { useState, useEffect } from 'react';
import { getAdvocateOverview } from '../../api/analytics';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Treemap, AreaChart, Area
} from 'recharts';
import {
    Card,
    Text,
    SimpleGrid,
    Group,
    Paper,
    LoadingOverlay,
    Badge,
    Stack,
    ThemeIcon,
    Table,
    ActionIcon,
    Select,
    Button,
    Box,
    Avatar,
    Divider
} from '@mantine/core';
import {
    AlertTriangle,
    Users,
    TrendingUp,
    MapPin,
    Download,
    Eye,
    Zap,
    ShieldCheck
} from 'lucide-react';
import { PlatformDisplay, CompanyLogo } from '../../components/CompanyLogo';

const AdvocateOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await getAdvocateOverview();
            setData(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !data) return (
        <div className="h-[70vh] flex items-center justify-center relative">
            <LoadingOverlay visible={true} overlayProps={{ blur: 2 }} />
        </div>
    );

    const CHART_COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#14b8a6', '#f43f5e'];
    const V_COLORS = {
      'verified': '#10b981',
      'flagged': '#f43f5e',
      'unverifiable': '#f59e0b',
      'pending': '#6366f1',
      'default': '#94a3b8'
    };

    const verificationPieData = data.verificationStats.map((item) => ({
        name: item._id,
        value: item.count,
        color: V_COLORS[item._id.toLowerCase()] || V_COLORS.default
    }));

    const totalVerifications = data.verificationStats.reduce((acc, curr) => acc + curr.count, 0);

    const allDates = [...new Set(data.commissionTrends.flatMap(p => p.trends.map(t => t.date)))].sort();
    const trendChartData = allDates.map(date => {
        const obj = { date };
        data.commissionTrends.forEach(p => {
            const dayData = p.trends.find(t => t.date === date);
            obj[p._id] = dayData ? parseFloat(dayData.rate.toFixed(1)) : null;
        });
        return obj;
    });

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 pb-24 px-4">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 border-none tracking-tight">Advocate Intelligence Access</h2>
                    <p className="text-slate-500 font-medium tracking-tight">Real-time monitoring of platform behavior and worker vulnerability.</p>
                </div>
                <Group>
                    <Badge size="xl" color="indigo" variant="light" radius="md" py={22} px={20} className="border border-indigo-100">
                        <Group gap="xs">
                            <TrendingUp size={16} />
                            <Text fw={800} size="sm" tt="uppercase" tracking="0.05em">Systemic Fairness Analytics</Text>
                        </Group>
                    </Badge>
                </Group>
            </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group min-h-[160px] flex flex-col justify-between">
          <Users size={120} strokeWidth={1} className="absolute -top-2 -right-4 text-slate-900 opacity-[0.12] group-hover:scale-110 group-hover:opacity-[0.18] transition-all duration-700 pointer-events-none" />
          <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Active Workers</p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{data.kpis.totalWorkers}</h3>
          </div>
          <div className="relative z-10 flex justify-between items-end mt-4">
              <p className="text-slate-400 text-[11px] font-medium italic">Active nodes</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-rose-500 relative overflow-hidden group min-h-[160px] flex flex-col justify-between">
          <AlertTriangle size={120} strokeWidth={1} className="absolute -top-2 -right-4 text-slate-900 opacity-[0.12] group-hover:scale-110 group-hover:opacity-[0.18] transition-all duration-700 pointer-events-none" />
          <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Vulnerable Households</p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{data.kpis.vulnerableTotal}</h3>
          </div>
          <div className="relative z-10 flex justify-between items-end mt-4">
              <span className="flex items-center text-[10px] font-bold px-2 py-1 rounded-md bg-rose-50 text-rose-600">
                <TrendingUp size={12} className="mr-1" />
                {">"}20% Income Drop
              </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group min-h-[160px] flex flex-col justify-between">
          <TrendingUp size={120} strokeWidth={1} className="absolute -top-2 -right-4 text-slate-900 opacity-[0.12] group-hover:scale-110 group-hover:opacity-[0.18] transition-all duration-700 pointer-events-none" />
          <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Avg Commission Rate</p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{data.kpis.avgCommission}%</h3>
          </div>
          <div className="relative z-10 flex justify-between items-end mt-4">
              <p className="text-slate-400 text-[11px] font-medium italic">System average</p>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border-none shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group min-h-[160px] flex flex-col justify-between text-white">
          <ShieldCheck size={120} strokeWidth={1} className="absolute -top-2 -right-4 text-white opacity-[0.12] group-hover:scale-110 group-hover:opacity-[0.18] transition-all duration-700 pointer-events-none" />
          <div className="relative z-10">
              <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">System Fairness Index</p>
              <h3 className="text-4xl font-bold text-[#28e0b6] tracking-tight">
                {data.platformFairness && data.platformFairness.length > 0 
                  ? Math.round(data.platformFairness.reduce((acc, curr) => acc + curr.score, 0) / data.platformFairness.length) 
                  : '85'}%
              </h3>
          </div>
          <div className="relative z-10 flex justify-between items-end mt-4">
              <p className="text-indigo-300 opacity-60 text-[11px] font-medium italic">Avg score across all platforms</p>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Commission Trends - Large Block */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Commission Rate Trends</h3>
              <p className="text-slate-400 text-xs font-medium">Longitudinal analysis of platform take-rates.</p>
            </div>
            <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-slate-100">
              Last 30 Days
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendChartData}>
                <defs>
                  {data.commissionTrends.map((p, i) => (
                    <linearGradient key={`grad-${p._id}`} id={`color-${p._id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                />
                {data.commissionTrends.map((p, i) => (
                  <Area 
                    key={p._id} 
                    type="monotone" 
                    dataKey={p._id} 
                    stroke={CHART_COLORS[i % CHART_COLORS.length]} 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill={`url(#color-${p._id})`} 
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <Divider my="xl" variant="dashed" label="Platform Performance Breakdown" labelPosition="center" />
          
          <div className="flex flex-wrap gap-6 justify-center">
            {data.commissionTrends.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3 bg-slate-50/50 px-4 py-2 rounded-2xl border border-slate-100 relative group/plat">
                <div 
                  className="w-1 h-8 rounded-full absolute left-0 top-1/2 -translate-y-1/2 opacity-60" 
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} 
                />
                <CompanyLogo platform={p._id} size="sm" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter leading-none">{p._id}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Avg: {(p.trends.reduce((acc, t) => acc + t.rate, 0) / p.trends.length).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Split - Small Block */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">System Health</h3>
            <p className="text-slate-400 text-xs font-medium">Verification status breakdown.</p>
          </div>

          <div className="h-64 w-full relative mb-10 flex items-center justify-center">
            {/* Central Label for Donut */}
            <div className="absolute flex flex-col items-center justify-center pb-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total</span>
               <span className="text-3xl font-black text-slate-900 tracking-tighter">{totalVerifications}</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={verificationPieData} 
                  cx="50%" cy="50%" 
                  innerRadius={75} outerRadius={95} 
                  paddingAngle={6} 
                  dataKey="value"
                  strokeWidth={0}
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {verificationPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {verificationPieData.map((d, i) => (
              <div key={i} className="flex flex-col p-4 rounded-3xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{d.name}</span>
                </div>
                <span className="text-xl font-black text-slate-800 tracking-tight leading-none">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight text-center uppercase">Platform Fairness Ranking</h3>
              <div className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">Live Index</div>
           </div>
           
           <div className="space-y-6">
              {data.platformFairness && data.platformFairness.slice(0, 4).map((plat, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-center mb-2 px-1">
                    <div className="flex items-center gap-4">
                      <CompanyLogo platform={plat.platform} size="md" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-tighter leading-none">{plat.platform}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ethical Compliance</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                       <span className={`text-xl font-black italic tracking-tighter leading-none ${plat.score > 70 ? 'text-emerald-500' : plat.score > 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                          {plat.score}%
                       </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${plat.score > 70 ? 'bg-emerald-500' : plat.score > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${plat.score}%` }}
                    />
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-bold text-slate-800 tracking-tight text-center uppercase">System Integrity Alerts</h3>
                 <Zap size={20} className="text-amber-500 animate-pulse" />
              </div>

              <div className="space-y-4">
                {data.spikes && data.spikes.length > 0 ? data.spikes.map((spike, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-rose-50 border border-rose-100 shadow-sm shadow-rose-100/20 group hover:scale-[1.02] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
                        <AlertTriangle size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-rose-800 uppercase tracking-[0.15em] mb-1">Commission Spike</p>
                        <p className="text-xs font-bold text-rose-700 leading-tight flex items-center gap-2">
                          <PlatformDisplay platform={spike.platform} size="xs" className="!bg-transparent" /> rates rose to {spike.currentRate}% (↑{spike.increase}%).
                        </p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-10 rounded-2xl bg-emerald-50/50 border border-dashed border-emerald-200 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                      <ShieldCheck size={24} />
                    </div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest leading-loose">No Anomalies Found</p>
                    <p className="text-[10px] text-emerald-600 font-medium italic">Commission structures remain stable.</p>
                  </div>
                )}
              </div>
           </div>

           <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 opacity-20 blur-[40px]" />
              <div className="relative z-10 flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">Highest Yield City</span>
                    <span className="text-xl font-black italic tracking-tighter uppercase text-[#28e0b6]">{[...data.distribution].sort((a,b) => b.avg - a.avg)[0]?._id  || 'N/A'}</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <MapPin size={18} className="text-white" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdvocateOverview;
