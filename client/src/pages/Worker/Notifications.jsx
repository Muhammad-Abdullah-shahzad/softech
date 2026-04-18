import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle, 
  MessageSquare,
  Clock,
  Trash2,
  Inbox
} from 'lucide-react';
import { getAnomalyAlerts } from '../../api/anomaly';
import { Badge, ActionIcon, Group, Text, Divider } from '@mantine/core';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const workerId = user.id || user.email || 'worker_01';

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const anomalies = await getAnomalyAlerts(workerId);
        // Mocking other notifications for demonstration as per brief
        const mockOthers = [
          { id: 'v1', type: 'verification', title: 'Earnings Verified', text: 'Your Foodpanda entry for April 12 has been successfully verified.', time: '2 hours ago', unread: true },
          { id: 'g1', type: 'grievance', title: 'Response Received', text: 'Support has responded to your case regarding Uber payment deduction.', time: 'Yesterday', unread: false },
        ];
        
        const mappedAnomalies = anomalies.data.map(a => ({
          id: a._id,
          type: 'anomaly',
          title: 'Potential Anomaly Detected',
          text: `Your shift on ${a.date.split('T')[0]} seems unusual: ${a.reason}`,
          time: '1 day ago',
          unread: true
        }));

        setNotifications([...mappedAnomalies, ...mockOthers]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'anomaly': return <div className="p-2 bg-rose-100 text-rose-600 rounded-xl"><ShieldAlert size={20}/></div>;
      case 'verification': return <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><CheckCircle size={20}/></div>;
      case 'grievance': return <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><MessageSquare size={20}/></div>;
      default: return <div className="p-2 bg-slate-100 text-slate-600 rounded-xl"><Bell size={20}/></div>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-end px-2">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 border-none">Notifications</h2>
           <p className="text-slate-500">Stay updated on your earnings and reports.</p>
        </div>
        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Mark all as read</button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
        {loading ? (
             <div className="p-20 text-center text-slate-400">Loading...</div>
        ) : notifications.length === 0 ? (
            <div className="p-20 text-center space-y-4">
                <Inbox size={64} className="mx-auto text-slate-200 stroke-1" />
                <p className="text-slate-400 font-medium italic">Your inbox is empty. Relax!</p>
            </div>
        ) : (
            <div className="divide-y divide-slate-50">
                {notifications.map((n) => (
                    <div key={n.id} className={`p-6 flex gap-6 hover:bg-slate-50/50 transition-colors group ${n.unread ? 'bg-indigo-50/30' : ''}`}>
                        <div className="shrink-0">{getIcon(n.type)}</div>
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                                <h4 className={`text-sm font-bold ${n.unread ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h4>
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                    <Clock size={10} /> {n.time}
                                </span>
                            </div>
                            <p className={`text-sm leading-relaxed ${n.unread ? 'text-slate-600' : 'text-slate-500 opacity-70'}`}>
                                {n.text}
                            </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionIcon variant="subtle" color="gray" radius="xl">
                                <Trash2 size={16} />
                            </ActionIcon>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">End of Notifications</p>
      </div>
    </div>
  );
};

export default Notifications;
