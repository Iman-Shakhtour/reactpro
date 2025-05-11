// src/components/Layout.js
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { HiBell } from "react-icons/hi2";
import Sidebar from "./Sidebar";

// 🔹 Define all role-based links directly here
const adminLinks = [
  { to: "manage-users", label: "Manage Users" },
  { to: "manage-courses", label: "Manage Courses" },
  { to: "manage-scholarships", label: "Manage Scholarships" },
  { to: "stats", label: "System Stats" },
];

const studentLinks = [
  { to: "courses", label: "My Courses" },
  { to: "progress", label: "My Progress" },
  { to: "profile", label: "My Profile" },
  { to: "scholarships", label: "My Scholarships" },
];

const instructorLinks = [
  { to: "/dashboard/instructor/content", label: "Manage Content" },
  { to: "/dashboard/instructor/assignments", label: "Manage Assignments" },
  { to: "/dashboard/instructor/submissions", label: "Submitted Assignments" },
  { to: "/dashboard/instructor/enrolled-students", label: "Enrolled Students" },
  { to: "/dashboard/instructor/edit-profile", label: "Edit Profile" },
];


const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "User";
  const role = token ? jwtDecode(token).role : null;

  const noHeaderRoutes = ["/", "/signup", "/login"];

  const onLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const links =
    role === "ROLE_ADMIN"
      ? adminLinks
      : role === "ROLE_STUDENT"
      ? studentLinks
      : role === "ROLE_INSTRUCTOR"
      ? instructorLinks
      : [];

  if (noHeaderRoutes.includes(location.pathname)) return <Outlet />;

  return (
    <>
      {/* Floating Bell Icon */}
      <div style={iconBox}>
        <HiBell size={22} style={{ cursor: "pointer" }} />
      </div>

      <div style={{ display: "flex" }}>
        <Sidebar
          links={links}
          title="Hayat LMS"
          username={username}
          onLogout={onLogout}
        />

        <main
          style={{
            flex: 1,
            padding: "40px 60px",
            background: "#eef5f8",
            minHeight: "100vh",
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

const iconBox = {
  position: "fixed",
  top: 16,
  right: 24,
  zIndex: 1000,
  color: "black",
};

export default Layout;
