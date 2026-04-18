import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getEarnings 
} from '../../api/earnings';
import { 
  Table, 
  Badge, 
  Group, 
  Text, 
  ActionIcon, 
  ScrollArea, 
  TextInput, 
  Select, 
  Button,
  LoadingOverlay,
  Card,
  Avatar
} from '@mantine/core';
import { Search, Filter, ChevronRight, Eye, Calendar, DollarSign, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const VerificationQueue = () => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPendingEarnings();
  }, [filterPlatform]);

  const fetchPendingEarnings = async () => {
    setLoading(true);
    try {
      // status=pending filter we added to the backend
      const res = await getEarnings('', 'pending', filterPlatform);
      setEarnings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEarnings = earnings.filter(e => 
    e.workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 border-none">Verification Queue</h2>
          <p className="text-slate-500">Review pending earnings logs from across all platforms.</p>
        </div>
        <div className="flex items-center gap-3">
            <Badge size="xl" color="yellow" variant="light" py={18} px={20} radius="xl">
                <Group gap={8}>
                    <Clock size={16} />
                    <span>{earnings.length} Pending Actions</span>
                </Group>
            </Badge>
        </div>
      </header>

      <Card radius="24px" p="xl" withBorder shadow="sm" className="bg-white border-slate-100">
        <Group mb="xl" justify="space-between">
           <div className="flex items-center gap-4 flex-1">
              <TextInput
                placeholder="Search by worker ID..."
                leftSection={<Search size={16} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                radius="md"
                className="w-full max-w-sm"
              />
              <Select
                placeholder="Filter Platform"
                data={['Uber', 'Careem', 'Yango', 'Bykea', 'Foodpanda', 'Fiverr', 'Upwork', 'Freelancer']}
                clearable
                radius="md"
                value={filterPlatform}
                onChange={setFilterPlatform}
                leftSection={<Filter size={14} />}
              />
           </div>
           <Button variant="light" color="indigo" radius="md" onClick={fetchPendingEarnings}>
              Refresh Queue
           </Button>
        </Group>

        <div className="relative min-h-[400px]">
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
          
          <ScrollArea h={600}>
            <Table verticalSpacing="md" className="min-w-[1000px]">
              <Table.Thead className="bg-slate-50/50">
                <Table.Tr>
                  <Table.Th>Worker Info</Table.Th>
                  <Table.Th>Platform</Table.Th>
                  <Table.Th>Earnings Details</Table.Th>
                  <Table.Th>Shift Period</Table.Th>
                  <Table.Th>Evidence</Table.Th>
                  <Table.Th>Submission Time</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredEarnings.map((item) => (
                  <Table.Tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar color="indigo" radius="xl" size="md">
                           {item.workerId.substring(0,2).toUpperCase()}
                        </Avatar>
                        <div>
                          <Text size="sm" fw={700} c="dark.9">{item.workerId}</Text>
                          <Text size="xs" c="dimmed">ID: {item._id.substring(item._id.length-6)}</Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="dot" color="dark" size="md" radius="sm">
                        {item.platform}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <div className="space-y-1">
                        <Text size="sm" fw={800} c="teal.7">₹{item.netAmount.toFixed(2)}</Text>
                        <Text size="xs" c="dimmed">Gross: ₹{item.grossAmount}</Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <div className="space-y-0.5">
                        <Group gap={4}>
                            <Calendar size={12} className="text-slate-400" />
                            <Text size="xs" fw={500}>{dayjs(item.shiftStart).format('MMM DD, YYYY')}</Text>
                        </Group>
                        <Text size="xs" c="dimmed">
                            {dayjs(item.shiftStart).format('HH:mm')} - {dayjs(item.shiftEnd).format('HH:mm')}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                        {item.evidenceUrls && item.evidenceUrls.length > 0 ? (
                            <Avatar 
                              src={item.evidenceUrls[0]} 
                              radius="md" 
                              size="lg" 
                              className="border border-slate-200"
                            />
                        ) : (
                            <Badge color="gray" variant="light">No Evidence</Badge>
                        )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" fw={500} c="gray.6">
                        {dayjs(item.createdAt).fromNow()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Button 
                        rightSection={<ChevronRight size={16}/>} 
                        variant="filled" 
                        color="indigo" 
                        radius="md"
                        size="xs"
                        onClick={() => navigate(`/dashboard/verifier/review/${item._id}`)}
                      >
                        Review
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
                {filteredEarnings.length === 0 && !loading && (
                    <Table.Tr>
                        <Table.Td colSpan={7} className="text-center py-20">
                            <Text c="dimmed">Great job! The queue is empty.</Text>
                        </Table.Td>
                    </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};

export default VerificationQueue;
