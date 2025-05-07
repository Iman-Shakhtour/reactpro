// src/pages/instructor/ManageAssignments.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const ManageAssignments = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/api/instructors/courses");
        setCourses(res.data);
      } catch (err) {
        toast.error("❌ Failed to load courses.");
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    const fetchAssignments = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/instructors/courses/${selectedCourseId}/assignments`
        );
        setAssignments(res.data);
      } catch (err) {
        toast.error("❌ Failed to load assignments.");
      }
    };
    fetchAssignments();
  }, [selectedCourseId]);

  const handleAddAssignment = async () => {
    if (!assignmentTitle.trim() || !instructions.trim()) {
      toast.warning("⚠️ Please fill in all fields.");
      return;
    }

    try {
      await axiosInstance.post(
        `/api/instructors/courses/${selectedCourseId}/assignments`,
        { title: assignmentTitle, instructions }
      );
      toast.success("✅ Assignment added successfully!");
      setAssignmentTitle("");
      setInstructions("");
      const res = await axiosInstance.get(
        `/api/instructors/courses/${selectedCourseId}/assignments`
      );
      setAssignments(res.data);
    } catch (err) {
      toast.error("❌ Failed to add assignment.");
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await axiosInstance.delete(`/api/instructors/assignments/${id}`);
      toast.success("🗑️ Assignment deleted.");
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (err) {
      toast.error("❌ Failed to delete.");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📝 Manage Assignments</h2>
      <p style={styles.subtext}>Create and manage assignments for your courses.</p>

      <div style={styles.card}>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Select a course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        {selectedCourseId && (
          <div style={styles.form}>
            <input
              type="text"
              placeholder="Assignment Title"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleAddAssignment} style={styles.addButton}>
              ➕ Add Assignment
            </button>
          </div>
        )}

        <h3 style={styles.sectionTitle}>📄 Existing Assignments</h3>
        {assignments.length === 0 ? (
          <p style={styles.empty}>No assignments available for this course.</p>
        ) : (
          <ul style={styles.assignmentList}>
            {assignments.map((a) => (
              <li key={a.id} style={styles.assignmentItem}>
                <div>
                  <strong>{a.title}</strong>
                  <p style={styles.instructions}>{a.instructions}</p>
                </div>
                <button
                  onClick={() => handleDeleteAssignment(a.id)}
                  style={styles.deleteButton}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
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
    marginBottom: 6,
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
  select: {
    padding: "10px",
    width: "100%",
    maxWidth: 400,
    borderRadius: 8,
    fontSize: 15,
    marginBottom: 20,
    border: "1px solid #ccc",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxWidth: 400,
    marginBottom: 24,
  },
  input: {
    padding: "10px",
    borderRadius: 8,
    fontSize: 15,
    border: "1px solid #ccc",
  },
  addButton: {
    background: "#001943",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 50,
    border: "none",
    fontWeight: 500,
    cursor: "pointer",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
    color: "#001943",
  },
  empty: {
    background: "#fff8e1",
    padding: 16,
    borderRadius: 8,
    color: "#8d6e63",
    border: "1px solid #ffe082",
  },
  assignmentList: {
    listStyle: "none",
    paddingLeft: 0,
    marginTop: 12,
  },
  assignmentItem: {
    backgroundColor: "#f9f9f9",
    padding: 14,
    borderRadius: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  instructions: {
    fontSize: 14,
    color: "#555",
  },
  deleteButton: {
    background: "none",
    border: "none",
    color: "#e74c3c",
    cursor: "pointer",
  },
};

export default ManageAssignments;
