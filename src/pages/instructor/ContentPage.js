import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

// Helper to unwrap HATEOAS-style responses
const unwrap = model => model.content ?? model;

const ContentPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [file, setFile] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [editingContent, setEditingContent] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  // Load instructor's courses and all content
  useEffect(() => {
    const loadData = async () => {
      try {
        const meRes = await axiosInstance.get("/api/instructors/me");
        const me = unwrap(meRes.data);

        const courseRes = await axiosInstance.get("/api/courses");
        const allCourses = courseRes.data.map(unwrap);
        const myCourses = allCourses.filter(c => c.instructorId === me.id);
        setCourses(myCourses);

        const contentRes = await axiosInstance.get("/api/contents");
        const allContent = contentRes.data.map(unwrap);
        // Attach courseTitle for display
        const annotated = allContent.map(c => ({
          ...c,
          courseTitle: allCourses.find(x => x.id === c.courseId)?.title || 'Unknown'
        }));
        setContentList(annotated);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load courses or content.");
      }
    };
    loadData();
  }, []);

  // Filter content for selected course
  const filteredContent = selectedCourseId
    ? contentList.filter(c => c.courseId === parseInt(selectedCourseId, 10))
    : [];

  const handleUpload = async () => {
    if (!selectedCourseId || !file) {
      toast.warning("⚠️ Please select a course and file.");
      return;
    }
    try {
      const meta = {
        title: file.name,
        type:  file.type,
        courseId: parseInt(selectedCourseId, 10)
      };
      const metaRes = await axiosInstance.post("/api/contents", meta);
      const created = unwrap(metaRes.data);
      const fd = new FormData();
      fd.append('file', file);
      await axiosInstance.post(
        `/api/contents/${created.id}/upload`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success("✅ Content uploaded!");
      setFile(null);
      // refresh content only for this course
      const allRes = await axiosInstance.get("/api/contents");
      const allContent = allRes.data.map(unwrap).map(c => ({
        ...c,
        courseTitle: courses.find(x => x.id === c.courseId)?.title || 'Unknown'
      }));
      setContentList(allContent);
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed. " + (err.response?.data || err.message));
    }
  };

  const handleDelete = async id => {
    try {
      await axiosInstance.delete(`/api/contents/${id}`);
      toast.success("🗑️ Deleted");
      setContentList(list => list.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("❌ Delete failed.");
    }
  };

  const handleEdit = content => {
    setEditingContent(content);
    setNewTitle(content.title);
  };

  const submitEdit = async () => {
    try {
      await axiosInstance.put(
        `/api/contents/${editingContent.id}`,
        { title: newTitle }
      );
      toast.success("✏️ Title updated.");
      setEditingContent(null);
      // update local list
      setContentList(list => list.map(c =>
        c.id === editingContent.id ? { ...c, title: newTitle } : c
      ));
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update title.");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📁 Manage Course Content</h2>
      <p style={styles.subtext}>Select a course to view or add content.</p>

      <div style={styles.card}>
        <div style={styles.formRow}>
          <select
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select Course --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={e => setFile(e.target.files[0])}
            disabled={!selectedCourseId}
            style={styles.input}
          />
          <button
            onClick={handleUpload}
            disabled={!selectedCourseId || !file}
            style={styles.button}
          >
            ➕ Upload
          </button>
        </div>

        {selectedCourseId ? (
          <>
            <h3 style={styles.sectionTitle}>
              📂 Content for “{courses.find(c => c.id === parseInt(selectedCourseId,10))?.title}”
            </h3>
            {filteredContent.length === 0 ? (
              <p style={styles.empty}>No content for this course yet.</p>
            ) : (
              <ul style={styles.list}>
                {filteredContent.map(item => (
                  <li key={item.id} style={styles.item}>
                    <span style={styles.title}>{item.title}</span>
                    <div style={styles.actions}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.viewLink}
                      >📥 View</a>
                      <button onClick={() => handleEdit(item)} style={styles.editBtn}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p style={styles.empty}>Please select a course above to manage its content.</p>
        )}
      </div>

      {editingContent && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Edit Title</h3>
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              style={styles.input}
            />
            <div style={styles.modalActions}>
              <button onClick={() => setEditingContent(null)} style={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={submitEdit} style={styles.saveBtn}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: "30px 60px" },
  heading: { fontSize: 26, fontWeight: "bold", color: "#001943", marginBottom: 6 },
  subtext: { color: "#666", marginBottom: 24 },
  card: { background: "#fff", borderRadius: 12, padding: 30, boxShadow: "0 0 0 2px #d6ecff" },
  formRow: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 },
  select: { padding: "10px", borderRadius: 8, fontSize: 15, border: "1px solid #ccc" },
  input: { padding: "10px", borderRadius: 8, fontSize: 15, border: "1px solid #ccc", flex: 1 },
  button: { background: "#001943", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 50, fontWeight: 500, cursor: "pointer" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 12, color: "#001943" },
  empty: { background: "#fff8e1", padding: 16, borderRadius: 8, color: "#8d6e63", border: "1px solid #ffe082" },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9f9f9", padding: 16, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, color: "#001943" },
  actions: { display: "flex", gap: 10 },
  viewLink: { textDecoration: "none", color: "#1e90ff", fontWeight: 500 },
  editBtn: { background: "none", border: "none", color: "#2ecc71", cursor: "pointer" },
  deleteBtn: { background: "none", border: "none", color: "#e74c3c", cursor: "pointer" },
  overlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: 12, padding: 20, width: 400, boxShadow: "0 0 0 2px #d6ecff" },
  modalActions: { marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10 },
  cancelBtn: { background: "#ccc", color: "white", padding: "8px 14px", border: "none", borderRadius: 6, cursor: "pointer" },
  saveBtn: { background: "#001943", color: "white", padding: "8px 14px", border: "none", borderRadius: 6, cursor: "pointer" },
};

export default ContentPage;