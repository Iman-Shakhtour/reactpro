// src/api/adminApi.js
import axiosInstance from "./axiosInstance";

const adminApi = {
  // ─── Dashboard ────────────────────────────────────
  getDashboardStats: () =>
    axiosInstance.get("/api/admin/dashboard/stats"),

  // ─── Courses ──────────────────────────────────────
  getCourses: () =>
    axiosInstance.get("/api/courses"),
  createCourse: data =>
    axiosInstance.post("/api/courses", data),
  updateCourse: (id, data) =>
    axiosInstance.put(`/api/courses/${id}`, data),
  deleteCourse: id =>
    axiosInstance.delete(`/api/courses/${id}`),

  // ─── Scholarships ─────────────────────────────────
  getScholarships: () =>
    axiosInstance.get("/api/scholarships"),
  createScholarship: data =>
    axiosInstance.post("/api/scholarships", data),
  updateScholarship: (id, data) =>
    axiosInstance.put(`/api/scholarships/${id}`, data),
  deleteScholarship: id =>
    axiosInstance.delete(`/api/scholarships/${id}`),

  // ─── Assign to Scholarship ────────────────────────
  assignStudentsToScholarship: (scholarshipId, studentIds) =>
    axiosInstance.put(
      `/api/scholarships/${scholarshipId}/students`,
      studentIds
    ),
  assignCoursesToScholarship: (scholarshipId, courseIds) =>
    axiosInstance.put(
      `/api/scholarships/${scholarshipId}/courses`,
      courseIds
    ),

  // ─── Admin Users ──────────────────────────────────
  getAdmins: () =>
    axiosInstance.get("/api/admins"),
  createAdmin: data =>
    axiosInstance.post("/api/admins", data),
  updateAdmin: (id, data) =>
    axiosInstance.put(`/api/admins/${id}`, data),
  deleteAdmin: id =>
    axiosInstance.delete(`/api/admins/${id}`),

  // ─── Students ────────────────────────────────────
  getStudents: () =>
    axiosInstance.get("/api/admins/students"),
  updateStudent: (id, data) =>
    axiosInstance.put(`/api/admins/students/${id}`, data),
  deleteStudent: id =>
    axiosInstance.delete(`/api/admins/students/${id}`),

  // ─── Instructors ─────────────────────────────────
  getInstructors: () =>
    axiosInstance.get("/api/admins/instructors"),
  createInstructor: data =>
    axiosInstance.post("/api/admins/instructors", data),
  updateInstructor: (id, data) =>
    axiosInstance.put(`/api/admins/instructors/${id}`, data),
  deleteInstructor: id =>
    axiosInstance.delete(`/api/admins/instructors/${id}`),

  // ─── Donors ──────────────────────────────────────
  getDonors: () =>
    axiosInstance.get("/api/admins/donors"),
  deleteDonor: id =>
    axiosInstance.delete(`/api/admins/donors/${id}`),
};

export default adminApi;
