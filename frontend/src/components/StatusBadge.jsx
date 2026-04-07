// src/components/StatusBadge.jsx
export default function StatusBadge({ status }) {
  const config = {
    pending: {
      label: 'Pending',
      className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400',
      icon: '⏳',
    },
    teacher_approved: {
      label: 'Teacher Approved',
      className: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      dot: 'bg-blue-400',
      icon: '✅',
    },
    hod_approved: {
      label: 'HOD Approved',
      className: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      dot: 'bg-purple-400',
      icon: '✅',
    },
    approved: {
      label: 'Approved',
      className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400',
      icon: '🎉',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-500/15 text-red-300 border-red-500/30',
      dot: 'bg-red-400',
      icon: '❌',
    },
  };

  const cfg = config[status] || config.pending;

  return (
    <span className={`status-badge border ${cfg.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`}></span>
      {cfg.label}
    </span>
  );
}
