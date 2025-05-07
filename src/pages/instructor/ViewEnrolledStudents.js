import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const ViewEnrolledStudents = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/api/instructors/me/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses.");
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/instructors/me/courses/${selectedCourseId}/students`
      );
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">👩‍🎓 Enrolled Students</h2>
        <div className="mb-6 flex items-center gap-4">
          <select
            className="border border-gray-300 rounded px-4 py-2 w-full"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">-- Select a Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <button
            onClick={fetchEnrolledStudents}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
            disabled={!selectedCourseId}
          >
            View Students
          </button>
        </div>

        {students.length > 0 ? (
          <ul className="space-y-3">
            {students.map((student) => (
              <li
                key={student.id}
                className="border rounded-lg px-4 py-3 shadow bg-gray-100"
              >
                <strong>{student.fullName}</strong> — {student.email}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No students enrolled or course not selected.</p>
        )}
      </div>
    </div>
  );
};

export default ViewEnrolledStudents;
