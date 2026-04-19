import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getEarningById, 
  updateEarning 
} from '../../api/earnings';
import { 
  Group, 
  Text, 
  Button,
  LoadingOverlay,
  Card,
  Badge,
  Stack,
  Divider,
  Textarea,
  ActionIcon,
  Tooltip,
  Paper,
  SimpleGrid,
  Avatar
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { 
  ChevronLeft, 
  CheckCircle2, 
  AlertTriangle, 
  XOctagon, 
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  User,
  Calendar,
  Clock,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import dayjs from 'dayjs';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [earning, setEarning] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchEarningDetail();
  }, [id]);

  const fetchEarningDetail = async () => {
    setLoading(true);
    try {
      const res = await getEarningById(id);
      setEarning(res.data.data);
    } catch (err) {
      console.error(err);
      notifications.show({
        title: 'Network Error',
        message: 'Could not retrieve record details from the node',
        color: 'red',
        icon: <X size={16} />,
        radius: 'md'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status) => {
    setActionLoading(true);
    try {
      const verifier = JSON.parse(localStorage.getItem('user'));
      await updateEarning(id, {
        verificationStatus: status,
        verifierComments: comment,
        verifiedBy: verifier.id || verifier.email,
        verifiedAt: new Date().toISOString()
      });
      notifications.show({
        title: 'Review Complete',
        message: `Record has been updated to ${status.toUpperCase()}`,
        color: status === 'verified' ? 'teal' : status === 'flagged' ? 'yellow' : 'red',
        icon: <Check size={16} />,
        radius: 'md'
      });
      navigate('/dashboard/verifier/queue');
    } catch (err) {
      console.error(err);
      notifications.show({
        title: 'Action Failed',
        message: 'System could not commit your review to the ledger',
        color: 'red',
        icon: <X size={16} />,
        radius: 'md'
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !earning) return (
    <div className="h-[70vh] relative">
      <LoadingOverlay visible={true} />
    </div>
  );

  if (!earning) return <Text>Record not found.</Text>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <Group>
          <ActionIcon 
            variant="default" 
            onClick={() => navigate('/dashboard/verifier/queue')} 
            radius="xl" 
            size="lg"
          >
            <ChevronLeft size={20} />
          </ActionIcon>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-none">Review Submission</h2>
            <Text size="xs" c="dimmed" fw={700}>ID: {earning._id}</Text>
          </div>
        </Group>

        <Group>
          <Badge size="xl" color="yellow" variant="light" radius="md">Pending Review</Badge>
        </Group>
      </header>

      <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="xl">
        {/* LEFT: Image Comparison */}
        <Stack spacing="lg">
           <Paper radius="24px" withBorder p="md" className="bg-slate-50 border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
              <Group justify="space-between" mb="md" px="xs">
                 <Group gap={8}>
                    <ImageIcon size={18} className="text-indigo-600" />
                    <Text fw={700} size="sm">Evidence Screenshot</Text>
                 </Group>
                 <ActionIcon variant="subtle" color="indigo" onClick={() => window.open(earning.evidenceUrls[0], '_blank')}>
                    <ExternalLink size={16} />
                 </ActionIcon>
              </Group>
              
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center relative group">
                {earning.evidenceUrls && earning.evidenceUrls.length > 0 ? (
                    <img 
                      src={earning.evidenceUrls[0]} 
                      alt="Verification Evidence" 
                      className="max-w-full max-h-full object-contain cursor-zoom-in"
                    />
                ) : (
                    <div className="text-center p-10">
                        <ImageIcon size={64} className="mx-auto mb-4 opacity-10" />
                        <Text c="dimmed">No screenshot provided for this record.</Text>
                    </div>
                )}
              </div>
           </Paper>

           <Card radius="24px" withBorder p="xl">
              <Text fw={700} mb="xl" size="lg">Verifier Actions</Text>
              <Stack gap="md">
                <Textarea 
                  label="Review Comments"
                  placeholder="e.g. Data matches screenshot perfectly..."
                  minRows={3}
                  radius="md"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                
                <SimpleGrid cols={3} spacing="md" mt="md">
                  <Button 
                    color="teal" 
                    radius="xl" 
                    size="md" 
                    leftSection={<CheckCircle2 size={18}/>}
                    onClick={() => handleAction('verified')}
                    loading={actionLoading}
                  >
                    Approve
                  </Button>
                  <Button 
                    color="yellow" 
                    radius="xl" 
                    size="md" 
                    variant="light"
                    leftSection={<AlertTriangle size={18}/>}
                    onClick={() => handleAction('flagged')}
                    loading={actionLoading}
                  >
                    Flag Item
                  </Button>
                  <Button 
                    color="red" 
                    radius="xl" 
                    size="md" 
                    variant="outline"
                    leftSection={<XOctagon size={18}/>}
                    onClick={() => handleAction('unverifiable')}
                    loading={actionLoading}
                  >
                    Reject
                  </Button>
                </SimpleGrid>
              </Stack>
           </Card>
        </Stack>

        {/* RIGHT: Data Comparison */}
        <Stack spacing="lg">
           {/* Anomaly Alerts Section */}
           {earning.anomalies && earning.anomalies.length > 0 && (
             <Card radius="24px" withBorder p="xl" className="border-rose-100 bg-rose-50/30 shadow-sm">
                <Group mb="md">
                  <div className="bg-rose-500 p-2 rounded-xl text-white">
                    <AlertTriangle size={20} />
                  </div>
                  <Text fw={800} c="rose.9">System Integrity Flag</Text>
                </Group>
                <Stack gap="sm">
                  {earning.anomalies.map((anomaly, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
                       <Text size="xs" fw={800} tt="uppercase" c="rose.6" mb={2}>
                         {anomaly.type.replace(/_/g, ' ')} ({anomaly.severity})
                       </Text>
                       <Text size="sm" fw={600} c="slate.8">{anomaly.message}</Text>
                       <Text size="xs" c="dimmed" mt={4} italic>{anomaly.suggestion}</Text>
                    </div>
                  ))}
                </Stack>
             </Card>
           )}

           <Card radius="24px" withBorder p="xl" className="shadow-sm">
               <Group justify="space-between" mb={30}>
                  <Group>
                    <Avatar color="indigo" radius="xl" size="lg">
                       <User size={24} />
                    </Avatar>
                    <div>
                      <Text fw={800} size="lg">{earning.workerId}</Text>
                      <Badge color="gray" variant="outline">Worker Account</Badge>
                    </div>
                  </Group>
                  <div className="text-right">
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={2}>Platform</Text>
                    <Badge size="xl" color="dark" radius="md">{earning.platform}</Badge>
                  </div>
               </Group>

               <Divider variant="dashed" mb="xl" />

               <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                     <div className="bg-slate-50 p-4 rounded-2xl">
                        <Text size="xs" c="dimmed" fw={700} tracking={1} tt="uppercase" mb={4}>Gross Amount</Text>
                        <Text size="xl" fw={900}>Rs. {earning.grossAmount.toFixed(2)}</Text>
                     </div>
                     <div className="bg-emerald-50 p-4 rounded-2xl">
                        <Text size="xs" c="teal.9" fw={700} tracking={1} tt="uppercase" mb={4}>Net Amount</Text>
                        <Text size="xl" fw={900} c="teal.7">Rs. {earning.netAmount.toFixed(2)}</Text>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="bg-slate-50 p-4 rounded-2xl h-full">
                        <Text size="xs" c="dimmed" fw={700} tracking={1} tt="uppercase" mb={4}>Deductions</Text>
                        {earning.deductions && earning.deductions.length > 0 ? (
                           <Stack gap={4}>
                              {earning.deductions.map((d, i) => (
                                <Group key={i} justify="space-between">
                                  <Text size="xs" fw={500}>{d.description || d.type}</Text>
                                  <Text size="xs" fw={700} c="red.6">-Rs. {d.amount}</Text>
                                </Group>
                              ))}
                           </Stack>
                        ) : (
                           <Text size="xs" c="dimmed" fs="italic">No deductions logged</Text>
                        )}
                     </div>
                  </div>
               </div>

               <Paper radius="24px" withBorder p="xl" className="border-indigo-100 bg-indigo-50/50">
                  <Group mb="lg">
                      <Calendar size={18} className="text-indigo-600" />
                      <Text fw={700}>Shift Timing</Text>
                  </Group>
                  <Group grow>
                      <div>
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={1}>Start</Text>
                        <Text fw={800}>{dayjs(earning.shiftStart).format('MMM DD, YYYY')}</Text>
                        <Text size="xs" c="dimmed">{dayjs(earning.shiftStart).format('HH:mm [hrs]')}</Text>
                      </div>
                      <ActionIcon variant="subtle" color="indigo" disabled>
                        <ArrowRight size={20} />
                      </ActionIcon>
                      <div>
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={1}>End</Text>
                        <Text fw={800}>{dayjs(earning.shiftEnd).format('MMM DD, YYYY')}</Text>
                        <Text size="xs" c="dimmed">{dayjs(earning.shiftEnd).format('HH:mm [hrs]')}</Text>
                      </div>
                  </Group>
               </Paper>
           </Card>

           <Card radius="24px" withBorder p="xl" className="text-white bg-slate-900">
              <Group mb="lg">
                 <ShieldCheck size={20} className="text-emerald-400" />
                 <Text fw={700}>Anomaly Check</Text>
              </Group>
              <Group grow>
                <div>
                   <Text size="xs" c="gray.5" fw={700} tt="uppercase" mb={1}>Anomaly Score</Text>
                   <Text size="xl" fw={900} color={earning.anomalyScore > 0.7 ? "red" : "teal"}>
                      {(earning.anomalyScore * 100).toFixed(0)}%
                   </Text>
                </div>
                <div>
                   <Text size="xs" c="gray.5" fw={700} tt="uppercase" mb={1}>Risk Level</Text>
                   <Badge 
                    color={earning.anomalyScore > 0.7 ? "red" : earning.anomalyScore > 0.3 ? "orange" : "teal"}
                    variant="filled"
                   >
                     {earning.anomalyScore > 0.7 ? "High Risk" : earning.anomalyScore > 0.3 ? "Medium" : "Low Risk"}
                   </Badge>
                </div>
              </Group>
           </Card>
        </Stack>
      </SimpleGrid>
    </div>
  );
};

export default ReviewDetail;
