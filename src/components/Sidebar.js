import { NavLink } from "react-router-dom";
import {
  HiUserGroup,
  HiBookOpen,
  HiAcademicCap,
  HiChartBar,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

/* ---------- CONFIG ---------- */
const BLUE  = "#001943";
const SKY   = "#d6ecff";
const SKY_H = "#bfe1ff";
const BTN_H = 48;
const FONT  = { fontFamily: "'Inter', sans-serif", fontWeight: 300 };

/* ---------- COMPONENT ---------- */
const Sidebar = ({ links, title, username = "User", onLogout = () => {} }) => (
  <aside style={st.wrapper}>
    {/* الشعار */}
    <div style={st.logo}>
      <span style={st.logoText}>Hayat&nbsp;LMS</span>
    </div>

    {/* بطاقة المستخدم */}
    <div style={st.card}>
      <img
        src={
          localStorage.getItem("profileImage") ||
          `https://api.dicebear.com/6.x/bottts/svg?seed=${username}`
        }
        alt="avatar"
        style={st.avatar}
      />
      <span style={st.hello}>Hi,&nbsp;{username}</span>
    </div>

    {/* روابط الملاحة */}
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

    {/* زر تسجيل الخروج */}
    <button onClick={onLogout} style={logoutBtn}>
      <HiArrowRightOnRectangle size={18} style={{ marginRight: 12 }} />
      Log&nbsp;out
    </button>
  </aside>
);

/* ---------- STYLES ---------- */
const st = {
  wrapper: {
    ...FONT,
    width: 300,
    height: "100vh",
    background: BLUE,
    color: "white",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    borderRadius: 12,
    boxSizing: "border-box",
  },
  logo: {
    marginBottom: 32,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 600,
    fontFamily: "'Quicksand', sans-serif",
  },
  card: {
    alignSelf: "center",
    width: "85%",
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#002357",
    padding: 14,
    borderRadius: 10,
    marginBottom: 36,
  },
  avatar: { width: 50, height: 50, borderRadius: "50%" },
  hello:  { fontSize: 15, fontWeight: 500 },
  nav:    { display: "flex", flexDirection: "column", gap: 18 },
};

/* زر NavLink */
const mainBtn = (active) => ({
  width: "85%",
  height: BTN_H,
  alignSelf: "center",
  display: "flex",
  alignItems: "center",
  background: active ? SKY_H : SKY,
  color: BLUE,
  paddingLeft: 18,
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 500,
  textDecoration: "none",
  transition: ".15s",
});

/* زر Log‑out */
const logoutBtn = {
  ...mainBtn(false),
  background: "#ffefef",
  color: "#c0392b",
  border: "none",
  cursor: "pointer",
};

export default Sidebar;
