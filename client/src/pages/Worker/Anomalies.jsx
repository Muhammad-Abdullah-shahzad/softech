import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  ShieldAlert, 
  ArrowRight, 
  Calendar, 
  IndianRupee, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Badge, Button, Group, Stack, Text, Card, Alert } from '@mantine/core';
import { getWorkerAnalytics } from '../../api/earnings';
import { useNavigate } from 'react-router-dom';

const Anomalies = () => {
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const workerId = user.id || user.email || 'worker_01';

    useEffect(() => {
        const fetchAnomalies = async () => {
            try {
                const res = await getWorkerAnalytics(workerId);
                setAnomalies(res.data.data.anomalies || []);
            } catch (err) {
                console.error('Error fetching anomalies:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnomalies();
    }, []);

    if (loading) return <div>Loading anomalies...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 border-none">System Integrity Alerts</h2>
                <p className="text-slate-500 mt-1">Our AI Anomaly Engine has flagged the following records for manual review.</p>
            </div>

            {anomalies.length === 0 ? (
                <Card radius="24px" p={40} withBorder className="bg-slate-50/50 border-dashed text-center">
                    <Stack align="center" gap="md">
                        <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
                            <ShieldAlert size={48} />
                        </div>
                        <Text fw={800} size="xl" c="slate.9">All Clear!</Text>
                        <Text c="dimmed" maw={400}>No unusual patterns detected in your earnings. Your data integrity score is excellent.</Text>
                    </Stack>
                </Card>
            ) : (
                <Stack gap="lg">
                    <Alert 
                        variant="light" 
                        color="rose" 
                        title="Attention Required" 
                        icon={<AlertCircle size={18} />}
                        radius="xl"
                        className="border border-rose-100"
                    >
                        The following records show patterns that significantly deviate from your historical data. Please verify these to maintain your account trust score.
                    </Alert>

                    {anomalies.map((anomaly, idx) => (
                        <Card key={idx} radius="24px" withBorder className="hover:shadow-lg transition-all border-rose-100 overflow-hidden p-0">
                            <div className="flex flex-col md:flex-row">
                                <div className="bg-rose-500 p-6 flex flex-col items-center justify-center text-white md:w-48 text-center shrink-0">
                                    <AlertCircle size={32} className="mb-2" />
                                    <Text fw={900} size="sm" tt="uppercase" tracking={1}>{anomaly.severity}</Text>
                                    <Text size="xs" opacity={0.8}>Severity</Text>
                                </div>
                                <div className="p-8 flex-1">
                                    <Group justify="space-between" mb="md">
                                        <Badge color="rose" variant="filled" py="lg" px="xl" radius="md">
                                            {anomaly.type.replace(/_/g, ' ')}
                                        </Badge>
                                        <Group gap="xs" className="text-slate-400">
                                            <Calendar size={14} />
                                            <Text size="xs" fw={700}>{anomaly.affectedDates?.[0]}</Text>
                                        </Group>
                                    </Group>

                                    <h4 className="text-xl font-bold text-slate-900 mb-2 border-none leading-tight">
                                        {anomaly.message}
                                    </h4>
                                    
                                    <p className="text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                                        " {anomaly.suggestion} "
                                    </p>

                                    {anomaly.earningRef && (
                                        <div className="mt-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <Group gap="sm">
                                                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                                                    <ShieldAlert size={16} className="text-slate-500" />
                                                </div>
                                                <div>
                                                    <Text size="xs" fw={900} tt="uppercase" c="slate.4" tracking={1}>Flagged Source Record</Text>
                                                    <Text size="sm" fw={700} c="slate.8">
                                                        {anomaly.earningRef.platform} shift on {new Date(anomaly.earningRef.date).toLocaleDateString()}
                                                    </Text>
                                                </div>
                                            </Group>
                                            <div className="sm:text-right">
                                                <Text size="xl" fw={900} className="italic text-slate-800 tracking-tight">₹{anomaly.earningRef.amount}</Text>
                                                <Text size="xs" fw={700} c="slate.4">Reported Payout</Text>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-8 flex justify-end gap-3">
                                        <Button 
                                            variant="light" 
                                            color="rose" 
                                            radius="xl" 
                                            rightSection={<ExternalLink size={14} />}
                                            onClick={() => navigate('/dashboard/worker/upload')}
                                        >
                                            Re-verify Data
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </Stack>
            )}
        </div>
    );
};

export default Anomalies;
