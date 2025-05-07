// src/pages/instructor/ViewEnrolledStudents.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { HiUsers } from "react-icons/hi2";

const ViewEnrolledStudents = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/api/instructors/me/courses");
        setCourses(res.data);
      } catch (error) {
        toast.error("Failed to load courses.");
      }
    };

    fetchCourses();
  }, []);

  const fetchEnrolledStudents = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/instructors/me/courses/${selectedCourseId}/students`
      );
      setStudents(res.data);
    } catch (error) {
      toast.error("Failed to load students.");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>
        <HiUsers style={{ marginRight: 10 }} />
        Enrolled Students
      </h2>
      <p style={styles.subtext}>Select a course to view its enrolled students.</p>

      <div style={styles.card}>
        <div style={styles.controls}>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select a Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <button
            onClick={fetchEnrolledStudents}
            style={styles.button}
            disabled={!selectedCourseId}
          >
            View Students
          </button>
        </div>

        {students.length > 0 ? (
          <ul style={styles.list}>
            {students.map((student) => (
              <li key={student.id} style={styles.listItem}>
                <strong>{student.fullName}</strong> — {student.email}
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.empty}>
            No students enrolled or no course selected.
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "30px 60px",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#001943",
    display: "flex",
    alignItems: "center",
  },
  subtext: {
    color: "#666",
    marginBottom: 24,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 30,
    boxShadow: "0 0 0 2px #d6ecff",
  },
  controls: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  select: {
    padding: "10px",
    fontSize: 15,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    background: "#001943",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 50,
    border: "none",
    fontWeight: 500,
    cursor: "pointer",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  listItem: {
    padding: "12px 16px",
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    fontSize: 15,
    color: "#333",
    boxShadow: "0 0 0 1px #eee",
  },
  empty: {
    background: "#fff8e1",
    padding: 16,
    borderRadius: 8,
    color: "#8d6e63",
    border: "1px solid #ffe082",
  },
};

export default ViewEnrolledStudents;
