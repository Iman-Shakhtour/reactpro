import axiosInstance from "./axiosInstance";

const studentApi = {
  // 👤 بيانات الطالب
  getProfile:      () => axiosInstance.get("/api/students/me"),
  updateProfile:   (data) => axiosInstance.put("/api/students/me", data),
  uploadPhoto:     (formData) => axiosInstance.post("/api/students/upload-photo", formData),

  // 📚 الكورسات
  getEnrollments:  (studentId) => axiosInstance.get(`/api/enrollments/student/${studentId}`),
  getMyCourses:    () => axiosInstance.get("/api/students/me/courses"),

  // 📝 التقييمات
  getAssignments:  (studentId) => axiosInstance.get(`/api/assessments/student/${studentId}`),

  // 🎓 المنح
  getScholarships: () => axiosInstance.get("/api/scholarships"),
  getMyApplications: (studentId) =>
    axiosInstance.get(`/api/scholarship-applications/student/${studentId}`),
};

export default studentApi;
