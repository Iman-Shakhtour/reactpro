// src/pages/admin/ManageCoursesPage.js
import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [title, setTitle]     = useState("");

  // 🔄 load courses (اختياري إذا عندك endpoint جاهز)
  const load = () =>
    adminApi.getCourses?.().then(res => setCourses(res.data));
  useEffect(() => { load?.(); }, []);

  const addCourse = async () => {
    if (!title.trim()) return;
    await adminApi.createCourse({ title });
    setTitle("");
    load?.();
  };

  return (
    <div>
      <h2>📚 Manage Courses</h2>

      <div style={{ margin: "10px 0" }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Course title"
        />
        <button onClick={addCourse}>➕ Add</button>
      </div>

      <ul>
        {courses?.map(c => <li key={c.id}>{c.title}</li>)}
      </ul>
    </div>
  );
};

export default ManageCoursesPage;
