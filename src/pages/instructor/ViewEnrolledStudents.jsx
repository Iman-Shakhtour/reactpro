import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { HiUsers } from "react-icons/hi2";

// Helper to unwrap HATEOAS-style responses
const unwrap = model => model.content ?? model;

const ViewEnrolledStudents = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [allEnrollments, setAllEnrollments] = useState([]);

  // Load instructor's courses and all enrollments
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) current instructor
        const meRes = await axiosInstance.get("/api/instructors/me");
        const me = unwrap(meRes.data);

        // 2) all courses → filter mine
        const crRes = await axiosInstance.get("/api/courses");
        const allCourses = crRes.data.map(unwrap);
        setCourses(allCourses.filter(c => c.instructorId === me.id));

        // 3) all enrollments
        const enRes = await axiosInstance.get("/api/enrollments");
        const enrolls = enRes.data.map(unwrap).map(e => ({
          ...e,
          student: e.student,                  // assume nested student
          courseTitle: allCourses.find(c => c.id === e.courseId)?.title || ""
        }));
        setAllEnrollments(enrolls);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load courses or enrollments.");
      }
    };
    loadData();
  }, []);

  // Filtered list based on selection
  const filtered = selectedCourseId
    ? allEnrollments.filter(e => e.courseId === parseInt(selectedCourseId, 10))
    : [];

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>
        <HiUsers style={{ marginRight: 10 }} />
        Enrolled Students
      </h2>
      <p style={styles.subtext}>Select a course to view its enrolled students.</p>

      <div style={styles.card}>
        <div style={styles.formRow}>
          <select
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select a Course --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {selectedCourseId ? (
          filtered.length > 0 ? (
            <ul style={styles.list}>
              {filtered.map(en => (
                <li key={en.id} style={styles.listItem}>
                  <strong>{en.student.fullName}</strong> — {en.student.email}
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.empty}>No students enrolled in this course.</p>
          )
        ) : (
          <p style={styles.empty}>Please select a course above.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: "30px 60px" },
  heading: { fontSize: 26, fontWeight: "bold", color: "#001943", display: "flex", alignItems: "center" },
  subtext: { color: "#666", marginBottom: 24 },
  card: { background: "#fff", borderRadius: 12, padding: 30, boxShadow: "0 0 0 2px #d6ecff" },
  formRow: { marginBottom: 20 },
  select: { padding: "10px", borderRadius: 8, border: "1px solid #ccc", fontSize: 15, width: 300 },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  listItem: { padding: "12px 16px", backgroundColor: "#f4f4f4", borderRadius: 8, fontSize: 15, color: "#333", boxShadow: "0 0 0 1px #eee" },
  empty: { background: "#fff8e1", padding: 16, borderRadius: 8, color: "#8d6e63", border: "1px solid #ffe082" },
};

export default ViewEnrolledStudents;