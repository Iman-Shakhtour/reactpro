import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScholarshipAppsPage from "./pages/admin/ScholarshipAppsPage";

// Public
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";

// Layout & Auth
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

// Instructor Pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import ContentPage from "./pages/instructor/ContentPage";
import ManageAssignments from "./pages/instructor/ManageAssignments";
import SubmittedAssignments from "./pages/instructor/SubmittedAssignments";
import ViewEnrolledStudents from "./pages/instructor/ViewEnrolledStudents";
import CourseDetails from "./pages/instructor/CourseDetails";
import InstructorProfile from "./pages/instructor/InstructorProfile";
import InstructorSettings from "./pages/instructor/InstructorSettings";

// Donor Pages
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
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<SystemStatisticsPage />} />
            <Route path="manage-users" element={<ManageUsersPage />}>
              <Route path="add" element={<AddUserPage />} />
            </Route>
            <Route path="manage-courses" element={<ManageCoursesPage />} />
            <Route
              path="manage-scholarships"
              element={<ManageScholarshipsPage />}
            />
            <Route
              path="scholarship-applications"
              element={<ScholarshipAppsPage />}
            />
            <Route path="stats" element={<SystemStatisticsPage />} />


          </Route>

          {/* Student */}
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute role="ROLE_STUDENT">
                <Outlet />
              </ProtectedRoute>
            }
          >
            {/* Dashboard كصفحة رئيسية */}
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="scholarships" element={<Scholarships />} />
            <Route path="assignments" element={<MyAssignments />} />
            <Route path="assignments/:id" element={<SolveAssignment />} />
            <Route path="profile" element={<MyProfile />} />

            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Instructor */}
          <Route
            path="/dashboard/instructor"
            element={
              <ProtectedRoute role="ROLE_INSTRUCTOR">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<InstructorDashboard />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="assignments" element={<ManageAssignments />} />
            <Route path="submissions" element={<SubmittedAssignments />} />
            <Route
              path="enrolled-students"
              element={<ViewEnrolledStudents />}
            />
            <Route
              path="course-details/:courseId"
              element={<CourseDetails />}
            />
            <Route path="profile" element={<InstructorProfile />} />
            <Route path="settings" element={<InstructorSettings />} />
          </Route>

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

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
