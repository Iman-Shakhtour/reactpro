import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

const AdminStatsPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.getStats().then(res => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading…</p>;

  return (
    <div>
      <h2>📊 System Statistics</h2>
      <ul style={{ lineHeight: 1.8 }}>
        <li>Total Donated: <strong>${stats.totalDonated.toFixed(2)}</strong></li>
        <li>Total Donors: <strong>{stats.totalDonors}</strong></li>
        <li>Total Scholarships: <strong>{stats.totalScholarships}</strong></li>
        <li>Total Courses: <strong>{stats.totalCourses}</strong></li>
      </ul>

      <h3>🏅 Top 3 Scholarships</h3>
      {stats.topScholarships.map(s => (
        <div key={s.id}>{s.name} — ${s.total.toFixed(2)}</div>
      ))}

      <h3>📚 Top 3 Courses</h3>
      {stats.topCourses.map(c => (
        <div key={c.id}>{c.title} — ${c.total.toFixed(2)}</div>
      ))}
    </div>
  );
};

export default AdminStatsPage;
