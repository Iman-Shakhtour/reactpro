import { Outlet } from "react-router-dom";

const StudentDashboard = () => (
  <div>
    <h2>🎓 Student Dashboard</h2>
    <div style={{ marginTop: 30 }}>
      <Outlet />
    </div>
  </div>
);

export default StudentDashboard;
