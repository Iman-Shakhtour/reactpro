import React, { useEffect, useState, useMemo } from "react";
import adminApi from "../../api/adminApi";

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", price: "" });

  // جلب الدورات من الباك إند
  const load = async () => {
    try {
      const res = await adminApi.getCourses();
      const data = Array.isArray(res.data)
        ? res.data.map(item => item.content || item)
        : [];
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // تصفية البحث (على العنوان والوصف)
  const filtered = useMemo(() => {
    if (!query.trim()) return courses;
    const q = query.toLowerCase();
    return courses.filter(c =>
      (c.title        || "")
        .toLowerCase()
        .includes(q) ||
      (c.description  || "")
        .toLowerCase()
        .includes(q)
    );
  }, [courses, query]);

  // فتح مودال إضافة جديد
  const openAdd = () => {
    setForm({ title: "", description: "", price: "" });
    setIsEditing(false);
    setEditingId(null);
    setModalOpen(true);
  };

  // فتح مودال التعديل
  const openEdit = c => {
    setForm({
      title: c.title || "",
      description: c.description || "",
      price: c.price != null ? c.price.toString() : ""
    });
    setIsEditing(true);
    setEditingId(c.id);
    setModalOpen(true);
  };

  // حفظ الإضافة أو التعديل
  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    const payload = {
      title: form.title,
      description: form.description,
      price: parseFloat(form.price) || 0
    };
    try {
      if (isEditing) {
        await adminApi.updateCourse(editingId, payload);
      } else {
        await adminApi.createCourse(payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  // حذف دورة
  const handleDelete = async id => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المقرر؟")) return;
    try {
      await adminApi.deleteCourse(id);
      load();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // أنماط CSS
  const S = {
    wrapper:      { padding: 30, background: "white", borderRadius: 12, boxShadow: "0 4px 18px rgba(0,0,0,.07)" },
    header:       { marginTop: 0 },
    topRow:       { display: "flex", gap: 10, margin: "18px 0", alignItems: "center" },
    search:       { flex: 1, padding: 10, borderRadius: 8, border: "1px solid #d0d6dd" },
    btnBlue:      { padding: "8px 18px", background: "#004aad", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
    table:        { width: "100%", borderCollapse: "collapse" },
    th:           { textAlign: "left", padding: "14px 16px", fontWeight: 600, fontSize: 14, background: "#f2f6fa", borderBottom: "1px solid #e3e8ee" },
    td:           { padding: "14px 16px", borderBottom: "1px solid #eff2f6", fontSize: 15 },
    actions:      { textAlign: "center" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" },
    modal:        { background: "white", padding: 24, borderRadius: 12, width: 360, boxShadow: "0 4px 18px rgba(0,0,0,.07)" },
    input:        { width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 6, margin: "8px 0" },
    modalActions: { marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }
  };

  return (
    <section style={S.wrapper}>
      <h2 style={S.header}>📚 Manage Courses</h2>

      <div style={S.topRow}>
        <input
          placeholder="🔍 Search…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={S.search}
        />
        <button style={S.btnBlue} onClick={openAdd}>Add Course</button>
      </div>

      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Course Name</th>
            <th style={S.th}>Description</th>
            <th style={S.th}>Price</th>
            <th style={{ ...S.th, ...S.actions }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.id}>
              <td style={S.td}>{c.title}</td>
              <td style={S.td}>{c.description}</td>
              <td style={S.td}>{c.price ? `$${c.price}` : "Free"}</td>
              <td style={{ ...S.td, ...S.actions }}>
                <button style={S.btnBlue} onClick={() => openEdit(c)}>Edit</button>&nbsp;
                <button style={{ ...S.btnBlue, background: "#ff4d4f" }} onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={4} style={{ ...S.td, textAlign: "center", fontStyle: "italic" }}>
                No courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen && (
        <div style={S.modalOverlay}>
          <div style={S.modal}>
            <h3>{isEditing ? "Edit Course" : "Add Course"}</h3>
            <input
              placeholder="Course Name"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              style={S.input}
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={S.input}
            />
            <input
              placeholder="Price"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              style={S.input}
            />
            <div style={S.modalActions}>
              <button style={S.btnBlue} onClick={handleSubmit}>
                {isEditing ? "Save" : "Add"}
              </button>
              <button
                style={{ ...S.btnBlue, background: "#ccc", color: "#333" }}
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
