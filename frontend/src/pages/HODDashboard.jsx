// src/pages/HODDashboard.jsx
import ApprovalDashboard from '../components/ApprovalDashboard';

export default function HODDashboard() {
  return (
    <ApprovalDashboard
      role="hod"
      title="HOD Dashboard"
      icon="🏛️"
      description="Review teacher-approved leave requests for secondary authorization"
    />
  );
}
