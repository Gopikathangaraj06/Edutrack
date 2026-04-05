import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { 
  LayoutDashboard, 
  BookOpen, 
  TrendingUp, 
  BarChart2, 
  User as UserIcon, 
  LogOut 
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Subjects', path: '/subjects', icon: <BookOpen size={20} /> },
    { name: 'Add Progress', path: '/add-progress', icon: <TrendingUp size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Profile', path: '/profile', icon: <UserIcon size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-3">
          <img 
            src={logo} 
            alt="Edutrack Logo" 
            className="h-10 w-auto object-contain" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span className="hidden text-xl font-bold text-slate-800 tracking-tight">Edutrack</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-primary font-medium shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 text-slate-500 hover:text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl w-full transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar for mobile - optional expansion */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center hidden md:flex">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Edutrack Logo" className="h-8 w-auto object-contain" onError={(e) => e.target.style.display='none'} />
            <h1 className="text-xl font-semibold text-slate-800">
              Welcome back, {user?.name.split(' ')[0]} 👋
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex flex-col items-end">
               <span className="text-sm font-medium text-slate-700">Level {user?.level}</span>
               <span className="text-xs text-primary font-medium">{user?.xp} XP</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                {user?.name.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
