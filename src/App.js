import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";

// Shared layout and protection
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import MyProfile from "./pages/student/MyProfile";
import Scholarships from "./pages/student/Scholarships";
import MyAssignments from "./pages/student/MyAssignments";
import Settings from "./pages/student/Settings";
import SolveAssignment from "./pages/student/SolveAssignment";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardHome from "./pages/admin/DashboardHome";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import AddUserPage from "./pages/admin/AddUserPage";
import ManageCoursesPage from "./pages/admin/ManageCoursesPage";
import ManageScholarshipsPage from "./pages/admin/ManageScholarshipsPage";
import SystemStatisticsPage from "./pages/admin/SystemStatisticsPage";

// Instructor Pages ✅ المعتمدة
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import ContentPage from "./pages/instructor/ContentPage";
import ManageAssignments from "./pages/instructor/ManageAssignments";
import SubmittedAssignments from "./pages/instructor/SubmittedAssignments";
import ViewEnrolledStudents from "./pages/instructor/ViewEnrolledStudents";
import EditProfile from "./pages/instructor/EditProfile";
import CourseDetails from "./pages/instructor/CourseDetails";

// Donor Page
import DonorDashboard from "./pages/DonorDashboard";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* 🔐 Protected Layout */}
        <Route element={<Layout />}>
          {/* 👩‍💼 Admin */}
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

          {/* 👨‍🎓 Student */}
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute role="ROLE_STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="courses" element={<MyCourses />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="scholarships" element={<Scholarships />} />
            <Route path="assignments" element={<MyAssignments />} />
            <Route path="settings" element={<Settings />} />
            <Route path="assignments/:id" element={<SolveAssignment />} />
          </Route>

          {/* 🧑‍🏫 Instructor ✅ */}
          <Route
            path="/dashboard/instructor"
            element={
              <ProtectedRoute role="ROLE_INSTRUCTOR">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="content" element={<ContentPage />} />
            <Route path="assignments" element={<ManageAssignments />} />
            <Route path="submissions" element={<SubmittedAssignments />} />
            <Route path="enrolled-students" element={<ViewEnrolledStudents />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="course-details/:courseId" element={<CourseDetails />} />
          </Route>

          {/* 🤝 Donor */}
          <Route
            path="/dashboard/donor"
            element={
              <ProtectedRoute role="ROLE_DONOR">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ❌ 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
