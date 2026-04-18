import React from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Smartphone, 
  LogOut,
  ShieldCheck,
  CreditCard,
  BellRing
} from 'lucide-react';
import { logout } from '../../api/auth';
import { Avatar, Button, Divider, Switch, Group, Text } from '@mantine/core';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Muhammad Abdullah", "role": "worker", "email": "abdullah@fairgig.io", "city": "Mumbai"}');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 border-none">My Profile</h2>
        <p className="text-slate-500">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 text-center shadow-sm">
                <Avatar 
                    size={100} 
                    radius="100%" 
                    className="mx-auto mb-4 border-4 border-white shadow-xl"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
                />
                <h3 className="text-xl font-bold text-slate-900 border-none">{user.name}</h3>
                <p className="text-indigo-600 text-sm font-bold uppercase tracking-wider">{user.role}</p>
                <div className="mt-6 flex justify-center gap-2">
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase">Identity Verified</div>
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100 uppercase">Pro Worker</div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-4 shadow-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-none">Account Actions</h4>
                <Button 
                    fullWidth 
                    variant="light" 
                    color="rose" 
                    radius="xl" 
                    leftSection={<LogOut size={18}/>}
                    onClick={handleLogout}
                >
                    Sign Out
                </Button>
            </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm space-y-8">
                <section>
                    <h4 className="text-sm font-bold text-slate-900 mb-6 border-none flex items-center gap-2">
                        <User size={18} className="text-indigo-500"/>
                        Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                            <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-xl">
                                {user.name}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                            <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-xl">
                                <Mail size={14} className="text-slate-400"/> {user.email}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Operating City</label>
                            <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-xl">
                                <MapPin size={14} className="text-slate-400"/> {user.city}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
                            <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-xl">
                                <Smartphone size={14} className="text-slate-400"/> +91 98765 43210
                            </div>
                        </div>
                    </div>
                </section>

                <Divider />

                <section className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-900 border-none flex items-center gap-2">
                        <BellRing size={18} className="text-indigo-500"/>
                        Preferences
                    </h4>
                    <div className="space-y-4 bg-slate-50 p-6 rounded-3xl">
                        <Group justify="space-between">
                            <div>
                                <Text size="sm" fw={700}>Push Notifications</Text>
                                <Text size="xs" color="dimmed">Get alerted instantly for anomalies and responses.</Text>
                            </div>
                            <Switch color="indigo" defaultChecked />
                        </Group>
                        <Divider variant="dashed" />
                        <Group justify="space-between">
                            <div>
                                <Text size="sm" fw={700}>Weekly Reports</Text>
                                <Text size="xs" color="dimmed">Receive an email summary of your earnings.</Text>
                            </div>
                            <Switch color="indigo" defaultChecked />
                        </Group>
                        <Divider variant="dashed" />
                        <Group justify="space-between">
                            <div>
                                <Text size="sm" fw={700}>Anonymous Data Sharing</Text>
                                <Text size="xs" color="dimmed">Contribute to community insights anonymously.</Text>
                            </div>
                            <Switch color="indigo" defaultChecked />
                        </Group>
                    </div>
                </section>

                <section className="space-y-6">
                     <h4 className="text-sm font-bold text-slate-900 border-none flex items-center gap-2">
                        <ShieldCheck size={18} className="text-indigo-500"/>
                        Security & Privacy
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" color="indigo" radius="xl" leftSection={<CreditCard size={18}/>}>
                            Update Bank Access
                        </Button>
                        <Button variant="outline" color="indigo" radius="xl">
                            Change Password
                        </Button>
                    </div>
                </section>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
