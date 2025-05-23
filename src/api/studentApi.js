/* src/api/studentApi.js */
import axiosInstance from "./axiosInstance";

const studentApi = {
  /* 👤 Profile */
  getProfile:    ()           => axiosInstance.get("/api/students/me"),
  updateProfile: (data)       => axiosInstance.put("/api/students/me", data),
  uploadPhoto:   (form)       =>
      axiosInstance.post("/api/students/upload-photo", form, {
        headers: { "Content-Type": "multipart/form-data" },
      }),

  /* 📚 Courses */
  getEnrollments: (studentId) => axiosInstance.get(`/api/enrollments/student/${studentId}`),
  getMyCourses:   ()          => axiosInstance.get("/api/students/me/courses"),

  /* 📝 Assessments */
  getAssignments: (studentId) => axiosInstance.get(`/api/assessments/student/${studentId}`),

  /* 🎓 Scholarships */
  getScholarships:   ()             => axiosInstance.get("/api/scholarships"),
  getMyApplications: (studentId)    => axiosInstance.get(`/api/scholarship-applications/student/${studentId}`),

  /* ✅ Apply for a scholarship */
  applyScholarship: (data) =>
      axiosInstance.post("/api/scholarship-applications", {
        studentId:      data.studentId,
        courseId:       data.courseId,
        scholarshipId:  data.scholarshipId,
        reason:         data.reason,
        lifeCondition:  data.lifeCondition,
        amount:         data.amount     ?? null,      // إذا لزم
        status:         data.status     ?? "PENDING"
      }),
};

export default studentApi;
