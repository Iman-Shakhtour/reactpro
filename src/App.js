// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./pages/LandingPage"; // ✅ استوردناها
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminDashboard from "./pages/AdminDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import ManageUsersPage from "./pages/ManageUsersPage";
import ManageCoursesPage from "./pages/ManageCoursesPage";
import ManageScholarshipsPage from "./pages/ManageScholarshipsPage";
import StatisticsPage from "./pages/StatisticsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* 🏠 Landing Page على الرابط الرئيسي */}
        <Route path="/" element={<LandingPage />} />

        {/* 🔒 صفحات الدخول والتسجيل */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* 🛡️ الصفحات المحمية داخل Layout */}
        <Route element={<Layout />}>
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute role="ROLE_ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/instructor"
            element={
              <ProtectedRoute role="ROLE_INSTRUCTOR">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute role="ROLE_STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/donor"
            element={
              <ProtectedRoute role="ROLE_DONOR">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/manage-users"
            element={
              <ProtectedRoute role="ROLE_ADMIN">
                <ManageUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/manage-courses"
            element={
              <ProtectedRoute role="ROLE_ADMIN">
                <ManageCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/manage-scholarships"
            element={
              <ProtectedRoute role="ROLE_ADMIN">
                <ManageScholarshipsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/stats"
            element={
              <ProtectedRoute role="ROLE_ADMIN">
                <StatisticsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 🛑 صفحة خطأ 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
