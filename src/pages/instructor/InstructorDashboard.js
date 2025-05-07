// src/pages/instructor/InstructorDashboard.js
import { Outlet } from "react-router-dom";

const InstructorDashboard = () => {
  const username = localStorage.getItem("username") || "Instructor";

  return (
    <div style={{ padding: "30px 60px" }}>
      <h1 style={{ marginTop: 0 }}>Instructor Dashboard</h1>
      <p>Welcome&nbsp;Back,&nbsp;{username}</p>

      <Outlet />
    </div>
  );
};

export default InstructorDashboard;
