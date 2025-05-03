import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar"; // تحقق من المسار الصحيح

const AdminDashboard = () => {
  const adminLinks = [
    { to: "manage-users", label: "Manage Users", icon: "👥" },
    { to: "manage-courses", label: "Manage Courses", icon: "📚" },
    { to: "manage-scholarships", label: "Manage Scholarships", icon: "🎓" },
    { to: "stats", label: "System Stats", icon: "📊" },
  ];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar links={adminLinks} title="Admin Panel" />
      <div style={{ marginLeft: "240px", padding: "30px", flex: 1 }}>
        <h2> Admin Dashboard</h2>
        <p>Welcome Admin! Use the sidebar to navigate.</p>
        <div style={{ marginTop: "30px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
