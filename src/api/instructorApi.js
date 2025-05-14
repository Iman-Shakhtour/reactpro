import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

// Helper to unwrap HATEOAS-style responses
const unwrap = model => model.content ?? model;

const ManageAssignments = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load instructor's courses (global endpoint, filtered)
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const meRes = await axiosInstance.get("/api/instructors/me");
        const me = unwrap(meRes.data);
        const allCoursesRes = await axiosInstance.get("/api/courses");
        const allCourses = allCoursesRes.data.map(unwrap);
        setCourses(allCourses.filter(c => c.instructorId === me.id));
      } catch {
        toast.error("❌ Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  // Load assignments from global endpoint, filtered by courseId
  useEffect(() => {
    if (!selectedCourseId) {
      setAssignments([]);
      return;
    }
    const loadAssignments = async () => {
      try {
        const res = await axiosInstance.get("/api/assessments");
        const allAs = res.data.map(unwrap);
        setAssignments(allAs.filter(a => a.courseId === parseInt(selectedCourseId, 10)));
      } catch {
        toast.error("❌ Failed to load assignments.");
      }
    };
    loadAssignments();
  }, [selectedCourseId]);

  const handleAddAssignment = async () => {
    if (!selectedCourseId || !assignmentTitle.trim() || !instructions.trim()) {
      toast.warning("⚠️ Please select a course and fill all fields.");
      return;
    }
    try {
      await axiosInstance.post(
        "/api/assessments",
        { title: assignmentTitle, instructions, courseId: parseInt(selectedCourseId, 10) }
      );
      toast.success("✅ Assignment added successfully!");
      setAssignmentTitle("");
      setInstructions("");
      // Refresh assignments
      const res = await axiosInstance.get("/api/assessments");
      const allAs = res.data.map(unwrap);
      setAssignments(allAs.filter(a => a.courseId === parseInt(selectedCourseId, 10)));
    } catch {
      toast.error("❌ Failed to add assignment.");
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await axiosInstance.delete(`/api/assessments/${id}`);
      toast.success("🗑️ Assignment deleted.");
      setAssignments(asgs => asgs.filter(a => a.id !== id));
    } catch {
      toast.error("❌ Failed to delete assignment.");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📝 Manage Assignments</h2>
      <p style={styles.subtext}>Create and manage assignments for your courses.</p>

      <div style={styles.card}>
        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <select
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select a course --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        )}

        {selectedCourseId && (
          <div style={styles.form}>
            <input
              type="text"
              placeholder="Assignment Title"
              value={assignmentTitle}
              onChange={e => setAssignmentTitle(e.target.value)}
              style={styles.input}
            />
            <textarea
              placeholder="Instructions"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              style={styles.textarea}
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
            {assignments.map(a => (
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
  page: { padding: "30px 60px" },
  heading: { fontSize: 26, fontWeight: "bold", color: "#001943", marginBottom: 6 },
  subtext: { color: "#666", marginBottom: 24 },
  card: { background: "#fff", borderRadius: 12, padding: 30, boxShadow: "0 0 0 2px #d6ecff" },
  select: { padding: "10px", width: "100%", maxWidth: 400, borderRadius: 8, fontSize: 15, marginBottom: 20, border: "1px solid #ccc" },
  form: { display: "flex", flexDirection: "column", gap: 12, maxWidth: 400, marginBottom: 24 },
  input: { padding: "10px", borderRadius: 8, fontSize: 15, border: "1px solid #ccc" },
  textarea: { padding: "10px", borderRadius: 8, fontSize: 15, border: "1px solid #ccc", minHeight: 80 },
  addButton: { background: "#001943", color: "#fff", padding: "10px 20px", borderRadius: 50, border: "none", fontWeight: 500, cursor: "pointer" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 12, color: "#001943" },
  empty: { background: "#fff8e1", padding: 16, borderRadius: 8, color: "#8d6e63", border: "1px solid #ffe082" },
  assignmentList: { listStyle: "none", paddingLeft: 0, marginTop: 12 },
  assignmentItem: { backgroundColor: "#f9f9f9", padding: 14, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  instructions: { fontSize: 14, color: "#555" },
  deleteButton: { background: "none", border: "none", color: "#e74c3c", cursor: "pointer" },
};

export default ManageAssignments;