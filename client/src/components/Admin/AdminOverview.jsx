import React from 'react';
import { Card, Text, Group, Stack, Progress } from '@mantine/core';
import { Users, AlertTriangle, TrendingUp, Shield } from 'lucide-react';

const AdminOverview = ({ stats }) => {
  return (
    <Stack gap="md">
      <Group grow>
        <Card withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" c="dimmed">Total Workers</Text>
              <Text size="xl" fw={700}>{stats?.totalWorkers || 0}</Text>
            </div>
            <Users size={24} />
          </Group>
        </Card>

        <Card withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" c="dimmed">Active Disputes</Text>
              <Text size="xl" fw={700}>{stats?.activeDisputes || 0}</Text>
            </div>
            <AlertTriangle size={24} />
          </Group>
        </Card>
      </Group>

      <Group grow>
        <Card withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" c="dimmed">Platform Health</Text>
              <Text size="lg" fw={600}>98%</Text>
              <Progress value={98} size="sm" mt="xs" />
            </div>
            <Shield size={20} />
          </Group>
        </Card>

        <Card withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" c="dimmed">Monthly Growth</Text>
              <Text size="lg" fw={600} c="green">+12%</Text>
            </div>
            <TrendingUp size={20} />
          </Group>
        </Card>
      </Group>
    </Stack>
  );
};

export default AdminOverview;