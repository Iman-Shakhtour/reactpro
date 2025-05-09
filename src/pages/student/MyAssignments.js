import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

/* ----------------------------------------------------------------------
   MyAssignments – Student view
   ----------------------------------------------------------------------
   ✨ Shows all assessments (assignments/quizzes) the student has in their courses.
   ✨ Fetch flow: 1) /api/students/me → id  → 2) /api/assessments/student/{id}
   ✨ Each card shows: course title, type, status.
-------------------------------------------------------------------------*/
const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Helper: map courseId → title */
  const [coursesMap, setCoursesMap] = useState({});

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        /* 1️⃣ Get student info to obtain id */
        const studentRes = await axiosInstance.get("/api/students/me");
        const studentId = studentRes.data.content?.id || studentRes.data.id;

        /* 2️⃣ Get assessments for this student */
        const assessRes = await axiosInstance.get(`/api/assessments/student/${studentId}`);
        const assessmentList = assessRes.data.map((m) => m.content || m);
        setAssignments(assessmentList);

        /* 3️⃣ Fetch titles for referenced courses (unique IDs) */
        const uniqueCourseIds = [...new Set(assessmentList.map((a) => a.courseId).filter(Boolean))];
        const tempMap = {};
        await Promise.all(
          uniqueCourseIds.map(async (cid) => {
            try {
              const cRes = await axiosInstance.get(`/api/courses/${cid}`);
              const title = cRes.data.content?.title || cRes.data.title || `Course #${cid}`;
              tempMap[cid] = title;
            } catch {
              tempMap[cid] = `Course #${cid}`;
            }
          })
        );
        setCoursesMap(tempMap);
      } catch (err) {
        toast.error("❌ Failed to load assignments.");
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  /* ----------------------- Styles ----------------------- */
  const styles = {
    page: { padding: 24 },
    title: { fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#111827" },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 24,
    },
    card: {
      background: "#ffffff",
      borderRadius: 16,
      boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.2s",
    },
    cardHover: { transform: "translateY(-4px)" },
    header: {
      background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
      color: "#fff",
      padding: "20px 16px",
      fontSize: 18,
      fontWeight: 600,
      textAlign: "center",
    },
    body: { padding: 16, flex: 1 },
    row: { marginBottom: 12, display: "flex", alignItems: "center", gap: 8 },
    label: { color: "#6b7280", fontSize: 13, flex: 1 },
    value: { color: "#111827", fontWeight: 500, fontSize: 14 },
    statusBadge: (status) => ({
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 12,
      fontSize: 12,
      color: "#fff",
      background: status === "COMPLETED" ? "#22c55e" : status === "PENDING" ? "#f97316" : "#facc15",
    }),
    empty: { textAlign: "center", color: "#6b7280", marginTop: 40 },
  };

  const Card = ({ a }) => (
    <div
      style={styles.card}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div style={styles.header}>{coursesMap[a.courseId] || `Course #${a.courseId}`}</div>
      <div style={styles.body}>
        <div style={styles.row}>
          <span style={styles.label}>📝 Type</span>
          <span style={styles.value}>{a.type}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>📌 Status</span>
          <span style={styles.statusBadge(a.status)}>{a.status}</span>
        </div>
        {a.correctAnswers && (
          <div style={styles.row}>
            <span style={styles.label}>✅ Correct Answers</span>
            <span style={styles.value}>{a.correctAnswers}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🗒️ My Assignments</h2>
      {loading ? (
        <p style={styles.empty}>Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p style={styles.empty}>No assignments found.</p>
      ) : (
        <div style={styles.grid}>
          {assignments.map((a) => (
            <Card key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAssignments;