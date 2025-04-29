import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  // الصفحات اللي مش لازم نظهر فيها الهيدر
  const noHeaderRoutes = ["/", "/signup"];
  const shouldShowHeader = token && !noHeaderRoutes.includes(location.pathname);

  return (
    <div>
      {/* ✅ نظهر الهيدر فقط لما لازم */}
      {shouldShowHeader && (
        <header style={headerStyle}>
          <div style={{ fontWeight: "bold", fontSize: "24px" }}>LMS System</div>
          <div>
            👋 {localStorage.getItem("username") || "User"}
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Logout
            </button>
          </div>
        </header>
      )}

      <main style={{ padding: "20px" }}>
        <Outlet /> {/* هون بنعرض الصفحات حسب الراوت */}
      </main>
    </div>
  );
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  backgroundColor: "#6c63ff",
  color: "white",
};

const logoutButtonStyle = {
  marginLeft: "20px",
  padding: "8px 16px",
  backgroundColor: "white",
  color: "#6c63ff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default Layout;
