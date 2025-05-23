// src/components/Sidebar.js
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  HiArrowRightOnRectangle,
  HiBars3,
  HiDocumentText
} from "react-icons/hi2";
import { useSidebar } from "./SidebarContext";
import "./Sidebar.css";

const Sidebar = ({ links, onLogout = () => {} }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [username, setUsername] = useState("User");
  const [avatar, setAvatar] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const updateSidebar = () => {
      setUsername(localStorage.getItem("username") || "User");
      setAvatar(localStorage.getItem("profileImage") || null);
      setRole(localStorage.getItem("role") || ""); // ✅ قراءة الدور من التخزين
    };
    updateSidebar();
    window.addEventListener("profileUpdated", updateSidebar);
    window.addEventListener("storage", updateSidebar);
    return () => {
      window.removeEventListener("profileUpdated", updateSidebar);
      window.removeEventListener("storage", updateSidebar);
    };
  }, []);

  // ✅ بناء قائمة الروابط مع إضافة رابط الطلبات للإدمن فقط
  const internalLinks = [
    ...(links || []),
    ...(role === "ROLE_ADMIN"
      ? []
      : [])
  ];

  return (
    <aside className="sidebar" style={{ width: isSidebarOpen ? 300 : 100 }}>
      <div className="sidebar-toggle">
        <HiBars3
          size={24}
          onClick={toggleSidebar}
          style={{ cursor: "pointer", color: "#5C4634" }}
        />
      </div>

      {isSidebarOpen && (
        <>
          <div className="sidebar-logo">Hayat&nbsp;LMS</div>
          <div className="sidebar-card">
            <img
              src={
                avatar ||
                `https://api.dicebear.com/6.x/bottts/svg?seed=${username}`
              }
              alt="avatar"
              className="sidebar-avatar"
            />
            <span className="sidebar-hello">{username.split(" ")[0]}</span>
          </div>
        </>
      )}

      <nav className="sidebar-nav">
        {internalLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            end
            title={!isSidebarOpen ? label : ""}
          >
            {icon && <span style={{ marginRight: isSidebarOpen ? 10 : 0 }}>{icon}</span>}
            {isSidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {isSidebarOpen && (
        <button onClick={onLogout} className="sidebar-logout sidebar-link">
          <HiArrowRightOnRectangle size={18} style={{ marginRight: 12 }} />
          Log&nbsp;out
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
