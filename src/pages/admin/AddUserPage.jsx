import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";

export default function ManageUsersPage() {
  const navigate = useNavigate();

  const [type, setType] = useState("admins");
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const fetcher = {
    admins: () => adminApi.getAdmins(),
    instructors: () => adminApi.getInstructors(),
    students: () => adminApi.getStudents(),
    donors: () => adminApi.getDonors(),
  };

  const loader = () => fetcher[type]().then(r => setUsers(Array.isArray(r.data) ? r.data : []));
  useEffect(() => {
    loader();
  }, [type]);

  const filtered = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(
      u => (u.fullName || u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  const remove = async id => {
    if (!window.confirm("Delete user?")) return;
    const apiRemove = {
      admins: () => adminApi.deleteAdmin(id),
      instructors: () => adminApi.deleteInstructor(id),
      students: () => adminApi.deleteStudent(id),
      donors: () => adminApi.deleteDonor(id),
    };
    await apiRemove[type]();
    loader();
  };

  const startEdit = u => {
    setEditId(u.id);
    setEditName(u.fullName || u.name);
    setEditEmail(u.email);
  };
  const saveEdit = async () => {
    const updated = { fullName: editName, email: editEmail };
    if (type === "admins") await adminApi.updateAdmin(editId, updated);
    if (type === "instructors") await adminApi.updateInstructor(editId, updated);
    if (type === "students") await adminApi.updateStudent(editId, updated);
    if (type === "donors") await adminApi.updateDonor(editId, updated);
    cancelEdit();
    loader();
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditEmail("");
  };

  const S = {
    wrapper: {
      padding: 30,
      background: "white",
      borderRadius: 12,
      boxShadow: "0 4px 18px rgba(0,0,0,.07)",
    },
    header: { marginTop: 0 },
    select: { padding: 10, borderRadius: 6, border: "1px solid #ccc" },
    searchRow: { display: "flex", gap: 10, margin: "18px 0" },
    search: { flex: 1, padding: 10, borderRadius: 8, border: "1px solid #d0d6dd" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      textAlign: "left",
      padding: "14px 16px",
      fontWeight: 600,
      fontSize: 14,
      background: "#f2f6fa",
      borderBottom: "1px solid #e3e8ee",
    },
    td: {
      padding: "14px 16px",
      borderBottom: "1px solid #eff2f6",
      fontSize: 15,
    },
    avatar: { width: 36, height: 36, borderRadius: "50%", marginRight: 12 },
    btnBlue: {
      padding: "8px 18px",
      background: "#004aad",
      color: "white",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 500,
    },
    btnRed: {
      padding: "8px 18px",
      background: "#ff4d4f",
      color: "white",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 500,
    },
  };

  const goToAdd = () => navigate("/dashboard/admin/manage-users/add"); // absolute path fix

  return (
    <section style={S.wrapper}>
      <h2 style={S.header}>Manage Users</h2>

      <select value={type} onChange={e => setType(e.target.value)} style={S.select}>
        <option value="admins">Admins</option>
        <option value="students">Students</option>
        <option value="instructors">Instructors</option>
        <option value="donors">Donors</option>
      </select>

      <div style={S.searchRow}>
        <input
          placeholder="🔍 Search…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={S.search}
        />
        <button style={S.btnBlue} onClick={goToAdd}>
          Add
        </button>
      </div>

      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Name</th>
            <th style={S.th}>Email</th>
            <th style={S.th}>Role</th>
            <th style={{ ...S.th, textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td style={S.td}>
                {editId === u.id ? (
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    style={S.select}
                  />
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`https://api.dicebear.com/6.x/bottts/svg?seed=${u.fullName || u.name}`}
                      alt="avatar"
                      style={S.avatar}
                    />
                    {u.fullName || u.name}
                  </div>
                )}
              </td>
              <td style={S.td}>
                {editId === u.id ? (
                  <input
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    style={S.select}
                  />
                ) : (
                  u.email || "—"
                )}
              </td>
              <td style={S.td}>
                {(u.role || type.slice(0, -1)).replace("ROLE_", "")}
              </td>
              <td style={{ ...S.td, textAlign: "center" }}>
                {editId === u.id ? (
                  <>
                    <button style={S.btnBlue} onClick={saveEdit}>
                      Save
                    </button>
                    &nbsp;
                    <button style={S.btnRed} onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button style={S.btnBlue} onClick={() => startEdit(u)}>
                      Edit
                    </button>
                    &nbsp;
                    <button style={S.btnRed} onClick={() => remove(u.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td
                colSpan={4}
                style={{ ...S.td, textAlign: "center", fontStyle: "italic" }}
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
