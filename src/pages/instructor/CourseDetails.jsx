import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Helper to unwrap HATEOAS-style responses
const unwrap = model => model.content ?? model;

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Fetch course details
        const res = await axiosInstance.get(`/api/courses/${courseId}`);
        const data = unwrap(res.data);
        setCourse(data);
      } catch (err) {
        console.error("Failed to fetch course details:", err);
        toast.error("❌ Unable to load course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return <p>Loading course details...</p>;
  if (!course) return <p>No course data found.</p>;

  return (
    <div style={{ padding: "30px 60px" }}>
      <div style={{ background: '#fff', padding: 30, borderRadius: 12, boxShadow: '0 0 0 2px #d6ecff', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 26, fontWeight: 'bold', color: '#001943' }}>📘 {course.title}</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>{course.description}</p>

        <section style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 'bold', color: '#001943' }}>👨‍🎓 Enrolled Students</h3>
          {course.students?.length > 0 ? (
            <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
              {course.students.map(student => (
                <li key={student.id}>{student.fullName}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666' }}>No students enrolled.</p>
          )}
        </section>

        <section style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 'bold', color: '#001943' }}>📄 Uploaded Content</h3>
          {course.content?.length > 0 ? (
            <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
              {course.content.map((file, idx) => (
                <li key={idx}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: '#001943', fontWeight: 500, textDecoration: 'underline' }}>
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666' }}>No content uploaded.</p>
          )}
        </section>

        <section>
          <h3 style={{ fontSize: 18, fontWeight: 'bold', color: '#001943' }}>📝 Assignments</h3>
          {course.assignments?.length > 0 ? (
            <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
              {course.assignments.map(assign => (
                <li key={assign.id}>{assign.title}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666' }}>No assignments created.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default CourseDetails;