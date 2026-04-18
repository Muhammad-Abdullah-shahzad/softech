import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { navigationConfig } from '../config/navigation';
import { Bell, Search, User, LogOut, ShieldCheck, Database } from 'lucide-react';
import { Avatar, Menu, Group, ActionIcon, Indicator, Divider, Badge } from '@mantine/core';

const AdvocateDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token && !storedUser) {
        navigate('/login');
    } else if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'advocate' && parsedUser.role !== 'analyst') {
            // alert('Unauthorized access to Advocate Intelligence Node.');
            // navigate('/login');
        }
        setUser(parsedUser);
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
      <Sidebar navigation={navigationConfig} currentRole="analyst" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
              <div className="relative w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Query system datasets..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
              <Badge color="indigo" variant="light" leftSection={<Database size={14}/>} radius="md" size="lg" py={12}>
                Advocate Access
              </Badge>
          </div>

          <Group gap="xl">
            <Indicator color="rose" size={10} offset={2} processing>
                <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                    <Bell size={22} className="text-slate-600" />
                </ActionIcon>
            </Indicator>

            <Menu shadow="md" width={220} radius="xl" withArrow>
              <Menu.Target>
                <button className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-2xl transition-colors">
                  <Avatar 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
                    radius="xl"
                    className="border-2 border-white shadow-sm"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'Advocate Account'}</p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Labour Rights Analyst</p>
                  </div>
                </button>
              </Menu.Target>

              <Menu.Dropdown p={8}>
                <Menu.Label>Advocate Profile</Menu.Label>
                <Menu.Item leftSection={<User size={14} />} className="rounded-xl">
                  Account Settings
                </Menu.Item>
                <Divider my={4} />
                <Menu.Item 
                  color="red" 
                  leftSection={<LogOut size={14} />} 
                  onClick={handleLogout}
                  className="rounded-xl"
                >
                  Terminate Session
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
