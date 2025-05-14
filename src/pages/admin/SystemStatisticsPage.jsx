// src/pages/admin/SystemStatisticsPage.js
import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import adminApi from "../../api/adminApi";

export default function SystemStatisticsPage() {
  const [summary, setSummary] = useState({
    totalDonations:    0,
    activeDonors:      0,
    totalScholarships: 0,
    totalStudents:     0,
    totalCourses:      0
  });
  const [topScholarships, setTopScholarships] = useState([]);
  const [topCourses, setTopCourses]           = useState([]);

  useEffect(() => {
    adminApi.getDashboardStats()
      .then(res => {
        const d = res.data;
        setSummary({
          totalDonations:    d.totalDonated      || 0,
          activeDonors:      d.totalDonors       || 0,
          totalScholarships: d.totalScholarships || 0,
          totalStudents:     d.totalStudents     || 0,
          totalCourses:      d.totalCourses      || 0
        });
        setTopScholarships(d.topScholarships || []);
        setTopCourses(d.topCourses         || []);
      })
      .catch(err => console.error("❌ Error loading stats:", err));
  }, []);

  const S = {
    wrapper:        { padding:24, background:"#f0f4f8", minHeight:"100vh" },
    header:         { fontSize:24, marginBottom:8 },
    subheader:      { color:"#555", marginBottom:24 },
    cardsGrid:      {
      display:"grid",
      gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
      gap:20,
      marginBottom:32
    },
    card:           {
      background:"#fff",
      padding:20,
      borderRadius:12,
      boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
      textAlign:"center"
    },
    cardLabel:      { fontSize:14, color:"#777" },
    cardValue:      { fontSize:28, fontWeight:600, marginTop:6 },
    chartContainer: {
      background:"#fff",
      padding:20,
      borderRadius:12,
      boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
      marginBottom:32
    },
    chartTitle:     { fontSize:18, marginBottom:12 }
  };

  return (
    <div style={S.wrapper}>
      <h2 style={S.header}>📊 System Statistics</h2>
      <p style={S.subheader}>
        Here you can view donation statistics and system summary.
      </p>

      <div style={S.cardsGrid}>
        <div style={S.card}>
          <div style={S.cardLabel}>Total Donations</div>
          <div style={S.cardValue}>${summary.totalDonations}</div>
        </div>
        <div style={S.card}>
          <div style={S.cardLabel}>Active Donors</div>
          <div style={S.cardValue}>{summary.activeDonors}</div>
        </div>
        <div style={S.card}>
          <div style={S.cardLabel}>Total Scholarships</div>
          <div style={S.cardValue}>{summary.totalScholarships}</div>
        </div>
        <div style={S.card}>
          <div style={S.cardLabel}>Total Students</div>
          <div style={S.cardValue}>{summary.totalStudents}</div>
        </div>
        <div style={S.card}>
          <div style={S.cardLabel}>Total Courses</div>
          <div style={S.cardValue}>{summary.totalCourses}</div>
        </div>
      </div>

      <div style={S.chartContainer}>
        <h3 style={S.chartTitle}>Top 3 Scholarships by Donations</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topScholarships} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="name" tick={{ fontSize:12 }} />
            <YAxis tick={{ fontSize:12 }} />
            <Tooltip />
            <Bar dataKey="total" name="Donated" fill="#4a90e2" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={S.chartContainer}>
        <h3 style={S.chartTitle}>Top 3 Courses by Donations</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topCourses} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="title" tick={{ fontSize:12 }} />
            <YAxis tick={{ fontSize:12 }} />
            <Tooltip />
            <Bar dataKey="total" name="Donated" fill="#50e3c2" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}