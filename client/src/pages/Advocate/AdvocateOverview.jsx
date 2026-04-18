import React, { useState, useEffect } from 'react';
import { getAdvocateOverview } from '../../api/analytics';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend, Treemap
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

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];
    const verificationPieData = data.verificationStats.map((item, idx) => ({
        name: item._id,
        value: item.count,
        color: COLORS[idx % COLORS.length]
    }));

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
            <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <Badge color="indigo" variant="filled" size="lg" radius="sm">Advocate Intelligence Access</Badge>
                    <h1 className="text-5xl font-black text-slate-900 border-none tracking-tight uppercase italic leading-[0.9]">
                        Systemic Fairness <span className="text-indigo-600">Analytics</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">Real-time monitoring of platform behavior and worker vulnerability.</p>
                </div>
                <Group>
                    <Button variant="default" leftSection={<Download size={16} />} radius="md">Export Data</Button>
                    <Button color="indigo" radius="md">Live Status</Button>
                </Group>
            </header>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
                <Paper radius="32px" withBorder p="xl" className="border-slate-100 shadow-sm relative overflow-hidden group">
                    <Stack gap={2}>
                        <Text size="xs" fw={900} tt="uppercase" c="dimmed">Active Workers</Text>
                        <Text size="42px" fw={900} className="italic">{data.kpis.totalWorkers}</Text>
                        <Text size="xs" fw={700} c="indigo.6">Active nodes</Text>
                    </Stack>
                    <Users size={80} className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-indigo-50 transition-colors" />
                </Paper>

                <Paper radius="32px" withBorder p="xl" className="border-rose-100 bg-rose-50/20 shadow-sm border-l-4 border-l-rose-500">
                    <Stack gap={2}>
                        <Text size="xs" fw={900} tt="uppercase" c="rose.9">Vulnerable Households</Text>
                        <Text size="42px" fw={900} c="rose.7" className="italic">{data.kpis.vulnerableTotal}</Text>
                        <Text size="xs" fw={700} c="rose.6" className="flex items-center gap-1">
                            <TrendingUp size={12} /> {">"}20% Income Drop
                        </Text>
                    </Stack>
                </Paper>

                <Paper radius="32px" withBorder p="xl" className="border-slate-100 shadow-sm">
                    <Stack gap={2}>
                        <Text size="xs" fw={900} tt="uppercase" c="dimmed">Avg Commission Rate</Text>
                        <Text size="42px" fw={900} className="italic text-slate-800">{data.kpis.avgCommission}%</Text>
                        <Text size="xs" fw={700} c="dimmed">System average</Text>
                    </Stack>
                </Paper>

                <Paper radius="32px" withBorder p="xl" className="bg-slate-900 text-white border-none shadow-2xl">
                    <Stack gap={2}>
                        <Text size="xs" fw={900} tt="uppercase" c="indigo.3">System Community Activity</Text>
                        <Text size="42px" fw={900} className="italic text-amber-400">{data.kpis.totalGrievances || 0}</Text>
                        <Text size="xs" fw={700} c="indigo.1" opacity={0.6}>Total workers discussing issues</Text>
                    </Stack>
                </Paper>
            </SimpleGrid>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card radius="40px" withBorder p={40} className="lg:col-span-2 shadow-sm border-slate-100">
                    <Group justify="space-between" mb={40}>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 border-none italic uppercase tracking-tighter">Commission Rate Trends</h3>
                            <Text size="sm" c="dimmed" fw={600}>Longitudinal analysis of platform take-rates.</Text>
                        </div>
                        <Select placeholder="Period" data={['Last 30 Days']} defaultValue="Last 30 Days" radius="md" size="sm" />
                    </Group>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                {data.commissionTrends.map((p, i) => (
                                    <Line key={p._id} type="monotone" dataKey={p._id} stroke={COLORS[i % COLORS.length]} strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card radius="40px" withBorder p={40} className="shadow-sm border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 border-none italic uppercase mb-2">Evidence Integrity</h3>
                    <Text size="sm" c="dimmed" fw={600} mb={40}>Verification breakdown.</Text>
                    <div className="h-64 mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={verificationPieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                                    {verificationPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <Stack gap="xs">
                        {verificationPieData.map((d, i) => (
                            <Group key={i} justify="space-between" p="md" radius="xl" className="bg-slate-50/50">
                                <Group gap="xs">
                                    <Box w={12} h={12} bg={d.color} style={{ borderRadius: '4px' }} />
                                    <Text size="sm" fw={800} className="uppercase tracking-tight">{d.name}</Text>
                                </Group>
                                <Text size="sm" fw={900}>{d.value}</Text>
                            </Group>
                        ))}
                    </Stack>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card radius="40px" withBorder p={40} className="shadow-sm border-slate-100">
                    <Group justify="space-between" mb={30}>
                        <h3 className="text-2xl font-black text-slate-800 border-none italic uppercase tracking-tighter">Platform Fairness Index</h3>
                        <Badge variant="filled" color="indigo" radius="md" size="lg">RANKED</Badge>
                    </Group>
                    
                    <Stack gap="xl">
                        {data.platformFairness && data.platformFairness.length > 0 ? data.platformFairness.map((plat, i) => (
                            <div key={i} className="group">
                                <Group justify="space-between" mb={12}>
                                    <Group gap="md">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            {plat.platform[0]}
                                        </div>
                                        <div>
                                            <Text fw={900} size="md" className="tracking-tight lowercase">{plat.platform}</Text>
                                            <Text size="xs" c="dimmed" fw={700}>Based on {data.kpis.totalWorkers} data points</Text>
                                        </div>
                                    </Group>
                                    <div className="text-right">
                                        <Text fw={1000} size="xl" c={plat.score > 70 ? 'emerald.7' : plat.score > 50 ? 'amber.7' : 'rose.7'}>
                                            {plat.score}
                                        </Text>
                                        <Text size="xs" fw={800} tt="uppercase" opacity={0.5}>Fairness Score</Text>
                                    </div>
                                </Group>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${plat.score > 70 ? 'bg-emerald-500' : plat.score > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                        style={{ width: `${plat.score}%` }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <Text align="center" c="dimmed">No ranking data available.</Text>
                        )}
                    </Stack>

                    <Paper mt={40} p="xl" radius="24px" className="bg-slate-50 border border-slate-100 italic">
                        <Text size="xs" fw={700} c="slate.5">
                            💡 {data.platformFairness[0]?.platform} is currently the most ethical platform with a score of {data.platformFairness[0]?.score}/100.
                        </Text>
                    </Paper>
                </Card>

                <Card radius="40px" withBorder p={40} className="shadow-sm border-slate-100">
                    <Group justify="space-between" mb={10}>
                        <h3 className="text-2xl font-black text-slate-800 border-none italic uppercase tracking-tighter">City Earnings Comparison</h3>
                        <MapPin size={24} className="text-indigo-500" />
                    </Group>
                    <Text size="sm" c="dimmed" fw={600} mb={30}>Average worker earnings across major metropolitan clusters.</Text>
                    
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.distribution} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="_id" 
                                    type="category" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#475569', fontSize: 13, fontWeight: 900 }} 
                                    width={120} 
                                />
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }} 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="avg" fill="#818cf8" radius={[0, 10, 10, 0]} barSize={40}>
                                    {data.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 space-y-4">
                        <Paper p="md" radius="xl" bg="slate.50" className="border border-slate-100 flex justify-between items-center px-8">
                             <Text size="xs" fw={800} c="dimmed" tt="uppercase">Highest Earning City</Text>
                             <Text size="sm" fw={900} c="indigo.7" className="italic">{[...data.distribution].sort((a,b) => b.avg - a.avg)[0]?._id  || 'N/A'}</Text>
                        </Paper>
                        
                        <Divider my="sm" variant="dashed" label="Anomalies" labelPosition="center" />

                        {data.spikes && data.spikes.length > 0 ? data.spikes.map((spike, idx) => (
                            <Paper key={idx} p="xl" radius="24px" className="bg-amber-50 border border-amber-100">
                                <Group gap="lg">
                                    <ThemeIcon size="xl" color="amber" variant="filled" radius="md"><Zap size={20} /></ThemeIcon>
                                    <div className="flex-1">
                                        <Text fw={900} size="sm" className="uppercase tracking-tight">Commission Spike</Text>
                                        <Text size="xs" fw={700} c="amber.9">{spike.platform} rates rose by {spike.increase}% (to {spike.currentRate}%).</Text>
                                    </div>
                                    <Button size="xs" color="amber">Investigate</Button>
                                </Group>
                            </Paper>
                        )) : (
                            <Paper p="xl" radius="24px" className="bg-emerald-50 border border-emerald-100">
                                <Group gap="lg">
                                    <ThemeIcon size="xl" color="teal" variant="filled" radius="md"><ShieldCheck size={20} /></ThemeIcon>
                                    <Text fw={800} size="sm" c="teal.9">No anomalous commission spikes detected currently.</Text>
                                </Group>
                            </Paper>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const CustomTreemapContent = (props) => {
    const { x, y, width, height, index, name, hourly } = props;
    const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: COLORS[index % COLORS.length],
                    stroke: '#fff',
                    strokeWidth: 2,
                    strokeOpacity: 1,
                }}
            />
            {width > 50 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 - 5}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={12}
                    fontWeight={900}
                    className="uppercase tracking-tighter"
                >
                    {name}
                </text>
            )}
            {width > 50 && height > 50 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 15}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={10}
                    fontWeight={700}
                >
                    ₹{hourly}/hr
                </text>
            )}
        </g>
    );
};

export default AdvocateOverview;
