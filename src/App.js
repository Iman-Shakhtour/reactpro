import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ManageCoursesPage from "./pages/admin/ManageCoursesPage";
import ManageScholarshipsPage from "./pages/admin/ManageScholarshipsPage";
import StatisticsPage from "./pages/StatisticsPage";
import NotFoundPage from "./pages/NotFoundPage";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// ✅ student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import MyProgress from "./pages/student/MyProgress";
import MyProfile from "./pages/student/MyProfile";
import MyScholarships from "./pages/student/MyScholarships";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>

        {/* 🏠 Landing and Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* 🛡️ Layout Wrapper */}
        <Route element={<Layout />}>
          
          {/* 🔐 Admin */}
          <Route
  path="/dashboard/admin"
  element={
    <ProtectedRoute role="ROLE_ADMIN">
      <AdminDashboard />
    </ProtectedRoute>
  }
>
  <Route path="manage-users" element={<ManageUsersPage />} />
  <Route path="manage-courses" element={<ManageCoursesPage />} />
  <Route path="manage-scholarships" element={<ManageScholarshipsPage />} />
  <Route path="stats" element={<StatisticsPage />} />
</Route>


          {/* 🎓 Student Dashboard with nested routes */}
          <Route
  path="/dashboard/student"
  element={
    <ProtectedRoute role="ROLE_STUDENT">
      <StudentDashboard />
    </ProtectedRoute>
  }
>
  {/* هاي بتظهر داخل الـ <Outlet /> في StudentDashboard */}
  <Route path="courses" element={<MyCourses />} />
  <Route path="progress" element={<MyProgress />} />
  <Route path="profile" element={<MyProfile />} />
  <Route path="scholarships" element={<MyScholarships />} />
</Route>

          {/* 👨‍🏫 Instructor */}
          <Route
            path="/dashboard/instructor"
            element={
              <ProtectedRoute role="ROLE_INSTRUCTOR">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          {/* 💰 Donor */}
          <Route
            path="/dashboard/donor"
            element={
              <ProtectedRoute role="ROLE_DONOR">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ❌ 404 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
