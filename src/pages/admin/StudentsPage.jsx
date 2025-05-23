import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);

  const load = () => adminApi.getStudents().then(r => setStudents(r.data));
  useEffect(load, []);

  const del = async id => {
    if (window.confirm("Delete student?")) {
      await adminApi.deleteStudent(id);
      load();
    }
  };

  return (
    <div>
      <h2>🧑‍🎓 Students</h2>
      {students.map(s => (
        <div key={s.id} style={row}>
          <span>{s.fullName} — {s.major}</span>
          <button onClick={() => del(s.id)}>🗑️</button>
        </div>
      ))}
    </div>
  );
};

const row = { display: "flex", justifyContent: "space-between", padding: "4px 0" };
export default StudentsPage;
