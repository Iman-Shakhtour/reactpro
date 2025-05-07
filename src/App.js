import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// General pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import StatisticsPage from "./pages/StatisticsPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ManageCoursesPage from "./pages/admin/ManageCoursesPage";
import ManageScholarshipsPage from "./pages/admin/ManageScholarshipsPage";

// Instructor pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import MyAssignments from "./pages/instructor/ManageAssignments";
import UploadContent from "./pages/instructor/UploadContent";
import SubmittedAssignments from "./pages/instructor/SubmittedAssignments";
import EditProfile from "./pages/instructor/EditProfile";
import UploadedContentList from "./pages/instructor/UploadedContentList";
import ViewEnrolledStudents from "./pages/instructor/ViewEnrolledStudents";
import CourseDetails from "./pages/instructor/CourseDetails";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/MyCourses";
import MyProgress from "./pages/student/MyProgress";
import MyProfile from "./pages/student/MyProfile";
import MyScholarships from "./pages/student/MyScholarships";

// Donor page
import DonorDashboard from "./pages/DonorDashboard";

// Shared
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Layout Wrapper */}
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
            <Route path="manage-users" element={<ManageUsersPage />} />
            <Route path="manage-courses" element={<ManageCoursesPage />} />
            <Route path="manage-scholarships" element={<ManageScholarshipsPage />} />
            <Route path="stats" element={<StatisticsPage />} />
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
            <Route path="courses" element={<StudentCourses />} />
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
>
  <Route path="courses" element={<UploadContent />} />
  <Route path="assignments" element={<MyAssignments />} />
  <Route path="upload-content" element={<UploadContent />} />
  <Route path="submissions" element={<SubmittedAssignments />} />
  <Route path="edit-profile" element={<EditProfile />} />
  <Route path="uploaded-content" element={<UploadedContentList />} />
  <Route path="enrolled-students" element={<ViewEnrolledStudents />} />
  <Route path="course-details/:courseId" element={<CourseDetails />} />
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

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
