import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/instructor/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) return <p>Loading course details...</p>;
  if (!course) return <p>No course data found.</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-indigo-700">📘 {course.title}</h2>
        <p className="text-gray-600 mb-4">{course.description}</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">👨‍🎓 Enrolled Students</h3>
        <ul className="list-disc ml-6 text-gray-700">
          {course.students?.length > 0 ? (
            course.students.map((student) => <li key={student.id}>{student.fullName}</li>)
          ) : (
            <li>No students enrolled.</li>
          )}
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">📄 Uploaded Content</h3>
        <ul className="list-disc ml-6 text-gray-700">
          {course.content?.length > 0 ? (
            course.content.map((file, index) => (
              <li key={index}>
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {file.name}
                </a>
              </li>
            ))
          ) : (
            <li>No content uploaded.</li>
          )}
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">📝 Assignments</h3>
        <ul className="list-disc ml-6 text-gray-700">
          {course.assignments?.length > 0 ? (
            course.assignments.map((assignment) => (
              <li key={assignment.id}>{assignment.title}</li>
            ))
          ) : (
            <li>No assignments created.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetails;
