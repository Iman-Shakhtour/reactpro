import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import studentApi from "../../api/studentApi";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import "./MyAssignments.css";

export default function MyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const resolveStudentId = async () => {
    let id = localStorage.getItem("userId");
    if (id) return id;

    try {
      const { data } = await studentApi.getProfile();
      const p = data.content ?? data;
      if (p?.id) {
        localStorage.setItem("userId", p.id);
        return p.id;
      }
    } catch (err) {
      console.error("Failed to auto‑resolve userId", err);
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      const studentId = await resolveStudentId();
      if (!studentId) {
        toast.error("⚠️ Missing user ID – please re‑login");
        setLoading(false);
        return;
      }

      try {
        // 🔹 Get assignments
        const { data: aData } = await studentApi.getAssignments(studentId);
        const assignmentsList = Array.isArray(aData)
          ? aData.map((item) => ({
              id: item.id,
              title: item.title,
              instructions: item.instructions,
              type: item.type,
              status: item.status,
              courseTitle: item.courseTitle,
            }))
          : [];

        // 🔹 Get submissions for this student
        const { data: sData } = await axiosInstance.get(`/api/submissions/student/${studentId}`);
        const submissionsList = Array.isArray(sData)
          ? sData.map((s) => s.content ?? s)
          : [];

        setAssignments(assignmentsList);
        setSubmissions(submissionsList);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load assignments or submissions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmtDate = (d) =>
    d ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(d)) : "—";

  const findScoreForAssignment = (assignmentId) => {
    const submission = submissions.find((s) => s.assessmentId === assignmentId);
    return submission?.score;
  };

  return (
    <section className="assign-wrapper">
      <h2 className="assign-heading"> My Assignments</h2>

      {loading ? (
        <p className="assign-msg">Loading…</p>
      ) : assignments.length === 0 ? (
        <p className="assign-msg">No assignments found.</p>
      ) : (
        <ul className="assign-list">
          {assignments.map((a) => (
            <li key={a.id} className="assign-card">
              <header className="assign-card-header">
                <h3 className="assign-title">{a.title}</h3>
                <span className={`status-badge ${a.status?.toLowerCase()}`}>{a.status}</span>
              </header>
              <p className="assign-info"><strong>Course:</strong> {a.courseTitle || "N/A"}</p>
              <p className="assign-info"><strong>Type:</strong> {a.type}</p>
              {a.instructions && <p className="assign-info"><strong>Instructions:</strong> {a.instructions}</p>}

              <Link to={`/dashboard/student/assignments/${a.id}`} className="open-btn">
                OPEN
              </Link>

              {/* 🔹 Show score if submitted */}
             {(() => {
  const submission = submissions.find((s) => s.assessmentId === a.id);

  if (!submission) {
    return <p className="assign-score">📌 Not submitted yet</p>;
  }

  if (submission.score == null) {
    return <p className="assign-score">⏳ Submitted (Pending grading)</p>;
  }

  return (
    <p className="assign-score">
      🎯 Your Score: <strong>{submission.score.toFixed(2)}%</strong>
    </p>
  );
})()}

            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
