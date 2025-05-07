import { HiBell, HiChatBubbleLeftRight } from "react-icons/hi2";

const Navbar = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;        // إخفاء الهيدر في صفحات غير محمية

  return (
    <header style={header}>
      <div />                     {/* يسار الهيدر فارغ */}
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
  background: "transparent",
  zIndex: 999,
};

const icons = { display: "flex", gap: 18 };
const icon  = { cursor: "pointer" };

export default Navbar;
