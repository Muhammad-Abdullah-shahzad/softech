import React, { useState, useEffect } from 'react';
import { 
    getCommunityPosts, 
    updatePostStatus, 
    getAdvocateCommunityStats, 
    createBroadcast 
} from '../../api/grievance';
import {
    Card,
    Text,
    Group,
    Badge,
    Stack,
    Button,
    TextInput,
    Textarea,
    Paper,
    LoadingOverlay,
    ActionIcon,
    Menu,
    Avatar,
    Box,
    SimpleGrid,
    ThemeIcon,
    Select,
    Divider
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { 
    MessageSquare, 
    AlertTriangle, 
    TrendingUp, 
    MoreVertical, 
    Tag, 
    ShieldCheck, 
    Send,
    MessageCircle,
    Users,
    ChevronDown,
    Filter,
    Check,
    X
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const AdvocateCommunity = () => {
    const [posts, setPosts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [filterPlatform, setFilterPlatform] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [postsRes, statsRes] = await Promise.all([
                getCommunityPosts({ platform: filterPlatform === 'All' ? null : filterPlatform, category: filterCategory === 'All' ? null : filterCategory }),
                getAdvocateCommunityStats()
            ]);
            setPosts(postsRes.data.data);
            setStats(statsRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterPlatform, filterCategory]);

    const handleUpdate = async (id, update) => {
        try {
            await updatePostStatus(id, update);
            fetchData();
        } catch (err) {
            notifications.show({
                title: 'Action Failed',
                message: 'Could not update grievance status',
                color: 'red',
                icon: <X size={16} />,
                radius: 'md'
            });
        }
    };

    const handleBroadcast = async () => {
        if (!broadcastMsg) return;
        try {
            await createBroadcast({ content: broadcastMsg, author: 'Labor Advocate' });
            notifications.show({
                title: 'Broadcast Dispatched',
                message: 'Announcement sent to all worker nodes',
                color: 'fairgig',
                icon: <Send size={16} />,
                radius: 'md'
            });
            setBroadcastMsg('');
        } catch (err) {
            notifications.show({
                title: 'Broadcast Failed',
                message: 'System could not propagate the message',
                color: 'red',
                icon: <X size={16} />,
                radius: 'md'
            });
        }
    };

    // Simple Clustering Logic (Group by Category + Platform)
    const getSimilarCount = (post) => {
        return posts.filter(p => p.category === post.category && p.platform === post.platform).length;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'teal';
            case 'escalated': return 'rose';
            case 'ignored': return 'gray';
            default: return 'indigo';
        }
    };

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto">
            <LoadingOverlay visible={loading} />
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 border-none tracking-tight">Community Watch</h2>
                    <p className="text-slate-500 font-medium tracking-tight">Monitor systemic issues and broadcast vital information to workers.</p>
                </div>
                <Group>
                    <Badge size="xl" color="rose" variant="light" radius="md" py={22} px={20} className="border border-rose-100">
                        <Group gap="xs">
                            <AlertTriangle size={16} />
                            <Text fw={800} size="sm" tt="uppercase" tracking="0.05em">Real-time Signals</Text>
                        </Group>
                    </Badge>
                </Group>
            </header>

            {/* PRIORITY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group min-h-[160px] flex flex-col justify-between border-l-4 border-l-rose-500">
                    <AlertTriangle size={120} strokeWidth={1} className="absolute -top-2 -right-4 text-slate-900 opacity-[0.12] group-hover:scale-110 group-hover:opacity-[0.18] transition-all duration-700 pointer-events-none" />
                    <div className="relative z-10">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Most Reported Issue</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stats?.mostReported?._id || 'N/A'}</h3>
                    </div>
                    <div className="relative z-10 mt-4">
                        <span className="flex items-center text-[10px] font-bold px-2 py-1 rounded-md bg-rose-50 text-rose-600 w-fit">
                           CRITICAL • {stats?.mostReported?.count || 0} Reports
                        </span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group min-h-[160px] flex flex-col justify-between border-l-4 border-l-indigo-500">
                    <TrendingUp size={120} strokeWidth={1} className="absolute -top-2 -right-4 text-slate-900 opacity-[0.12] group-hover:scale-110 group-hover:opacity-[0.18] transition-all duration-700 pointer-events-none" />
                    <div className="relative z-10">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Trend Spotting</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight truncate">{stats?.risingIssue?._id || 'N/A'}</h3>
                    </div>
                    <div className="relative z-10 mt-4">
                        <span className="flex items-center text-[10px] font-bold px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 w-fit">
                           RISING TREND
                        </span>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2rem] border-none shadow-xl relative overflow-hidden group min-h-[160px] flex flex-col justify-between text-white">
                    <ShieldCheck size={120} strokeWidth={1} className="absolute -top-2 -right-4 text-white opacity-[0.12] group-hover:scale-110 group-hover:opacity-[0.18] transition-all duration-700 pointer-events-none" />
                    <div className="relative z-10">
                        <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">Active Reach</p>
                        <h3 className="text-4xl font-bold text-[#28e0b6] tracking-tight">4,280</h3>
                    </div>
                    <div className="relative z-10 mt-4">
                        <p className="text-indigo-300 opacity-60 text-[11px] font-medium italic">Growing by 12% MoM</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* COMPLAINT FEED */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex justify-between items-center mb-4 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
                        <Group>
                            <Filter size={18} className="text-slate-400" />
                            <Select 
                                placeholder="Platform" 
                                data={['All', 'Uber', 'Careem', 'Yango', 'Bykea', 'Foodpanda', 'Fiverr', 'Upwork', 'Freelancer']} 
                                value={filterPlatform}
                                onChange={setFilterPlatform}
                                size="xs"
                                variant="filled"
                                radius="md"
                                className="w-32"
                            />
                            <Select 
                                placeholder="Category" 
                                data={['All', 'Rate Change', 'Complaint', 'Deactivation', 'Payment Issue', 'Support Request']} 
                                value={filterCategory}
                                onChange={setFilterCategory}
                                size="xs"
                                variant="filled"
                                radius="md"
                                className="w-40"
                            />
                        </Group>
                        <Text size="xs" fw={800} c="dimmed uppercase">{posts.length} Complaints tracked</Text>
                    </div>                    <Stack gap="xl">
                        {posts.map((post) => (
                            <div key={post._id} className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all relative group">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl border border-indigo-100 uppercase">
                                            {post.platform[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">{post.title}</h3>
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                                    post.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                    post.status === 'escalated' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                                    'bg-slate-50 text-slate-500 border-slate-100'
                                                }`}>
                                                    {post.status}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                                ANONYMOUS • {dayjs(post.createdAt).fromNow().toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <Menu shadow="xl" radius="24px" width={220}>
                                        <Menu.Target>
                                            <ActionIcon variant="light" color="indigo" radius="md" size="lg"><MoreVertical size={20}/></ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown p={12}>
                                            <Menu.Label className="text-[10px] font-black uppercase tracking-widest mb-2">Advocate Action</Menu.Label>
                                            <Menu.Item leftSection={<TrendingUp size={16}/>} className="font-bold text-slate-700" onClick={() => handleUpdate(post._id, { status: 'escalated' })}>Escalate Case</Menu.Item>
                                            <Menu.Item leftSection={<ShieldCheck size={16}/>} className="font-bold text-slate-700" onClick={() => handleUpdate(post._id, { status: 'resolved' })}>Mark Resolved</Menu.Item>
                                            <Divider my={8} />
                                            <Menu.Item color="gray" className="font-bold" onClick={() => handleUpdate(post._id, { status: 'ignored' })}>Archive Thread</Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </div>

                                <div className="pl-20">
                                    <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8 max-w-[90%] italic">
                                        "{post.description}"
                                    </p>

                                    <div className="flex flex-wrap gap-2 items-center">
                                        <div className="px-3 py-1 transparent-indigo rounded-xl text-[10px] font-black text-indigo-600 border border-indigo-100 uppercase tracking-widest bg-indigo-50">{post.platform}</div>
                                        <div className="px-3 py-1 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 border border-slate-100 uppercase tracking-widest">{post.category}</div>
                                        {post.tags && post.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-indigo-50/30 rounded-xl text-[10px] font-bold text-indigo-400 border border-indigo-100/50 uppercase tracking-widest italic">#{tag}</span>
                                        ))}

                                        {getSimilarCount(post) > 1 && (
                                            <div className="flex items-center gap-2 ml-auto animate-pulse">
                                                <AlertTriangle size={14} className="text-rose-500" />
                                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                                                    Systemic Indicator: {getSimilarCount(post)} Reports
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Stack>
                </div>

                {/* SIDE ACTIONS */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-10 rounded-[2rem] shadow-xl sticky top-28 border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 opacity-40 blur-[60px]" />
                        
                        <div className="relative z-10 flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100/50">
                                <Send size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Broadcast</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Global Alert System</p>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <textarea 
                                placeholder="Enter announcement content..." 
                                className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-6 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
                                rows={5}
                                value={broadcastMsg}
                                onChange={(e) => setBroadcastMsg(e.currentTarget.value)}
                            />
                            <button 
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                                onClick={handleBroadcast}
                            >
                                <Send size={16} strokeWidth={3} />
                                Dispatch Message
                            </button>

                            <div className="pt-6 border-t border-slate-100 mt-8">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Recent Dispatches</p>
                                <div className="space-y-4">
                                     <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all group">
                                        <p className="text-xs font-bold text-slate-800 tracking-tight mb-1">Delayed Payments - Uber Update</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SENT 2H AGO</p>
                                     </div>
                                     <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all group">
                                        <p className="text-xs font-bold text-slate-800 tracking-tight mb-1">Insurance Policy Change Info</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SENT 1D AGO</p>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default AdvocateCommunity;
