import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const ManageAssignments = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await axiosInstance.get("/api/instructors/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("❌ Failed to load courses.");
      }
    };

    fetchMyCourses();
  }, []);

  const handleAddAssignment = async () => {
    if (!assignmentTitle || !instructions || !selectedCourseId) {
      toast.error("❌ Please complete all fields.");
      return;
    }

    try {
      await axiosInstance.post(`/api/assignments?courseId=${selectedCourseId}`, {
        title: assignmentTitle,
        instructions,
      });

      toast.success("✅ Assignment added!");
      setAssignmentTitle("");
      setInstructions("");
      setSelectedCourseId("");
    } catch (error) {
      console.error("Error adding assignment:", error);
      toast.error("❌ Failed to add assignment.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white shadow-xl p-6 rounded-2xl max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">📝 Manage Assignments</h2>
        <p className="text-gray-600 mb-6">Create and assign new assignments to your courses.</p>

        <div className="space-y-4">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Assignment Title"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
          />

          <textarea
            placeholder="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
            rows="5"
          ></textarea>

          <button
            onClick={handleAddAssignment}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold"
          >
            ➕ Add Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageAssignments;
