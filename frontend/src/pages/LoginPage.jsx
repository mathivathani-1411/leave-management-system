// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const roles = ['student', 'teacher', 'hod', 'principal'];

export default function LoginPage() {
  const location = useLocation();
  const defaultRole = location.state?.defaultRole || 'student';

  const [form, setForm] = useState({ email: '', password: '', role: defaultRole });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.role) {
      return toast.error('All fields are required');
    }
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      const routes = { student: '/student', teacher: '/teacher', hod: '/hod', principal: '/principal' };
      navigate(routes[data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md page-enter relative z-10">
        {/* Back */}
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors group w-fit">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="glass-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg shadow-indigo-900/50">
              🔑
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role */}
            <div>
              <label className="label">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="input-field capitalize"
              >
                {roles.map(r => (
                  <option key={r} value={r} className="bg-slate-900 capitalize">{r.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-slate-500 text-sm mt-6">
            Demo credentials available on homepage
          </p>
        </div>
      </div>
    </div>
  );
}
