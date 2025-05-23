// src/pages/admin/ManageUsersPage.js
import { useEffect, useMemo, useState } from "react";
import adminApi from "../../api/adminApi";
import { HiPlus, HiTrash, HiPencil, HiCheck, HiX } from "react-icons/hi";
import { toast } from "react-toastify";

/* ---------- helpers ---------- */
const labelOf = t => t.slice(0, -1).replace(/^./, c => c.toUpperCase());
const defaultNew  = { fullName:"", email:"", password:"", major:"", specialty:"" };
const defaultEdit = { id:null, fullName:"", email:"", major:"" };

export default function ManageUsersPage() {

  /* ---------- state ---------- */
  const [type,   setType]   = useState("admins");   // admins | students | instructors | donors
  const [list,   setList]   = useState([]);
  const [query,  setQuery]  = useState("");

  /* add / edit state */
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ ...defaultNew });
  const [edit,    setEdit]    = useState({ ...defaultEdit });

  /* ---------- fetch ---------- */
  const loaders = {
    admins      : adminApi.getAdmins,
    students    : adminApi.getStudents,
    instructors : adminApi.getInstructors,
    donors      : adminApi.getDonors,
  };

  const load = async () => {
    try {
      const { data } = await loaders[type]();
      /* unwrap HATEOAS if present */
      const rows = (Array.isArray(data)
          ? data
          : data._embedded
              ? Object.values(data._embedded)[0]
              : []
        ).map(i => i.content || i);
      setList(rows);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load data");
    }
  };

  /* mount / type‑change */
  useEffect(() => { load(); }, [type]);

  /* ---------- search ---------- */
  const filtered = useMemo(() => {
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(u =>
      (u.fullName || u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  }, [list, query]);

  /* ---------- CRUD helpers ---------- */
  const calls = {
    delete: {
      admins      : id => adminApi.deleteAdmin(id),
      students    : id => adminApi.deleteStudent(id),
      instructors : id => adminApi.deleteInstructor(id),
      donors      : id => adminApi.deleteDonor(id),
    },
    update: {
      admins      : (id,d)=> adminApi.updateAdmin(id,d),
      students    : (id,d)=> adminApi.updateStudent(id,d),
      instructors : (id,d)=> adminApi.updateInstructor(id,d),
    },
    create: {
      admins      : d => adminApi.createAdmin(d),
      students    : d => adminApi.createStudent(d),
      instructors : d => adminApi.createInstructor(d),
    }
  };

  const remove = async id => {
    if (!window.confirm("Delete?")) return;
    try { await calls.delete[type](id);  await load(); toast.success("Deleted"); }
    catch(e){ toast.error(e.response?.data?.message || "Delete failed"); }
  };

  const saveEdit = async () => {
    const { id, fullName, email, major } = edit;
    const payload = { fullName, email, ...(type==="students" && major.trim() ? { major:major.trim() } : {}) };
    try { await calls.update[type](id, payload); setEdit({ ...defaultEdit }); await load(); toast.success("Saved"); }
    catch(e){ toast.error(e.response?.data?.message || "Update failed"); }
  };

  const addOne = async () => {
    const { fullName, email, password, major, specialty } = newUser;
    let payload = {};
    if (type==="admins") {
      if (!password.trim()) return toast.error("Password required");
      payload = { fullName, email, password };
    } else if (type==="students") {
      if (!major.trim())     return toast.error("Major required");
      if (!password.trim())  return toast.error("Password required");
      payload = { fullName, email, password, major };
    } else if (type==="instructors") {
      payload = { fullName, email, password, specialty };
    } else { return toast.error("Cannot create this role"); }

    try { await calls.create[type](payload); setShowAdd(false); setNewUser({ ...defaultNew }); await load(); toast.success("Added"); }
    catch(e){ toast.error(e.response?.data?.message || "Create failed"); }
  };

  /* ---------- styles (design) ---------- */
  const S = {
    card:        { padding:30, background:"#fff", borderRadius:12, boxShadow:"0 4px 18px rgba(0,0,0,.07)" },
    h2:          { margin:0, marginBottom:24 },
    select:      { padding:10, borderRadius:6, border:"1px solid #ccc" },
    btnGreen:    { padding:"10px 18px", background:"#059669", color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontWeight:500 },
    searchRow:   { display:"flex", gap:12, margin:"24px 0" },
    search:      { flex:1, padding:12, borderRadius:8, border:"1px solid #d1d5db" },
    table:       { width:"100%", borderCollapse:"collapse" },
    th:          { textAlign:"left", padding:"14px 16px", background:"#f3f4f6", fontWeight:600, borderBottom:"1px solid #e5e7eb" },
    td:          { padding:"14px 16px", borderBottom:"1px solid #f3f4f6" },
    actions:     { whiteSpace:"nowrap", textAlign:"center" },
    btnBlue:     { padding:"6px 14px", background:"#2563eb", color:"#fff", border:"none", borderRadius:4, cursor:"pointer" },
    btnRed:      { padding:"6px 14px", background:"#dc2626", color:"#fff", border:"none", borderRadius:4, cursor:"pointer" },
    modalBg:     { position:"fixed", inset:0, background:"rgba(0,0,0,.35)", display:"flex", alignItems:"center", justifyContent:"center" },
    modal:       { background:"#fff", padding:24, borderRadius:12, width:380 },
    input:       { width:"100%", padding:10, borderRadius:6, border:"1px solid #d1d5db", marginBottom:12 }
  };

  /* ---------- UI ---------- */
  return (
    <section style={S.card}>
      <h2 style={S.h2}>Manage Users</h2>

      {/* top controls */}
      <div style={{ display:"flex", gap:12 }}>
        <select value={type} onChange={e=>setType(e.target.value)} style={S.select}>
          <option value="admins">Admins</option>
          <option value="students">Students</option>
          <option value="instructors">Instructors</option>
          <option value="donors">Donors</option>
        </select>

        <button style={{ ...S.btnGreen, opacity:type==="donors"?0.5:1 }} disabled={type==="donors"} onClick={()=>setShowAdd(true)}>
          <HiPlus style={{ verticalAlign:"middle" }}/> Add {labelOf(type)}
        </button>
      </div>

      {/* search */}
      <div style={S.searchRow}>
        <input
          placeholder="🔍 Search…"
          style={S.search}
          value={query}
          onChange={e=>setQuery(e.target.value)}
        />
      </div>

      {/* table */}
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Name</th>
            <th style={S.th}>Email</th>
            {type==="students" && <th style={S.th}>Major</th>}
            <th style={S.th}>Role</th>
            <th style={{ ...S.th, textAlign:"center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              {/* name */}
              <td style={S.td}>
                {edit.id===u.id
                  ? <input style={S.input} value={edit.fullName} onChange={e=>setEdit({...edit, fullName:e.target.value})}/>
                  : (u.fullName || u.name)
                }
              </td>

              {/* email */}
              <td style={S.td}>
                {edit.id===u.id
                  ? <input style={S.input} value={edit.email} onChange={e=>setEdit({...edit, email:e.target.value})}/>
                  : (u.email || "—")
                }
              </td>

              {/* major (students only) */}
              {type==="students" && (
                <td style={S.td}>
                  {edit.id===u.id
                    ? <input style={S.input} value={edit.major} onChange={e=>setEdit({...edit, major:e.target.value})}/>
                    : (u.major || "—")
                  }
                </td>
              )}

              {/* role */}
              <td style={S.td}>{labelOf(type)}</td>

              {/* actions */}
              <td style={{ ...S.td, ...S.actions }}>
                {edit.id===u.id
                  ? <>
                      <button style={S.btnBlue} onClick={saveEdit}><HiCheck/></button> 
                      <button style={S.btnRed}  onClick={()=>setEdit({...defaultEdit})}><HiX/></button>
                    </>
                  : <>
                      {type!=="donors" &&
                        <button style={S.btnBlue} onClick={()=>setEdit({ id:u.id, fullName:u.fullName||u.name, email:u.email||"", major:u.major||"" })}>
                          <HiPencil/>
                        </button>} 
                      <button style={S.btnRed} onClick={()=>remove(u.id)}><HiTrash/></button>
                    </>
                }
              </td>
            </tr>
          ))}
          {filtered.length===0 && (
            <tr><td colSpan={type==="students"?5:4} style={{ ...S.td, textAlign:"center", fontStyle:"italic" }}>No data.</td></tr>
          )}
        </tbody>
      </table>

      {/* modal add */}
      {showAdd && (
        <div style={S.modalBg}>
          <div style={S.modal}>
            <h3>Add {labelOf(type)}</h3>

            <input
              placeholder="Full name"
              style={S.input}
              value={newUser.fullName}
              onChange={e=>setNewUser({...newUser, fullName:e.target.value})}
            />
            <input
              placeholder="Email"
              style={S.input}
              value={newUser.email}
              onChange={e=>setNewUser({...newUser, email:e.target.value})}
            />
            {(type==="admins" || type==="students" || type==="instructors") && (
              <input
                type="password"
                placeholder="Password"
                style={S.input}
                value={newUser.password}
                onChange={e=>setNewUser({...newUser, password:e.target.value})}
              />
            )}
            {type==="students" && (
              <input
                placeholder="Major"
                style={S.input}
                value={newUser.major}
                onChange={e=>setNewUser({...newUser, major:e.target.value})}
              />
            )}
            {type==="instructors" && (
              <input
                placeholder="Specialty"
                style={S.input}
                value={newUser.specialty}
                onChange={e=>setNewUser({...newUser, specialty:e.target.value})}
              />
            )}

            <div style={{ textAlign:"right", marginTop:4 }}>
              <button style={S.btnBlue} onClick={addOne}>Add</button> 
              <button style={S.btnRed}  onClick={()=>setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
