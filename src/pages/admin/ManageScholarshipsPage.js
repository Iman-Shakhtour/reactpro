// src/pages/admin/ManageScholarshipsPage.js
import React, { useEffect, useState, useMemo } from "react";
import adminApi from "../../api/adminApi";

export default function ManageScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [query, setQuery]               = useState("");

  // modal state: "add", "edit", "assign-students", "assign-courses"
  const [modalMode, setModalMode]       = useState(null);
  const [activeId, setActiveId]         = useState(null);

  // form for add/edit
  const [form, setForm] = useState({
    name: "",
    totalAmount: "",
    slots: "",
    region: ""
  });

  // data for assignments
  const [students, setStudents]         = useState([]);
  const [courses, setCourses]           = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedCourses, setSelectedCourses]   = useState([]);

  // load scholarships, students, courses
  const loadAll = async () => {
    // scholarships
    const schRes = await adminApi.getScholarships();
    const schList = Array.isArray(schRes.data)
      ? schRes.data.map(item => item.content || item)
      : [];
    setScholarships(schList);

    // students
    const stRes = await adminApi.getStudents();
    setStudents(Array.isArray(stRes.data) ? stRes.data : []);

    // courses
    const coRes = await adminApi.getCourses();
    const coList = Array.isArray(coRes.data)
      ? coRes.data.map(item => item.content || item)
      : [];
    setCourses(coList);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // filtered scholarships by name or amount
  const filtered = useMemo(() => {
    if (!query.trim()) return scholarships;
    const q = query.toLowerCase();
    return scholarships.filter(s =>
      (s.name           || "").toLowerCase().includes(q) ||
      String(s.totalAmount).includes(q)
    );
  }, [scholarships, query]);

  // open add/edit modal
  const openAddEdit = (mode, sch = null) => {
    setModalMode(mode);
    if (mode === "edit" && sch) {
      setActiveId(sch.id);
      setForm({
        name:        sch.name,
        totalAmount: sch.totalAmount,
        slots:       sch.availableSlots,
        region:      sch.targetRegion
      });
    } else {
      setActiveId(null);
      setForm({ name: "", totalAmount: "", slots: "", region: "" });
    }
  };

  // open assign modal
  const openAssign = (mode, sch) => {
    setModalMode(mode);
    setActiveId(sch.id);
    if (mode === "assign-students") {
      setSelectedStudents(sch.assignedStudentIds || []);
    } else {
      setSelectedCourses(sch.assignedCourseIds || []);
    }
  };

  // save add/edit
  const handleSave = async () => {
    const payload = {
      name:           form.name,
      totalAmount:    parseFloat(form.totalAmount) || 0,
      availableSlots: parseInt(form.slots, 10)      || 0,
      targetRegion:   form.region
    };
    if (modalMode === "add") {
      await adminApi.createScholarship(payload);
    } else {
      await adminApi.updateScholarship(activeId, payload);
    }
    await loadAll();
    setModalMode(null);
  };

  // delete scholarship
  const handleDelete = async id => {
    if (!window.confirm("تأكيد حذف المنحة؟")) return;
    await adminApi.deleteScholarship(id);
    await loadAll();
  };

  // assign students
  const handleAssignStudents = async () => {
    await adminApi.assignStudentsToScholarship(activeId, selectedStudents);
    await loadAll();
    setModalMode(null);
  };

  // assign courses
  const handleAssignCourses = async () => {
    await adminApi.assignCoursesToScholarship(activeId, selectedCourses);
    await loadAll();
    setModalMode(null);
  };

  return (
    <section style={S.wrapper}>
      <h2 style={S.header}>🎓 Manage Scholarships</h2>

      <div style={S.topRow}>
        <input
          placeholder="🔍 Search…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={S.search}
        />
        <button style={S.btn} onClick={() => openAddEdit("add")}>
          Add Scholarship
        </button>
      </div>

      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Name</th>
            <th style={S.th}>Total Amount</th>
            <th style={S.th}>Slots</th>
            <th style={S.th}>Region</th>
            <th style={S.th}>Assigned Students</th>
            <th style={S.th}>Assigned Courses</th>
            <th style={{ ...S.th, ...S.actions }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id}>
              <td style={S.td}>{s.name}</td>
              <td style={S.td}>{s.totalAmount}</td>
              <td style={S.td}>{s.availableSlots}</td>
              <td style={S.td}>{s.targetRegion}</td>
              <td style={S.td}>{(s.assignedStudentIds || []).length}</td>
              <td style={S.td}>{(s.assignedCourseIds  || []).length}</td>
              <td style={S.td}>
                <div style={S.actionGrid}>
                  <button style={S.btn} onClick={() => openAddEdit("edit", s)}>
                    Edit
                  </button>
                  <button style={S.btnRed} onClick={() => handleDelete(s.id)}>
                    Delete
                  </button>
                  <button
                    style={S.btn}
                    onClick={() => openAssign("assign-students", s)}
                  >
                    Assign Students
                  </button>
                  <button
                    style={S.btn}
                    onClick={() => openAssign("assign-courses", s)}
                  >
                    Assign Courses
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalMode && (
        <div style={S.modalOverlay}>
          <div style={S.modal}>
            {/* Add / Edit Scholarship */}
            {(modalMode === "add" || modalMode === "edit") && (
              <>
                <h3>{modalMode === "add" ? "Add" : "Edit"} Scholarship</h3>
                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={e =>
                    setForm(f => ({ ...f, name: e.target.value }))
                  }
                  style={S.input}
                />
                <input
                  placeholder="Total Amount"
                  type="number"
                  value={form.totalAmount}
                  onChange={e =>
                    setForm(f => ({ ...f, totalAmount: e.target.value }))
                  }
                  style={S.input}
                />
                <input
                  placeholder="Slots"
                  type="number"
                  value={form.slots}
                  onChange={e =>
                    setForm(f => ({ ...f, slots: e.target.value }))
                  }
                  style={S.input}
                />
                <input
                  placeholder="Region"
                  value={form.region}
                  onChange={e =>
                    setForm(f => ({ ...f, region: e.target.value }))
                  }
                  style={S.input}
                />
                <div style={S.modalActions}>
                  <button style={S.btn} onClick={handleSave}>
                    Save
                  </button>
                  <button
                    style={{ ...S.btn, background: "#ccc", color: "#333" }}
                    onClick={() => setModalMode(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Assign Students */}
            {modalMode === "assign-students" && (
              <>
                <h3>Assign Students</h3>
                <div style={S.listContainer}>
                  {students.map(st => (
                    <label key={st.id} style={S.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(st.id)}
                        onChange={e => {
                          const next = e.target.checked
                            ? [...selectedStudents, st.id]
                            : selectedStudents.filter(x => x !== st.id);
                          setSelectedStudents(next);
                        }}
                      />
                      {" " + st.fullName}
                    </label>
                  ))}
                </div>
                <div style={S.modalActions}>
                  <button style={S.btn} onClick={handleAssignStudents}>
                    Assign
                  </button>
                  <button
                    style={{ ...S.btn, background: "#ccc", color: "#333" }}
                    onClick={() => setModalMode(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Assign Courses */}
            {modalMode === "assign-courses" && (
              <>
                <h3>Assign Courses</h3>
                <div style={S.listContainer}>
                  {courses.map(c => (
                    <label key={c.id} style={S.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(c.id)}
                        onChange={e => {
                          const next = e.target.checked
                            ? [...selectedCourses, c.id]
                            : selectedCourses.filter(x => x !== c.id);
                          setSelectedCourses(next);
                        }}
                      />
                      {" " + c.title}
                    </label>
                  ))}
                </div>
                <div style={S.modalActions}>
                  <button style={S.btn} onClick={handleAssignCourses}>
                    Assign
                  </button>
                  <button
                    style={{ ...S.btn, background: "#ccc", color: "#333" }}
                    onClick={() => setModalMode(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

const S = {
  wrapper:      { padding: 30, background: "#fff", borderRadius: 12, boxShadow: "0 4px 18px rgba(0,0,0,.07)" },
  header:       { marginTop: 0 },
  topRow:       { display: "flex", gap: 10, margin: "18px 0", alignItems: "center" },
  search:       { flex: 1, padding: 10, borderRadius: 8, border: "1px solid #d0d6dd" },
  btn:          { padding: "8px 18px", background: "#004aad", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
  btnRed:       { padding: "8px 18px", background: "#ff4d4f", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
  table:        { width: "100%", borderCollapse: "collapse" },
  th:           { textAlign: "left", padding: "14px 16px", fontWeight: 600, background: "#f2f6fa", borderBottom: "1px solid #e3e8ee" },
  td:           { padding: "14px 16px", borderBottom: "1px solid #eff2f6", verticalAlign: "top" },
  actions:      { textAlign: "right" },
  actionGrid:   {
    display:           "grid",
    gridTemplateColumns: "repeat(2, auto)",
    gap:               "8px 12px",
    justifyContent:    "flex-end",
    alignItems:        "center"
  },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" },
  modal:        { background: "#fff", padding: 24, borderRadius: 12, width: 400, maxHeight: "80%", overflowY: "auto" },
  input:        { width: "100%", padding: 8, margin: "8px 0", border: "1px solid #ccc", borderRadius: 6 },
  modalActions: { marginTop: 16, textAlign: "right" },
  listContainer:{ maxHeight: 300, overflowY: "auto", margin: "12px 0", padding: "0 4px" },
  checkboxLabel:{ display: "block", margin: "4px 0", cursor: "pointer" }
};
