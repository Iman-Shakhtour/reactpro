import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const InstructorDashboard = () => {
  const instructorLinks = [
    { to: "upload-content", label: "Upload Content", icon: "📤" },
    { to: "assignments", label: "Manage Assignments", icon: "📝" },
    { to: "submissions", label: "Submitted Assignments", icon: "📄" },
    { to: "uploaded-content", label: "Uploaded Content", icon: "📂" },
    { to: "enrolled-students", label: "Enrolled Students", icon: "👥" },
    { to: "edit-profile", label: "Edit Profile", icon: "🛠️" },
  ];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar links={instructorLinks} title="Instructor Panel" />
      <div style={{ marginLeft: "240px", padding: "30px", flex: 1 }}>
        <h2>👨‍🏫 Instructor Dashboard</h2>
        <p>Welcome Instructor! Use the sidebar to manage your tasks.</p>
        <div style={{ marginTop: "30px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
