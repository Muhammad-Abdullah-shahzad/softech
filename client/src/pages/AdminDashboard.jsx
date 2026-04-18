import React from 'react';
import { AppShell, Container, Text } from '@mantine/core';
import Sidebar from '../components/Sidebar';
import AdminOverview from '../components/Admin/AdminOverview';
import { navigationConfig } from '../config/navigation';

const AdminDashboard = () => {
  // Mock data - in real app this would come from API
  const stats = {
    totalWorkers: 1250,
    activeDisputes: 23
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Text fw={700} size="lg" style={{ lineHeight: '60px' }}>
            FairGig Admin Portal
          </Text>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar navigation={navigationConfig} currentRole="admin" />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl" py="md">
          <Text size="xl" fw={700} mb="lg">Admin Dashboard</Text>
          <AdminOverview stats={stats} />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default AdminDashboard;