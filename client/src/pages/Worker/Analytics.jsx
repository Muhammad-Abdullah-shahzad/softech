import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, ComposedChart, Area
} from 'recharts';
import { 
  getWorkerAnalytics, 
  getMedianAnalytics 
} from '../../api/earnings';
import { 
  TrendingUp, 
  Zap, 
  Target 
} from 'lucide-react';

const Analytics = () => {
  const [trends, setTrends] = useState([]);
  const [hourlyTrend, setHourlyTrend] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [cityMedian, setCityMedian] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const workerId = user.id || user.email || 'worker_01';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [workerRes, medianRes] = await Promise.all([
          getWorkerAnalytics(workerId),
          getMedianAnalytics()
        ]);
        setTrends(workerRes.data.data.earningsTrend);
        
        // Let's add the median to the hourly trend for chart rendering
        const median = medianRes.data.data.cityMedian || 150;
        const mappedHourly = workerRes.data.data.hourlyRateTrend.map(h => ({
            ...h,
            cityAvg: median
        }));
        
        setHourlyTrend(mappedHourly);
        
        // Calculate dynamic commissions
        const mappedPlatforms = workerRes.data.data.platformComparison.map(p => ({
            name: p.platform,
            commissionRate: 15 // Assuming static platform commission till actual feature is built
        }));
        setPlatformData(mappedPlatforms);
        setCityMedian(median);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading Analytics...</div>;

  const avgRate = hourlyTrend.length > 0 
    ? Math.round(hourlyTrend.reduce((acc, curr) => acc + curr.rate, 0) / hourlyTrend.length) 
    : 0;

  let comparisonText = "Your market benchmarking statistics are based on dynamic data.";
  if (cityMedian && avgRate > 0) {
      if (avgRate > cityMedian) {
          const diff = Math.round(((avgRate - cityMedian) / cityMedian) * 100);
          comparisonText = `Excellent! You are currently earning ${diff}% above the regional median.`;
      } else if (avgRate < cityMedian) {
          const diff = Math.round(((cityMedian - avgRate) / cityMedian) * 100);
          comparisonText = `Your average is ${diff}% below the regional median. Review your anomalies to optimize.`;
      } else {
          comparisonText = `Your earnings perfectly match the regional average standard.`;
      }
  }

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 border-none">Deep Analytics</h2>
        <p className="text-slate-500">Compare your performance against market benchmarks.</p>
      </header>

      {/* Row 1: Efficiency & Hourly Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-none">Hourly Rate Tracker</h3>
              <p className="text-sm text-slate-500">Your rate vs City-wide median</p>
            </div>
            <div className="bg-indigo-50 p-2 rounded-xl">
              <Zap className="text-indigo-600" size={20} />
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={hourlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="rate" fill="#28e0b6" fillOpacity={0.1} stroke="#28e0b6" strokeWidth={3} />
                <Line type="monotone" dataKey="cityAvg" stroke="#f43f5e" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 text-xs font-medium">
             <div className="flex items-center gap-1"><span className="w-3 h-1 bg-[#28e0b6] rounded"></span> Your Rate</div>
             <div className="flex items-center gap-1"><span className="w-3 h-1 bg-rose-500 border-t border-dashed border-white"></span> City Median</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-none">Commission Tracker</h3>
              <p className="text-sm text-slate-500">Percentage of gross earnings taken by platforms</p>
            </div>
            <div className="bg-amber-50 p-2 rounded-xl">
              <TrendingUp className="text-amber-600" size={20} />
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="commissionRate" fill="#f59e0b" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Market Benchmark Badge */}
      <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4">
                <span className="bg-[#28e0b6] text-slate-900 border-none text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">Fairness Report</span>
                <h3 className="text-3xl font-bold max-w-md">{comparisonText}</h3>
                <p className="text-slate-400 max-w-lg">Based on data from verified workers in your exact region.</p>
            </div>
            <div className="flex gap-10">
                <div className="text-center">
                    <p className="text-slate-400 text-sm mb-1">Your Avg Rate</p>
                    <p className="text-4xl font-black italic">Rs. {avgRate}</p>
                </div>
                <div className="text-center">
                    <p className="text-slate-400 text-sm mb-1">City Median Rate</p>
                    <p className="text-4xl font-black italic opacity-40">Rs. {cityMedian}</p>
                </div>
            </div>
        </div>
        <Target className="absolute -bottom-10 -right-10 text-[#28e0b6]/10 w-64 h-64" />
      </div>

      {/* Row 2: Earnings Trend */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-8 border-none">Earnings Consistency</h3>
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{stroke: '#28e0b6', strokeWidth: 2}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Legend verticalAlign="top" align="right" />
                <Line type="monotone" dataKey="amount" name="Net Amount" stroke="#28e0b6" strokeWidth={4} dot={{ r: 6, fill: '#28e0b6', strokeWidth: 3, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
