import React from 'react';
import { AppShell, Container, Text } from '@mantine/core';
import Sidebar from '../components/Sidebar';
import AnalyticsOverview from '../components/Analyst/AnalyticsOverview';
import { navigationConfig } from '../config/navigation';

const AnalystDashboard = () => {
  // Mock data - in real app this would come from API
  const analytics = {
    anomaliesDetected: 47,
    dataProcessed: '2.1M'
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="xl" h="100%">
          <div className="h-full flex items-center justify-between">
            <img src="/logo.png" alt="FairGig" className="h-8 w-auto" />
            <Text fw={900} size="sm" tt="uppercase" tracking={1.2} c="slate.4">Analytics Portal</Text>
          </div>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar navigation={navigationConfig} currentRole="analyst" />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl" py="md">
          <Text size="xl" fw={700} mb="lg">Analytics Dashboard</Text>
          <AnalyticsOverview analytics={analytics} />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default AnalystDashboard;