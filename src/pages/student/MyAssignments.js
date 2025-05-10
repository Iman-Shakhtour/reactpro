import React, { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const MyAssignments = () => {
  const [list, setList] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stu = await studentApi.getProfile();
        const id = stu.data.content?.id ?? stu.data.id;
        const asRes = await studentApi.getAssignments(id);
        const arr = asRes.data.map((m) => m.content || m);
        setList(arr);

        // fetch course titles
        const ids = [...new Set(arr.map((a) => a.courseId).filter(Boolean))];
        const map = {};
        await Promise.all(
          ids.map(async (cid) => {
            try {
              const c = await axiosInstance.get(`/api/courses/${cid}`);
              map[cid] = c.data.content?.title || c.data.title || `Course #${cid}`;
            } catch {
              map[cid] = `Course #${cid}`;
            }
          })
        );
        setCourses(map);
      } catch {
        toast.error("❌ Failed to load assignments.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ---------- styles ---------- */
  const st = {
    page: { padding: 24 },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
      gap: 24,
    },
    card: {
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.2s",
    },
    header: {
      background: "linear-gradient(135deg,#06b6d4 0%,#3b82f6 100%)",
      color: "#fff",
      padding: "20px 16px",
      fontSize: 18,
      fontWeight: 600,
      textAlign: "center",
    },
    body: { padding: 16 },
    row: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
    badge: (s) => ({
      padding: "4px 10px",
      borderRadius: 12,
      fontSize: 12,
      color: "#fff",
      background: s === "COMPLETED" ? "#22c55e" : s === "PENDING" ? "#f97316" : "#facc15",
    }),
  };

  const Card = ({ a }) => (
    <div
      style={st.card}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div style={st.header}>{courses[a.courseId] || `Course #${a.courseId}`}</div>
      <div style={st.body}>
        <div style={st.row}>
          <span>📝 Type</span>
          <span>{a.type}</span>
        </div>
        <div style={st.row}>
          <span>📌 Status</span>
          <span style={st.badge(a.status)}>{a.status}</span>
        </div>
        {a.correctAnswers && (
          <div style={st.row}>
            <span>✅ Correct Answers</span>
            <span>{a.correctAnswers}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={st.page}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>🗒️ My Assignments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <div style={st.grid}>{list.map((a) => <Card key={a.id} a={a} />)}</div>
      )}
    </div>
  );
};

export default MyAssignments;
