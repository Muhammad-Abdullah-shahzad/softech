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
    Filter
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
            alert('Update failed');
        }
    };

    const handleBroadcast = async () => {
        if (!broadcastMsg) return;
        try {
            await createBroadcast({ content: broadcastMsg, author: 'Labor Advocate' });
            alert('Broadcast sent to all workers!');
            setBroadcastMsg('');
        } catch (err) {
            alert('Broadcast failed');
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
            
            <header>
                <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic border-none mb-2">Community Watch</h1>
                <p className="text-slate-500 font-bold">Monitor systemic issues and broadcast vital information to workers.</p>
            </header>

            {/* PRIORITY CARDS */}
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                <Card radius="32px" withBorder className="shadow-sm border-slate-100 p-8 border-l-rose-500 border-l-4">
                    <Group justify="space-between" mb="xs">
                        <ThemeIcon color="rose" variant="light" radius="md"><AlertTriangle size={20}/></ThemeIcon>
                        <Badge color="rose" radius="sm">CRITICAL</Badge>
                    </Group>
                    <Text size="xs" fw={800} c="dimmed" tt="uppercase">Most Reported Issue</Text>
                    <Text size="xl" fw={900} mt={5}>{stats?.mostReported?._id || 'N/A'}</Text>
                    <Text size="xs" fw={700} c="rose.6" mt={5}>{stats?.mostReported?.count || 0} active reports</Text>
                </Card>

                <Card radius="32px" withBorder className="shadow-sm border-slate-100 p-8 border-l-indigo-500 border-l-4">
                    <Group justify="space-between" mb="xs">
                        <ThemeIcon color="indigo" variant="light" radius="md"><TrendingUp size={20}/></ThemeIcon>
                        <Badge color="indigo" radius="sm">RISING</Badge>
                    </Group>
                    <Text size="xs" fw={800} c="dimmed" tt="uppercase">Trend Spotting</Text>
                    <Text size="xl" fw={900} mt={5}>{stats?.risingIssue?._id || 'N/A'}</Text>
                    <Text size="xs" fw={700} c="indigo.6" mt={5}>Platform with most growth</Text>
                </Card>

                <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <Text size="xs" fw={800} c="slate.4" tt="uppercase">Active Reach</Text>
                            <Text size="2xl" fw={900}>4.2k Workers</Text>
                        </div>
                        <Group gap="xs" mt={20}>
                            <Users size={16} className="text-emerald-400" />
                            <Text size="xs" fw={700} c="slate.3">Growing by 12% MoM</Text>
                        </Group>
                    </div>
                    <Box className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={120} />
                    </Box>
                </div>
            </SimpleGrid>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* COMPLAINT FEED */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex justify-between items-center mb-4 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                        <Group>
                            <Filter size={18} className="text-slate-400" />
                            <Select 
                                placeholder="Platform" 
                                data={['All', 'Uber', 'Careem', 'Zomato', 'Swiggy', 'Foodpanda']} 
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
                    </div>

                    <Stack gap="xl">
                        {posts.map((post) => (
                            <Paper key={post._id} radius="32px" withBorder p={40} className="shadow-sm border-slate-100 group hover:shadow-md transition-shadow relative">
                                <Group justify="space-between" mb="lg">
                                    <Group gap="lg">
                                        <Avatar radius="xl" color="indigo" size="md">#</Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Text fw={900} size="md" className="tracking-tight text-slate-800">{post.title}</Text>
                                                <Badge color={getStatusColor(post.status)} variant="dot">
                                                    {post.status.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <Text size="xs" c="dimmed" fw={700}>
                                                Posted anonymously • {dayjs(post.createdAt).fromNow()}
                                            </Text>
                                        </div>
                                    </Group>
                                    
                                    <Menu shadow="xl" radius="xl" width={200}>
                                        <Menu.Target>
                                            <ActionIcon variant="subtle" color="gray"><MoreVertical size={18}/></ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown p={10}>
                                            <Menu.Label>Advocate Action</Menu.Label>
                                            <Menu.Item leftSection={<TrendingUp size={14}/>} onClick={() => handleUpdate(post._id, { status: 'escalated' })}>Escalate</Menu.Item>
                                            <Menu.Item leftSection={<ShieldCheck size={14}/>} onClick={() => handleUpdate(post._id, { status: 'resolved' })}>Resolve</Menu.Item>
                                            <Divider my={5} />
                                            <Menu.Item color="gray" onClick={() => handleUpdate(post._id, { status: 'ignored' })}>Ignore</Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>

                                <div className="ml-16">
                                    <Text size="sm" c="slate.7" className="leading-relaxed font-medium mb-6">
                                        {post.description}
                                    </Text>

                                    <Group gap="xs">
                                        <Badge variant="light" color="indigo" size="xs">{post.platform}</Badge>
                                        <Badge variant="light" color="gray" size="xs">{post.category}</Badge>
                                        {post.tags && post.tags.map(tag => (
                                            <Badge key={tag} variant="outline" color="indigo" size="xs">#{tag}</Badge>
                                        ))}

                                        {/* CLUSTERING LABEL */}
                                        {getSimilarCount(post) > 1 && (
                                            <div className="flex items-center gap-1.5 ml-auto">
                                                <MessageCircle size={14} className="text-rose-500" />
                                                <Text size="xs" fw={800} c="rose.6" className="uppercase tracking-widest">
                                                    Systemic Indicator: {getSimilarCount(post)} Reports
                                                </Text>
                                            </div>
                                        )}
                                    </Group>

                                    {/* Action Buttons Mini */}
                                    <div className="mt-8 pt-6 border-t border-slate-50 flex gap-4">
                                        <Button 
                                            size="compact-xs" 
                                            variant="light" 
                                            color="indigo" 
                                            radius="xl" 
                                            leftSection={<Tag size={12}/>}
                                            onClick={() => {
                                                const tag = prompt('Enter tag:');
                                                if (tag) handleUpdate(post._id, { tags: [...(post.tags || []), tag] });
                                            }}
                                        >
                                            Add Tag
                                        </Button>
                                    </div>
                                </div>
                            </Paper>
                        ))}
                    </Stack>
                </div>

                {/* SIDE ACTIONS */}
                <div className="lg:col-span-4 space-y-10">
                    <Card radius="32px" withBorder p={30} className="shadow-sm border-slate-100 sticky top-28 bg-white">
                        <Group mb="xl">
                            <ThemeIcon size="xl" radius="xl" color="indigo" variant="light">
                                <Send size={24} />
                            </ThemeIcon>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 border-none uppercase tracking-tighter">Broadcast</h3>
                                <Text size="xs" fw={700} c="dimmed">Message to all active workers</Text>
                            </div>
                        </Group>

                        <Stack gap="md">
                            <Textarea 
                                placeholder="Enter an announcement, policy update, or warning..." 
                                minRows={4}
                                radius="xl"
                                variant="filled"
                                value={broadcastMsg}
                                onChange={(e) => setBroadcastMsg(e.currentTarget.value)}
                            />
                            <Button 
                                fullWidth 
                                color="indigo" 
                                radius="xl" 
                                size="md" 
                                leftSection={<Send size={18}/>}
                                onClick={handleBroadcast}
                            >
                                Send Broadcast
                            </Button>
                        </Stack>

                        <Divider my={30} label="Recent Broadcasts" labelPosition="center" />
                        
                        <Stack gap="sm">
                             <Paper p="md" radius="lg" bg="slate.50" className="border border-slate-100">
                                <Text size="xs" fw={800} c="slate.8">Delayed Payments - Uber Update</Text>
                                <Text size="xs" c="dimmed" mt={2}>Sent 2 hours ago</Text>
                             </Paper>
                             <Paper p="md" radius="lg" bg="slate.50" className="border border-slate-100">
                                <Text size="xs" fw={800} c="slate.8">Insurance Policy Change Info</Text>
                                <Text size="xs" c="dimmed" mt={2}>Sent 1 day ago</Text>
                             </Paper>
                        </Stack>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdvocateCommunity;
