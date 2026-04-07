// src/components/StatusTimeline.jsx
export default function StatusTimeline({ status, currentLevel }) {
  const steps = [
    { key: 'applied', label: 'Applied', icon: '📝' },
    { key: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
    { key: 'hod', label: 'HOD', icon: '🏛️' },
    { key: 'principal', label: 'Principal', icon: '🏫' },
    { key: 'final', label: 'Final', icon: '✅' },
  ];

  const getStepStatus = (stepKey) => {
    if (status === 'rejected') {
      if (stepKey === 'applied') return 'done';
      if (stepKey === 'teacher' && currentLevel === 'teacher') return 'rejected';
      if (stepKey === 'hod' && currentLevel === 'hod') return 'rejected';
      if (stepKey === 'principal' && currentLevel === 'principal') return 'rejected';
      if (currentLevel === 'completed') return 'rejected';
      return 'inactive';
    }
    if (status === 'approved') return 'done';
    if (stepKey === 'applied') return 'done';
    if (stepKey === 'teacher' && ['teacher_approved', 'hod_approved', 'approved'].includes(status)) return 'done';
    if (stepKey === 'hod' && ['hod_approved', 'approved'].includes(status)) return 'done';
    if (stepKey === 'principal' && status === 'approved') return 'done';
    if (stepKey === 'final' && status === 'approved') return 'done';
    // Active step
    if (stepKey === 'teacher' && status === 'pending' && currentLevel === 'teacher') return 'active';
    if (stepKey === 'hod' && status === 'teacher_approved' && currentLevel === 'hod') return 'active';
    if (stepKey === 'principal' && status === 'hod_approved' && currentLevel === 'principal') return 'active';
    return 'inactive';
  };

  const colorMap = {
    done: 'bg-emerald-500 border-emerald-400 text-white',
    active: 'bg-indigo-500 border-indigo-400 text-white animate-pulse',
    rejected: 'bg-red-500 border-red-400 text-white',
    inactive: 'bg-slate-800 border-slate-700 text-slate-500',
  };

  const lineColorMap = {
    done: 'bg-emerald-500',
    active: 'bg-indigo-500',
    rejected: 'bg-red-500',
    inactive: 'bg-slate-700',
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((step, idx) => {
        const stepStatus = getStepStatus(step.key);
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs ${colorMap[stepStatus]}`}>
                {step.icon}
              </div>
              <span className="text-[9px] text-slate-500 mt-0.5 hidden sm:block">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-6 h-0.5 mx-0.5 ${lineColorMap[getStepStatus(steps[idx + 1].key)]}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
