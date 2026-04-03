import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BookOpen, TrendingUp, Flame, Target, CheckCircle2, Circle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, tasksRes] = await Promise.all([
        api.get('/progress/analytics'),
        api.get('/tasks')
      ]);
      setAnalytics(analyticsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateDemo = async () => {
    try {
      const toastId = toast.loading('Generating demo data...');
      const res = await api.post('/progress/demo');
      const { userXP, userLevel, userStreak } = res.data;
      updateUserStats(userXP, userLevel, userStreak);
      await fetchDashboardData();
      toast.success('Demo data injected successfully!', { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate demo data');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await api.post('/tasks', { title: newTask, date: new Date() });
      setTasks([res.data, ...tasks]);
      setNewTask('');
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await api.put(`/tasks/${id}`, { completed: !completed });
      setTasks(tasks.map(t => t._id === id ? { ...t, completed: !completed } : t));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading dashboard...</div>;

  const xpProgress = (user?.xp % 100) || 0;

  return (
    <div className="space-y-6">
      {/* Welcome & Level Header */}
      <div className="card-container bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Keep it up, {user?.name.split(' ')[0]}!</h2>
            <p className="text-slate-600 mt-1">You are doing great. Track your progress to level up.</p>
            {(!analytics?.subjects || analytics.subjects.length === 0 || (!analytics.chartData || analytics.chartData.length === 0)) && (
               <button onClick={generateDemo} className="mt-3 text-sm px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2">
                 <Activity size={16} /> Generate Demo Data
               </button>
            )}
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 w-full md:w-auto">
            <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center border-4 border-white shadow-sm">
              <span className="text-white font-bold text-xl">{user?.level}</span>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-slate-700">Level {user?.level}</span>
                <span className="text-xs text-slate-500 font-medium">{xpProgress} / 100 XP</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${xpProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-container flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Subjects Tracked</p>
            <h3 className="text-2xl font-bold text-slate-800">{analytics?.subjects?.length || 0}</h3>
          </div>
        </div>
        <div className="card-container flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Average Score</p>
            <h3 className="text-2xl font-bold text-slate-800">{Math.round(analytics?.average || 0)}%</h3>
          </div>
        </div>
        <div className="card-container flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Best Performance</p>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              {analytics?.best ? `${Math.round(analytics.best.averageScore)}%` : '-'}
            </h3>
          </div>
        </div>
        <div className="card-container flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Study Streak</p>
            <h3 className="text-2xl font-bold text-slate-800">{user?.studyStreak || 0} {user?.studyStreak === 1 ? 'day' : 'days'}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-container">
            <h3 className="font-semibold text-slate-800 mb-6">Progress Trend Over Time</h3>
            <div className="h-64">
              {analytics?.chartData?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    {analytics.subjects.map((sub, idx) => (
                      <Line 
                        key={sub._id} 
                        type="monotone" 
                        dataKey={sub.name} 
                        stroke={`hsl(${idx * 137.5 % 360}, 70%, 50%)`} 
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">Not enough data to graph</div>
              )}
            </div>
          </div>
        </div>

        {/* Focus Areas & Tasks */}
        <div className="space-y-6">
          <div className="card-container bg-blue-50 border-blue-100">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Target size={18} className="text-primary" />
              Focus Areas
            </h3>
            {analytics?.weakest ? (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                <div className="text-sm font-medium text-slate-600 mb-1">Lowest Score</div>
                <div className="text-xl font-bold text-slate-800">{analytics.weakest.name}</div>
                <div className="mt-2 text-sm text-red-500 font-medium bg-red-50 px-2 py-1 inline-block rounded">
                  {Math.round(analytics.weakest.averageScore)}% Average
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500">Track progress to identify focus areas.</div>
            )}
          </div>

          <div className="card-container">
            <h3 className="font-semibold text-slate-800 mb-4">Today's Study Plan</h3>
            <form onSubmit={addTask} className="mb-4">
              <input 
                type="text" 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="input-field text-sm w-full"
              />
            </form>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tasks.length === 0 && <div className="text-sm text-slate-500 text-center py-2">No tasks yet.</div>}
              {tasks.map(task => (
                <div key={task._id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer" onClick={() => toggleTask(task._id, task.completed)}>
                  <div className="mt-0.5 text-slate-300 group-hover:text-primary transition-colors">
                    {task.completed ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} />}
                  </div>
                  <span className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
