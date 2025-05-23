import React, { useEffect, useState, useMemo } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";

export default function ManageScholarshipsPage() {
  /* ───────── state ───────── */
  const [scholarships, setScholarships] = useState([]);
  const [query, setQuery]               = useState("");

  const [modalMode, setModalMode]       = useState(null); // add|edit|assign-students|assign-courses|applications
  const [activeId,  setActiveId]        = useState(null);

  const [form, setForm] = useState({ name:"", totalAmount:"", slots:"", region:"" });

  const [students, setStudents]         = useState([]);
  const [courses , setCourses]          = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedCourses , setSelectedCourses ] = useState([]);

  const [applications, setApplications] = useState([]);   // for Applications modal

  /* ───────── init ───────── */
  const loadAll = async () => {
    const sch = await adminApi.getScholarships();
    const st  = await adminApi.getStudents();
    const co  = await adminApi.getCourses();
    setScholarships(sch.data.map(o=>o.content||o));
    setStudents(st.data);
    setCourses(co.data.map(o=>o.content||o));
  };
  useEffect(() => { loadAll(); }, []);

  /* ───────── filtering ───── */
  const filtered = useMemo(()=>{
    const q=query.toLowerCase();
    return scholarships.filter(s =>
      (s.name||"").toLowerCase().includes(q) ||
      String(s.totalAmount||"").includes(q)
    );
  },[scholarships,query]);

  /* ───────── CRUD handlers ─ */
  const openAdd = () => { setForm({name:"",totalAmount:"",slots:"",region:""}); setModalMode("add"); };
  const openEdit = sch  => {
    setActiveId(sch.id);
    setForm({
      name: sch.name,
      totalAmount: sch.totalAmount,
      slots: sch.availableSlots,
      region: sch.targetRegion
    });
    setModalMode("edit");
  };

  const saveAddEdit = async () => {
    const payload = {
      name:form.name,
      totalAmount:+form.totalAmount,
      availableSlots:+form.slots,
      targetRegion:form.region
    };
    try{
      modalMode==="add"
        ? await adminApi.createScholarship(payload)
        : await adminApi.updateScholarship(activeId,payload);
      toast.success("Saved!");
      setModalMode(null); await loadAll();
    }catch{ toast.error("Failed"); }
  };

  const deleteScholarship = async id => {
    if(!window.confirm("Delete scholarship?")) return;
    await adminApi.deleteScholarship(id); await loadAll();
  };

  /* ───────── assign ───────── */
  const openAssign = (mode,sch) => {
    setActiveId(sch.id);
    if(mode==="assign-students") setSelectedStudents(sch.assignedStudentIds||[]);
    else                          setSelectedCourses (sch.assignedCourseIds ||[]);
    setModalMode(mode);
  };
  const submitAssignStudents = async () => {
    await adminApi.assignStudentsToScholarship(activeId,selectedStudents);
    setModalMode(null); await loadAll();
  };
  const submitAssignCourses  = async () => {
    await adminApi.assignCoursesToScholarship(activeId,selectedCourses);
    setModalMode(null); await loadAll();
  };

  /* ───────── applications ─── */
  const openApplications = async sch => {
    setActiveId(sch.id);
    const res = await adminApi.getAllApplications();
    const apps = res.data.map(o=>o.content||o).filter(a=>a.scholarshipId===sch.id);
    setApplications(apps); setModalMode("applications");
  };
  const actOnApp = async (id,action) => {
    try{
      await (action==="approve"
        ? adminApi.approveApplication(id)
        : adminApi.rejectApplication(id));
      setApplications(applications.map(a=>a.id===id?{...a,status:action.toUpperCase()}:a));
      toast.success(`${action}d`);
    }catch{ toast.error("Failed"); }
  };

  /* ───────── UI ──────────── */
  return (
    <section style={S.wrapper}>
      <h2 style={S.header}>🎓 Manage Scholarships</h2>

      <div style={S.topRow}>
        <input style={S.search} placeholder="🔍 Search…" value={query} onChange={e=>setQuery(e.target.value)}/>
        <button style={S.btn} onClick={openAdd}>Add Scholarship</button>
      </div>

      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Name</th><th style={S.th}>Total Amount</th>
            <th style={S.th}>Slots</th><th style={S.th}>Region</th>
            <th style={S.th}>Students</th><th style={S.th}>Courses</th>
            <th style={{...S.th,...S.actions}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s=>(
            <tr key={s.id}>
              <td style={S.td}>{s.name}</td>
              <td style={S.td}>{s.totalAmount}</td>
              <td style={S.td}>{s.availableSlots}</td>
              <td style={S.td}>{s.targetRegion}</td>
              <td style={S.td}>{(s.assignedStudentIds||[]).length}</td>
              <td style={S.td}>{(s.assignedCourseIds ||[]).length}</td>
              <td style={S.td}>
                <div style={S.actionGrid}>
                  <button style={S.btn}    onClick={()=>openEdit(s)}>Edit</button>
                  <button style={S.btnRed} onClick={()=>deleteScholarship(s.id)}>Delete</button>
                  <button style={S.btn}    onClick={()=>openAssign("assign-students",s)}>Assign Students</button>
                  <button style={S.btn}    onClick={()=>openAssign("assign-courses",s)}>Assign Courses</button>
                  <button style={S.btnGreen} onClick={()=>openApplications(s)}>Applications</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ───────── Modal ───────── */}
      {modalMode && (
        <div style={S.modalOverlay}>
          <div style={S.modal}>
            {/* add / edit */}
            {(modalMode==="add"||modalMode==="edit") && (
              <>
                <h3>{modalMode==="add"?"Add":"Edit"} Scholarship</h3>
                {["name","totalAmount","slots","region"].map(k=>(
                  <input key={k} style={S.input} placeholder={k}
                         value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>
                ))}
                <div style={S.modalActions}>
                  <button style={S.btn} onClick={saveAddEdit}>Save</button>
                  <button style={S.btnGray} onClick={()=>setModalMode(null)}>Cancel</button>
                </div>
              </>
            )}

            {/* assign students */}
            {modalMode==="assign-students" && (
              <>
                <h3>Assign Students</h3>
                <div style={S.list}>{students.map(st=>(
                  <label key={st.id} style={S.label}>
                    <input type="checkbox" checked={selectedStudents.includes(st.id)}
                           onChange={e=>{
                             const next=e.target.checked
                               ? [...selectedStudents,st.id]
                               : selectedStudents.filter(x=>x!==st.id);
                             setSelectedStudents(next);
                           }}/> {st.fullName}
                  </label>
                ))}</div>
                <div style={S.modalActions}>
                  <button style={S.btn} onClick={submitAssignStudents}>Assign</button>
                  <button style={S.btnGray} onClick={()=>setModalMode(null)}>Cancel</button>
                </div>
              </>
            )}

            {/* assign courses */}
            {modalMode==="assign-courses" && (
              <>
                <h3>Assign Courses</h3>
                <div style={S.list}>{courses.map(c=>(
                  <label key={c.id} style={S.label}>
                    <input type="checkbox" checked={selectedCourses.includes(c.id)}
                           onChange={e=>{
                             const next=e.target.checked
                               ? [...selectedCourses,c.id]
                               : selectedCourses.filter(x=>x!==c.id);
                             setSelectedCourses(next);
                           }}/> {c.title}
                  </label>
                ))}</div>
                <div style={S.modalActions}>
                  <button style={S.btn} onClick={submitAssignCourses}>Assign</button>
                  <button style={S.btnGray} onClick={()=>setModalMode(null)}>Cancel</button>
                </div>
              </>
            )}

            {/* applications */}
            {modalMode==="applications" && (
              <>
                <h3>Applications ({applications.length})</h3>
                {applications.length===0
                  ? <p>No applications.</p>
                  : <table style={{...S.table,fontSize:14}}>
                      <thead><tr><th style={S.th}>Student</th><th style={S.th}>Status</th><th style={S.th}>Actions</th></tr></thead>
                      <tbody>{applications.map(a=>(
                        <tr key={a.id}>
                          <td style={S.td}>{a.studentId}</td>
                          <td style={S.td}>{a.status}</td>
                          <td style={S.td}>
                            <button style={S.btn}
                              disabled={a.status!=="PENDING"}
                              onClick={()=>actOnApp(a.id,"approve")}>Approve</button>{" "}
                            <button style={S.btnRed}
                              disabled={a.status!=="PENDING"}
                              onClick={()=>actOnApp(a.id,"reject")}>Reject</button>
                          </td>
                        </tr>
                      ))}</tbody>
                    </table>}
                <div style={S.modalActions}>
                  <button style={S.btnGray} onClick={()=>setModalMode(null)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ───────── styles ───────── */
const S = {
  wrapper:{padding:30,background:"#fff",borderRadius:12,boxShadow:"0 4px 18px rgba(0,0,0,.07)"},
  header:{marginTop:0},
  topRow:{display:"flex",gap:10,margin:"18px 0",alignItems:"center"},
  search:{flex:1,padding:10,borderRadius:8,border:"1px solid #d0d6dd"},
  table:{width:"100%",borderCollapse:"collapse"},
  th:{textAlign:"left",padding:"14px 16px",fontWeight:600,background:"#f2f6fa",borderBottom:"1px solid #e3e8ee"},
  td:{padding:"14px 16px",borderBottom:"1px solid #eff2f6"},
  actions:{textAlign:"right"},
  actionGrid:{display:"grid",gridTemplateColumns:"repeat(3,auto)",gap:"8px 10px",justifyContent:"flex-end"},
  btn:{padding:"6px 14px",background:"#004aad",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:13},
  btnRed:{padding:"6px 14px",background:"#ff4d4f",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:13},
  btnGreen:{padding:"6px 14px",background:"#10b981",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:13},
  btnGray:{padding:"6px 14px",background:"#ccc",color:"#333",border:"none",borderRadius:6,cursor:"pointer",fontSize:13},
  modalOverlay:{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center"},
  modal:{background:"#fff",padding:24,borderRadius:12,width:500,maxHeight:"80%",overflowY:"auto"},
  input:{width:"100%",padding:10,margin:"8px 0",borderRadius:6,border:"1px solid #ccc"},
  modalActions:{marginTop:16,textAlign:"right"},
  list:{maxHeight:320,overflowY:"auto",margin:"12px 0"},
  label:{display:"block",margin:"6px 0"}
};
