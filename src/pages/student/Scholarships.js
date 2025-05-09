import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

/* ----------------------------------------------------------------------
   ScholarshipsTabs – طالب
   ----------------------------------------------------------------------
   • تبويب "All Scholarships" ↠ يعرض كل المنح من /api/scholarships
   • تبويب "My Applications" ↠ يعرض طلبات الطالب من /api/scholarship-applications/student/{id}
   • تصميم كروت جذابة + أشرطة تبويب أنيقة
-------------------------------------------------------------------------*/
const ScholarshipsTabs = () => {
  const [tab, setTab] = useState("all"); // all | my
  const [all, setAll] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔄 تحميل المنح والطلبات مرة واحدة */
  useEffect(() => {
    const loadData = async () => {
      try {
        // المنح كلها
        const allRes = await axiosInstance.get("/api/scholarships");
        setAll(allRes.data.map((m) => m.content || m));

        // معرف الطالب
        const stu = await axiosInstance.get("/api/students/me");
        const studentId = stu.data.content?.id ?? stu.data.id;

        // الطلبات الخاصة به
        const appRes = await axiosInstance.get(
          `/api/scholarship-applications/student/${studentId}`
        );
        setApps(appRes.data.map((m) => m.content || m));
      } catch (err) {
        toast.error("❌ Failed to load scholarships.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /* ----------------- تنسيقات سريعة ----------------- */
  const styles = {
    page: { padding: 24 },
    h2: { fontSize: 24, fontWeight: 700, marginBottom: 16 },
    tabs: { display: "flex", gap: 12, marginBottom: 24 },
    tabBtn: (active) => ({
      padding: "8px 16px",
      cursor: "pointer",
      fontWeight: 600,
      borderBottom: active ? "3px solid #6366f1" : "3px solid transparent",
      color: active ? "#111827" : "#6b7280",
    }),
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: 24,
    },
    card: {
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
      overflow: "hidden",
      transition: "transform 0.2s",
      display: "flex",
      flexDirection: "column",
    },
    hover: { transform: "translateY(-4px)" },
    header: {
      background: "linear-gradient(135deg,#6366f1 0%,#7c3aed 100%)",
      color: "#fff",
      padding: "18px 16px",
      fontSize: 18,
      fontWeight: 600,
      textAlign: "center",
    },
    body: { padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 8 },
    row: { display: "flex", justifyContent: "space-between", fontSize: 14 },
    label: { color: "#6b7280" },
    val: { fontWeight: 500 },
    status: (st) => ({
      padding: "4px 10px",
      borderRadius: 12,
      fontSize: 12,
      color: "#fff",
      background:
        st === "APPROVED"
          ? "#22c55e"
          : st === "PENDING"
          ? "#f97316"
          : "#ef4444",
    }),
    empty: { textAlign: "center", color: "#6b7280", marginTop: 40 },
  };

  /* Card للمِنح العامة */
  const ScholarshipCard = ({ s }) => (
    <div
      style={styles.card}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.hover)}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div style={styles.header}>{s.name}</div>
      <div style={styles.body}>
        <div style={styles.row}>
          <span style={styles.label}>💰 Amount</span>
          <span style={styles.val}>${s.totalAmount?.toLocaleString()}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>👥 Slots</span>
          <span style={styles.val}>{s.availableSlots}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>🌍 Region</span>
          <span style={styles.val}>{s.targetRegion || "-"}</span>
        </div>
      </div>
    </div>
  );

  /* Card لطلبات الطالب */
  const ApplicationCard = ({ a }) => (
    <div
      style={styles.card}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.hover)}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div style={styles.header}>{a.scholarshipName || `Scholarship #${a.scholarshipId}`}</div>
      <div style={styles.body}>
        <div style={styles.row}>
          <span style={styles.label}>💵 Requested</span>
          <span style={styles.val}>{a.amount ?? "-"}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>📌 Status</span>
          <span style={styles.status(a.status)}>{a.status}</span>
        </div>
      </div>
    </div>
  );

  const currentList = tab === "all" ? all : apps;

  return (
    <div style={styles.page}>
      <h2 style={styles.h2}>🎓 Scholarships</h2>
      {/* Tabs */}
      <div style={styles.tabs}>
        <span style={styles.tabBtn(tab === "all")} onClick={() => setTab("all")}>All Scholarships</span>
        <span style={styles.tabBtn(tab === "my")} onClick={() => setTab("my")}>My Applications</span>
      </div>

      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : currentList.length === 0 ? (
        <p style={styles.empty}>{tab === "all" ? "No scholarships." : "No applications yet."}</p>
      ) : (
        <div style={styles.grid}>
          {tab === "all"
            ? currentList.map((s) => <ScholarshipCard key={s.id} s={s} />)
            : currentList.map((a) => <ApplicationCard key={a.id} a={a} />)}
        </div>
      )}
    </div>
  );
};

export default ScholarshipsTabs;
