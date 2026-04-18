import { Table, Badge, Group, Avatar, ActionIcon, ScrollArea, Loader, Text, Stack, Anchor } from '@mantine/core';
import { RotateCw, FileImage } from 'lucide-react';

const EarningsTable = ({ earnings, loading, onRefresh }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge color="green" variant="light" size="sm">Verified</Badge>;
      case 'flagged':
        return <Badge color="red" variant="light" size="sm">Flagged</Badge>;
      default:
        return <Badge color="gray" variant="light" size="sm">Pending</Badge>;
    }
  };

  const getPlatformIcon = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes('uber')) return { color: 'black', text: 'U' };
    if (p.includes('deliveroo')) return { color: 'black', text: 'D' };
    if (p.includes('door')) return { color: 'black', text: 'D' };
    return { color: 'black', text: platform.charAt(0) };
  };

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text fw={600}>Recent Activity</Text>
        <ActionIcon variant="subtle" onClick={onRefresh} loading={loading}>
          <RotateCw size={16} />
        </ActionIcon>
      </Group>

      <ScrollArea h={400}>
        {loading && !earnings.length ? (
          <Stack align="center" justify="center" p="xl">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">Loading...</Text>
          </Stack>
        ) : earnings.length === 0 ? (
          <Stack align="center" justify="center" p="xl">
            <Text c="dimmed">No activity recorded</Text>
          </Stack>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Platform</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Evidence</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {earnings.map((e) => {
                const iconCfg = getPlatformIcon(e.platform);
                return (
                  <Table.Tr key={e._id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar color={iconCfg.color} radius="sm" size="sm">{iconCfg.text}</Avatar>
                        <span>{e.platform}</span>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <span style={{ fontWeight: 600 }}>${e.netAmount.toFixed(2)}</span>
                    </Table.Td>
                    <Table.Td>
                      {new Date(e.shiftStart).toLocaleDateString()}
                    </Table.Td>
                    <Table.Td>
                      {getStatusBadge(e.verificationStatus)}
                    </Table.Td>
                    <Table.Td>
                      {e.evidenceUrls && e.evidenceUrls.length > 0 ? (
                        <Anchor href={e.evidenceUrls[0]} target="_blank" underline="hover">
                          <Group gap={4}>
                            <FileImage size={14} />
                            <Text size="xs">View</Text>
                          </Group>
                        </Anchor>
                      ) : (
                        <Text size="xs" c="dimmed">None</Text>
                      )}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        )}
      </ScrollArea>
    </div>
  );
};

export default EarningsTable;