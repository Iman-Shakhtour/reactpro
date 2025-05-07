import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const username = localStorage.getItem("username") || "User";

  return (
    <div style={{ padding: "30px 60px" }}>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      <p>Welcome&nbsp;Back,&nbsp;{username}</p>

      <Outlet />
    </div>
  );
};

export default AdminDashboard;
