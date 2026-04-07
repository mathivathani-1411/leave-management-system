// src/pages/StudentDashboard.jsx
import { useState, useEffect } from 'react';
import { leaveAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const leaveTypes = ['Medical', 'Personal', 'Academic', 'Family Emergency', 'Other'];

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysBetween(from, to) {
  const diff = new Date(to) - new Date(from);
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('history'); // 'apply' | 'history'
  const [form, setForm] = useState({
    leaveType: 'Medical',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const fetchLeaves = async () => {
    try {
      const { data } = await leaveAPI.getMyLeaves();
      setLeaves(data);
    } catch {
      toast.error('Failed to load leaves');
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fromDate || !form.toDate || !form.reason.trim()) {
      return toast.error('All fields are required');
    }
    if (new Date(form.fromDate) > new Date(form.toDate)) {
      return toast.error('From date cannot be after To date');
    }
    setSubmitting(true);
    try {
      await leaveAPI.apply(form);
      toast.success('Leave applied successfully!');
      setForm({ leaveType: 'Medical', fromDate: '', toDate: '', reason: '' });
      setActiveTab('history');
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply leave');
    } finally {
      setSubmitting(false);
    }
  };

  // Stats
  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => ['pending', 'teacher_approved', 'hod_approved'].includes(l.status)).length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 page-enter">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white">
            Welcome, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-slate-400 mt-1">Manage your leave applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Applied', value: stats.total, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            { label: 'In Progress', value: stats.pending, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Approved', value: stats.approved, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-400', bg: 'bg-red-500/10' },
          ].map(s => (
            <div key={s.label} className={`glass-card p-4 ${s.bg}`}>
              <div className={`text-3xl font-bold font-display ${s.color}`}>{s.value}</div>
              <div className="text-slate-400 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'history', label: '📋 Leave History' },
            { key: 'apply', label: '➕ Apply Leave' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Apply Form */}
        {activeTab === 'apply' && (
          <div className="glass-card p-6 max-w-2xl">
            <h2 className="font-display text-xl font-bold text-white mb-6">Apply for Leave</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Leave Type</label>
                  <select name="leaveType" value={form.leaveType} onChange={handleChange} className="input-field">
                    {leaveTypes.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                  </select>
                </div>
                <div className="hidden sm:block" />
                <div>
                  <label className="label">From Date</label>
                  <input type="date" name="fromDate" value={form.fromDate} onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]} className="input-field" />
                </div>
                <div>
                  <label className="label">To Date</label>
                  <input type="date" name="toDate" value={form.toDate} onChange={handleChange}
                    min={form.fromDate || new Date().toISOString().split('T')[0]} className="input-field" />
                </div>
              </div>

              {form.fromDate && form.toDate && (
                <div className="glass-card p-3 bg-indigo-500/10 border-indigo-500/20 text-indigo-300 text-sm">
                  📅 Duration: <strong>{daysBetween(form.fromDate, form.toDate)} day(s)</strong>
                </div>
              )}

              <div>
                <label className="label">Reason</label>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the reason for your leave..."
                  className="input-field resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                  {submitting ? <LoadingSpinner size="sm" /> : '📤 Submit Application'}
                </button>
                <button type="button" onClick={() => setForm({ leaveType: 'Medical', fromDate: '', toDate: '', reason: '' })}
                  className="btn-secondary">
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Leave History */}
        {activeTab === 'history' && (
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h2 className="font-display text-xl font-bold text-white">My Leave Applications</h2>
            </div>
            {loadingLeaves ? (
              <div className="p-12 flex justify-center"><LoadingSpinner size="md" text="Loading leaves..." /></div>
            ) : leaves.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-slate-400">No leave applications yet</p>
                <button onClick={() => setActiveTab('apply')} className="btn-primary mt-4 text-sm">
                  Apply for Leave
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/3 border-b border-white/5">
                    <tr>
                      {['Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Progress'].map(h => (
                        <th key={h} className="table-header">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leaves.map(leave => (
                      <tr key={leave._id} className="hover:bg-white/3 transition-colors">
                        <td className="table-cell">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-xs">
                            {leave.leaveType}
                          </span>
                        </td>
                        <td className="table-cell whitespace-nowrap">{formatDate(leave.fromDate)}</td>
                        <td className="table-cell whitespace-nowrap">{formatDate(leave.toDate)}</td>
                        <td className="table-cell text-center">{daysBetween(leave.fromDate, leave.toDate)}</td>
                        <td className="table-cell max-w-[180px]">
                          <p className="truncate" title={leave.reason}>{leave.reason}</p>
                        </td>
                        <td className="table-cell">
                          <StatusBadge status={leave.status} />
                          {leave.status === 'rejected' && leave.rejectionReason && (
                            <p className="text-red-400 text-xs mt-1 truncate max-w-[120px]" title={leave.rejectionReason}>
                              {leave.rejectionReason}
                            </p>
                          )}
                        </td>
                        <td className="table-cell">
                          <StatusTimeline status={leave.status} currentLevel={leave.currentLevel} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
