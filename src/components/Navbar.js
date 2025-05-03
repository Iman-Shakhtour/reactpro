import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toast.success("✅ Logged out successfully!");
    navigate("/");
  };

  return (
    <nav style={navbarStyle}>
<div style={brandStyle}>LMS System</div>
      {token && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "20px" }}>👋 {username}</span>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};
const brandStyle = {
  fontWeight: "bold",
  fontSize: "40px",   // ⬅️ كبر الخط
  marginLeft: "0px",  // ⬅️ ما في مسافة من اليسار
};

const navbarStyle = {
  height: "60px",
  backgroundColor: "#4B3FEC", // نفس لون السايدبار
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 30px",
  position: "fixed",
  top: 0,
  left: "0px", // ⬅️ يبدأ بعد عرض السايدبار
  right: 0,
  zIndex: 1000,
  
};

const logoutButtonStyle = {
  backgroundColor: "white",
  color: "#4B3FEC",
  border: "none",
  padding: "8px 15px",
  borderRadius: "50px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Navbar;
