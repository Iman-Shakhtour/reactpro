import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

/* ---------- COLORS ---------- */
const COLOR_SIDEBAR_BG = "#A9BA9D",
      COLOR_CARD_BG    = "#CCE3C0",
      COLOR_HIGHLIGHT  = "#E9DCAA",
      COLOR_TEXT       = "#3B3B3B",
      COLOR_LOGOUT_BG  = "#E9DCAA",
      COLOR_LOGOUT_TX  = "#5C4634";

const BTN_H = 48;
const FONT  = { fontFamily: "'Inter',sans-serif", fontWeight: 300 };

const Sidebar = ({ links, onLogout = () => {} }) => {
  const [username, setUsername] = useState("User");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const updateSidebar = () => {
      setUsername(localStorage.getItem("username") || "User");
      setAvatar(localStorage.getItem("profileImage") || null);
    };

    updateSidebar();

    window.addEventListener("profileUpdated", updateSidebar);
    window.addEventListener("storage", updateSidebar);

    return () => {
      window.removeEventListener("profileUpdated", updateSidebar);
      window.removeEventListener("storage", updateSidebar);
    };
  }, []);

  return (
    <aside style={st.wrapper}>
      <div style={st.logo}><span style={st.logoText}>Hayat&nbsp;LMS</span></div>

      <div style={st.card}>
        <img
          src={
            avatar ||
            `https://api.dicebear.com/6.x/bottts/svg?seed=${username}`
          }
          alt="avatar"
          style={st.avatar}
        />
        <span style={st.hello}>&nbsp;{username.split(" ")[0]}</span>
      </div>

      <nav style={st.nav}>
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => mainBtn(isActive)}
            end
          >
            {icon && <span style={{ marginRight: 10 }}>{icon}</span>}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      <button onClick={onLogout} style={logoutBtn}>
        <HiArrowRightOnRectangle size={18} style={{ marginRight: 12 }} />
        Log&nbsp;out
      </button>
    </aside>
  );
};

/* ---------- STYLES ---------- */
const st = {
  wrapper: {
    ...FONT,
    position: "fixed",
    top: 0,
    left: 0,
    width: 300,
    height: "100vh",
    background: COLOR_SIDEBAR_BG,
    color: COLOR_TEXT,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    borderRadius: 12,
    boxSizing: "border-box"
  },
  logo: { marginBottom: 32 },
  logoText: {
    fontSize: 32,
    fontWeight: 600,
    color: COLOR_HIGHLIGHT,
    fontFamily: "'Quicksand',sans-serif"
  },
  card: {
    alignSelf: "center",
    width: "85%",
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: COLOR_CARD_BG,
    padding: 14,
    borderRadius: 10,
    marginBottom: 36
  },
  avatar: { width: 50, height: 50, borderRadius: "50%" },
  hello:  { fontSize: 15, fontWeight: 500 },
  nav:    { display: "flex", flexDirection: "column", gap: 18 }
};

const mainBtn = active => ({
  width: "85%",
  height: BTN_H,
  alignSelf: "center",
  display: "flex",
  alignItems: "center",
  background: active ? COLOR_HIGHLIGHT : COLOR_CARD_BG,
  color: COLOR_TEXT,
  paddingLeft: 18,
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 500,
  textDecoration: "none",
  transition: ".15s"
});

const logoutBtn = {
  ...mainBtn(false),
  background: COLOR_LOGOUT_BG,
  color: COLOR_LOGOUT_TX,
  border: "none",
  cursor: "pointer"
};

export default Sidebar;
