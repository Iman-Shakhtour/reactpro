import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { HiBell } from "react-icons/hi2";
import Sidebar from "./Sidebar";
import { adminLinks, studentLinks } from "../utils/sidebarLinks";

const Layout = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const token     = localStorage.getItem("token");
  const username  = localStorage.getItem("username") || "User";
  const role      = token ? jwtDecode(token).role : null;

  /* صفحات بدون شريط جانبي */
  const noHeaderRoutes = ["/", "/signup"];

  const onLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const links =
    role === "ROLE_ADMIN"   ? adminLinks
  : role === "ROLE_STUDENT" ? studentLinks
  : [];

  /* صفحات الهبوط */
  if (noHeaderRoutes.includes(location.pathname)) return <Outlet />;

  return (
    <>
      {/* أيقونة إشعار ثابتة */}
      <div style={iconBox}>
        <HiBell size={22} style={{ cursor: "pointer" }} />
      </div>

      <div style={{ display: "flex" /* بدون paddingTop */ }}>
        <Sidebar
          links={links}
          title="Hayat"
          username={username}
          id="E79307"
          onLogout={onLogout}
        />

        <main
          style={{
            marginLeft: 300,
            flex: 1,
            padding: "40px 60px",
            background: "#eef5f8",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

/* أيقونة عائمة */
const iconBox = {
  position: "fixed",
  top: 16,
  right: 24,
  zIndex: 1000,
  color: "black",
};

export default Layout;
