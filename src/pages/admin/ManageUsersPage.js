import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

export default function ManageUsersPage() {
  const [type, setType]   = useState("admins");
  const [users, setUsers] = useState([]);
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");

  /* -------- API fetch -------- */
  const fetcher = {
    admins:       () => adminApi.getAdmins(),
    students:     () => adminApi.getStudents(),
    instructors:  () => adminApi.getInstructors(),
    donors:       () => adminApi.getDonors(),
  };

  const loader = () => fetcher[type]().then(r => setUsers(Array.isArray(r.data) ? r.data : []));

  useEffect(loader, [type]);

  /* -------- create / delete -------- */
  const create = async () => {
    if (!name.trim()) return;
    if (type === "admins")
      await adminApi.createAdmin({ fullName: name, email, adminLevel: "BASIC" });
    else if (type === "instructors")
      await adminApi.createInstructor({ fullName: name, email });
    setName(""); setEmail(""); loader();
  };

  const remove = async id => {
    if (!window.confirm("Are you sure?")) return;
    const apiRemove = {
      admins:      () => adminApi.deleteAdmin(id),
      instructors: () => adminApi.deleteInstructor(id),
      students:    () => adminApi.deleteStudent(id),
      donors:      () => adminApi.deleteDonor(id),
    };
    await apiRemove[type](); loader();
  };

  /* -------- UI -------- */
  return (
    <section style={card}>
      <h2 style={{ marginTop: 0 }}>Manage Users</h2>

      {/* النوع */}
      <select value={type} onChange={e => setType(e.target.value)} style={select}>
        <option value="admins">Admins</option>
        <option value="students">Students</option>
        <option value="instructors">Instructors</option>
        <option value="donors">Donors</option>
      </select>

      {/* فورم الإضافة (لنوعين فقط) */}
      {(type === "admins" || type === "instructors") && (
        <div style={{ display: "flex", gap: 10, margin: "18px 0" }}>
          <input style={input} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
          <input style={input} placeholder="Email"     value={email} onChange={e => setEmail(e.target.value)} />
          <button style={btnBlue} onClick={create}>Add</button>
        </div>
      )}

      {/* القائمة */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map(u => (
          <li key={u.id} style={userRow}>
            <span>{u.fullName || u.name} {u.email && `— ${u.email}`}</span>
            <button onClick={() => remove(u.id)} style={btnRed}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- styles ---------- */
const card = {
  background: "white",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
  maxWidth: 680,
};

const select = { padding: 10, borderRadius: 6, border: "1px solid #ccc" };
const input  = { ...select, flex: 1 };
const btnBlue= { padding: "10px 18px", background: "#008CFF", color: "white", border: "none",
                 borderRadius: 6, cursor: "pointer", fontWeight: 600 };
const btnRed = { ...btnBlue, background: "#ff4d4f" };

const userRow = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "12px 0", borderBottom: "1px solid #eff2f6", fontSize: 15,
};
