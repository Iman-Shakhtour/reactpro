// src/components/Layout.js
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { jwtDecode } from "jwt-decode";
import { studentLinks, adminLinks } from "../utils/sidebarLinks";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = token ? jwtDecode(token).role : null;

  const noHeaderRoutes = ["/", "/signup"];
  const shouldShowHeader = token && !noHeaderRoutes.includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  

  let links = [];
  if (role === "ROLE_STUDENT") links = studentLinks;
  if (role === "ROLE_ADMIN") links = adminLinks;

  // ممكن تضيف روابط لباقي الرولز هون كمان

  return (
    <div>
      {shouldShowHeader && <Navbar />}

      {shouldShowHeader ? (
        <div style={{ display: "flex" }}>
          <Sidebar links={links} title="Student" />
          <div style={{ marginLeft: "50px", paddingTop: "80px", padding: "40px 40px" }}>
  <Outlet />
</div>

      
        </div>
      ) : (
        <Outlet /> // لما ما في توكن، زي صفحات اللوج إن
      )}
    </div>
  );
};

export default Layout;
