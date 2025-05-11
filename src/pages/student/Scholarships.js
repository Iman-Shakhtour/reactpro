import React, { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
import { toast } from "react-toastify";
import "./Scholarships.css";

const Scholarships = () => {
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

  const ScholarshipCard = ({ s }) => (
    <div
      className="card"
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div className="card-header">{s.name}</div>
      <div className="card-body">
        <div className="card-row">
          <span>💰 Amount</span>
          <span>${s.totalAmount?.toLocaleString()}</span>
        </div>
        <div className="card-row">
          <span>👥 Slots</span>
          <span>{s.availableSlots}</span>
        </div>
        <div className="card-row">
          <span>🌍 Region</span>
          <span>{s.targetRegion || "-"}</span>
        </div>
      </div>
    </div>
  );

  const ApplicationCard = ({ a }) => (
    <div
      className="card"
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div className="card-header">{a.scholarshipName || `Scholarship #${a.scholarshipId}`}</div>
      <div className="card-body">
        <div className="card-row">
          <span>💵 Requested</span>
          <span>{a.amount ?? "-"}</span>
        </div>
        <div className="card-row">
          <span>📌 Status</span>
          <span className={`status ${a.status}`}>{a.status}</span>
        </div>
      </div>
    </div>
  );

  const list = tab === "all" ? all : apps;

  return (
    <div className="scholarships-page">
      <h2 className="page-title">🎓 Scholarships</h2>

      <div className="tabs">
        <span className={`tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
          All Scholarships
        </span>
        <span className={`tab ${tab === "my" ? "active" : ""}`} onClick={() => setTab("my")}>
          My Applications
        </span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p>{tab === "all" ? "No scholarships." : "No applications yet."}</p>
      ) : (
        <div className="card-grid">
          {tab === "all"
            ? list.map((s) => <ScholarshipCard key={s.id} s={s} />)
            : list.map((a) => <ApplicationCard key={a.id} a={a} />)}
        </div>
      )}
    </div>
  );
};

export default Scholarships;
