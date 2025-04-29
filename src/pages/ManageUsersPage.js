import { useNavigate } from "react-router-dom";

const ManageUsersPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👥 Manage Users</h2>
      <p>Here you can view, create, update, and delete users.</p>

      <button
        onClick={goBack}
        style={{
          marginTop: "20px",
          padding: "8px 16px",
          backgroundColor: "#6c63ff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        🔙 Go Back
      </button>
    </div>
  );
};

export default ManageUsersPage;
