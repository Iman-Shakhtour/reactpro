import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { adminLinks, studentLinks, instructorLinks } from "../utils/sidebarLinks";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

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
      {/* 🔔 جرس الإشعارات */}
<div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <NotificationBell />
      </div>

      <Navbar />

<div
  className="d-flex"
  style={{ height: "calc(100vh - 56px)", marginTop: "56px" }}
>
  {/* ✅ Sidebar مساحة ثابتة */}
  <div className="bg-light" style={{ width: "250px", minWidth: "250px", borderRight: "none" }}>
    <Sidebar
      links={links}
      title="Hayat"
      username={username}
      onLogout={onLogout}
    />
  </div>

        {/* ✅ Main content مع scroll */}
 <div
    className="flex-grow-1 d-flex flex-column"
    style={{ paddingInlineStart: "40px" }} // ✅ هنا التعديل
  >
      <main className="flex-grow-1 p-4" style={{ overflowY: "auto", background: "#F9F9F6" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  </div>
</>
);
};

export default Layout;

    
