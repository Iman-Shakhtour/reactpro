import { HiChatBubbleLeftRight } from "react-icons/hi2";
import NotificationBell from "./NotificationBell"; // ✅ استدعاء الجرس

const Navbar = () => {
  const token = localStorage.getItem("token");

  // إخفاء الهيدر في الصفحات العامة
  if (!token) return null;

  return (
    <header style={header}>
      <div >
        {/* ✅ الجرس التفاعلي */}
        {/* أيقونة الدردشة أو الملاحظات */}
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
  background: "#F9F9F6",

  zIndex: 999,
};

const logo = {
  fontSize: 20,
  fontWeight: 600,
  color: "#5C4634", // Cookies & Cream text
  fontFamily: "'Quicksand', sans-serif",
};


const icon = {
  cursor: "pointer",
  color: "#5C4634",
};

export default Navbar;