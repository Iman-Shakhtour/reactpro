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
    <nav style={{ backgroundColor: "#6a0dad", padding: "10px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h2 style={{ margin: 0 }}>LMS System</h2>
      </div>
      {token && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "20px" }}>👋 {username}</span>
          <button
            onClick={handleLogout}
            style={{
              background: "white",
              color: "#6a0dad",
              border: "none",
              padding: "8px 15px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

