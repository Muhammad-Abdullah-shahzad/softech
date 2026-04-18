import React, { useState, useEffect } from 'react';
import { getVerifierStats } from '../../api/earnings';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  Card, 
  Text, 
  SimpleGrid, 
  Group, 
  Paper,
  LoadingOverlay,
  Badge
} from '@mantine/core';
import { TrendingUp, ClipboardCheck, AlertTriangle, ShieldCheck } from 'lucide-react';

const VerifierAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getVerifierStats();
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return <div className="h-[70vh] relative"><LoadingOverlay visible={true} /></div>;

  const statusPieData = data.stats.map(s => ({ name: s._id, value: s.count }));
  const COLORS = {
    verified: '#10b981',
    flagged: '#f59e0b',
    unverifiable: '#f43f5e',
    pending: '#6366f1',
    unverified: '#94a3b8'
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 border-none">Verification Insights</h2>
        <p className="text-slate-500">Overview of platform integrity and verifier performance.</p>
      </header>

      {/* Summary Cards */}
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
        <Paper radius="24px" withBorder p="xl" className="border-indigo-100 bg-indigo-50/50">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Total Reviewed Tasks</Text>
              <Text size="32px" fw={900}>{data.dailyTrends.reduce((acc, curr) => acc + curr.count, 0)}</Text>
            </div>
            <div className="bg-indigo-600 p-3 rounded-2xl text-white">
              <ClipboardCheck size={24} />
            </div>
          </Group>
          <Group mt={12} gap={4}>
            <TrendingUp size={14} className="text-emerald-500" />
            <Text size="xs" c="teal.6" fw={700}>+12.5% from last week</Text>
          </Group>
        </Paper>

        <Paper radius="24px" withBorder p="xl" className="border-amber-100 bg-amber-50/50">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Active Discrepancies</Text>
              <Text size="32px" fw={900}>{data.stats.find(s => s._id === 'flagged')?.count || 0}</Text>
            </div>
            <div className="bg-amber-500 p-3 rounded-2xl text-white">
              <AlertTriangle size={24} />
            </div>
          </Group>
          <Text size="xs" c="dimmed" mt={12}>Pending re-verification or worker appeal.</Text>
        </Paper>

        <Paper radius="24px" withBorder p="xl" className="border-emerald-100 bg-emerald-50/50">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Integrity Rate</Text>
              <Text size="32px" fw={900}>
                {((data.stats.find(s => s._id === 'verified')?.count || 0) / 
                  (data.stats.reduce((acc, curr) => acc + curr.count, 0) || 1) * 100).toFixed(1)}%
              </Text>
            </div>
            <div className="bg-emerald-500 p-3 rounded-2xl text-white">
              <ShieldCheck size={24} />
            </div>
          </Group>
          <Text size="xs" c="dimmed" mt={12}>Percentage of records verified successfully.</Text>
        </Paper>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
        {/* Trend Chart */}
        <Card radius="24px" withBorder p="xl" shadow="sm">
          <Text fw={700} mb="xl">Daily Verification Activity</Text>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                   contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution */}
        <Card radius="24px" withBorder p="xl" shadow="sm">
          <Text fw={700} mb="xl">Record Status Distribution</Text>
          <div className="h-80 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                 >
                    {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} />
                    ))}
                 </Pie>
                 <Tooltip />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
          </div>
        </Card>
      </SimpleGrid>

      {/* Platform Level Flags */}
      <Card radius="24px" withBorder p="xl" shadow="sm">
        <Text fw={700} mb="xl">Platform-wise Flag Frequency</Text>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {['Uber', 'Zomato', 'Swiggy', 'Ola', 'Deliveroo'].map(platform => {
                const pFlags = data.platformStats.find(ps => ps._id.platform === platform && ps._id.status === 'flagged')?.count || 0;
                return (
                    <Paper key={platform} p="md" radius="lg" withBorder className="text-center group hover:bg-rose-50 hover:border-rose-100 transition-colors">
                        <Text size="xs" fw={700} c="dimmed" mb={8}>{platform}</Text>
                        <Text size="xl" fw={900} c={pFlags > 5 ? "red.6" : "dark.8"}>{pFlags}</Text>
                        <Text size="10px" fw={600} c="dimmed">Flags this month</Text>
                    </Paper>
                )
            })}
        </div>
      </Card>
    </div>
  );
};

export default VerifierAnalytics;
