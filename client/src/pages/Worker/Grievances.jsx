import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MessageSquareWarning, 
  MessageCircle, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { getGrievances, createGrievance } from '../../api/grievance';
import { Modal, TextInput, Textarea, Select, Button, Badge, Timeline, Text, Avatar, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const Grievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const workerId = 'worker_01';

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    platform: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getGrievances(workerId);
      setGrievances(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGrievance({ ...formData, workerId });
      fetchData();
      close();
      setFormData({ title: '', category: '', description: '', platform: '' });
    } catch (err) {
      alert('Failed to submit grievance');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'emerald';
      case 'escalated': return 'rose';
      case 'open': return 'amber';
      default: return 'slate';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left List */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-bold text-slate-900 border-none">Grievances</h2>
            <button 
                onClick={open}
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
                <Plus size={20} />
            </button>
        </div>

        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search complaints..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm shadow-sm"
            />
        </div>

        <div className="space-y-3">
            {loading ? (
                <p className="text-center text-slate-400 py-10">Loading...</p>
            ) : grievances.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-8 text-center border-2 border-dashed border-slate-200">
                    <MessageSquareWarning size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="text-slate-500 font-medium">No active grievances</p>
                </div>
            ) : grievances.map((item) => (
                <div 
                    key={item._id}
                    onClick={() => setSelectedGrievance(item)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                        selectedGrievance?._id === item._id 
                        ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-indigo-100'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <Badge color={getStatusColor(item.status)} size="xs" variant="filled">
                            {item.status}
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-400">{item.createdAt.split('T')[0]}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.platform} • {item.category}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Right Detail */}
      <div className="lg:col-span-8">
        {selectedGrievance ? (
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm h-fit animate-in fade-in duration-300">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4 items-center">
                            <Avatar color="indigo" radius="xl">{selectedGrievance.platform[0]}</Avatar>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 border-none">{selectedGrievance.title}</h3>
                                <p className="text-sm text-slate-500">Case ID: {selectedGrievance._id.substring(0,8).toUpperCase()}</p>
                            </div>
                        </div>
                        <Badge size="lg" color={getStatusColor(selectedGrievance.status)} variant="light">
                            {selectedGrievance.status.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Issue Description</h5>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl italic border-l-4 border-indigo-500">
                            "{selectedGrievance.description}"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-4">
                        <div className="space-y-1">
                             <p className="text-[10px] font-bold text-slate-400 uppercase">Category</p>
                             <p className="font-semibold text-slate-800">{selectedGrievance.category}</p>
                        </div>
                        <div className="space-y-1">
                             <p className="text-[10px] font-bold text-slate-400 uppercase">Platform</p>
                             <p className="font-semibold text-slate-800">{selectedGrievance.platform}</p>
                        </div>
                    </div>

                    <Divider />

                    <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-none">Resolution Timeline</h5>
                        <Timeline active={selectedGrievance.status === 'resolved' ? 2 : 1} bulletSize={28} lineWidth={2}>
                            <Timeline.Item bullet={<Plus size={14}/>} title="Case Filed">
                                <Text color="dimmed" size="xs">{selectedGrievance.createdAt}</Text>
                                <Text size="sm" mt={4}>Grievance successfully logged in the FairGig support system.</Text>
                            </Timeline.Item>

                            <Timeline.Item 
                                bullet={<Clock size={14}/>} 
                                title="Under Review" 
                                lineVariant={selectedGrievance.status === 'open' ? 'dashed' : 'solid'}
                            >
                                <Text size="sm" mt={4}>Wait time: ~24 hours for platform to respond.</Text>
                            </Timeline.Item>

                            <Timeline.Item 
                                bullet={selectedGrievance.status === 'resolved' ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>} 
                                title={selectedGrievance.status === 'resolved' ? "Resolved" : "Pending Action"}
                            >
                                <Text size="sm" mt={4}>
                                    {selectedGrievance.status === 'resolved' 
                                        ? "The issue has been closed. Compensation credited." 
                                        : "Awaiting platform representative response."}
                                </Text>
                            </Timeline.Item>
                        </Timeline>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button fullWidth radius="xl" variant="light" color="indigo" leftSection={<MessageCircle size={18}/>}>
                            Add Comment
                        </Button>
                        <Button fullWidth radius="xl" variant="outline" color="rose" disabled={selectedGrievance.status !== 'open'}>
                            Escalate Case
                        </Button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center text-slate-400 h-full flex flex-col justify-center items-center">
                 <MessageCircle size={64} strokeWidth={1} className="mb-6 opacity-20" />
                 <h4 className="text-xl font-bold text-slate-600 mb-2 border-none">Select a grievance to view details</h4>
                 <p className="max-w-xs mx-auto">Click on any case from the list on the left to see its full history and resolution status.</p>
                 <ArrowRight className="mt-8 text-indigo-300 animate-bounce" />
            </div>
        )}
      </div>

      <Modal 
        opened={opened} 
        onClose={close} 
        title={<span className="font-bold text-lg">File a New Grievance</span>}
        centered
        radius="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
           <TextInput 
                label="Topic / Subject" 
                placeholder="Brief summary of the issue"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
           />
           <div className="grid grid-cols-2 gap-4">
               <Select 
                    label="Platform"
                    data={['Uber', 'Zomato', 'Swiggy', 'Ola', 'Rapido']}
                    value={formData.platform}
                    onChange={(val) => setFormData({...formData, platform: val})}
               />
               <Select 
                    label="Category"
                    data={['Payment Delay', 'Wrong Deduction', 'App Technical Issue', 'Harrassment', 'Other']}
                    value={formData.category}
                    onChange={(val) => setFormData({...formData, category: val})}
               />
           </div>
           <Textarea 
                label="Detailed Description" 
                placeholder="Explain the incident in detail..."
                minRows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
           />
           <Button fullWidth type="submit" color="indigo" radius="md" mt="md" size="md">
                Submit Complaint
           </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Grievances;
