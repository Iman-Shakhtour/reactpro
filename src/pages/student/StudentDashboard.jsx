// src/pages/student/StudentDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import Calendar from "react-calendar";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  FaBookOpen, FaClipboardCheck, FaGraduationCap, FaQuoteLeft
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "react-calendar/dist/Calendar.css";
import axiosInstance from "../../api/axiosInstance";
import "./StudentDashboard.css";

/* ---------------- helpers ---------------- */
const COLORS = ["#3b82f6", "#10b981", "#f97316", "#ef4444"];
const unwrap = (m) => m.content ?? m;

export default function StudentDashboard() {
  const { t, i18n } = useTranslation();

  /* ------------- state ------------- */
  const [student, setStudent] = useState({});
  const [courses, setCourses] = useState([]);
  const [assigns, setAssigns] = useState([]);
  const [apps,    setApps]    = useState([]);
  const [quote,   setQuote]   = useState("");

  /* ------------- helpers ------------- */
  const pickRandomQuote = useCallback(() => {
    const quotes = t("quotes", { returnObjects: true });
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [t]);

  /* ------------- fetch ------------- */
  useEffect(() => {
    (async () => {
      const me = unwrap((await axiosInstance.get("/api/students/me")).data);
      setStudent(me);

      localStorage.setItem("profileImage", me.photoUrl || "");
      window.dispatchEvent(new Event("profileUpdated"));

      const [c, a, app] = await Promise.all([
        axiosInstance.get("/api/students/me/courses"),
        axiosInstance.get("/api/students/me/assignments"),
        axiosInstance.get(`/api/students/${me.id}/scholarship-applications`)
      ]);
      setCourses(c.data);   setAssigns(a.data);   setApps(app.data);
    })().catch(console.error);
  }, []);

  /* ------------- quote refresh when language changes ------------- */
  useEffect(() => {
    setQuote(pickRandomQuote());
  }, [pickRandomQuote, i18n.language]);

  /* ------------- derived ------------- */
  const done     = assigns.filter(a => a.status === "DONE").length;
  const pending  = assigns.length - done;
  const barData  = [
    { name: t("completed"), value: done },
    { name: t("pending"),   value: pending }
  ];
  const pieData  = [
    { name: t("courses"),      value: courses.length,   color: COLORS[0] },
    { name: t("scholarships"), value: apps.length,      color: COLORS[2] },
    { name: t("assignments"),  value: assigns.length,   color: COLORS[1] }
  ];

  /* ------------- UI ------------- */
  return (
    <div className="dash-wrapper">
      <h1 className="dash-title">
        {t("welcome", { name: student.fullName?.split(" ")[0] || "" })}
      </h1>

      {/* quick stats */}
      <div className="stats-grid">
        <StatCard color={COLORS[0]} icon={<FaBookOpen />}
                  label={t("courses")} value={courses.length}/>
        <StatCard color={COLORS[1]} icon={<FaClipboardCheck />}
                  label={t("assignments")} value={assigns.length}/>
        <StatCard color={COLORS[2]} icon={<FaGraduationCap />}
                  label={t("scholarships")} value={apps.length}/>
      </div>

      {/* charts */}
      <div className="two-col">
        <section className="panel">
          <h3>{t("assignments_progress")}</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name" tick={{fontSize:12}}/>
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {barData.map((_,i)=><Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <h3>{t("my_overview")}</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={45}
                   outerRadius={75} label>
                {pieData.map(d => (
                  <Cell key={d.name} fill={d.color}/>
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* calendar + motivation */}
      <section className="panel flex-box">
        <div style={{flex:1}}>
          <h3>{t("calendar")}</h3>
          <Calendar
            tileClassName={({date}) =>
              assigns.some(a => a.dueDate &&
               new Date(a.dueDate).toDateString()===date.toDateString())
               ? "due-day" : ""
            }
          />
          <small className="legend">{t("highlighted_note")}</small>
        </div>

        <MotivationCard
          quote={quote}
          onNew={() => setQuote(pickRandomQuote())}
          t={t}
        />
      </section>
    </div>
  );
}

/* ---------------- components ---------------- */
function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card" style={{borderLeft:`6px solid ${color}`}}>
      <div className="icon" style={{color}}>{icon}</div>
      <div className="meta">
        <span className="value">{value}</span>
        <span className="label">{label}</span>
      </div>
    </div>
  );
}

function MotivationCard({ quote, onNew, t }) {
  return (
    <div className="motive-card">
      <FaQuoteLeft className="motive-icon"/>
      <p className="motive-text">“{quote}”</p>
      <button className="motive-btn" onClick={onNew}>
        {t("new_quote")}
      </button>
    </div>
  );
}
