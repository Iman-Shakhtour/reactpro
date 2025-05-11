import { useNavigate } from "react-router-dom";

const ManageScholarshipsPage = () => {
  const navigate = useNavigate();

  

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎓 Manage Scholarships</h2>
      <p>Here you can view, create, update, and delete scholarships.</p>

    </div>
  );
};

export default ManageScholarshipsPage;
