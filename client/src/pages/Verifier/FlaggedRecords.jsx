import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEarnings } from '../../api/earnings';
import { 
  Table, 
  Badge, 
  Group, 
  Text, 
  ScrollArea, 
  Card,
  Avatar,
  Button,
  LoadingOverlay
} from '@mantine/core';
import { AlertCircle, ChevronRight, MessageSquare } from 'lucide-react';
import dayjs from 'dayjs';

const FlaggedRecords = () => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlaggedEarnings();
  }, []);

  const fetchFlaggedEarnings = async () => {
    setLoading(true);
    try {
      const res = await getEarnings('', 'flagged');
      setEarnings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 border-none">Flagged Records</h2>
        <p className="text-slate-500">Review discrepancies and disputed earnings logs.</p>
      </header>

      <Card radius="24px" p="xl" withBorder shadow="sm" className="bg-white border-slate-100">
        <div className="relative min-h-[400px]">
          <LoadingOverlay visible={loading} />
          <ScrollArea h={600}>
            <Table verticalSpacing="md">
              <Table.Thead className="bg-slate-50/50">
                <Table.Tr>
                  <Table.Th>Worker</Table.Th>
                  <Table.Th>Platform</Table.Th>
                  <Table.Th>Issue / Comments</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {earnings.map((item) => (
                  <Table.Tr key={item._id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar color="rose" radius="xl" size="sm">
                           {item.workerId[0].toUpperCase()}
                        </Avatar>
                        <Text size="sm" fw={600}>{item.workerId}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                       <Badge color="dark" radius="sm">{item.platform}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" wrap="nowrap">
                        <MessageSquare size={14} className="text-rose-500 shrink-0" />
                        <Text size="xs" c="red.8" className="line-clamp-2">
                          {item.verifierComments || "No specific reason provided"}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                       <Text size="sm" fw={700}>₹{item.netAmount}</Text>
                    </Table.Td>
                    <Table.Td>
                       <Button 
                          variant="white" 
                          color="indigo" 
                          size="xs" 
                          rightSection={<ChevronRight size={14}/>}
                          onClick={() => navigate(`/dashboard/verifier/review/${item._id}`)}
                       >
                          Re-review
                       </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
                {earnings.length === 0 && !loading && (
                  <Table.Tr>
                    <Table.Td colSpan={5} className="text-center py-20">
                      <AlertCircle size={40} className="mx-auto mb-4 opacity-10" />
                      <Text c="dimmed">No flagged records found.</Text>
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

export default FlaggedRecords;
