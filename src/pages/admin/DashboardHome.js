// src/pages/admin/DashboardHome.js
const DashboardHome = () => {
  const username = localStorage.getItem("username") || "Admin";
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome Back, {username}</p>
    </div>
  );
};

export default DashboardHome;
