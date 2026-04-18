import React, { useState, useEffect } from 'react';
import { getVerifierOverview } from '../../api/analytics';
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
    AlertCircle
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
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-900 border-none tracking-tight italic uppercase">Verifier Analytics</h2>
          <p className="text-slate-500 font-medium">Real-time throughput, inconsistency detection, and platform risk modeling.</p>
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
      <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="xl">
        <Paper radius="32px" withBorder p="xl" className="border-slate-100 shadow-sm">
            <Stack gap={2}>
                <Text size="xs" fw={900} tt="uppercase" c="dimmed">Workload Reviewed</Text>
                <Text size="42px" fw={900} className="italic">{data.workload.reviewed}</Text>
                <Group gap={4}>
                    <TrendingUp size={14} className="text-emerald-500" />
                    <Text size="xs" fw={700} c="teal.7">15% Thruput Increase</Text>
                </Group>
            </Stack>
        </Paper>

        <Paper radius="32px" withBorder p="xl" className="border-slate-100 shadow-sm border-l-4 border-l-rose-500">
            <Stack gap={2}>
                <Text size="xs" fw={900} tt="uppercase" c="dimmed">Detected Anomalies</Text>
                <Text size="42px" fw={900} c="rose.7" className="italic">
                    {data.anomalyPatterns.reduce((a,c)=>a+c.count, 0)}
                </Text>
                <Text size="xs" fw={700} c="dimmed">Verified system discrepancies</Text>
            </Stack>
        </Paper>

        <Paper radius="32px" withBorder p="xl" className="border-slate-100 shadow-sm">
            <Stack gap={2}>
                <Text size="xs" fw={900} tt="uppercase" c="dimmed">Pending Review</Text>
                <Text size="42px" fw={900} c="indigo.7" className="italic">{data.workload.pending}</Text>
                <Text size="xs" fw={700} c="dimmed">Records in current queue</Text>
            </Stack>
        </Paper>

        <Paper radius="32px" withBorder p="xl" className="bg-slate-900 text-white border-none shadow-2xl">
            <Stack gap={2}>
                <Text size="xs" fw={900} tt="uppercase" c="indigo.3">Integrity Score</Text>
                <Text size="42px" fw={900} className="italic text-emerald-400">
                    {((data.decisions.verified / (data.workload.reviewed || 1)) * 100).toFixed(1)}%
                </Text>
                <Text size="xs" fw={700} c="indigo.1" opacity={0.6}>Mean ecosystem verification rate</Text>
            </Stack>
        </Paper>
      </SimpleGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Verification Activity: Line Chart */}
        <Card radius="40px" withBorder p={40} className="lg:col-span-2 shadow-sm border-slate-100">
            <Group justify="space-between" mb={40}>
                <div>
                    <h3 className="text-xl font-black text-slate-800 border-none italic">Verification Throughput</h3>
                    <Text size="sm" c="dimmed" fw={600}>Daily aggregation of finalized verification cycles.</Text>
                </div>
                <ActionIcon variant="light" color="indigo" size="lg" radius="md">
                    <Activity size={18} />
                </ActionIcon>
            </Group>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.activity}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#28e0b6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#28e0b6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                        />
                        <Tooltip 
                            contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}
                        />
                        <Area type="monotone" dataKey="count" stroke="#28e0b6" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>

        {/* Decision Breakdown: Pie Chart */}
        <Card radius="40px" withBorder p={40} className="shadow-sm border-slate-100">
            <h3 className="text-xl font-black text-slate-800 border-none italic mb-4">Decision Breakdown</h3>
            <Text size="sm" c="dimmed" fw={600} mb={40}>Distribution of verifier determinations.</Text>
            
            <div className="h-64 mb-8">
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
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Platform Risk Analysis */}
        <Card radius="40px" withBorder p={40} className="shadow-sm border-slate-100">
            <Group justify="space-between" mb={40}>
                <div>
                    <h3 className="text-xl font-black text-slate-800 border-none italic">Platform Risk Modeling</h3>
                    <Text size="sm" c="dimmed" fw={600}>Historical frequency of flagged submissions per platform.</Text>
                </div>
                <AlertOctagon size={24} className="text-rose-500" />
            </Group>
            
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.platformRisk} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="platform" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#475569', fontSize: 13, fontWeight: 800}}
                        />
                        <Tooltip />
                        <Bar dataKey="flags" fill="#f43f5e" radius={[0, 10, 10, 0]} barSize={32}>
                            {data.platformRisk.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.flags > 10 ? '#f43f5e' : '#fda4af'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>

        {/* Suspicious Patterns */}
        <Card radius="40px" withBorder p={40} className="shadow-sm border-slate-100">
             <Group justify="space-between" mb={40}>
                <div>
                    <h3 className="text-xl font-black text-slate-800 border-none italic">Suspicious Pattern Detection</h3>
                    <Text size="sm" c="dimmed" fw={600}>Common anomaly types flagged by the system.</Text>
                </div>
                <SearchCheck size={24} className="text-amber-500" />
            </Group>

            <Stack gap="lg">
                {data.anomalyPatterns.map((anomaly, i) => (
                    <Paper key={i} p="xl" radius="24px" className="bg-slate-50 border border-slate-100 relative overflow-hidden">
                        <div className="flex justify-between items-center relative z-10">
                            <Group gap="lg">
                                <ThemeIcon size="xl" radius="md" color="amber" variant="light">
                                    <AlertCircle size={20} />
                                </ThemeIcon>
                                <div>
                                    <Text fw={900} size="md" className="uppercase tracking-tight">{anomaly.type}</Text>
                                    <Text size="xs" c="dimmed" fw={600}>Inconsistent data signature detected</Text>
                                </div>
                            </Group>
                            <Badge size="xl" variant="filled" color="amber" radius="md">
                                {anomaly.count} Hits
                            </Badge>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-xl" />
                    </Paper>
                ))}
                {data.anomalyPatterns.length === 0 && (
                    <Text c="dimmed" ta="center" py={40} italic>No significant suspicious patterns detected in current cycle.</Text>
                )}
            </Stack>
        </Card>
      </div>

    </div>
  );
};

export default VerifierAnalytics;
