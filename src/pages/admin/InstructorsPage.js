import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

const InstructorsPage = () => {
  const [ins, setIns] = useState([]);

  const load = () => adminApi.getInstructors().then(r => setIns(r.data));
  useEffect(load, []);

  const del = async id => {
    if (window.confirm("Delete instructor?")) {
      await adminApi.deleteInstructor(id);
      load();
    }
  };

  return (
    <div>
      <h2>👨‍🏫 Instructors</h2>
      {ins.map(i => (
        <div key={i.id} style={row}>
          <span>{i.fullName} — {i.email}</span>
          <button onClick={() => del(i.id)}>🗑️</button>
        </div>
      ))}
    </div>
  );
};

const row = { display: "flex", justifyContent: "space-between", padding: "4px 0" };
export default InstructorsPage;
