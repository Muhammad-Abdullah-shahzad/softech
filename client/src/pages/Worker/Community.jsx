import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  MapPin, 
  ShieldAlert,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  ThumbsUp,
  Clock,
  ChevronRight,
  X
} from 'lucide-react';
import { 
    getCommunityPosts, 
    createCommunityPost, 
    getCommunityTrending, 
    getMyCommunityPosts,
    getBroadcasts
} from '../../api/grievance';
import { PlatformDisplay } from '../../components/CompanyLogo';
import { 
    Badge, 
    Progress, 
    Avatar, 
    Group, 
    Text, 
    Paper, 
    Button, 
    TextInput, 
    Select, 
    Textarea, 
    Modal, 
    Card, 
    Stack, 
    ActionIcon, 
    SegmentedControl,
    Loader,
    Divider,
    SimpleGrid
} from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [broadcasts, setBroadcasts] = useState([]);
    const [trending, setTrending] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [view, setView] = useState('all');
    
    const [formData, setFormData] = useState({
        platform: '',
        category: '',
        title: '',
        description: '',
        city: 'Lahore'
    });
    
    const [filters, setFilters] = useState({
        platform: '',
        category: '',
        search: ''
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const workerId = user.id || user.email || 'worker_01';

    const fetchData = async () => {
        setLoading(true);
        try {
            const [postRes, trendRes, broadRes] = await Promise.all([
                view === 'all' ? getCommunityPosts(filters) : getMyCommunityPosts(workerId),
                getCommunityTrending(),
                getBroadcasts()
            ]);
            setPosts(postRes.data.data);
            setTrending(trendRes.data.data);
            setBroadcasts(broadRes.data.data);
        } catch (err) {
            console.error('Error fetching community data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [view, filters.platform, filters.category, filters.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCommunityPost({ ...formData, workerId });
            setShowModal(false);
            setFormData({ platform: '', category: '', title: '', description: '', city: user.city || 'Lahore' });
            fetchData();
        } catch (err) {
            alert('Failed to post. Please try again.');
        }
    };

    const getCategoryColor = (cat) => {
        switch(cat) {
            case 'Complaint': return 'red';
            case 'Rate Change': return 'yellow';
            case 'Deactivation': return 'dark';
            case 'Payment Issue': return 'orange';
            default: return 'blue';
        }
    };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 border-none tracking-tight">Worker Community</h2>
          <p className="text-slate-500 font-medium">Anonymous insights & support from 1,200+ gig partners.</p>
        </div>
        <Button 
            leftSection={<Plus size={18} />} 
            size="lg" 
            radius="xl" 
            color="indigo" 
            onClick={() => setShowModal(true)}
            className="shadow-xl shadow-indigo-100 hover:-translate-y-1 transition-transform"
        >
            Post Anonymous Insight
        </Button>
      </header>

      {/* BROADCAST SECTION */}
      {broadcasts.length > 0 && (
        <div className="space-y-4">
             <Text fw={900} size="xs" tt="uppercase" c="slate.4" tracking={1.5}>Advocate Announcements</Text>
             <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {broadcasts.slice(0, 2).map((b) => (
                    <Card key={b._id} radius="24px" withBorder className="bg-white border-slate-100 shadow-sm overflow-hidden relative">
                        {/* Soft Teal accent glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#28e0b6]/10 rounded-full -mr-16 -mt-16 blur-2xl z-0" />
                        
                        <Stack gap="sm" className="relative z-10">
                            <Group justify="space-between">
                                <span className="bg-[#28e0b6]/10 text-slate-800 border border-[#28e0b6]/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                    Broadcast
                                </span>
                                <Text size="xs" c="slate.4" fw={600}>{dayjs(b.createdAt).fromNow()}</Text>
                            </Group>
                            
                            <Text fw={600} size="sm" c="slate.8" className="leading-relaxed">
                                {b.content}
                            </Text>
                            
                            <Group gap={6} mt="xs" className="pt-3 border-t border-slate-50">
                                <ShieldAlert size={14} className="text-[#28e0b6]" />
                                <Text size="xs" fw={700} c="slate.5">Verified Advocate Notice</Text>
                            </Group>
                        </Stack>
                    </Card>
                ))}
             </SimpleGrid>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Sidebar: Filters & Trends */}
        <aside className="space-y-8 order-2 lg:order-1">
            
            <Paper p="xl" radius="32px" withBorder className="border-slate-100 shadow-sm space-y-6">
                <Text fw={900} size="xs" tt="uppercase" c="dimmed" tracking={1.5}>Filter Feed</Text>
                <Stack>
                    <Select 
                        placeholder="All Platforms" 
                        data={['Uber', 'Careem', 'Yango', 'Bykea', 'Foodpanda', 'Fiverr', 'Upwork', 'Freelancer']} 
                        value={filters.platform}
                        onChange={(val) => setFilters(f => ({...f, platform: val}))}
                        radius="md"
                        clearable
                    />
                    <Select 
                        placeholder="All Categories" 
                        data={['Rate Change', 'Complaint', 'Deactivation', 'Payment Issue', 'Support Request']} 
                        value={filters.category}
                        onChange={(val) => setFilters(f => ({...f, category: val}))}
                        radius="md"
                        clearable
                    />
                    <TextInput 
                        placeholder="Search keywords..." 
                        leftSection={<Search size={14} />}
                        value={filters.search}
                        onChange={(e) => setFilters(f => ({...f, search: e.target.value}))}
                        radius="md"
                    />
                </Stack>
                <Button variant="subtle" color="slate" fullWidth onClick={() => setFilters({ platform: '', category: '', search: '' })}>
                    Clear All
                </Button>
            </Paper>

            {trending && (
                <Paper p="xl" radius="32px" className="bg-slate-900 text-white border-none shadow-2xl space-y-6">
                    <Group justify="space-between">
                        <Text fw={900} size="xs" tt="uppercase" c="indigo.4" tracking={1.5}>Market Heatmap</Text>
                        <TrendingUp size={16} className="text-indigo-400" />
                    </Group>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <Text size="xs" c="dimmed" fw={700}>MOST REPORTED ISSUE</Text>
                            <Text fw={900} size="lg" className="text-rose-400">{trending.mostReportedIssue}</Text>
                        </div>

                        <Divider color="white" opacity={0.1} label="Top Platforms" labelPosition="center" />
                        
                        {trending.topPlatforms.map((p, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <Text size="sm" fw={600}>{p._id}</Text>
                                <Badge variant="light" color="indigo">{p.count} posts</Badge>
                            </div>
                        ))}
                    </div>
                </Paper>
            )}
        </aside>

        {/* Main Feed */}
        <section className="lg:col-span-3 space-y-8 order-1 lg:order-2">
            
            <SegmentedControl 
                value={view} 
                onChange={setView}
                data={[
                    { label: 'Community Feed', value: 'all' },
                    { label: 'My Anonymous Posts', value: 'my' }
                ]}
                radius="xl"
                size="md"
                className="bg-slate-100 p-1 mb-4"
            />

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader size="xl" color="indigo" type="dots" />
                </div>
            ) : posts.length === 0 ? (
                <Paper p={60} radius="40px" withBorder className="border-dashed border-2 text-center bg-slate-50/50">
                    <MessageSquare size={48} className="mx-auto text-slate-300 opacity-50 mb-4" />
                    <Text fw={700} c="dimmed">No posts found matching your current view or filters.</Text>
                </Paper>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {posts.map((post) => (
                        <Card key={post._id} radius="32px" padding="30px" withBorder className="hover:border-indigo-200 transition-all hover:shadow-lg hover:shadow-indigo-50 group">
                            <Stack gap="lg">
                                <div className="flex justify-between items-start">
                                    <Group>
                                        <Avatar radius="xl" color="indigo" variant="light">
                                            {post.anonymousId.split('#')[1]}
                                        </Avatar>
                                        <div>
                                            <Text size="sm" fw={900} className="group-hover:text-indigo-600 transition-colors">{post.anonymousId}</Text>
                                            <Group gap={6}>
                                                <Clock size={12} className="text-slate-400" />
                                                <Text size="xs" c="dimmed">{dayjs(post.createdAt).fromNow()}</Text>
                                                <Text size="xs" opacity={0.3}>•</Text>
                                                <MapPin size={12} className="text-slate-400" />
                                                <Text size="xs" c="dimmed">{post.city}</Text>
                                            </Group>
                                        </div>
                                    </Group>
                                    <Badge color={getCategoryColor(post.category)} variant="filled" py={12} px={16} radius="md">
                                        {post.category}
                                    </Badge>
                                </div>

                                <Stack gap={8}>
                                    <h4 className="text-xl font-black text-slate-800 border-none">{post.title}</h4>
                                    <Text size="md" c="slate.7" className="leading-relaxed">
                                        {post.description}
                                    </Text>
                                </Stack>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                    <PlatformDisplay platform={post.platform} size="sm" className="bg-slate-50 px-3 py-1 rounded-full border border-slate-200" />
                                    <Group gap="xs">
                                        <ActionIcon variant="light" color="indigo" size="lg" radius="md">
                                            <ThumbsUp size={18} />
                                        </ActionIcon>
                                        <Text size="xs" fw={700} c="dimmed">{post.upvotes} found this helpful</Text>
                                    </Group>
                                </div>
                            </Stack>
                        </Card>
                    ))}
                </div>
            )}
        </section>
      </div>

      {/* Post Modal */}
      <Modal 
        opened={showModal} 
        onClose={() => setShowModal(false)} 
        title={<Text fw={900} size="xl">Share Anonymous Insight</Text>}
        radius="32px"
        padding={40}
        size="lg"
        overlayProps={{ blur: 5, opacity: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Select 
                    label="Platform" 
                    placeholder="Select Platform"
                    data={['Uber', 'Careem', 'Yango', 'Bykea', 'Foodpanda', 'Fiverr', 'Upwork', 'Freelancer']}
                    required
                    value={formData.platform}
                    onChange={(val) => setFormData(f => ({...f, platform: val}))}
                    renderOption={({ option }) => <PlatformDisplay platform={option.value} size="sm" />}
                    radius="md"
                />
                <Select 
                    label="Category" 
                    placeholder="Issue Category"
                    data={['Rate Change', 'Complaint', 'Deactivation', 'Payment Issue', 'Support Request']}
                    required
                    value={formData.category}
                    onChange={(val) => setFormData(f => ({...f, category: val}))}
                    radius="md"
                />
            </div>
            <TextInput 
                label="Headline" 
                placeholder="What's happening?" 
                required
                value={formData.title}
                onChange={(e) => setFormData(f => ({...f, title: e.target.value}))}
                radius="md"
            />
            <Textarea 
                label="Description" 
                placeholder="Details of the issue or insight..." 
                minRows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData(f => ({...f, description: e.target.value}))}
                radius="md"
            />
            <TextInput 
                label="City / Zone" 
                value={formData.city}
                disabled
                radius="md"
            />
            
            <Group justify="flex-end" mt="xl">
                <Button variant="subtle" color="slate" onClick={() => setShowModal(false)} radius="md">Cancel</Button>
                <Button type="submit" color="indigo" px={40} radius="md" loading={loading}>Post Anonymously</Button>
            </Group>
        </form>
      </Modal>
    </div>
  );
};

export default Community;
