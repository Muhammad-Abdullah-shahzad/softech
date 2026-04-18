import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FileX
} from 'lucide-react';
import { getEarnings, addEarning, updateEarning, deleteEarning } from '../../api/earnings';
import { Modal, TextInput, Select, NumberInput, Button, Badge, Group, ActionIcon, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [opened, { open, close }] = useDisclosure(false);
  const [editingItem, setEditingItem] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const workerId = user.id || user.email || 'worker_01';

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    platform: '',
    hours: 0,
    grossEarnings: 0,
    deductions: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getEarnings(workerId);
      setEarnings(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error('Error fetching earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const netAmount = formData.grossEarnings - formData.deductions;
      const start = new Date(formData.date);
      const end = new Date(start.getTime() + formData.hours * 60 * 60 * 1000);

      const payload = {
        workerId,
        platform: formData.platform,
        shiftStart: start,
        shiftEnd: end,
        grossAmount: formData.grossEarnings,
        deductions: [{ type: 'Generic Deduction', amount: formData.deductions }],
        netAmount: netAmount,
        verificationStatus: 'unverified',
        city: user.city || 'Unknown'
      };

      if (editingItem) {
        await updateEarning(editingItem._id, payload);
      } else {
        await addEarning(payload);
      }
      fetchData();
      close();
      setEditingItem(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        platform: '',
        hours: 0,
        grossEarnings: 0,
        deductions: 0
      });
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteEarning(id);
        fetchData();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleEdit = (item) => {
    if (item.status === 'verified') {
      alert('Verified records cannot be edited');
      return;
    }
    setEditingItem(item);
    setFormData({
      date: item.date.split('T')[0],
      platform: item.platform,
      hours: item.hours,
      grossEarnings: item.grossEarnings,
      deductions: item.deductions
    });
    open();
  };

  const filteredEarnings = earnings.filter(item => {
    const matchesSearch = item.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'All' || item.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified': return <Badge color="green" leftSection={<CheckCircle2 size={12}/>}>Verified</Badge>;
      case 'flagged': return <Badge color="red" leftSection={<AlertTriangle size={12}/>}>Flagged</Badge>;
      case 'unverifiable': return <Badge color="gray" leftSection={<FileX size={12}/>}>Rejected</Badge>;
      case 'pending': return <Badge color="yellow" leftSection={<Clock size={12}/>}>Pending</Badge>;
      default: return <Badge color="gray" variant="outline">Unverified</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Earnings Log</h2>
          <p className="text-slate-500 text-sm">Manage and track your daily work entries.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); open(); }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Add Entry
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search platforms..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select 
            className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2 ring-1 ring-slate-100"
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
          >
            <option value="All">All Platforms</option>
            <option value="Uber">Uber</option>
            <option value="Careem">Careem</option>
            <option value="Yango">Yango</option>
            <option value="Bykea">Bykea</option>
            <option value="Foodpanda">Foodpanda</option>
            <option value="Fiverr">Fiverr</option>
            <option value="Upwork">Upwork</option>
            <option value="Freelancer">Freelancer</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Platform</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Hours</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Gross</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Deductions</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Net</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="8" className="px-6 py-10 text-center text-slate-400">Loading your data...</td></tr>
              ) : filteredEarnings.length === 0 ? (
                <tr>
                    <td colSpan="8" className="px-6 py-10 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                            <FileX size={48} strokeWidth={1}/>
                            <p>No records found matching your filters.</p>
                        </div>
                    </td>
                </tr>
              ) : filteredEarnings.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{item.shiftStart ? item.shiftStart.split('T')[0] : 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                        {item.platform ? item.platform[0] : '?'}
                      </div>
                      <span className="text-sm font-semibold">{item.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    {item.shiftStart && item.shiftEnd ? 
                        Math.round((new Date(item.shiftEnd) - new Date(item.shiftStart)) / (1000 * 60 * 60)) : 
                        0}h
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">₹{item.grossAmount || 0}</td>
                  <td className="px-6 py-4 text-sm text-rose-500">
                    ₹{Array.isArray(item.deductions) ? item.deductions.reduce((sum, d) => sum + d.amount, 0) : 0}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{item.netAmount || 0}</td>
                  <td className="px-6 py-4">{getStatusBadge(item.verificationStatus || 'unverified')}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionIcon 
                         variant="subtle" 
                         color="gray" 
                         disabled={item.status === 'verified'}
                         onClick={() => handleEdit(item)}
                      >
                        <Edit2 size={16} />
                      </ActionIcon>
                      <ActionIcon 
                        variant="subtle" 
                        color="red"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 size={16} />
                      </ActionIcon>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        opened={opened} 
        onClose={close} 
        title={<span className="font-bold text-lg">{editingItem ? 'Edit Earning Record' : 'Log New Earning'}</span>}
        centered
        radius="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput 
            label="Date" 
            type="date" 
            required 
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
          <Select 
            label="Platform"
            placeholder="Select platform"
            data={['Uber', 'Careem', 'Yango', 'Bykea', 'Foodpanda', 'Fiverr', 'Upwork', 'Freelancer', 'Other']}
            value={formData.platform}
            onChange={(val) => setFormData({...formData, platform: val})}
            required
          />
          <div className="grid grid-cols-2 gap-4">
             <NumberInput 
                label="Hours Worked" 
                min={0} 
                max={24} 
                precision={1}
                value={formData.hours}
                onChange={(val) => setFormData({...formData, hours: val})}
                required
             />
             <NumberInput 
                label="Gross Earnings (₹)" 
                min={0} 
                value={formData.grossEarnings}
                onChange={(val) => setFormData({...formData, grossEarnings: val})}
                required
             />
          </div>
          <NumberInput 
            label="Deductions (₹)" 
            min={0}
            value={formData.deductions}
            onChange={(val) => setFormData({...formData, deductions: val})}
            required
          />
          <Button fullWidth type="submit" color="indigo" radius="md" mt="md">
            {editingItem ? 'Update Record' : 'Save Record'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Earnings;
