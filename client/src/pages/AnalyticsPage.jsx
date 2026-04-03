import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ResponsiveContainer, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { BarChart2, Star, TrendingDown, Activity } from 'lucide-react';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/progress/analytics');
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading analytics...</div>;

  if (!data?.subjects || data.subjects.length === 0) {
    return (
       <div className="flex flex-col items-center justify-center h-full text-slate-500">
         <BarChart2 size={48} className="mb-4 text-slate-300" />
         <p>Not enough data to display analytics.</p>
       </div>
    );
  }

  const subjectBarData = data.subjects.map(s => ({
    name: s.name,
    score: Math.round(s.averageScore)
  }));

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart2 className="text-primary" />
          Advanced Analytics
        </h1>
        <p className="text-slate-500 mt-1">Deep dive into your performance metrics and growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <div className="card-container flex items-center gap-4 bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-none shadow-md">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-blue-100 font-medium tracking-wide text-uppercase">Overall Average</p>
            <h3 className="text-3xl font-bold">{Math.round(data.average)}%</h3>
          </div>
        </div>

        <div className="card-container flex flex-col justify-center">
          <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-2">
            <Star size={16} className="text-amber-500" /> Best Subject
          </p>
          <h3 className="text-xl font-bold text-slate-800">{data.best?.name}</h3>
          <p className="text-sm font-semibold text-emerald-500 mt-1">{Math.round(data.best?.averageScore)}% Average</p>
        </div>

        <div className="card-container flex flex-col justify-center border-l-4 border-l-red-400">
          <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-2">
            <TrendingDown size={16} className="text-red-500" /> Weakest Subject
          </p>
          <h3 className="text-xl font-bold text-slate-800">{data.weakest?.name}</h3>
          <p className="text-sm font-semibold text-red-500 mt-1">{Math.round(data.weakest?.averageScore)}% Average</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Comparison Bar Chart */}
        <div className="card-container">
          <h3 className="font-semibold text-slate-800 mb-6">Subject Comparison</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectBarData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis dataKey="name" type="category" tick={{fill: '#64748b', fontSize: 12}} width={100} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Radar */}
        <div className="card-container flex flex-col">
          <h3 className="font-semibold text-slate-800 mb-2">Performance Radar</h3>
          <p className="text-sm text-slate-500 mb-4">Your balanced skill map across all subjects.</p>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#475569', fontSize: 11, fontWeight: 500}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#60a5fa" fillOpacity={0.5} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
