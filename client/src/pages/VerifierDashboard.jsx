import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { navigationConfig } from '../config/navigation';
import { Avatar, Menu, Group, ActionIcon, Indicator, Divider, Badge } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Bell, Search, User, LogOut, ShieldCheck, ShieldAlert, X } from 'lucide-react';

const VerifierDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'verifier') {
      notifications.show({
        title: 'Access Restricted',
        message: 'This secure node is reserved for verifiers only',
        color: 'red',
        icon: <ShieldAlert size={16} />,
        radius: 'md'
      });
      navigate('/login');
      return;
    }

    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <Sidebar navigation={navigationConfig} currentRole="verifier" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative w-96 hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search worker ID or record..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            {/* <Badge color="indigo" variant="light" leftSection={<ShieldCheck size={14} />} radius="md" size="lg">
              Verifier Mode
            </Badge> */}
          </div>

          <Group gap="xl">
            {/* <Indicator color="rose" size={10} offset={2} processing>
              <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" onClick={() => navigate('/dashboard/verifier/notifications')}>
                <Bell size={22} className="text-slate-600" />
              </ActionIcon>
            </Indicator> */}

            <Menu shadow="md" width={220} radius="xl" withArrow transitionProps={{ transition: 'pop-top-right' }}>
              <Menu.Target>
                <button className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-200">
                  <Avatar
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                    radius="xl"
                    className="border-2 border-white shadow-sm"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'Verifier Account'}</p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Verifier</p>
                  </div>
                </button>
              </Menu.Target>

              <Menu.Dropdown p={8}>
                <Menu.Label>Verifier Dashboard</Menu.Label>
                <Menu.Item leftSection={<User size={14} />} onClick={() => navigate('/dashboard/verifier/profile')} className="rounded-xl">
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
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VerifierDashboard;
