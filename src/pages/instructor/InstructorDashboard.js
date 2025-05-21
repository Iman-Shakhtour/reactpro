import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import "./InstructorDashboard.css";

const unwrap = model => model.content ?? model;

const InstructorDashboard = () => {
  const username = localStorage.getItem("username") || "Instructor";
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const meRes = await axiosInstance.get("/api/instructors/me");
        const me = unwrap(meRes.data);

        const allRes = await axiosInstance.get("/api/courses");
        const allCourses = allRes.data.map(unwrap);
        const myCourses = allCourses.filter(c => c.instructorId === me.id);

        setCourses(myCourses);
      } catch (error) {
        console.error("Failed to load courses:", error);
        toast.error("❌ Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <div className="instructor-dashboard">
      <div className="header">
        <p>Welcome back, <strong>{username}</strong> 👋</p>
      </div>

      <div className="courses-section">
        <h2>📚 My Courses</h2>

        {loading ? (
          <p className="status">Loading courses…</p>
        ) : courses.length === 0 ? (
          <p className="status">You have no courses yet.</p>
        ) : (
          <div className="course-cards">
            {courses.map(course => (
              <Link
                to={`course-details/${course.id}`}
                key={course.id}
                className="course-card"
              >
                <h3>{course.title}</h3>
                <p>{course.description?.slice(0, 80) || "No description available."}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Outlet />
    </div>
  );
};

export default InstructorDashboard;
