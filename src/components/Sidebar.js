// src/components/Sidebar.js
import { NavLink }                       from "react-router-dom";
import {
  HiUserGroup,
  HiBookOpen,
  HiAcademicCap,
  HiChartBar,
  HiCog,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

/* ---------- CONFIG ---------- */
const BLUE  = "#001943";
const SKY   = "#d6ecff";
const SKY_H = "#bfe1ff";
const BTN_H = 48;
const FONT  = { fontFamily: "'Inter', sans-serif", fontWeight: 300 };

/* ---------- COMPONENT ---------- */
const Sidebar = ({ links, title, username, onLogout }) => (
  <aside style={st.wrapper}>
<div style={st.logo}>
  
  <span style={st.logoText}>Hayat LMS</span>
</div>




    {/* بطاقة المستخدم */}
    <div style={st.card}>
      <img
        src={`https://api.dicebear.com/6.x/bottts/svg?seed=${username}`}
        alt="avatar"
        style={st.avatar}
      />
      <span style={st.hello}>Hi,&nbsp;{username}</span>
    </div>

    {/* الملاحة + Settings */}
    <nav style={st.nav}>
      {links.map(({ to, label }) => (
        <NavLink key={to} to={to} end style={mainBtn}>
          {iconPicker[label]} <span style={{ marginLeft: 12 }}>{label}</span>
        </NavLink>
      ))}

      {/* Settings أصبح هنا مباشرةً بعد System Stats */}
      <NavLink to="#" style={mainBtn({ isActive: false })}>
        <HiCog size={18} style={{ marginRight: 12 }} /> Settings
      </NavLink>
    </nav>

    <div style={{ flex: 1 }} />

    {/* Log‑out بالأسفل كما هو */}
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
    boxShadow: "0 0 0 2px #00a3ff",
    boxSizing: "border-box",
  },
  brand: {
    margin: 0,
    marginBottom: 32,
    fontSize: 28,        /* أكبر قليلاً */
    fontWeight: 500,
    letterSpacing: 1,
  },
  card: {
    alignSelf: "center",
    width: "79%",        /* نفس عرض الأزرار */
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
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  
  
  logoText: {
    alignItems: "center",
    fontSize: 35,
    fontWeight: 600,
    letterSpacing: "0.5px",
    fontFamily: "'Quicksand', sans-serif",  // أو 'Nunito'
    
  
  },
  
  
};

/* زر الملاحة الرئيسى (و Settings) */
const mainBtn = ({ isActive = false } = {}) => ({
  alignSelf: "center",
  width: "85%",               /* أضيق من كامل السايدبار */
  height: BTN_H,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  background: isActive ? SKY_H : SKY,
  color: BLUE,
  paddingLeft: 18,
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 500,
  textDecoration: "none",
  transition: ".15s",
}
);

/* زر Log‑out */
const logoutBtn = {
  ...mainBtn(),
  background: "#ffefef",
  color: "#c0392b",
  border: "none",
  cursor: "pointer",
  width:150,
  

};

/* ---------- ICON MAPPER ---------- */
const iconPicker = {
  "Manage Users":        <HiUserGroup size={18} />,
  "Manage Courses":      <HiBookOpen   size={18} />,
  "Manage Scholarships": <HiAcademicCap size={18} />,
  "System Stats":        <HiChartBar   size={18} />,
};

export default Sidebar;
