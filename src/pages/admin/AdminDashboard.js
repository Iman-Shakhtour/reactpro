import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      {/* أي محتوى تريده هنا (مثل Sidebar، عنوان) */}
      <Outlet />  {/* هذا ضروري لعرض صفحات الأبناء مثل manage-users/add */}
    </div>
  );
};

export default AdminDashboard;
