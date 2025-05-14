import { HiBell, HiChatBubbleLeftRight } from "react-icons/hi2";

const Navbar = () => {
  const token = localStorage.getItem("token");

  // إخفاء الهيدر في الصفحات العامة
  if (!token) return null;

  return (
    <header style={header}>
      <span style={logo}>Hayat LMS</span>
      <div style={icons}>
        <HiBell size={22} style={icon} />
        <HiChatBubbleLeftRight size={22} style={icon} />
      </div>
    </header>
  );
};

/* ---------- styles ---------- */
const header = {
  height: 60,
  width: "100%",
  position: "fixed",
  top: 0,
  left: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
  background: "#CCE3C0", // Tea Green
  color: "#3B3B3B",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  zIndex: 999,
};

const logo = {
  fontSize: 20,
  fontWeight: 600,
  color: "#5C4634", // Cookies & Cream text
  fontFamily: "'Quicksand', sans-serif",
};

const icons = {
  display: "flex",
  gap: 18,
};

const icon = {
  cursor: "pointer",
  color: "#5C4634", // متناسق مع التصميم
};

export default Navbar;
