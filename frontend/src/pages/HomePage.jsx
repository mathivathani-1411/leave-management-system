// src/pages/HomePage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const features = [
  { icon: '🎓', title: 'Students', desc: 'Apply & track leaves in real-time' },
  { icon: '👨‍🏫', title: 'Teachers', desc: 'Review & approve student requests' },
  { icon: '🏛️', title: 'HOD', desc: 'Second-level approval authority' },
  { icon: '🏫', title: 'Principal', desc: 'Final approval & oversight' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-900/50">
            L
          </div>
          <span className="font-display font-semibold text-white text-xl">LeaveMS</span>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16 text-center page-enter">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Hierarchical Approval System
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
          Leave{' '}
          <span className="gradient-text">Management</span>
          <br />System
        </h1>

        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          A streamlined approval workflow for educational institutions.
          From application to final decision — fully transparent and efficient.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button
            onClick={() => navigate('/login', { state: { defaultRole: 'student' } })}
            className="group relative px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-all duration-200 shadow-xl shadow-indigo-900/40 active:scale-95"
          >
            <span className="flex items-center gap-2">
              🎓 Student Login
            </span>
          </button>
          <button
            onClick={() => navigate('/login', { state: { defaultRole: 'teacher' } })}
            className="group px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-base transition-all duration-200 active:scale-95"
          >
            <span className="flex items-center gap-2">
              👨‍🏫 Teacher Login
            </span>
          </button>
          <button
            onClick={() => navigate('/login', { state: { defaultRole: 'hod' } })}
            className="group px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-base transition-all duration-200 active:scale-95"
          >
            <span className="flex items-center gap-2">
              🏛️ HOD Login
            </span>
          </button>
          <button
            onClick={() => navigate('/login', { state: { defaultRole: 'principal' } })}
            className="group px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-base transition-all duration-200 active:scale-95"
          >
            <span className="flex items-center gap-2">
              🏫 Principal Login
            </span>
          </button>
        </div>

        {/* Flow indicator */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center mb-16">
          {['Student', 'Teacher', 'HOD', 'Principal', 'Decision'].map((step, i) => (
            <div key={step} className="flex items-center gap-2 sm:gap-3">
              <div className="glass-card px-3 py-1.5 text-xs sm:text-sm text-slate-300 font-medium">
                {step}
              </div>
              {i < 4 && <span className="text-slate-600">→</span>}
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl w-full mb-16">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-4 text-center hover:bg-white/8 transition-all duration-200 group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">{f.icon}</div>
              <div className="text-white text-sm font-semibold mb-1">{f.title}</div>
              <div className="text-slate-500 text-xs">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Demo Credentials */}
        <div className="glass-card p-6 max-w-2xl w-full text-left">
          <h3 className="text-white text-lg font-semibold mb-4 text-center">Demo Credentials</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-indigo-300 font-medium mb-2">Student</div>
              <div className="text-slate-400">Email: student@demo.com</div>
              <div className="text-slate-400">Password: demo123</div>
            </div>
            <div>
              <div className="text-indigo-300 font-medium mb-2">Teacher</div>
              <div className="text-slate-400">Email: teacher@demo.com</div>
              <div className="text-slate-400">Password: demo123</div>
            </div>
            <div>
              <div className="text-indigo-300 font-medium mb-2">HOD</div>
              <div className="text-slate-400">Email: hod@demo.com</div>
              <div className="text-slate-400">Password: demo123</div>
            </div>
            <div>
              <div className="text-indigo-300 font-medium mb-2">Principal</div>
              <div className="text-slate-400">Email: principal@demo.com</div>
              <div className="text-slate-400">Password: demo123</div>
            </div>
          </div>
          <div className="text-center text-slate-500 text-xs mt-4">
            Use these credentials to explore different user roles
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-slate-600 text-xs">
        Leave Management System © 2024 — Built with MERN Stack
      </footer>
    </div>
  );
}
