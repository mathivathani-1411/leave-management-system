// src/pages/TeacherDashboard.jsx
import ApprovalDashboard from '../components/ApprovalDashboard';

export default function TeacherDashboard() {
  return (
    <ApprovalDashboard
      role="teacher"
      title="Teacher Dashboard"
      icon="👨‍🏫"
      description="Review and action student leave requests at the first approval level"
    />
  );
}
