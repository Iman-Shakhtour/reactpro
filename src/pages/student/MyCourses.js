import React, { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
import { toast } from "react-toastify";
import "./MyCourses.css";

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
        <table className="table">
          <thead>
            <tr style={{ background: "#f4f7fb" }}>
              <th>Title</th>
              <th>Description</th>
              <th>Type</th>
              <th>Price</th>
              <th>Progress</th>
              <th>Status</th>
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
                  <td>{enroll.courseTitle || "-"}</td>
                  <td>{enroll.courseDescription || "-"}</td>
                  <td>{enroll.courseIsFree ? "Free" : "Paid"}</td>
                  <td>
                    {enroll.courseIsFree ? "—" : `$${enroll.coursePrice ?? "N/A"}`}
                  </td>
                  <td>
                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${enroll.progress?.toFixed?.(0) ?? 0}%`,
                          backgroundColor: enroll.completed ? "#4CAF50" : "#2196F3",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "12px" }}>
                      {enroll.progress?.toFixed?.(0) ?? 0}%
                    </span>
                  </td>
                  <td>{enroll.completed ? "✅ Completed" : "⏳ In Progress"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyCourses;
