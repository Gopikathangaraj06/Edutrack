import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User as UserIcon, Flame, Trophy, Star, Shield, Award, Clock } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Created an account', icon: <Star size={20} />, unlocked: true, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 2, title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: <Flame size={20} />, unlocked: user?.studyStreak >= 7, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 3, title: 'Dedicated Scholar', description: 'Reach Level 5', icon: <Shield size={20} />, unlocked: user?.level >= 5, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 4, title: 'Master of Knowledge', description: 'Reach Level 10', icon: <Award size={20} />, unlocked: user?.level >= 10, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 5, title: 'A+ Student', description: 'Achieve 90%+ average', icon: <Trophy size={20} />, unlocked: false, color: 'text-emerald-500', bg: 'bg-emerald-50' } // Hardcoded false for simplicity, real app would check stats
  ];

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card-container relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="relative pt-16 flex flex-col md:flex-row items-center md:items-end gap-6 pb-2">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-5xl font-bold text-primary shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
            <p className="text-slate-500">{user.email}</p>
          </div>
          <div className="flex gap-4 mb-2">
            <div className="text-center px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-sm text-slate-500 font-medium">Level</div>
              <div className="text-2xl font-bold text-primary">{user.level}</div>
            </div>
            <div className="text-center px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-sm text-slate-500 font-medium">XP</div>
              <div className="text-2xl font-bold text-indigo-500">{user.xp}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About Card */}
        <div className="card-container">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <UserIcon size={18} className="text-primary" />
            User Details
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Member Since</p>
              <p className="font-medium text-slate-800">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Last Active</p>
              <p className="font-medium text-slate-800 flex items-center gap-2">
                <Clock size={14} className="text-slate-400"/>
                {new Date(user.lastActive || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Current Streak</p>
              <p className="font-medium text-orange-500 flex items-center gap-1">
                <Flame size={14} />
                {user.studyStreak} Days
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Card */}
        <div className="md:col-span-2 card-container">
          <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Trophy size={18} className="text-primary" />
            Achievements Badges
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((badge) => (
              <div 
                key={badge.id} 
                className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                  badge.unlocked 
                    ? `bg-white border-slate-200 shadow-sm` 
                    : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.unlocked ? badge.bg : 'bg-slate-200'} ${badge.unlocked ? badge.color : 'text-slate-400'}`}>
                  {badge.icon}
                </div>
                <div>
                  <h4 className={`font-semibold ${badge.unlocked ? 'text-slate-800' : 'text-slate-500'}`}>{badge.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
