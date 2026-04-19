import React, { useState, useEffect } from 'react';
import { getVerifierOverview } from '../../api/analytics';
import { CompanyLogo } from '../../components/CompanyLogo';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
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
  Timeline,
  Divider,
  Box,
  ActionIcon
} from '@mantine/core';
import { 
    Activity, 
    ShieldCheck, 
    AlertOctagon, 
    Search, 
    TrendingUp, 
    Clock, 
    ChevronRight,
    SearchCheck,
    AlertCircle,
    FileCheck,
    AlertTriangle,
    Inbox
} from 'lucide-react';

const VerifierAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getVerifierOverview();
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

  const COLORS = {
    verified: '#10b981',
    flagged: '#f43f5e',
    unverifiable: '#f59e0b',
    pending: '#28e0b6'
  };

  const decisionPieData = [
    { name: 'Verified', value: data.decisions.verified, color: COLORS.verified },
    { name: 'Flagged', value: data.decisions.flagged, color: COLORS.flagged },
    { name: 'Unverifiable', value: data.decisions.unverifiable, color: COLORS.unverifiable }
  ].filter(d => d.value > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 border-none">Verifier Analytics</h2>
          <p className="text-slate-500">Real-time throughput, inconsistency detection, and platform risk modeling.</p>
        </div>
        <Group>
            <Badge size="xl" color="indigo" variant="light" radius="md" py={20} px={20} className="border border-indigo-100">
                <Group gap="xs">
                    <Activity size={18} />
                    <Text fw={800} size="sm">Live Node Monitoring</Text>
                </Group>
            </Badge>
        </Group>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group min-h-[160px] flex flex-col justify-between">
          <FileCheck size={120} strokeWidth={1} className="absolute -top-2 -right-4 text-slate-900 opacity-[0.12] group-hover:scale-110 group-hover:opacity-[0.18] transition-all duration-700 pointer-events-none" />
          <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Workload Reviewed</p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{data.workload.reviewed}</h3>
          </div>
          <div className="relative z-10 flex justify-between items-end mt-4">
              <p className="text-slate-400 text-[11px] font-medium italic">Total verified workflows</p>
              <span className="flex items-center text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-50 text-emerald-600">
                <TrendingUp size={12} className="mr-1" />
                15%
              </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-rose-500 relative overflow-hidden group min-h-[160px] flex flex-col justify-between">
          <AlertTriangle size={120} strokeWidth={1} className="absolute -top-2 -right-4 text-slate-900 opacity-[0.12] group-hover:scale-110 group-hover:opacity-[0.18] transition-all duration-700 pointer-events-none" />
          <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Detected Anomalies</p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{data.anomalyPatterns.reduce((a,c)=>a+c.count, 0)}</h3>
          </div>
          <div className="relative z-10 flex justify-between items-end mt-4">
              <p className="text-slate-400 text-[11px] font-medium italic">Verified system discrepancies</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group min-h-[160px] flex flex-col justify-between">
          <Inbox size={120} strokeWidth={1} className="absolute -top-2 -right-4 text-slate-900 opacity-[0.12] group-hover:scale-110 group-hover:opacity-[0.18] transition-all duration-700 pointer-events-none" />
          <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Pending Review</p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{data.workload.pending}</h3>
          </div>
          <div className="relative z-10 flex justify-between items-end mt-4">
              <p className="text-slate-400 text-[11px] font-medium italic">Queue waiting for validation</p>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border-none shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group min-h-[160px] flex flex-col justify-between text-white">
          <ShieldCheck size={120} strokeWidth={1} className="absolute -top-2 -right-4 text-white opacity-[0.12] group-hover:scale-110 group-hover:opacity-[0.18] transition-all duration-700 pointer-events-none" />
          <div className="relative z-10">
              <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">System Trust Accuracy</p>
              <h3 className="text-4xl font-bold text-[#28e0b6] tracking-tight">
                {((data.decisions.verified / (data.decisions.verified + data.decisions.flagged + data.decisions.unverifiable || 1)) * 100).toFixed(1)}%
              </h3>
          </div>
          <div className="relative z-10 flex justify-between items-end mt-4">
              <p className="text-indigo-300 opacity-60 text-[11px] font-medium italic">Ratio of verified vs total audits</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Decision Breakdown: Pie Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 border-none mb-1">Decision Breakdown</h3>
            <p className="text-sm text-slate-500 mb-8">Distribution of verifier determinations.</p>
            
            <div className="h-64 min-h-[300px] mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={decisionPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {decisionPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <Stack gap="xs">
                {decisionPieData.map((d, i) => (
                    <Group key={i} justify="space-between" p="md" radius="xl" className="bg-slate-50/50">
                        <Group gap="xs">
                            <Box w={12} h={12} bg={d.color} style={{borderRadius: '4px'}} />
                            <Text size="sm" fw={800}>{d.name}</Text>
                        </Group>
                        <Text size="sm" fw={900}>{d.value}</Text>
                    </Group>
                ))}
            </Stack>
        </div>

        {/* Top Problematic Platforms Panel */}
        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 border-none">Top Problematic Platforms</h3>
                    <p className="text-sm text-slate-500 mt-1">Platforms with the highest anomaly and flag rates.</p>
                </div>
                <div className="bg-rose-50 p-3 rounded-2xl">
                    <AlertOctagon size={24} className="text-rose-500" />
                </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center space-y-6">
                {data.platformRisk && data.platformRisk.length > 0 ? (
                    [...data.platformRisk]
                        .sort((a,b) => b.flags - a.flags)
                        .slice(0,3)
                        .map((item, idx) => (
                        <div key={idx} className="group flex items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-rose-200 transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-md">
                            <div className="text-4xl font-black text-slate-200 italic w-10 text-center">#{idx + 1}</div>
                            <div className="flex items-center gap-4 flex-1 border-l-2 border-slate-200 pl-6 ml-2">
                                <CompanyLogo platform={item.platform} size="lg" />
                                <span className="text-xl font-bold text-slate-800 tracking-wide">{item.platform}</span>
                            </div>
                            <div className="text-right">
                               <div className="flex items-center gap-3 justify-end mb-1">
                                  <span className="text-3xl font-black text-slate-900">{item.flags}</span>
                                  <span className="text-xs text-rose-600 font-bold uppercase tracking-widest bg-rose-100 px-3 py-1.5 rounded-md">Flags</span>
                               </div>
                               <div className="w-32 h-2.5 bg-slate-200 rounded-full mt-2 overflow-hidden flex justify-end ml-auto">
                                   <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min((item.flags / Math.max(...data.platformRisk.map(p => p.flags))) * 100, 100)}%` }} />
                               </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-500 italic">No flagged platforms detected.</div>
                )}
            </div>
        </div>
      </div>

    </div>
  );
};

export default VerifierAnalytics;
