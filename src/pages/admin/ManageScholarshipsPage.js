// src/pages/admin/ManageScholarshipsPage.js
import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

const ManageScholarshipsPage = () => {
  const [scholarships, setList] = useState([]);
  const [name, setName]         = useState("");

  const load = () =>
    adminApi.getScholarships?.().then(res => setList(res.data));
  useEffect(() => { load?.(); }, []);

  const add = async () => {
    if (!name.trim()) return;
    await adminApi.createScholarship({ name });
    setName("");
    load?.();
  };

  return (
    <div>
      <h2>🎓 Manage Scholarships</h2>

      <div style={{ margin: "10px 0" }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Scholarship name"
        />
        <button onClick={add}>➕ Add</button>
      </div>

      <ul>
        {scholarships?.map(s => <li key={s.id}>{s.name}</li>)}
      </ul>
    </div>
  );
};

export default ManageScholarshipsPage;
