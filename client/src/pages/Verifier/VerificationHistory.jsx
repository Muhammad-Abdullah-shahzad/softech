import React, { useState, useEffect } from 'react';
import { getEarnings } from '../../api/earnings';
import { 
  Table, 
  Badge, 
  Group, 
  Text, 
  ScrollArea, 
  Card,
  Avatar,
  LoadingOverlay
} from '@mantine/core';
import { History, CheckCircle2, AlertTriangle, XOctagon } from 'lucide-react';
import dayjs from 'dayjs';

const VerificationHistory = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Get all verified and unverifiable (and flagged) to show history
      const res = await getEarnings();
      const history = res.data.data.filter(e => e.verificationStatus !== 'pending' && e.verificationStatus !== 'unverified');
      setEarnings(history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'verified': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'flagged': return <AlertTriangle size={14} className="text-amber-500" />;
      case 'unverifiable': return <XOctagon size={14} className="text-rose-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 border-none">Verification History</h2>
        <p className="text-slate-500">Audit log of all decisions made by the verification team.</p>
      </header>

      <Card radius="24px" p="xl" withBorder shadow="sm" className="bg-white border-slate-100">
        <div className="relative min-h-[400px]">
          <LoadingOverlay visible={loading} />
          <ScrollArea h={600}>
            <Table verticalSpacing="md">
              <Table.Thead className="bg-slate-50/50">
                <Table.Tr>
                  <Table.Th>Worker</Table.Th>
                  <Table.Th>Outcome</Table.Th>
                  <Table.Th>Decision Date</Table.Th>
                  <Table.Th>Verifier ID</Table.Th>
                  <Table.Th>Comments</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {earnings.map((item) => (
                  <Table.Tr key={item._id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar color="indigo" radius="xl" size="sm">
                           {item.workerId[0].toUpperCase()}
                        </Avatar>
                        <Text size="sm" fw={600}>{item.workerId}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                        <Group gap={6}>
                            {getStatusIcon(item.verificationStatus)}
                            <Badge 
                                color={item.verificationStatus === 'verified' ? 'emerald' : item.verificationStatus === 'flagged' ? 'amber' : 'rose'} 
                                variant="light"
                                radius="sm"
                            >
                                {item.verificationStatus}
                            </Badge>
                        </Group>
                    </Table.Td>
                    <Table.Td>
                        <Text size="xs" c="dimmed">{dayjs(item.verifiedAt || item.updatedAt).format('MMM DD, YYYY HH:mm')}</Text>
                    </Table.Td>
                    <Table.Td>
                        <Text size="xs" fw={700} c="gray.7">{item.verifiedBy || "System"}</Text>
                    </Table.Td>
                    <Table.Td>
                        <Text size="xs" className="line-clamp-1 italic text-slate-500" title={item.verifierComments}>
                            {item.verifierComments || "No comment added"}
                        </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};

export default VerificationHistory;
