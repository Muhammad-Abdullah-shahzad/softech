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
import { notifications } from '@mantine/notifications';
import { Check, X } from 'lucide-react';

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
    if (pwdData.new !== pwdData.confirm) {
      notifications.show({
        title: 'Security Mismatch',
        message: 'New password and confirmation do not match',
        color: 'red',
        icon: <X size={16} />,
        radius: 'md'
      });
      return;
    }
    
    setPwdLoading(true);
    try {
      await changePassword({
        userId,
        currentPassword: pwdData.current,
        newPassword: pwdData.new
      });
      notifications.show({
        title: 'Identity Secured',
        message: 'Your account password has been updated successfully',
        color: 'fairgig',
        icon: <Check size={16} />,
        radius: 'md'
      });
      setShowPwdModal(false);
      setPwdData({ current: '', new: '', confirm: '' });
    } catch (err) {
      notifications.show({
        title: 'Security Error',
        message: err.response?.data?.detail || 'Identity node rejected the change',
        color: 'red',
        icon: <X size={16} />,
        radius: 'md'
      });
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingOverlay visible={true} /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 px-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 border-none tracking-tight">Profile Settings</h2>
          <p className="text-slate-500 font-medium tracking-tight">Manage your personal information, government credentials, and security protocols.</p>
        </div>
        <Button 
            variant="light" 
            color="rose" 
            radius="md" 
            size="md"
            leftSection={<LogOut size={18}/>}
            onClick={handleLogout}
            className="font-bold text-xs uppercase tracking-widest border border-rose-100"
        >
            Terminate Session
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: ID Card & Status */}
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
                    <ShieldCheck size={140} strokeWidth={1} />
                </div>
                
                <div className="relative z-10">
                  <Avatar 
                      size={140} 
                      radius="100%" 
                      className="mx-auto mb-8 border-4 border-slate-50 shadow-xl"
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.fullName}`}
                  />
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-2">{profile?.fullName}</h3>
                  <div className="flex flex-col gap-3 mt-4">
                      <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 w-fit mx-auto">
                        {profile?.role} • CORE NODE
                      </span>
                      <div className="flex items-center justify-center gap-2 py-2 px-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 w-fit mx-auto">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Identity Verified</span>
                      </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col gap-4">
                    <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Global ID</span>
                        <span className="text-xs font-bold text-slate-900 font-mono leading-none">#{profile?.id.substring(18).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
            </div>

            <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 relative overflow-hidden group">
               <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
                      <ShieldAlert size={20} />
                  </div>
                  <div>
                      <h4 className="text-sm font-bold text-indigo-900 tracking-tight mb-1">Security Recommendation</h4>
                      <p className="text-xs text-indigo-700/70 leading-relaxed font-medium">Protect your CNIC and credentials. We recommend changing your password every 90 days.</p>
                  </div>
               </div>
            </div>
        </div>

        {/* Right Column: Detailed Registry & Security */}
        <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-12">
                <section>
                    <div className="flex items-center gap-4 mb-10">
                       <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                          <User size={20} />
                       </div>
                       <div>
                          <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Identity Registry</h4>
                          <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Public profile and government data</p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                <User size={16} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-900">{profile?.fullName}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verified Email</label>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                <Mail size={16} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-900">{profile?.email}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Government CNIC</label>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                <Fingerprint size={16} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-900">{profile?.cnic}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Geographic Node (City)</label>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                <MapPin size={16} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-900">{profile?.city}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px w-full bg-slate-50" />

                <section>
                    <div className="flex items-center gap-4 mb-10">
                       <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                          <Lock size={20} />
                       </div>
                       <div>
                          <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Security Configuration</h4>
                          <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Authentication and access control</p>
                       </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 border-dashed flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-sm font-bold text-slate-900 leading-none">Encryption Password</p>
                            <p className="text-xs text-slate-400 font-medium mt-2">Manage your multi-factor credentials.</p>
                        </div>
                        <Button 
                            variant="filled" 
                            color="indigo" 
                            radius="xl"
                            size="md"
                            onClick={() => setShowPwdModal(true)}
                            rightSection={<ChevronRight size={16}/>}
                            className="shadow-xl shadow-indigo-100/50 w-full md:w-auto"
                        >
                            Update Credentials
                        </Button>
                    </div>
                </section>
            </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal 
        opened={showPwdModal} 
        onClose={() => setShowPwdModal(false)}
        title={<span className="text-lg font-bold text-slate-900 tracking-tight">Update Authentication Security</span>}
        radius="3xl"
        padding={40}
        centered
        overlayProps={{ blur: 8, opacity: 0.3 }}
      >
        <form onSubmit={handlePasswordChange}>
            <Stack gap="xl">
                <PasswordInput 
                    label="Current Password" 
                    placeholder="Existing credentials" 
                    required 
                    radius="md"
                    value={pwdData.current}
                    onChange={(e) => setPwdData({...pwdData, current: e.target.value})}
                />
                <div className="h-px bg-slate-100 my-2" />
                <PasswordInput 
                    label="New Secure Password" 
                    placeholder="Enter new lock code" 
                    required 
                    radius="md"
                    value={pwdData.new}
                    onChange={(e) => setPwdData({...pwdData, new: e.target.value})}
                />
                <PasswordInput 
                    label="Confirm New Password" 
                    placeholder="Repeat new code" 
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
                    className="mt-4"
                >
                    Save Security Profile
                </Button>
            </Stack>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
