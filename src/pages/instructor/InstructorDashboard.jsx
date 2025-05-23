// src/pages/instructor/InstructorDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { FaBookOpen, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import Calendar from "react-calendar";
import { toast } from "react-toastify";
import "react-calendar/dist/Calendar.css";

import axiosInstance from "../../api/axiosInstance";
import "./InstructorDashboard.css";

/* ---------- helpers ---------- */
const unwrap = (m) => m.content ?? m;
const COLORS = ["#3b82f6", "#10b981", "#f97316", "#ef4444"];   // ألوان زاهية
const quotes = [
  "Teaching is the profession that creates all others ✨",
  "A good teacher ignites the imagination and inspires hope.",
  "The art of teaching is the art of assisting discovery.",
  "Education is not the filling of a pail, but the lighting of a fire."
];

export default function InstructorDashboard() {
  const username = localStorage.getItem("username") || "Instructor";

  /* ---------- state ---------- */
  const [courses,     setCourses]     = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [subs,        setSubs]        = useState([]);
  const [loading,     setLoading]     = useState(true);

  /* ---------- fetch ---------- */
  useEffect(() => {
    (async () => {
      try {
        /* 1) أنا */
        const me = unwrap((await axiosInstance.get("/api/instructors/me")).data);

        /* 2) مقرّراتي */
  const allCourses = (await axiosInstance.get(`/api/courses/instructor/${me.id}`)).data.map(unwrap);

        setCourses(allCourses);

        /* 3) واجباتي */
       const myAssign = (await axiosInstance.get("/api/assessments")).data.map(unwrap)
  .filter(a => a.instructorId === me.id);

        setAssignments(myAssign);

        /* 4) تسليمات الطلبة */
        const mySubs = (await axiosInstance.get("/api/submissions")).data.map(unwrap)
                      .filter(s => myAssign.some(a => a.id === s.assignmentId));
        setSubs(mySubs);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- derived data ---------- */
  const graded   = subs.filter(s => s.grade !== null).length;
  const pending  = subs.length - graded;

  const barData = [
    { name: "Graded",  value: graded  },
    { name: "Pending", value: pending },
  ];

  /** Pie slices - gradable / missing */
  const pieData = [
    { name: "Submitted", value: subs.length,   color: COLORS[0] },
    { name: "Missing",   value: assignments.length * 30 - subs.length, color: COLORS[3] } // افتراضي
  ];

  const quote = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    []
  );

  /* ---------- UI ---------- */
  return (
    <div className="instructor-wrapper">
      <h1 className="title">
        Welcome back, {username.split(" ")[0]} <span role="img" aria-label="wave"></span>
      </h1>

      {/* quick stats */}
      <div className="stats-grid">
        <StatCard icon={<FaBookOpen />}      label="Courses"      value={courses.length}   color={COLORS[0]} />
        <StatCard icon={<FaClipboardList />} label="Assignments"  value={assignments.length} color={COLORS[2]} />
        <StatCard icon={<FaCheckCircle />}   label="Submissions"  value={subs.length}      color={COLORS[1]} />
      </div>

      {/* charts + inspiration */}
      <div className="two-col">
        <section className="panel">
          <h3>Submission Status</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((_e, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <h3>Submission Coverage</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                label
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="panel inspiration">
          <h3>Inspiration of the Day 💡</h3>
          <p>{quote}</p>
        </section>
      </div>

      {/* calendar */}
      <section className="panel">
        <h3>Calendar</h3>
        <Calendar
          tileClassName={({ date }) => {
            const hasDue = assignments.some(a =>
              a.dueDate && new Date(a.dueDate).toDateString() === date.toDateString()
            );
            return hasDue ? "due-day" : "";
          }}
        />
        <small className="legend">• highlighted days have assignment deadlines</small>
      </section>

      {/* courses */}
      <div className="panel courses-section">
        <h3>📚 My Courses</h3>
        {loading ? (
          <p className="status">Loading…</p>
        ) : courses.length === 0 ? (
          <p className="status">You don't have courses yet.</p>
        ) : (
          <div className="course-cards">
            {courses.map(c => (
              <Link to={`course-details/${c.id}`} key={c.id} className="course-card">
                <h4>{c.title}</h4>
                <p>{c.description?.slice(0, 80) || "No description available."}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Outlet />
    </div>
  );
}

/* -------- reusable ------- */
function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card" style={{ borderLeft: `6px solid ${color}` }}>
      <div className="icon" style={{ color }}>{icon}</div>
      <div className="meta">
        <span className="value">{value}</span>
        <span className="label">{label}</span>
      </div>
    </div>
  );
}
