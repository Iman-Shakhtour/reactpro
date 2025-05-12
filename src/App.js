import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";

// Shared layout & protection
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/MyCourses";
import MyProgress from "./pages/student/MyProgress";
import MyProfile from "./pages/student/MyProfile";
import MyScholarships from "./pages/student/MyScholarships";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ManageCoursesPage from "./pages/admin/ManageCoursesPage";
import ManageScholarshipsPage from "./pages/admin/ManageScholarshipsPage";
import StatisticsPage from "./pages/StatisticsPage";

// Instructor pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import ContentPage from "./pages/instructor/ContentPage";
import ManageAssignments from "./pages/instructor/ManageAssignments";
import SubmittedAssignments from "./pages/instructor/SubmittedAssignments";
import ViewEnrolledStudents from "./pages/instructor/ViewEnrolledStudents";
import EditProfile from "./pages/instructor/EditProfile";
import CourseDetails from "./pages/instructor/CourseDetails";

// Donor page
import DonorDashboard from "./pages/DonorDashboard";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* 🔐 Protected layout */}
        <Route element={<Layout />}>
          {/* 👨‍🎓 Student */}
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

          {/* 👩‍💼 Admin */}
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

          {/* 🧑‍🏫 Instructor */}
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
