import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell"; // ✅ الجرس التفاعلي
import { adminLinks, studentLinks, instructorLinks } from "../utils/sidebarLinks";

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
      {/* ✅ جرس الإشعارات العائم */}
      <div style={floatingBellStyle}>
        <NotificationBell />
      </div>

      <div style={{ display: "flex" }}>
        <Sidebar
          links={links}
          title="Hayat"
          username={username}
          onLogout={onLogout}
        />

        <main style={mainStyle}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

/* ---------- STYLES ---------- */
const floatingBellStyle = {
  position: "fixed",
  top: 16,
  right: 24,
  zIndex: 1000,
};

const mainStyle = {
  marginLeft: 300,
  flex: 1,
  height: "100vh",
  padding: "40px 60px",
  background: "#F9F9F6",
  overflowY: "auto",
  overflowX: "hidden",
};

export default Layout;
