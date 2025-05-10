import React, { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
import { toast } from "react-toastify";

const ScholarshipsTabs = () => {
  const [tab, setTab] = useState("all"); // all | my
  const [all, setAll] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sch, stu] = await Promise.all([
          studentApi.getScholarships(),
          studentApi.getProfile(),
        ]);
        setAll(sch.data.map((m) => m.content || m));
        const id = stu.data.content?.id ?? stu.data.id;
        const appRes = await studentApi.getMyApplications(id);
        setApps(appRes.data.map((m) => m.content || m));
      } catch {
        toast.error("❌ Failed to load scholarships.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ---------- styles ---------- */
  const st = {
    page: { padding: 24 },
    tabs: { display: "flex", gap: 12, marginBottom: 24 },
    tab: (a) => ({
      padding: "8px 16px",
      cursor: "pointer",
      fontWeight: 600,
      borderBottom: a ? "3px solid #6366f1" : "3px solid transparent",
      color: a ? "#111827" : "#6b7280",
    }),
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
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
    body: { padding: 16, display: "flex", flexDirection: "column", gap: 8 },
    row: { display: "flex", justifyContent: "space-between" },
    status: (s) => ({
      padding: "4px 10px",
      borderRadius: 12,
      fontSize: 12,
      color: "#fff",
      background: s === "APPROVED" ? "#22c55e" : s === "PENDING" ? "#f97316" : "#ef4444",
    }),
  };

  const ScholarshipCard = ({ s }) => (
    <div
      style={st.card}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, st.hover)}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div style={st.header}>{s.name}</div>
      <div style={st.body}>
        <div style={st.row}>
          <span>💰 Amount</span>
          <span>${s.totalAmount?.toLocaleString()}</span>
        </div>
        <div style={st.row}>
          <span>👥 Slots</span>
          <span>{s.availableSlots}</span>
        </div>
        <div style={st.row}>
          <span>🌍 Region</span>
          <span>{s.targetRegion || "-"}</span>
        </div>
      </div>
    </div>
  );

  const ApplicationCard = ({ a }) => (
    <div
      style={st.card}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, st.hover)}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div style={st.header}>{a.scholarshipName || `Scholarship #${a.scholarshipId}`}</div>
      <div style={st.body}>
        <div style={st.row}>
          <span>💵 Requested</span>
          <span>{a.amount ?? "-"}</span>
        </div>
        <div style={st.row}>
          <span>📌 Status</span>
          <span style={st.status(a.status)}>{a.status}</span>
        </div>
      </div>
    </div>
  );

  const list = tab === "all" ? all : apps;

  return (
    <div style={st.page}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>🎓 Scholarships</h2>

      {/* Tabs */}
      <div style={st.tabs}>
        <span style={st.tab(tab === "all")} onClick={() => setTab("all")}>
          All Scholarships
        </span>
        <span style={st.tab(tab === "my")} onClick={() => setTab("my")}>
          My Applications
        </span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p>{tab === "all" ? "No scholarships." : "No applications yet."}</p>
      ) : (
        <div style={st.grid}>
          {tab === "all"
            ? list.map((s) => <ScholarshipCard key={s.id} s={s} />)
            : list.map((a) => <ApplicationCard key={a.id} a={a} />)}
        </div>
      )}
    </div>
  );
};

export default ScholarshipsTabs;
