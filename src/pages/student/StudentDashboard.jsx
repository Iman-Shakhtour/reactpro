// src/pages/student/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  FaBookOpen, FaClipboardCheck, FaGraduationCap, FaQuoteLeft
} from "react-icons/fa";
import "react-calendar/dist/Calendar.css";
import axiosInstance from "../../api/axiosInstance";
import "./StudentDashboard.css";

/* ---------------- helpers ---------------- */
const COLORS = ["#3b82f6", "#10b981", "#f97316", "#ef4444"];
const unwrap = (m) => m.content ?? m;
const QUOTES = [
  "The expert in anything was once a beginner.",
  "Learning never exhausts the mind – Leonardo da Vinci.",
  "Success is the sum of small efforts repeated daily.",
  "Education is the passport to the future.",
  "Believe you can and you're halfway there."
];
const randQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

export default function StudentDashboard() {
  /* ------------- state ------------- */
  const [student, setStudent] = useState({});
  const [courses, setCourses] = useState([]);
  const [assigns, setAssigns] = useState([]);
  const [apps,    setApps]    = useState([]);
  const [quote,   setQuote]   = useState(randQuote);

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

  /* ------------- derived ------------- */
  const done     = assigns.filter(a => a.status === "DONE").length;
  const pending  = assigns.length - done;
  const barData  = [{ name:"Completed", value: done },
                    { name:"Pending",   value: pending }];
  const pieData  = [
    { name:"Courses",      value: courses.length,   color: COLORS[0] },
    { name:"Scholarships", value: apps.length,      color: COLORS[2] },
    { name:"Assignments",  value: assigns.length,   color: COLORS[1] }
  ];

  /* ------------- UI ------------- */
  return (
    <div className="dash-wrapper">
      <h1 className="dash-title">
        Welcome, {student.fullName?.split(" ")[0] || "Student"} 
      </h1>

      {/* quick stats */}
      <div className="stats-grid">
        <StatCard color={COLORS[0]} icon={<FaBookOpen />}
                  label="Courses" value={courses.length}/>
        <StatCard color={COLORS[1]} icon={<FaClipboardCheck />}
                  label="Assignments" value={assigns.length}/>
        <StatCard color={COLORS[2]} icon={<FaGraduationCap />}
                  label="Scholarships" value={apps.length}/>
      </div>

      {/* charts */}
      <div className="two-col">
        <section className="panel">
          <h3>Assignments Progress</h3>
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
          <h3>My Overview</h3>
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
          <h3>Calendar</h3>
          <Calendar
            tileClassName={({date}) =>
              assigns.some(a => a.dueDate &&
               new Date(a.dueDate).toDateString()===date.toDateString())
               ? "due-day" : ""
            }
          />
          <small className="legend">
            • highlighted days have assignment deadlines
          </small>
        </div>

        <MotivationCard quote={quote} onNew={()=>setQuote(randQuote())}/>
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

function MotivationCard({ quote, onNew }) {
  return (
    <div className="motive-card">
      <FaQuoteLeft className="motive-icon"/>
      <p className="motive-text">“{quote}”</p>
      <button className="motive-btn" onClick={onNew}>New quote</button>
    </div>
  );
}
