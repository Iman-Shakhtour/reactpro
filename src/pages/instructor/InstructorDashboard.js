import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

// Helper to unwrap HATEOAS-style responses
const unwrap = model => model.content ?? model;

const InstructorDashboard = () => {
  const username = localStorage.getItem("username") || "Instructor";
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // 1) Who am I?
        const meRes = await axiosInstance.get("/api/instructors/me");
        const me = unwrap(meRes.data);

        // 2) Fetch all courses and filter to mine
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
    <div style={{ padding: "30px 60px" }}>
      <h1 style={{ marginTop: 0 }}>Instructor Dashboard</h1>
      <p>Welcome&nbsp;Back,&nbsp;{username}</p>

      <section style={{ margin: "24px 0" }}>
        <h2 style={{ fontSize: 20, fontWeight: "bold", color: "#001943" }}>📚 My Courses</h2>

        {loading ? (
          <p>Loading courses…</p>
        ) : courses.length === 0 ? (
          <p style={{ color: "#666" }}>You have no courses yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {courses.map(course => (
              <li key={course.id} style={{ marginBottom: 8 }}>
                <Link
                  to={`course-details/${course.id}`}
                  style={{ textDecoration: "none", color: "#001943", fontWeight: 500 }}
                >
                  ➡️ {course.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Renders nested routes like Content, Assignments, CourseDetails, etc. */}
      <Outlet />
    </div>
  );
};

export default InstructorDashboard;