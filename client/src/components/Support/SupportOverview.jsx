import React from 'react';
import { Card, Text, Group, Stack, Badge, Button } from '@mantine/core';
import { MessageSquare, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const SupportOverview = ({ grievances }) => {
  const pendingCount = grievances?.filter(g => g.status === 'pending').length || 0;
  const resolvedCount = grievances?.filter(g => g.status === 'resolved').length || 0;
  const urgentCount = grievances?.filter(g => g.priority === 'urgent').length || 0;

  return (
    <Stack gap="md">
      <Group grow>
        <Card withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" c="dimmed">Pending Cases</Text>
              <Text size="xl" fw={700}>{pendingCount}</Text>
            </div>
            <Clock size={24} />
          </Group>
        </Card>

        <Card withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" c="dimmed">Resolved</Text>
              <Text size="xl" fw={700} c="green">{resolvedCount}</Text>
            </div>
            <CheckCircle size={24} />
          </Group>
        </Card>
      </Group>

      <Card withBorder>
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Text size="sm" c="dimmed">Urgent Cases</Text>
            <Text size="xl" fw={700} c="red">{urgentCount}</Text>
          </div>
          <AlertTriangle size={24} />
        </Group>

        <Group gap="xs">
          <Badge color="red" size="sm">High Priority</Badge>
          <Badge color="orange" size="sm">Medium Priority</Badge>
          <Badge color="yellow" size="sm">Low Priority</Badge>
        </Group>

        <Button size="sm" mt="md" variant="light">
          View All Cases
        </Button>
      </Card>
    </Stack>
  );
};

export default SupportOverview;