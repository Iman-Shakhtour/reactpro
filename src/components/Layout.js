import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { HiBell } from "react-icons/hi2";
import Sidebar from "./Sidebar";
import { adminLinks, studentLinks } from "../utils/sidebarLinks";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "User";
  const role = token ? jwtDecode(token).role : null;

  const noHeaderRoutes = ["/", "/signup"];

  const onLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const links =
    role === "ROLE_ADMIN"
      ? adminLinks
      : role === "ROLE_STUDENT"
      ? studentLinks
      : [];

  if (noHeaderRoutes.includes(location.pathname)) return <Outlet />;

  return (
    <>
      <div style={iconBox}>
        <HiBell size={22} style={{ cursor: "pointer", color: "#5C4634" }} />
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

const iconBox = {
  position: "fixed",
  top: 16,
  right: 24,
  zIndex: 1000,
};

const mainStyle = {
  flex: 1,
  padding: "40px 60px",
  background: "#F9F9F6", // خلفية ناعمة مريحة للعين
  minHeight: "100vh",
  overflowX: "hidden",
};

export default Layout;
