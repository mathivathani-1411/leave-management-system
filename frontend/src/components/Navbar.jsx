// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const roleColors = {
  student: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  teacher: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  hod: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  principal: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

const roleIcons = {
  student: '🎓',
  teacher: '📚',
  hod: '🏛️',
  principal: '🏫',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-900/50">
              L
            </div>
            <span className="font-display font-semibold text-white text-lg hidden sm:block">
              LeaveMS
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-slate-400 text-sm">{user.name}</span>
            </div>

            {/* Role Badge */}
            <span className={`status-badge border ${roleColors[user.role]} capitalize`}>
              {roleIcons[user.role]} {user.role}
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 
                         border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 
                         transition-all duration-200 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
