// src/pages/admin/ManageUsersPage.js
import React, { useEffect, useMemo, useState } from "react";
import adminApi from "../../api/adminApi";

export default function ManageUsersPage() {
  const [type, setType]           = useState("admins");
  const [users, setUsers]         = useState([]);
  const [query, setQuery]         = useState("");

  // edit state
  const [editId, setEditId]       = useState(null);
  const [editName, setEditName]   = useState("");
  const [editEmail, setEditEmail] = useState("");

  // add state
  const [showAdd, setShowAdd]     = useState(false);
  const [newName, setNewName]     = useState("");
  const [newEmail, setNewEmail]   = useState("");

  // helper: singular form, capitalized
  const singular = type.slice(0, -1);
  const label = singular.charAt(0).toUpperCase() + singular.slice(1);

  // fetch functions map
  const fetcher = {
    admins:      () => adminApi.getAdmins(),
    students:    () => adminApi.getStudents(),
    instructors: () => adminApi.getInstructors(),
    donors:      () => adminApi.getDonors(),
  };

  // load users, unwrap HATEOAS if needed
  const load = async () => {
    try {
      const res = await fetcher[type]();
      let list = [];
      // array of EntityModels?
      if (Array.isArray(res.data)) {
        list = res.data.map(item => item.content || item);
      } else if (res.data._embedded) {
        const embedded = Object.values(res.data._embedded)[0];
        list = embedded.map(item => item.content || item);
      }
      setUsers(list);
    } catch (err) {
      console.error("Load users failed", err);
    }
  };

  useEffect(() => {
    load();
  }, [type]);

  // search filter
  const filtered = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(u =>
      (u.fullName || u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  // remove user
  const remove = async id => {
    if (!window.confirm(`Delete this ${singular}?`)) return;
    const fn = {
      admins:      () => adminApi.deleteAdmin(id),
      students:    () => adminApi.deleteStudent(id),
      instructors: () => adminApi.deleteInstructor(id),
      donors:      () => adminApi.deleteDonor(id),
    }[type];
    await fn();
    load();
  };

  // start editing
  const startEdit = u => {
    setEditId(u.id);
    setEditName(u.fullName || u.name);
    setEditEmail(u.email);
  };

  // save edit
  const saveEdit = async () => {
    const payload = { fullName: editName, email: editEmail };
    const fn = {
      admins:      () => adminApi.updateAdmin(editId, payload),
      students:    () => adminApi.updateStudent(editId, payload),
      instructors: () => adminApi.updateInstructor(editId, payload),
      donors:      () => adminApi.deleteDonor(editId), // or no-op
    }[type];
    await fn();
    cancelEdit();
    load();
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditEmail("");
  };

  // add new
  const handleAdd = async () => {
    const payload = { fullName: newName, email: newEmail };
    const fn = {
      admins:      () => adminApi.createAdmin(payload),
      students:    () => Promise.reject("Creation not supported"),
      instructors: () => adminApi.createInstructor(payload),
      donors:      () => Promise.reject("Creation not supported"),
    }[type];

    try {
      await fn();
      setShowAdd(false);
      setNewName("");
      setNewEmail("");
      load();
    } catch (err) {
      alert(err?.toString() || "Cannot create this type");
    }
  };

  // styles
  const S = {
    wrapper:   { padding:30, background:"#fff", borderRadius:12, boxShadow:"0 4px 18px rgba(0,0,0,.07)" },
    header:    { marginTop:0 },
    select:    { padding:10, borderRadius:6, border:"1px solid #ccc", marginRight:10 },
    searchRow: { display:"flex", gap:10, margin:"18px 0" },
    search:    { flex:1, padding:10, borderRadius:8, border:"1px solid #d0d6dd" },
    table:     { width:"100%", borderCollapse:"collapse" },
    th:        { textAlign:"left", padding:"14px 16px", fontWeight:600, background:"#f2f6fa", borderBottom:"1px solid #e3e8ee" },
    td:        { padding:"14px 16px", borderBottom:"1px solid #eff2f6", fontSize:15 },
    actions:   { textAlign:"center" },
    btnBlue:   { padding:"8px 18px", background:"#004aad", color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontWeight:500 },
    btnRed:    { padding:"8px 18px", background:"#ff4d4f", color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontWeight:500 },
    modalOverlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center" },
    modal:     { background:"#fff", padding:24, borderRadius:12, width:400 }
  };

  return (
    <section style={S.wrapper}>
      <h2 style={S.header}>Manage Users</h2>

      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          style={S.select}
        >
          <option value="admins">Admins</option>
          <option value="students">Students</option>
          <option value="instructors">Instructors</option>
          <option value="donors">Donors</option>
        </select>
        <button style={S.btnBlue} onClick={() => setShowAdd(true)}>
          Add {label}
        </button>
      </div>

      <div style={S.searchRow}>
        <input
          placeholder="🔍 Search…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={S.search}
        />
      </div>

      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Name</th>
            <th style={S.th}>Email</th>
            <th style={S.th}>Role</th>
            <th style={{ ...S.th, ...S.actions }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td style={S.td}>
                {editId === u.id
                  ? <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      style={S.select}
                    />
                  : (u.fullName || u.name)
                }
              </td>
              <td style={S.td}>
                {editId === u.id
                  ? <input
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      style={S.select}
                    />
                  : u.email || "—"
                }
              </td>
              <td style={S.td}>{label}</td>
              <td style={{ ...S.td, ...S.actions }}>
                {editId === u.id
                  ? <>
                      <button style={S.btnBlue} onClick={saveEdit}>Save</button>&nbsp;
                      <button style={S.btnRed} onClick={cancelEdit}>Cancel</button>
                    </>
                  : <>
                      <button style={S.btnBlue} onClick={() => startEdit(u)}>Edit</button>&nbsp;
                      <button style={S.btnRed} onClick={() => remove(u.id)}>Delete</button>
                    </>
                }
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={4} style={{ ...S.td, textAlign:"center", fontStyle:"italic" }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showAdd && (
        <div style={S.modalOverlay}>
          <div style={S.modal}>
            <h3>Add {label}</h3>
            <input
              placeholder="Full Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{ ...S.select, width:"100%", marginBottom:10 }}
            />
            <input
              placeholder="Email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              style={{ ...S.select, width:"100%", marginBottom:20 }}
            />
            <div style={{ textAlign:"right" }}>
              <button style={S.btnBlue} onClick={handleAdd}>Add</button>&nbsp;
              <button style={S.btnRed} onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
