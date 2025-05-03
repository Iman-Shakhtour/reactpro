import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const StudentDashboard = () => {
  const studentLinks = [
    { to: "courses", label: "My Courses", icon: "📚" },
    { to: "progress", label: "My Progress", icon: "📈" },
    { to: "profile", label: "My Profile", icon: "🙍‍♂️" },
    { to: "scholarships", label: "My Scholarships", icon: "🎓" },
  ];

  return (
    <div style={containerStyle}>
      <Sidebar links={studentLinks} title="Student Panel" />

      <div style={contentStyle}>
        <h2>🎓 Student Dashboard</h2>
        <p>Welcome Student! Use the sidebar to navigate.</p>

        <div style={{ marginTop: "30px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  display: "flex",
};

const contentStyle = {
  marginLeft: "240px", // نفس عرض السايدبار
  padding: "30px",
  flex: 1,
};

export default StudentDashboard;
