import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingDown, 
  TrendingUp, 
  MessageSquare, 
  MapPin, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { getCommunityInsights } from '../../api/analytics';
import { getTrendingGrievances } from '../../api/grievance';
import { Badge, Progress, Avatar, Group, Text, Paper, Button } from '@mantine/core';

const Community = () => {
  const [insights, setInsights] = useState(null);
  const [trendingGrievances, setTrendingGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const [insightsRes, grievanceRes] = await Promise.all([
          getCommunityInsights(),
          getTrendingGrievances()
        ]);
        setInsights(insightsRes.data.data);
        setTrendingGrievances(grievanceRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunityData();
  }, []);

  if (loading) return <div>Loading Community Insights...</div>;

  return (
    <div className="space-y-10 pb-12">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 border-none">Community Insights</h2>
        <p className="text-slate-500 text-sm italic">Aggregate, anonymized data from the FairGig network.</p>
      </header>

      {/* Row 1: Market Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Paper p="xl" radius="32px" withBorder className="bg-slate-900 text-white border-none">
            <h3 className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">Market Pulse</h3>
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between mb-2">
                        <Text size="sm" c="dimmed">Uber Availability</Text>
                        <Text size="sm" fw={700}>High (88%)</Text>
                    </div>
                    <Progress value={88} color="indigo" size="sm" radius="xl" />
                </div>
                <div>
                    <div className="flex justify-between mb-2">
                        <Text size="sm" c="dimmed">Zomato Incentives</Text>
                        <Text size="sm" fw={700}>Dropping (-12%)</Text>
                    </div>
                    <Progress value={45} color="rose" size="sm" radius="xl" />
                </div>
                <div>
                    <div className="flex justify-between mb-2">
                        <Text size="sm" c="dimmed">Swiggy Verification Speed</Text>
                        <Text size="sm" fw={700}>Improving</Text>
                    </div>
                    <Progress value={72} color="emerald" size="sm" radius="xl" />
                </div>
            </div>
        </Paper>

        <div className="md:col-span-2 bg-indigo-50 rounded-[32px] p-8 flex flex-col justify-between border border-indigo-100">
             <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-indigo-900 border-none">Worker Sentiment</h3>
                    <p className="text-sm text-indigo-700">How your peers feel about current rates in Mumbai.</p>
                </div>
                <Users className="text-indigo-600 opacity-20" size={48} />
             </div>
             
             <div className="flex gap-12 mt-8">
                <div>
                    <p className="text-4xl font-black text-indigo-600 italic">68%</p>
                    <p className="text-sm font-bold text-indigo-900 mt-1 uppercase tracking-tighter">Satisfied</p>
                </div>
                <div>
                    <p className="text-4xl font-black text-rose-500 italic">22%</p>
                    <p className="text-sm font-bold text-indigo-900 mt-1 uppercase tracking-tighter">Concerned</p>
                </div>
                <div>
                    <p className="text-4xl font-black text-slate-400 italic">10%</p>
                    <p className="text-sm font-bold text-indigo-900 mt-1 uppercase tracking-tighter">Neutral</p>
                </div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Trending Issues */}
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 px-2 border-none">
                <ShieldAlert className="text-rose-500" size={24} />
                Trending Issues
            </h3>
            <div className="space-y-3">
                {trendingGrievances.map((g, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 flex justify-between items-center group hover:border-rose-200 transition-colors">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center">
                                <MessageSquare className="text-rose-600" size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm group-hover:text-rose-700">{g.title}</h4>
                                <p className="text-xs text-slate-500">{g.affectedCount}+ workers reported this in {g.platform}</p>
                            </div>
                        </div>
                        <ArrowUpRight size={18} className="text-slate-300 group-hover:text-rose-500" />
                    </div>
                ))}
            </div>
        </div>

        {/* Global Rate Changes */}
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 px-2 border-none">
                <TrendingUp className="text-indigo-500" size={24} />
                Global Rate Changes
            </h3>
            <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-50">
                {insights?.rateChanges?.map((item, idx) => (
                    <div key={idx} className="p-6 flex justify-between items-center">
                        <Group>
                            <Avatar color={item.change > 0 ? 'teal' : 'red'} radius="xl">
                                {item.change > 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                            </Avatar>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{item.platform}</h4>
                                <Text size="xs" color="dimmed" className="flex items-center gap-1">
                                    <MapPin size={10} /> {item.city}
                                </Text>
                            </div>
                        </Group>
                        <div className="text-right">
                            <p className={`font-black italic ${item.change > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {item.change > 0 ? '+' : ''}{item.change}%
                            </p>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Past 7 Days</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Hero Insights */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[40px] p-12 text-white overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                  <h3 className="text-4xl font-black italic tracking-tight leading-tight">Fairness Score: 7.4/10</h3>
                  <p className="text-indigo-100 text-lg opacity-80 leading-relaxed">
                      Mumbai's gig economy is currently seeing a "Fair" rating. Payment delays reduced by 14% this month across major platforms.
                  </p>
                  <Button variant="white" color="indigo" radius="xl" size="lg" px={40}>View Full Report</Button>
              </div>
              <div className="hidden md:flex justify-end">
                    <div className="grid grid-cols-2 gap-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center font-bold text-2xl italic">
                                F
                            </div>
                        ))}
                    </div>
              </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
      </div>
    </div>
  );
};

export default Community;
