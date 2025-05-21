import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [student, setStudent] = useState({});
  const [coursesCount, setCoursesCount] = useState(0);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [scholarshipsCount, setScholarshipsCount] = useState(0); // ✅ جديد

  useEffect(() => {
    // 1) جلب بيانات الطالب نفسه + تحديث صورة البروفايل في Sidebar
    axiosInstance
      .get("/api/students/me")
      .then((res) => {
        const data = res.data.content ?? res.data;
        setStudent(data);

        // ✅ صح: أخذ الصورة من photoUrl مباشرة
        const photoUrl = data.photoUrl || "";
        localStorage.setItem("profileImage", photoUrl);
        window.dispatchEvent(new Event("profileUpdated"));

        // ✅ تحميل عدد طلبات المنح الدراسية بعد جلب id
        const id = data.id;
        axiosInstance
          .get(`/api/students/${id}/scholarship-applications`)
          .then((res) => {
            setScholarshipsCount(res.data.length);
          })
          .catch((err) => {
            console.error("Failed to load scholarships:", err);
            setScholarshipsCount(0);
          });
      })
      .catch((err) => console.error("Failed to load student info:", err));

    // 2) عدد الكورسات
    axiosInstance.get("/api/students/me/courses")
      .then((res) => {
        setCoursesCount(res.data.length);
      })
      .catch((err) => {
        console.error("Failed to load courses count:", err);
        setCoursesCount(0);
      });

    // 3) عدد الواجبات
    axiosInstance.get("/api/students/me/assignments")
      .then((res) => {
        setAssignmentsCount(res.data.length);
      })
      .catch((err) => {
        console.error("Failed to load assignments:", err);
        setAssignmentsCount(0);
      });

  }, []);

  return (
    <div className="student-dashboard">
      <div className="header">
        <h1> Welcome, {student.fullName || "Student"}!</h1>
      </div>

      <div className="overview-section">
        <h2>Quick Overview</h2>
        <div className="overview-cards">
          <div className="card">
            <h3> My Courses</h3>
            <p>
              You are enrolled in <strong>{coursesCount}</strong> course
              {coursesCount !== 1 && "s"}.
            </p>
          </div>
          <div className="card">
            <h3> My Assignments</h3>
            <p>
              You have <strong>{assignmentsCount}</strong> assignment
              {assignmentsCount !== 1 && "s"} to complete.
            </p>
          </div>
          <div className="card">
            <h3> Scholarships</h3>
            <p>
              You have applied to <strong>{scholarshipsCount}</strong> scholarship
              {scholarshipsCount !== 1 && "s"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
