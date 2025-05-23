import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { FaFileAlt } from "react-icons/fa";

// Helper to unwrap HATEOAS-style responses
const unwrap = model => model.content ?? model;

const SubmittedAssignments = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) get current instructor
        const meRes = await axiosInstance.get("/api/instructors/me");
        const me = unwrap(meRes.data);

        // 2) get all courses, filter to mine
        const coursesRes = await axiosInstance.get("/api/courses");
        const allCourses = coursesRes.data.map(unwrap);
        const myCourseIds = allCourses
          .filter(c => c.instructorId === me.id)
          .map(c => c.id);

        // 3) get all submissions, filter by myCourseIds
        const subsRes = await axiosInstance.get("/api/submissions");
        const allSubs = subsRes.data.map(unwrap);
        const mySubs = allSubs.filter(s => {
          const cid = s.courseId ?? s.course?.id;
          return myCourseIds.includes(cid);
        });

        // 4) map to view model
        setSubmissions(
          mySubs.map(s => ({
            studentName:      s.student?.fullName || "",
            assignmentTitle:  s.assessment?.title  || "",
            courseTitle:      s.course?.title      || "",
            submittedAt:      s.submittedAt,
            fileUrl:          s.fileUrl || s.url   || "",
          }))
        );
      } catch (error) {
        console.error("Error loading submissions:", error);
        toast.error("❌ Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>
        <FaFileAlt style={{ marginRight: 10 }} />
        Student Submissions
      </h2>
      <p style={styles.subtext}>Review submitted assignments by students.</p>

      <div style={styles.card}>
        {loading ? (
          <p>Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p style={styles.empty}>No submissions found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Assignment</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Submitted At</th>
                  <th style={styles.th}>Link</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, idx) => (
                  <tr key={idx} style={styles.tableRow}>
                    <td style={styles.td}>{sub.studentName}</td>
                    <td style={styles.td}>{sub.assignmentTitle}</td>
                    <td style={styles.td}>{sub.courseTitle}</td>
                    <td style={styles.td}>{new Date(sub.submittedAt).toLocaleString()}</td>
                    <td style={styles.td}>
                      <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                        📎 View File
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: "30px 60px" },
  heading: { fontSize: 26, fontWeight: "bold", color: "#001943", display: "flex", alignItems: "center" },
  subtext: { color: "#666", marginBottom: 24 },
  card: { background: "#fff", borderRadius: 12, padding: 30, boxShadow: "0 0 0 2px #d6ecff" },
  empty: { background: "#fff8e1", padding: 16, borderRadius: 8, color: "#8d6e63", border: "1px solid #ffe082" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeaderRow: { backgroundColor: "#d6ecff", textAlign: "left" },
  th: { padding: "12px 16px", fontSize: 14, fontWeight: "bold", color: "#001943" },
  td: { padding: "12px 16px", fontSize: 14, color: "#333", borderBottom: "1px solid #eee" },
  tableRow: { backgroundColor: "#f9f9f9", transition: "0.3s" },
  link: { color: "#1e40af", fontWeight: "500", textDecoration: "none" },
};

export default SubmittedAssignments;