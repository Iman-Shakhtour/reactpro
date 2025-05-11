// src/api/adminApi.js
import axiosInstance from "./axiosInstance";

const adminApi = {
  // stats
  getStats: () => axiosInstance.get("/api/admin/dashboard/stats"),

  // users
  getAdmins    : () => axiosInstance.get("/api/admins"),
  createAdmin  : data => axiosInstance.post("/api/admins", data),
  deleteAdmin  : id   => axiosInstance.delete(`/api/admins/${id}`),

  // courses & scholarships
  createCourse      : data => axiosInstance.post("/api/admins/courses", data),
  createScholarship : data => axiosInstance.post("/api/admins/scholarships", data),

  // scholarship applications
  getScholarshipApps : () => axiosInstance.get("/api/admins/scholarship-applications"),
  approveApp         : id => axiosInstance.put(`/api/admins/scholarships/approve/${id}`),
  rejectApp          : id => axiosInstance.put(`/api/admins/scholarships/reject/${id}`),

  // students
  getStudents   : () => axiosInstance.get("/api/admins/students"),
  updateStudent : (id, data) => axiosInstance.put(`/api/admins/students/${id}`, data),
  deleteStudent : id => axiosInstance.delete(`/api/admins/students/${id}`),

  // instructors
  getInstructors   : () => axiosInstance.get("/api/admins/instructors"),
  createInstructor : data => axiosInstance.post("/api/admins/instructors", data),
  deleteInstructor : id => axiosInstance.delete(`/api/admins/instructors/${id}`),

  // donors
  getDonors   : () => axiosInstance.get("/api/admins/donors"),
  deleteDonor : id => axiosInstance.delete(`/api/admins/donors/${id}`),
};

export default adminApi;
