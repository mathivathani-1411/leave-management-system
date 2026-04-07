// src/pages/PrincipalDashboard.jsx
import ApprovalDashboard from '../components/ApprovalDashboard';

export default function PrincipalDashboard() {
  return (
    <ApprovalDashboard
      role="principal"
      title="Principal Dashboard"
      icon="🏫"
      description="Final approval authority — HOD-approved requests require your decision"
    />
  );
}
