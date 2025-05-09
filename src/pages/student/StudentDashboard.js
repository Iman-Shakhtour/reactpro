import { Outlet } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <div>
      <h2>My  Dashboard</h2>

      <div style={{ marginTop: "30px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default StudentDashboard;
