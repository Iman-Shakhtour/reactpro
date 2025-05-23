import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

// Helper to unwrap HATEOAS-style responses
const unwrap = model => model.content ?? model;

const ManageAssignments = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [allAssignments, setAllAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  const [newTitle, setNewTitle] = useState("");
  const [newInstructions, setNewInstructions] = useState("");
  const [addingTitle, setAddingTitle] = useState("");
  const [addingInstructions, setAddingInstructions] = useState("");
  const [editing, setEditing] = useState(null);

  // load instructor courses and all assignments
  useEffect(() => {
    const loadData = async () => {
      try {
        const meRes = await axiosInstance.get("/api/instructors/me");
        const me = unwrap(meRes.data);
        const coursesRes = await axiosInstance.get("/api/courses");
        const allCourses = coursesRes.data.map(unwrap);
        setCourses(allCourses.filter(c => c.instructorId === me.id));

        const asgRes = await axiosInstance.get("/api/assessments");
        setAllAssignments(asgRes.data.map(unwrap));
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load courses or assignments.");
      }
    };
    loadData();
  }, []);

  // filter when selection or assignments change
  useEffect(() => {
    if (selectedCourseId) {
      setFilteredAssignments(
        allAssignments.filter(a => a.courseId === parseInt(selectedCourseId, 10))
      );
    } else {
      setFilteredAssignments([]);
    }
  }, [selectedCourseId, allAssignments]);

  const handleAdd = async () => {
    if (!selectedCourseId || !addingTitle.trim() || !addingInstructions.trim()) {
      toast.warning("⚠️ Please select a course and fill in fields.");
      return;
    }
    try {
      await axiosInstance.post("/api/assessments", {
        title: addingTitle,
        instructions: addingInstructions,
        courseId: parseInt(selectedCourseId, 10)
      });
      toast.success("✅ Assignment added!");
      setAddingTitle("");
      setAddingInstructions("");
      // refresh
      const res = await axiosInstance.get("/api/assessments");
      setAllAssignments(res.data.map(unwrap));
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add assignment.");
    }
  };

  const handleDelete = async id => {
    try {
      await axiosInstance.delete(`/api/assessments/${id}`);
      toast.success("🗑️ Assignment deleted.");
      setAllAssignments(a => a.filter(x => x.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete assignment.");
    }
  };

  const startEdit = a => {
    setEditing(a);
    setNewTitle(a.title);
    setNewInstructions(a.instructions);
  };

  const submitEdit = async () => {
    try {
      await axiosInstance.put(`/api/assessments/${editing.id}`, {
        title: newTitle,
        instructions: newInstructions
      });
      toast.success("✏️ Assignment updated.");
      setEditing(null);
      const res = await axiosInstance.get("/api/assessments");
      setAllAssignments(res.data.map(unwrap));
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update assignment.");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📝 Manage Assignments</h2>
      <p style={styles.subtext}>Select a course to view or add its assignments.</p>

      <div style={styles.card}>
        <div style={styles.formRow}>
          <select
            style={styles.select}
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
          >
            <option value="">-- Select Course --</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {selectedCourseId && (
          <div style={styles.formAdd}>
            <input
              type="text"
              placeholder="Title"
              style={styles.input}
              value={addingTitle}
              onChange={e => setAddingTitle(e.target.value)}
            />
            <textarea
              placeholder="Instructions"
              style={styles.textarea}
              value={addingInstructions}
              onChange={e => setAddingInstructions(e.target.value)}
            />
            <button style={styles.addButton} onClick={handleAdd}>
              ➕ Add
            </button>
          </div>
        )}

        <h3 style={styles.sectionTitle}>
          📄 Assignments for “{courses.find(c => c.id === parseInt(selectedCourseId,10))?.title || ''}”
        </h3>

        {filteredAssignments.length === 0 ? (
          <p style={styles.empty}>No assignments for this course.</p>
        ) : (
          <ul style={styles.list}>
            {filteredAssignments.map(a => (
              <li key={a.id} style={styles.item}>
                <div>
                  <strong style={styles.title}>{a.title}</strong>
                  <p style={styles.instructions}>{a.instructions}</p>
                </div>
                <div style={styles.actions}>
                  <button style={styles.editBtn} onClick={() => startEdit(a)}><FaEdit /></button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(a.id)}><FaTrash /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Edit Assignment</h3>
            <input
              type="text"
              style={styles.input}
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <textarea
              style={styles.textarea}
              value={newInstructions}
              onChange={e => setNewInstructions(e.target.value)}
            />
            <div style={styles.modalActions}>
              <button onClick={() => setEditing(null)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={submitEdit} style={styles.saveBtn}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: "30px 60px" },
  heading: { fontSize: 26, fontWeight: "bold", color: "#001943" },
  subtext: { color: "#666", marginBottom: 24 },
  card: { background: "#fff", borderRadius: 12, padding: 30, boxShadow: "0 0 0 2px #d6ecff" },
  formRow: { display: "flex", marginBottom: 20 },
  select: { flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #ccc", fontSize: 15 },
  formAdd: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 },
  input: { padding: "10px", borderRadius: 8, border: "1px solid #ccc", fontSize: 15 },
  textarea: { padding: "10px", borderRadius: 8, border: "1px solid #ccc", fontSize: 15, minHeight: 60 },
  addButton: { background: "#001943", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 50, cursor: "pointer" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#001943", marginBottom: 12 },
  empty: { background: "#fff8e1", padding: 16, borderRadius: 8, color: "#8d6e63", border: "1px solid #ffe082" },
  list: { listStyle: "none", paddingLeft: 0 },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9f9f9", padding: 16, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, color: "#001943", marginBottom: 6 },
  instructions: { fontSize: 14, color: "#555" },
  actions: { display: "flex", gap: 10 },
  editBtn: { background: "none", border: "none", color: "#2ecc71", cursor: "pointer" },
  deleteBtn: { background: "none", border: "none", color: "#e74c3c", cursor: "pointer" },
  overlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "#fff", padding: 20, borderRadius: 12, width: 400, boxShadow: "0 0 0 2px #d6ecff" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 },
  cancelBtn: { background: "#ccc", border: "none", padding: "8px 14px", borderRadius: 6, cursor: "pointer" },
  saveBtn: { background: "#001943", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 6, cursor: "pointer" },
};

export default ManageAssignments;