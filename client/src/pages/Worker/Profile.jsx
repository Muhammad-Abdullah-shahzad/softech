import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Lock,
  LogOut,
  Fingerprint,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { logout } from '../../api/auth';
import { getProfile, changePassword } from '../../api/profile';
import { 
    Badge,
    Avatar, 
    Button, 
    Divider, 
    Group, 
    Text, 
    TextInput, 
    PasswordInput, 
    Modal, 
    Stack, 
    Alert,
    LoadingOverlay,
    Paper
} from '@mantine/core';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdData, setPwdData] = useState({ current: '', new: '', confirm: '' });
  const [pwdLoading, setPwdLoading] = useState(false);

  const localUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = localUser.id;

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await getProfile(userId);
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchProfileData();
  }, [userId]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdData.new !== pwdData.confirm) return alert("Passwords don't match");
    
    setPwdLoading(true);
    try {
      await changePassword({
        userId,
        currentPassword: pwdData.current,
        newPassword: pwdData.new
      });
      alert('Password changed successfully');
      setShowPwdModal(false);
      setPwdData({ current: '', new: '', confirm: '' });
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingOverlay visible={true} /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900 border-none tracking-tighter uppercase italic">Identity Node</h2>
          <p className="text-slate-500 font-bold">Secure management of your FairGig credentials.</p>
        </div>
        <Button 
            variant="light" 
            color="rose" 
            radius="xl" 
            size="md"
            leftSection={<LogOut size={18}/>}
            onClick={handleLogout}
            className="font-black uppercase tracking-widest text-xs"
        >
            Terminate Session
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: ID Card */}
        <div className="lg:col-span-4 space-y-6">
            <Paper radius="40px" withBorder p={40} className="shadow-xl shadow-indigo-50 border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck size={120} />
                </div>
                <Avatar 
                    size={120} 
                    radius="100%" 
                    className="mx-auto mb-6 border-4 border-white shadow-2xl relative z-10"
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.fullName}`}
                />
                <h3 className="text-2xl font-black text-slate-900 border-none tracking-tight">{profile?.fullName}</h3>
                <Text size="xs" fw={900} c="indigo" tt="uppercase" tracking={2}>{profile?.role} Level 1</Text>
                
                <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                    <Group justify="space-between" className="bg-slate-50 p-4 rounded-2xl">
                        <Text size="xs" fw={800} c="dimmed">NETWORK ID</Text>
                        <Text size="xs" fw={900} className="font-mono">#{profile?.id.substring(18)}</Text>
                    </Group>
                    <Group justify="space-between" className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100/50">
                        <Text size="xs" fw={800} c="emerald.7">STATUS</Text>
                        <Badge color="emerald" variant="filled">VERIFIED</Badge>
                    </Group>
                </div>
            </Paper>

            <Alert icon={<ShieldAlert size={16} />} title="Security Tip" color="indigo" radius="xl" variant="light">
                Secure your CNIC and credentials. Change your password every quarter to prevent unauthorized data access.
            </Alert>
        </div>

        {/* Right Column: Details & Security */}
        <div className="lg:col-span-8 space-y-8">
            <Paper radius="40px" withBorder p={40} className="shadow-sm border-slate-100 space-y-10">
                <section>
                    <h4 className="text-xl font-black text-slate-900 mb-8 border-none flex items-center gap-3 italic uppercase tracking-tighter">
                        <User size={24} className="text-indigo-600"/>
                        Registry Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                            <Paper p="md" radius="xl" bg="slate.50" className="border border-slate-100/50">
                                <Text fw={700} size="sm">{profile?.fullName}</Text>
                            </Paper>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Mail</label>
                            <Paper p="md" radius="xl" bg="slate.50" className="border border-slate-100/50 flex items-center gap-2">
                                <Mail size={14} className="text-slate-400"/>
                                <Text fw={700} size="sm">{profile?.email}</Text>
                            </Paper>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Government CNIC</label>
                            <Paper p="md" radius="xl" bg="slate.50" className="border border-slate-100/50 flex items-center gap-2">
                                <Fingerprint size={14} className="text-slate-400"/>
                                <Text fw={700} size="sm">{profile?.cnic}</Text>
                            </Paper>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational City</label>
                            <Paper p="md" radius="xl" bg="slate.50" className="border border-slate-100/50 flex items-center gap-2">
                                <MapPin size={14} className="text-slate-400"/>
                                <Text fw={700} size="sm">{profile?.city}</Text>
                            </Paper>
                        </div>
                    </div>
                </section>

                <Divider />

                <section>
                    <h4 className="text-xl font-black text-slate-900 mb-8 border-none flex items-center gap-3 italic uppercase tracking-tighter">
                        <Lock size={24} className="text-indigo-600"/>
                        Security Protocol
                    </h4>
                    
                    <Paper p="xl" radius="32px" className="bg-slate-50 border border-slate-100 border-dashed">
                        <Group justify="space-between">
                            <div>
                                <Text fw={800} size="sm" c="slate.8">Account Password</Text>
                                <Text size="xs" c="dimmed">Last changed recently via identity node.</Text>
                            </div>
                            <Button 
                                variant="filled" 
                                color="indigo" 
                                radius="xl"
                                onClick={() => setShowPwdModal(true)}
                                rightSection={<ChevronRight size={14}/>}
                                className="shadow-lg shadow-indigo-100"
                            >
                                Change Password
                            </Button>
                        </Group>
                    </Paper>
                </section>
            </Paper>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal 
        opened={showPwdModal} 
        onClose={() => setShowPwdModal(false)}
        title={<Text fw={900} size="lg">Update Security Credentials</Text>}
        radius="32px"
        padding={40}
        centered
        overlayProps={{ blur: 10, opacity: 0.4 }}
      >
        <form onSubmit={handlePasswordChange}>
            <Stack gap="xl">
                <PasswordInput 
                    label="Current Password" 
                    placeholder="Verify existing credentials" 
                    required 
                    radius="md"
                    value={pwdData.current}
                    onChange={(e) => setPwdData({...pwdData, current: e.target.value})}
                />
                <Divider label="New Credentials" labelPosition="center" />
                <PasswordInput 
                    label="New Password" 
                    placeholder="Enter strong password" 
                    required 
                    radius="md"
                    value={pwdData.new}
                    onChange={(e) => setPwdData({...pwdData, new: e.target.value})}
                />
                <PasswordInput 
                    label="Confirm New Password" 
                    placeholder="Retype new password" 
                    required 
                    radius="md"
                    value={pwdData.confirm}
                    onChange={(e) => setPwdData({...pwdData, confirm: e.target.value})}
                />
                <Button 
                    type="submit" 
                    fullWidth 
                    color="indigo" 
                    radius="xl" 
                    size="lg"
                    loading={pwdLoading}
                >
                    Update Identity Lock
                </Button>
            </Stack>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
