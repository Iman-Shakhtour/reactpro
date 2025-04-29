import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>👑 Admin Dashboard</h2>
      <p>Welcome Admin! Manage users, courses, donations, and system settings.</p>

      <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <Link to="/dashboard/manage-users" style={linkStyle}>
          👥 Manage Users
        </Link>
        <Link to="/dashboard/manage-courses" style={linkStyle}>
          📚 Manage Courses
        </Link>
        <Link to="/dashboard/manage-scholarships" style={linkStyle}>
          🎓 Manage Scholarships
        </Link>
        <Link to="/dashboard/stats" style={linkStyle}>
          📊 View System Statistics
        </Link>
      </div>
    </div>
  );
};

const linkStyle = {
  padding: "12px 20px",
  backgroundColor: "#6c63ff",
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
  borderRadius: "8px",
  textAlign: "center",
  width: "250px",
};

export default AdminDashboard;
