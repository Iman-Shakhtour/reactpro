// src/pages/admin/ManageScholarshipsPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import adminApi from "../../api/adminApi";

export default function ManageScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [query, setQuery]           = useState("");
  const [modalOpen, setModalOpen]   = useState(false);
  const [isEditing, setIsEditing]   = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [form, setForm] = useState({
    name: "",
    goalAmount: "",
    description: "",
    donorId: "",
  });
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [assignStudentsMode, setAssignStudentsMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Load initial data
  const load = async () => {
    const sch = await adminApi.getScholarships?.();
    setScholarships(sch?.data || []);
    const st = await adminApi.getStudents?.();
    setStudents(st?.data || []);
    const inst = await adminApi.getInstructors?.();
    setInstructors(inst?.data || []);
  };
  useEffect(() => { load(); }, []);

  // Filter scholarships by search
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return scholarships.filter(s =>
      s.name.toLowerCase().includes(q) ||
      String(s.goalAmount).includes(q)
    );
  }, [scholarships, query]);

  // Open Add / Edit modal
  const openAdd = () => {
    setForm({ name: "", goalAmount: "", description: "", donorId: "" });
    setIsEditing(false);
    setEditingId(null);
    setModalOpen(true);
    setAssignStudentsMode(false);
  };
  const openEdit = s => {
    setForm({
      name: s.name,
      goalAmount: s.goalAmount,
      description: s.description,
      donorId: s.donorId || ""
    });
    setIsEditing(true);
    setEditingId(s.id);
    setModalOpen(true);
    setAssignStudentsMode(false);
  };

  // Submit Add / Edit
  const handleSubmit = async () => {
    if (!form.name.trim() || !form.goalAmount) return;
    if (isEditing) {
      await adminApi.updateScholarship(editingId, form);
    } else {
      await adminApi.createScholarship(form);
    }
    setModalOpen(false);
    load();
  };

  // Delete scholarship
  const handleDelete = async id => {
    if (!window.confirm("تأكيد حذف المنحة؟")) return;
    await adminApi.deleteScholarship(id);
    load();
  };

  // Assign students
  const openAssignStudents = s => {
    setEditingId(s.id);
    setSelectedStudents(s.students?.map(st => st.id) || []);
    setAssignStudentsMode(true);
    setModalOpen(true);
  };
  const submitAssignStudents = async () => {
    await adminApi.assignStudentsToScholarship(editingId, selectedStudents);
    setModalOpen(false);
    load();
  };

  // Styles (inline for brevity)
  const S = {
    wrapper: { padding: 30, background: "#fff", borderRadius: 12, boxShadow: "0 4px 18px rgba(0,0,0,.07)" },
    topRow: { display: "flex", gap: 10, margin: "18px 0", alignItems: "center" },
    search: { flex: 1, padding: 10, borderRadius: 8, border: "1px solid #d0d6dd" },
    btn:  { padding: "8px 18px", background: "#004aad", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
    table: { width: "100%", borderCollapse: "collapse" },
    th:    { textAlign: "left", padding: "14px 16px", fontWeight: 600, background: "#f2f6fa", borderBottom: "1px solid #e3e8ee" },
    td:    { padding: "14px 16px", borderBottom: "1px solid #eff2f6" },
    actions: { textAlign: "center" },
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" },
    modal: { background: "#fff", padding: 24, borderRadius: 12, width: 400, boxShadow: "0 4px 18px rgba(0,0,0,.07)" },
    input: { width: "100%", padding: 10, margin: "8px 0", borderRadius: 6, border: "1px solid #ccc" },
    checkbox: { marginRight: 8 }
  };

  return (
    <section style={S.wrapper}>
      <h2>🎓 Manage Scholarships</h2>

      <div style={S.topRow}>
        <input
          placeholder="🔍 Search…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={S.search}
        />
        <button style={S.btn} onClick={openAdd}>Add Scholarship</button>
      </div>

      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Name</th>
            <th style={S.th}>Goal</th>
            <th style={S.th}>Donors</th>
            <th style={S.th}>Assigned Students</th>
            <th style={S.th}>Instructor</th>
            <th style={{ ...S.th, ...S.actions }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id}>
              <td style={S.td}>{s.name}</td>
              <td style={S.td}>${s.goalAmount}</td>
              <td style={S.td}>{s.donorCount}</td>
              <td style={S.td}>{s.students?.length || 0}</td>
              <td style={S.td}>{s.instructor?.fullName || "—"}</td>
              <td style={{ ...S.td, ...S.actions }}>
                <button style={S.btn}   onClick={() => openEdit(s)}>Edit</button>{" "}
                <button style={{ ...S.btn, background: "#ff4d4f" }} onClick={() => handleDelete(s.id)}>Delete</button>{" "}
                <button style={S.btn}   onClick={() => openAssignStudents(s)}>Assign Students</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} style={{ ...S.td, textAlign: "center", fontStyle: "italic" }}>
                No scholarships found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div style={S.modalOverlay}>
          <div style={S.modal}>
            {assignStudentsMode
              ? <>
                  <h3>Assign Students</h3>
                  {students.map(st => (
                    <div key={st.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(st.id)}
                          onChange={e => {
                            const next = e.target.checked
                              ? [...selectedStudents, st.id]
                              : selectedStudents.filter(x => x !== st.id);
                            setSelectedStudents(next);
                          }}
                          style={S.checkbox}
                        />
                        {st.fullName}
                      </label>
                    </div>
                  ))}
                  <div style={{ marginTop: 16, textAlign: "right" }}>
                    <button style={S.btn} onClick={submitAssignStudents}>Assign</button>
                    <button style={{ ...S.btn, background: "#ccc", color: "#333", marginLeft: 8 }} onClick={() => setModalOpen(false)}>Cancel</button>
                  </div>
                </>
              : <>
                  <h3>{isEditing ? "Edit Scholarship" : "Add Scholarship"}</h3>
                  <input
                    placeholder="Name"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    style={S.input}
                  />
                  <input
                    placeholder="Goal Amount"
                    type="number"
                    value={form.goalAmount}
                    onChange={e => setForm({...form, goalAmount: e.target.value})}
                    style={S.input}
                  />
                  <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    style={{ ...S.input, height: 80 }}
                  />
                  <select
                    value={form.donorId}
                    onChange={e => setForm({...form, donorId: e.target.value})}
                    style={S.input}
                  >
                    <option value="">Select Donor</option>
                    {students.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
                  </select>
                  <div style={{ marginTop: 16, textAlign: "right" }}>
                    <button style={S.btn} onClick={handleSubmit}>{isEditing ? "Save" : "Add"}</button>
                    <button style={{ ...S.btn, background: "#ccc", color: "#333", marginLeft: 8 }} onClick={() => setModalOpen(false)}>Cancel</button>
                  </div>
                </>
            }
          </div>
        </div>
      )}
    </section>
  );
}
