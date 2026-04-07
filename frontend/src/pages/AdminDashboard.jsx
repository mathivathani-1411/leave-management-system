// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { leaveAPI } from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysBetween(from, to) {
  const diff = new Date(to) - new Date(from);
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leavesRes, statsRes] = await Promise.all([
          leaveAPI.getAllLeaves(),
          leaveAPI.getStats(),
        ]);
        setLeaves(leavesRes.data);
        setStats(statsRes.data);
      } catch {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statuses = ['all', 'pending', 'teacher_approved', 'hod_approved', 'approved', 'rejected'];
  const filtered = filterStatus === 'all' ? leaves : leaves.filter(l => l.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96"><LoadingSpinner size="lg" text="Loading admin data..." /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 page-enter">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <span>⚙️</span> Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Monitor all leave requests and system statistics</p>
        </div>

        {/* Stats grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            {[
              { label: 'Total Leaves', value: stats.total, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              { label: 'Pending', value: stats.pending, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Teacher Apvd', value: stats.teacher_approved, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'HOD Apvd', value: stats.hod_approved, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              { label: 'Approved', value: stats.approved, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Rejected', value: stats.rejected, color: 'text-red-400', bg: 'bg-red-500/10' },
              { label: 'Total Users', value: stats.totalUsers, color: 'text-slate-300', bg: 'bg-white/5' },
            ].map(s => (
              <div key={s.label} className={`glass-card p-4 ${s.bg}`}>
                <div className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</div>
                <div className="text-slate-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Approval Flow Info */}
        <div className="glass-card p-5 mb-8 bg-indigo-500/5 border-indigo-500/20">
          <h3 className="text-white font-semibold mb-3 text-sm">📊 Approval Flow Status</h3>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {[
              { label: 'Student Applies', color: 'bg-slate-600' },
              { label: '→', color: '' },
              { label: 'Teacher Reviews', color: 'bg-amber-600' },
              { label: '→', color: '' },
              { label: 'HOD Reviews', color: 'bg-blue-600' },
              { label: '→', color: '' },
              { label: 'Principal Decides', color: 'bg-purple-600' },
              { label: '→', color: '' },
              { label: 'Final Decision', color: 'bg-emerald-600' },
            ].map((item, i) => item.color ? (
              <span key={i} className={`px-2 py-1 rounded-md ${item.color} text-white`}>{item.label}</span>
            ) : (
              <span key={i} className="text-slate-600">{item.label}</span>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filterStatus === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              {s.replace('_', ' ')} {s !== 'all' ? `(${leaves.filter(l => l.status === s).length})` : `(${leaves.length})`}
            </button>
          ))}
        </div>

        {/* All Leaves Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h2 className="font-semibold text-white">All Leave Requests ({filtered.length})</h2>
          </div>
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-slate-400">No leave requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/3 border-b border-white/5">
                  <tr>
                    {['Student', 'Role', 'Type', 'Duration', 'Reason', 'Applied', 'Status', 'Progress'].map(h => (
                      <th key={h} className="table-header">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map(leave => (
                    <tr key={leave._id} className="hover:bg-white/3 transition-colors">
                      <td className="table-cell">
                        <div>
                          <p className="font-medium text-white text-sm">{leave.userId?.name}</p>
                          <p className="text-slate-500 text-xs">{leave.userId?.email}</p>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="capitalize text-xs text-slate-400">{leave.userId?.role}</span>
                      </td>
                      <td className="table-cell">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-xs">
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="table-cell whitespace-nowrap text-xs">
                        <div className="text-slate-400">{formatDate(leave.fromDate)} – {formatDate(leave.toDate)}</div>
                        <div className="text-white font-medium">{daysBetween(leave.fromDate, leave.toDate)}d</div>
                      </td>
                      <td className="table-cell max-w-[140px]">
                        <p className="truncate text-xs" title={leave.reason}>{leave.reason}</p>
                      </td>
                      <td className="table-cell whitespace-nowrap text-xs text-slate-400">
                        {formatDate(leave.appliedDate)}
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={leave.status} />
                        {leave.status === 'rejected' && leave.rejectionReason && (
                          <p className="text-red-400 text-xs mt-0.5 truncate max-w-[100px]" title={leave.rejectionReason}>
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
      </div>
    </div>
  );
}
