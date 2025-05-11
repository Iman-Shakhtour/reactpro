import { useNavigate } from "react-router-dom";

const ManageCoursesPage = () => {
  const navigate = useNavigate();

 
  return (
    <div style={{ padding: "20px" }}>
      <h2>📚 Manage Courses</h2>
      <p>Here you can view, create, update, and delete courses.</p>

     
    </div>
  );
};

export default ManageCoursesPage;
