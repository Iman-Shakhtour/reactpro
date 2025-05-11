// src/pages/instructor/ContentPage.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

const ContentPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [file, setFile] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [editingContent, setEditingContent] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    axiosInstance.get("/api/instructor/my-courses").then(res => setCourses(res.data));
    axiosInstance.get("/api/content/my-uploads").then(res => setContentList(res.data));
  }, []);

  const handleUpload = async () => {
    if (!selectedCourseId || !file) {
      toast.warning("⚠️ Please select a course and file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosInstance.post(`/api/courses/${selectedCourseId}/content`, formData);
      toast.success("✅ Content uploaded!");
      setFile(null);
      const res = await axiosInstance.get("/api/content/my-uploads");
      setContentList(res.data);
    } catch {
      toast.error("❌ Upload failed.");
    }
  };

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/api/content/${id}`);
    toast.success("🗑️ Deleted");
    setContentList(contentList.filter(c => c.id !== id));
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setNewTitle(content.title);
  };

  const submitEdit = async () => {
    try {
      await axiosInstance.put(`/api/content/${editingContent.id}`, { title: newTitle });
      toast.success("✏️ Title updated.");
      setEditingContent(null);
      const res = await axiosInstance.get("/api/content/my-uploads");
      setContentList(res.data);
    } catch {
      toast.error("❌ Failed to update title.");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📁 Manage Course Content</h2>
      <p style={styles.subtext}>Upload, view, and manage your teaching materials.</p>

      <div style={styles.card}>
        <div style={styles.formRow}>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={styles.input}
          />

          <button onClick={handleUpload} style={styles.button}>
            ➕ Upload
          </button>
        </div>

        <h3 style={styles.sectionTitle}>📂 Uploaded Files</h3>
        {contentList.length === 0 ? (
          <p style={styles.empty}>No content uploaded yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {contentList.map((item) => (
              <li key={item.id} style={styles.item}>
                <div>
                  <strong>{item.title}</strong>
                  <p style={styles.courseText}>Course: {item.courseTitle}</p>
                </div>
                <div style={styles.actions}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.viewLink}
                  >
                    📥 View
                  </a>
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
      </div>

      {editingContent && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Edit Title</h3>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
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
  formRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  select: {
    padding: "10px",
    borderRadius: 8,
    fontSize: 15,
    border: "1px solid #ccc",
  },
  input: {
    padding: "10px",
    borderRadius: 8,
    fontSize: 15,
    border: "1px solid #ccc",
  },
  button: {
    background: "#001943",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: 50,
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
  item: {
    background: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  courseText: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    display: "flex",
    gap: 10,
  },
  viewLink: {
    textDecoration: "none",
    color: "#001943",
    fontWeight: "bold",
  },
  editBtn: {
    background: "none",
    border: "none",
    color: "#2ecc71",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#e74c3c",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw", height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    width: 400,
    boxShadow: "0 0 0 2px #d6ecff",
  },
  modalActions: {
    marginTop: 16,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    background: "#ccc",
    color: "white",
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  saveBtn: {
    background: "#001943",
    color: "white",
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default ContentPage;
