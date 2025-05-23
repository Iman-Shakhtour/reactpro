
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  HiArrowRightOnRectangle,
  HiBars3
} from "react-icons/hi2";
import { useSidebar } from "./SidebarContext";

const Sidebar = ({ links, onLogout = () => {} }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [username, setUsername] = useState("User");
  const [avatar, setAvatar] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const updateSidebar = () => {
      setUsername(localStorage.getItem("username") || "User");
      setAvatar(localStorage.getItem("profileImage") || null);
      setRole(localStorage.getItem("role") || "");
    };
    updateSidebar();
    window.addEventListener("profileUpdated", updateSidebar);
    window.addEventListener("storage", updateSidebar);
    return () => {
      window.removeEventListener("profileUpdated", updateSidebar);
      window.removeEventListener("storage", updateSidebar);
    };
  }, []);

  const internalLinks = [...(links || [])];

  return (
    <aside
      className="d-flex flex-column bg-light p-3"
      style={{
        width: isSidebarOpen ? "280px" : "100px",
        transition: "width 0.3s ease",
        height: "100vh",
        borderRadius: "12px",
        boxShadow: "5px 0 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* زر التبديل */}
      <div className="text-center mb-3">
        <HiBars3
          size={24}
          onClick={toggleSidebar}
          style={{ cursor: "pointer", color: "#5C4634" }}
        />
      </div>

      {/* شعار + صورة المستخدم */}
      {isSidebarOpen && (
        <>
          <h4 className="text-center fw-bold mb-4" style={{ color: "#E9DCAA" }}>
            Hayat LMS
          </h4>
          <div
            className="d-flex align-items-center rounded p-3 mb-4"
            style={{ backgroundColor: "#CCE3C0" }}
          >
            <img
              src={
                avatar ||
                `https://api.dicebear.com/6.x/bottts/svg?seed=${username}`
              }
              alt="avatar"
              className="rounded-circle me-3"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
              }}
            />
            <span className="fw-semibold text-dark">
              {username.split(" ")[0]}
            </span>
          </div>
        </>
      )}

      {/* روابط التنقل */}
      <nav className="nav flex-column gap-3">
        {internalLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `btn d-flex align-items-center text-start ${
                isActive ? "fw-bold shadow-sm" : "fw-medium"
              } ${isSidebarOpen ? "px-3" : "justify-content-center"}`
            }
            style={{
              backgroundColor: "#CCE3C0",
              color: "#3B3B3B",
              height: "48px",
              borderRadius: "10px",
              textDecoration: "none",
            }}
            title={!isSidebarOpen ? label : ""}
            end
          >
            <span className="me-2">{icon}</span>
            {isSidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* زر تسجيل الخروج — مرفوع شوي عن الحافة */}
      <div className="mt-4" style={{ marginTop: "auto", paddingBottom: "20px" }}>
        <button
          onClick={onLogout}
          className={`btn d-flex align-items-center justify-content-center ${
            isSidebarOpen ? "w-100" : ""
          }`}
          style={{
            backgroundColor: "#E9DCAA",
            color: "#5C4634",
            borderRadius: "10px",
            fontWeight: "bold",
            height: "48px",
            marginInline: isSidebarOpen ? 0 : "auto",
            width: isSidebarOpen ? "100%" : "48px",
          }}
          title={!isSidebarOpen ? "Log out" : ""}
        >
          <HiArrowRightOnRectangle size={20} />
          {isSidebarOpen && <span className="ms-2">Log out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

