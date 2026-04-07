// src/components/ApprovalDashboard.jsx - Reusable approval dashboard for Teacher/HOD/Principal
import { useState, useEffect } from 'react';
import { leaveAPI } from '../services/api';
import Navbar from './Navbar';
import StatusBadge from './StatusBadge';
import StatusTimeline from './StatusTimeline';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysBetween(from, to) {
  const diff = new Date(to) - new Date(from);
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

// Rejection Modal
function RejectModal({ leave, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="glass-card p-6 w-full max-w-md relative z-10 page-enter">
        <h3 className="font-display text-xl font-bold text-white mb-2">Reject Leave</h3>
        <p className="text-slate-400 text-sm mb-4">
          Rejecting leave for <strong className="text-white">{leave?.userId?.name}</strong>
        </p>
        <label className="label">Rejection Reason (optional)</label>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Enter reason for rejection..."
          rows={3}
          className="input-field resize-none mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading}
            className="btn-danger flex items-center gap-2 flex-1 justify-center"
          >
            {loading ? <LoadingSpinner size="sm" /> : '❌ Confirm Reject'}
          </button>
          <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function ApprovalDashboard({ role, title, icon, description, accentColor = 'indigo' }) {
  const [leaves, setLeaves] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState('pending'); // 'pending' | 'approved'

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        leaveAPI.getPendingLeaves(),
        leaveAPI.getApprovedLeaves(),
      ]);
      setLeaves(pendingRes.data);
      setApprovedLeaves(approvedRes.data);
    } catch {
      toast.error('Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await leaveAPI.updateLeave(id, { action: 'approve' });
      toast.success('Leave approved successfully!');
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (rejectionReason) => {
    if (!rejectModal) return;
    setActionLoading(rejectModal._id);
    try {
      await leaveAPI.updateLeave(rejectModal._id, { action: 'reject', rejectionReason });
      toast.success('Leave rejected');
      setRejectModal(null);
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const leaveTypes = ['all', ...new Set(leaves.map(l => l.leaveType))];
  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.leaveType === filter);

  return (
    <div className="min-h-screen">
      <Navbar />
      {rejectModal && (
        <RejectModal
          leave={rejectModal}
          onConfirm={handleReject}
          onCancel={() => setRejectModal(null)}
          loading={!!actionLoading}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 page-enter">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{icon}</span>
              <h1 className="font-display text-3xl font-bold text-white">{title}</h1>
            </div>
            <p className="text-slate-400">{description}</p>
          </div>
          <div className="flex gap-3">
            <div className="glass-card px-5 py-3 text-center">
              <div className="text-3xl font-bold font-display text-indigo-400">{leaves.length}</div>
              <div className="text-slate-500 text-xs">Pending</div>
            </div>
            <div className="glass-card px-5 py-3 text-center">
              <div className="text-3xl font-bold font-display text-green-400">{approvedLeaves.length}</div>
              <div className="text-slate-500 text-xs">Approved</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('pending')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            ⏳ Pending ({leaves.length})
          </button>
          <button
            onClick={() => setTab('approved')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'approved' ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            ✅ Approved ({approvedLeaves.length})
          </button>
        </div>

        {tab === 'pending' && (
          <>
            {/* Filter tabs */}
            {leaveTypes.length > 1 && (
              <div className="flex gap-2 mb-6 flex-wrap">
                {leaveTypes.map(t => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                      filter === t
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            <div className="glass-card overflow-hidden">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-semibold text-white">Pending Leave Requests</h2>
                <button onClick={fetchLeaves} className="text-slate-500 hover:text-white transition-colors text-sm flex items-center gap-1">
                  🔄 Refresh
                </button>
              </div>
              {loading ? (
                <div className="p-12 flex justify-center"><LoadingSpinner size="md" text="Loading requests..." /></div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-5xl mb-3">🎉</div>
                  <p className="text-slate-400">No pending leave requests</p>
                  <p className="text-slate-600 text-sm mt-1">All caught up!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/3 border-b border-white/5">
                      <tr>
                        {['Student', 'Leave Type', 'Duration', 'Reason', 'Applied', 'Progress', 'Actions'].map(h => (
                          <th key={h} className="table-header">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filtered.map(leave => (
                        <tr key={leave._id} className="hover:bg-white/3 transition-colors">
                          <td className="table-cell">
                            <div>
                              <p className="font-medium text-white">{leave.userId?.name}</p>
                              <p className="text-slate-500 text-xs">{leave.userId?.email}</p>
                            </div>
                          </td>
                          <td className="table-cell">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-xs">
                              {leave.leaveType}
                            </span>
                          </td>
                          <td className="table-cell whitespace-nowrap">
                            <div className="text-xs text-slate-400">
                              {formatDate(leave.fromDate)} – {formatDate(leave.toDate)}
                            </div>
                            <div className="text-white text-xs font-medium mt-0.5">
                              {daysBetween(leave.fromDate, leave.toDate)} day(s)
                            </div>
                          </td>
                          <td className="table-cell max-w-[160px]">
                            <p className="truncate text-xs" title={leave.reason}>{leave.reason}</p>
                          </td>
                          <td className="table-cell whitespace-nowrap text-xs text-slate-400">
                            {formatDate(leave.appliedDate)}
                          </td>
                          <td className="table-cell">
                            <StatusTimeline status={leave.status} currentLevel={leave.currentLevel} />
                          </td>
                          <td className="table-cell">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(leave._id)}
                                disabled={!!actionLoading}
                                className="btn-success flex items-center gap-1 disabled:opacity-50"
                              >
                                {actionLoading === leave._id ? <LoadingSpinner size="sm" /> : '✅ Approve'}
                              </button>
                              <button
                                onClick={() => setRejectModal(leave)}
                                disabled={!!actionLoading}
                                className="btn-danger flex items-center gap-1 disabled:opacity-50"
                              >
                                ❌ Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'approved' && (
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h2 className="font-semibold text-white">Approved Students ({approvedLeaves.length})</h2>
            </div>
            {loading ? (
              <div className="p-12 flex justify-center"><LoadingSpinner size="md" text="Loading..." /></div>
            ) : approvedLeaves.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-slate-400">No approved leaves yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/3 border-b border-white/5">
                    <tr>
                      {['#', 'Student', 'Leave Type', 'Duration', 'Reason', 'Status'].map(h => (
                        <th key={h} className="table-header">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {approvedLeaves.map((leave, idx) => (
                      <tr key={leave._id} className="hover:bg-white/3 transition-colors">
                        <td className="table-cell text-slate-500 text-xs">{idx + 1}</td>
                        <td className="table-cell">
                          <p className="font-medium text-white">{leave.userId?.name}</p>
                          <p className="text-slate-500 text-xs">{leave.userId?.email}</p>
                        </td>
                        <td className="table-cell">
                          <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-300 text-xs">
                            {leave.leaveType}
                          </span>
                        </td>
                        <td className="table-cell whitespace-nowrap">
                          <div className="text-xs text-slate-400">
                            {formatDate(leave.fromDate)} – {formatDate(leave.toDate)}
                          </div>
                          <div className="text-white text-xs font-medium mt-0.5">
                            {daysBetween(leave.fromDate, leave.toDate)} day(s)
                          </div>
                        </td>
                        <td className="table-cell max-w-[160px]">
                          <p className="truncate text-xs" title={leave.reason}>{leave.reason}</p>
                        </td>
                        <td className="table-cell">
                          <StatusBadge status={leave.status} />
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
