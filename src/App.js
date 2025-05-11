import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";

// Layout & Protected Routing
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import MyProgress from "./pages/student/MyProgress";
import MyProfile from "./pages/student/MyProfile";
import MyScholarships from "./pages/student/MyScholarships";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardHome from "./pages/admin/DashboardHome";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import AddUserPage from "./pages/admin/AddUserPage";
import ManageCoursesPage from "./pages/admin/ManageCoursesPage";
import ManageScholarshipsPage from "./pages/admin/ManageScholarshipsPage";
import SystemStatisticsPage from "./pages/admin/SystemStatisticsPage";

// Instructor & Donor Dashboards
import InstructorDashboard from "./pages/InstructorDashboard";
import DonorDashboard from "./pages/DonorDashboard";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Layout */}
        <Route element={<Layout />}>
          {/* Admin */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute role="ROLE_ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="manage-users" element={<ManageUsersPage />}>
              <Route path="add" element={<AddUserPage />} />
            </Route>
            <Route path="manage-courses" element={<ManageCoursesPage />} />
            <Route path="manage-scholarships" element={<ManageScholarshipsPage />} />
            <Route path="stats" element={<SystemStatisticsPage />} />
          </Route>

          {/* Student */}
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute role="ROLE_STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="courses" element={<MyCourses />} />
            <Route path="progress" element={<MyProgress />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="scholarships" element={<MyScholarships />} />
          </Route>

          {/* Instructor */}
          <Route
            path="/dashboard/instructor"
            element={
              <ProtectedRoute role="ROLE_INSTRUCTOR">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Donor */}
          <Route
            path="/dashboard/donor"
            element={
              <ProtectedRoute role="ROLE_DONOR">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
