import React from 'react';
import { Card, Text, Group, Stack, Progress, Badge } from '@mantine/core';
import { BarChart3, AlertCircle, TrendingDown, Activity } from 'lucide-react';

const AnalyticsOverview = ({ analytics }) => {
  return (
    <Stack gap="md">
      <Group grow>
        <Card withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" c="dimmed">Anomalies Detected</Text>
              <Text size="xl" fw={700}>{analytics?.anomaliesDetected || 0}</Text>
              <Text size="xs" c="red" mt="xs">+5% from last week</Text>
            </div>
            <AlertCircle size={24} />
          </Group>
        </Card>

        <Card withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" c="dimmed">Data Processed</Text>
              <Text size="xl" fw={700}>{analytics?.dataProcessed || '2.1M'}</Text>
              <Text size="xs" c="green" mt="xs">+8% from last week</Text>
            </div>
            <BarChart3 size={24} />
          </Group>
        </Card>
      </Group>

      <Card withBorder>
        <Text size="sm" c="dimmed" mb="md">Detection Accuracy</Text>
        <Group justify="space-between" mb="xs">
          <Text size="sm">Overall Performance</Text>
          <Text size="sm" fw={600}>94.2%</Text>
        </Group>
        <Progress value={94.2} size="sm" />

        <Group mt="md" gap="xs">
          <Badge color="green" size="sm">High Confidence</Badge>
          <Badge color="yellow" size="sm">Medium Confidence</Badge>
          <Badge color="red" size="sm">Low Confidence</Badge>
        </Group>
      </Card>
    </Stack>
  );
};

export default AnalyticsOverview;