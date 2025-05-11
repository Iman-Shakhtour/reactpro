import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

const ScholarshipAppsPage = () => {
  const [apps, setApps] = useState([]);

  const load = () => adminApi.getScholarshipApps().then(res => setApps(res.data));
  useEffect(load, []);

  const act = async (id, action) => {
    await (action === "approve" ? adminApi.approveApp(id) : adminApi.rejectApp(id));
    load();
  };

  return (
    <div>
      <h2>📄 Scholarship Applications</h2>
      {apps.length === 0 ? <p>No applications.</p> : (
        <table>
          <thead><tr><th>ID</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {apps.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.status}</td>
                <td>
                  <button onClick={() => act(a.id, "approve")}>✅</button>
                  <button onClick={() => act(a.id, "reject")}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScholarshipAppsPage;
