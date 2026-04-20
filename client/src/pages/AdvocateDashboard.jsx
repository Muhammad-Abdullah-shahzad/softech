import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { navigationConfig } from '../config/navigation';
import { Avatar, Menu, Group, ActionIcon, Indicator, Divider, Badge, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Bell, Search, User, LogOut, ShieldCheck, Database, ShieldAlert, X, Mail, MapPin, Fingerprint, Menu as MenuIcon } from 'lucide-react';
import { getProfile } from '../api/profile';

const AdvocateDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token && !storedUser) {
      navigate('/login');
    } else if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'advocate' && parsedUser.role !== 'analyst') {
        notifications.show({
          title: 'Access Restricted',
          message: 'Advocate Intelligence Node requires elevated permissions',
          color: 'red',
          icon: <ShieldAlert size={16} />,
          radius: 'md'
        });
        navigate('/login');
      }
      setUser(parsedUser);

      // Fetch fresh profile data to get all fields
      if (parsedUser.id) {
        getProfile(parsedUser.id)
          .then(res => setUser(prev => ({ ...prev, ...res.data })))
          .catch(err => console.error('Dashboard profile fetch failed:', err));
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      {/* Sidebar - Using the analyst/advocate config */}
      <Sidebar 
        navigation={navigationConfig} 
        currentRole="analyst" 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors"
            >
              <MenuIcon size={24} />
            </button>

            <div className="relative w-96 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Query system datasets..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              />
            </div>
          </div>
            {/* <Badge color="indigo" variant="light" leftSection={<Database size={14}/>} radius="md" size="lg" py={12}>
                Advocate Access
              </Badge> */}

          <Group gap="xl">
            {/* <Indicator color="rose" size={10} offset={2} processing>
                <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                    <Bell size={22} className="text-slate-600" />
                </ActionIcon>
            </Indicator> */}

            <Menu shadow="md" width={220} radius="xl" withArrow>
              <Menu.Target>
                <button className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-2xl transition-colors">
                  <Avatar
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    radius="xl"
                    className="border-2 border-white shadow-sm"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 leading-tight">{user?.fullName || 'Advocate Account'}</p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{user?.role || 'Labour Rights Analyst'}</p>
                  </div>
                </button>
              </Menu.Target>

              <Menu.Dropdown p={8}>
                <Menu.Label>Advocate Profile Node</Menu.Label>
                <div className="px-3 py-2">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={4}>Registry Details</Text>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Mail size={12} />
                            <Text size="xs" fw={600}>{user?.email || 'Unauthorized Email'}</Text>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <MapPin size={12} />
                            <Text size="xs" fw={600}>{user?.city || 'Unknown Node'}</Text>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Fingerprint size={12} />
                            <Text size="xs" fw={600} className="font-mono">{user?.cnic || 'Unverified ID'}</Text>
                        </div>
                    </div>
                </div>
                
                <Divider my={8} />

                <Menu.Label>System</Menu.Label>
                <Menu.Item leftSection={<User size={14} />} onClick={() => navigate('/dashboard/advocate/profile')} className="rounded-xl">
                  Profile Settings
                </Menu.Item>
                <Divider my={4} />
                <Menu.Item
                  color="red"
                  leftSection={<LogOut size={14} />}
                  onClick={handleLogout}
                  className="rounded-xl"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-50/30">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdvocateDashboard;
