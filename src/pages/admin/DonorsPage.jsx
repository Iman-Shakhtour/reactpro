import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);

  const load = () => adminApi.getDonors().then(r => setDonors(r.data));
  useEffect(load, []);

  const del = async id => {
    if (window.confirm("Delete donor?")) {
      await adminApi.deleteDonor(id);
      load();
    }
  };

  return (
    <div>
      <h2>💰 Donors</h2>
      {donors.map(d => (
        <div key={d.id} style={row}>
          <span>{d.fullName} — {d.email}</span>
          <button onClick={() => del(d.id)}>🗑️</button>
        </div>
      ))}
    </div>
  );
};

const row = { display: "flex", justifyContent: "space-between", padding: "4px 0" };
export default DonorsPage;
