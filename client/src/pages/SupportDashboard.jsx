import React from 'react';
import { AppShell, Container, Text } from '@mantine/core';
import Sidebar from '../components/Sidebar';
import SupportOverview from '../components/Support/SupportOverview';
import { navigationConfig } from '../config/navigation';

const SupportDashboard = () => {
  // Mock data - in real app this would come from API
  const grievances = [
    { id: 1, status: 'pending', priority: 'urgent' },
    { id: 2, status: 'pending', priority: 'medium' },
    { id: 3, status: 'resolved', priority: 'low' },
    { id: 4, status: 'pending', priority: 'urgent' },
    { id: 5, status: 'resolved', priority: 'medium' }
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Text fw={700} size="lg" style={{ lineHeight: '60px' }}>
            FairGig Support Portal
          </Text>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar navigation={navigationConfig} currentRole="support" />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl" py="md">
          <Text size="xl" fw={700} mb="lg">Support Dashboard</Text>
          <SupportOverview grievances={grievances} />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default SupportDashboard;