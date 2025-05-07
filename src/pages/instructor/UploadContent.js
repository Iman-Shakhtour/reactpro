
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const UploadContent = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/api/instructor/my-courses");
        setCourses(res.data);
      } catch (error) {
        toast.error("Failed to load courses.");
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  const handleUpload = async () => {
    if (!selectedCourseId || !file) {
      toast.error("Please select a course and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosInstance.post(`/api/courses/${selectedCourseId}/content`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Content uploaded successfully!");
      setFile(null);
    } catch (error) {
      toast.error("❌ Upload failed.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">📁 Upload Course Content</h2>
        <div className="space-y-4">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <button
            onClick={handleUpload}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded shadow"
          >
            ➕ Upload Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadContent;
