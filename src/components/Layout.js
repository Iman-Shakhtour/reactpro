import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { adminLinks, studentLinks, instructorLinks } from "../utils/sidebarLinks";
import Footer from "./Footer";
import Navbar from "./Navbar";
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
      {/* ✅ جرس الإشعارات */}
      <div style={floatingBellStyle}>
        <NotificationBell />
      </div>

 <Navbar /> {/* ⬅️ render the navbar */}
    <div style={{ display: "flex" }}>
      <Sidebar
        links={links}
        title="Hayat"
        username={username}
        onLogout={onLogout}
      />
      ...
    </div>
    
      <div style={{ display: "flex" }}>
        <Sidebar
          links={links}
          title="Hayat"
          username={username}
          onLogout={onLogout}
        />

        {/* ✅ هذا هو التعديل المهم */}
        <div style={contentWrapper}>
          <main style={mainStyle}>
            <Outlet />
          </main>
          <Footer />
        </div>
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

const contentWrapper = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  height: "100vh", // ✅ ضروري عشان الفوتر ينزل تحت
};

const mainStyle = {
  flex: 1, // ✅ يخلي المحتوى يتمدد والباقي للفوتر
  padding: "80px 350px 40px", // ✅ أضفنا margin من الأعلى
  background: "#F9F9F6",
  overflowY: "auto",
  overflowX: "hidden",
};

export default Layout;
