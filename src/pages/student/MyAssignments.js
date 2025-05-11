/* =============================================================
   MyAssignments.js — React component (Student view)
   Auto‑recovers userId if missing
   ============================================================= */

import React, { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
import { toast } from "react-toastify";
import "./MyAssignments.css";

export default function MyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------------
     Helper: get or discover studentId
  ------------------------------------------------------------- */
  const resolveStudentId = async () => {
    let id = localStorage.getItem("userId");
    if (id) return id;

    // ⚠️ لم يُحفظ الـ id ‑ جرّب جلب البروفايل ثم خزّنه
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
        const { data } = await studentApi.getAssignments(studentId);
        const clean = (item) => ({
          id: item.id,
          title: item.title,
          instructions: item.instructions,
          dueDate: item.dueDate,
          type: item.type,
          status: item.status,
          courseTitle: item.courseTitle,
        });
        setAssignments(Array.isArray(data) ? data.map(clean) : []);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load assignments");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmtDate = (d) =>
    d ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(d)) : "—";

  return (
    <section className="assign-wrapper">
      <h2 className="assign-heading">📚 My Assignments</h2>

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
              <p className="assign-info"><strong>Due:</strong> {fmtDate(a.dueDate)}</p>
              {a.instructions && <p className="assign-info"><strong>Instructions:</strong> {a.instructions}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}