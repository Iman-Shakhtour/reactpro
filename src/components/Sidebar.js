import { NavLink } from "react-router-dom";

const Sidebar = ({ links = [], title = "Dashboard" }) => {
  return (
    <aside style={sidebarStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <nav style={linkContainer}>
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            style={getLinkStyle}
            end // مهم إذا كنت تستخدم nested routes
          >
            {icon} <span style={{ marginLeft: "10px" }}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const sidebarStyle = {
  height: "100vh",             // ⬅️ يغطي طول الشاشة
  width: "240px",
  backgroundColor: "#4B3FEC", // نفس لون navbar
  color: "white",
  padding: "30px 20px",
  display: "flex",
  flexDirection: "column",
  position: "fixed",           // ⬅️ ثابت عالشمال
  top: 0,
  left: 0,
  borderTopRightRadius: "20px",   // زاوية علوية ناعمة
  borderBottomRightRadius: "20px",
  boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)", // ظل ناعم من اليمين
};

const titleStyle = {
  margin: 0,
  marginTop: "70px",     // ⬅️ نزله لتحت

  marginBottom: "70px",
  fontSize: "22px",
  fontWeight: "bold",
};

const linkContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const getLinkStyle = ({ isActive }) => ({
  color: isActive ? "#4B3FEC" : "white",
  backgroundColor: isActive ? "white" : "transparent",
  padding: "20px 15px", // ⬅️ زيدنا حجم البادينغ
  borderRadius: "50px", // ⬅️ ممكن تخلي الزوايا أنعم
  fontSize: "20px",     // ⬅️ كبر الخط
  textDecoration: "none",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  transition: "0.3s",
});

export default Sidebar;
