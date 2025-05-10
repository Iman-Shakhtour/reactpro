import React, { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
import { toast } from "react-toastify";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const stuRes = await studentApi.getProfile();
        const studentId = stuRes.data.content?.id ?? stuRes.data.id;

        const enRes = await studentApi.getEnrollments(studentId);
        const list = enRes.data.map((e) => e.content ?? e);
        setEnrollments(list);
      } catch (err) {
        console.error("❌ Failed to fetch enrollments:", err);
        toast.error("❌ Failed to fetch enrollments");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "25px" }}>
        📚 My Courses & Progress
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#f4f7fb" }}>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Progress</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  You are not enrolled in any courses.
                </td>
              </tr>
            ) : (
              enrollments.map((enroll) => (
                <tr key={enroll.id}>
                  <td style={tdStyle}>{enroll.courseTitle || "-"}</td>
                  <td style={tdStyle}>{enroll.courseDescription || "-"}</td>
                  <td style={tdStyle}>{enroll.courseIsFree ? "Free" : "Paid"}</td>
                  <td style={tdStyle}>
                    {enroll.courseIsFree ? "—" : `$${enroll.coursePrice ?? "N/A"}`}
                  </td>
                  <td style={tdStyle}>
                    <div style={progressBarContainer}>
                      <div
                        style={{
                          ...progressBarFill,
                          width: `${enroll.progress?.toFixed?.(0) ?? 0}%`,
                          backgroundColor: enroll.completed ? "#4CAF50" : "#2196F3",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "12px" }}>
                      {enroll.progress?.toFixed?.(0) ?? 0}%
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {enroll.completed ? "✅ Completed" : "⏳ In Progress"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ✅ CSS Styles
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  overflow: "hidden",
};

const thStyle = {
  padding: "12px",
  fontWeight: "bold",
  textAlign: "left",
  borderBottom: "1px solid #eee",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #f0f0f0",
  verticalAlign: "middle",
};

const progressBarContainer = {
  height: "10px",
  width: "100%",
  backgroundColor: "#ddd",
  borderRadius: "6px",
  marginBottom: "4px",
};

const progressBarFill = {
  height: "100%",
  borderRadius: "6px",
  transition: "width 0.3s ease-in-out",
};

export default MyCourses;
