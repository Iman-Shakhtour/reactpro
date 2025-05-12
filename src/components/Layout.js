import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { HiBell } from "react-icons/hi2";
import Sidebar from "./Sidebar";
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

  // Choose sidebar links based on role
  let links = [];
  if (role === "ROLE_ADMIN") {
    links = adminLinks;
  } else if (role === "ROLE_STUDENT") {
    links = studentLinks;
  } else if (role === "ROLE_INSTRUCTOR") {
    links = instructorLinks;
  }

  // Don't render header/sidebar on public routes
  if (noHeaderRoutes.includes(location.pathname)) {
    return <Outlet />;
  }

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

        <main style={mainStyle}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

/* ---------- STYLES ---------- */
const iconBox = {
  position: "fixed",
  top: 16,
  right: 24,
  zIndex: 1000,
  color: "black",
};

const mainStyle = {
  flex: 1,
  padding: "40px 60px",
  background: "#eef5f8",
  minHeight: "100vh",
};

export default Layout;
