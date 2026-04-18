import React from 'react';
import { Card, Text, Group, Badge, Stack } from '@mantine/core';
import { DollarSign, Clock, AlertTriangle } from 'lucide-react';

const EarningsOverview = ({ earnings }) => {
  const totalEarned = earnings.reduce((acc, curr) => acc + curr.netAmount, 0);
  const flaggedCount = earnings.filter(e => e.verificationStatus === 'flagged').length;
  const totalShifts = earnings.length;

  return (
    <Stack gap="md">
      <Card withBorder>
        <Group justify="space-between" align="center">
          <div>
            <Text size="sm" c="dimmed">Total Earned</Text>
            <Text size="xl" fw={700}>${totalEarned.toFixed(2)}</Text>
          </div>
          <DollarSign size={24} />
        </Group>
      </Card>

      <Group grow>
        <Card withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" c="dimmed">Total Shifts</Text>
              <Text size="lg" fw={600}>{totalShifts}</Text>
            </div>
            <Clock size={20} />
          </Group>
        </Card>

        <Card withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" c="dimmed">Flagged</Text>
              <Text size="lg" fw={600} c={flaggedCount > 0 ? 'red' : 'black'}>{flaggedCount}</Text>
            </div>
            <AlertTriangle size={20} />
          </Group>
        </Card>
      </Group>
    </Stack>
  );
};

export default EarningsOverview;