import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FaFileAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const SubmittedAssignments = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axiosInstance.get("/api/instructors/submissions");
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
          <FaFileAlt /> Student Submissions
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : submissions.length === 0 ? (
          <p className="text-gray-600">No submissions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-indigo-100 text-left">
                  <th className="px-4 py-2">Student</th>
                  <th className="px-4 py-2">Assignment</th>
                  <th className="px-4 py-2">Course</th>
                  <th className="px-4 py-2">Submitted At</th>
                  <th className="px-4 py-2">Link</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{sub.studentName}</td>
                    <td className="px-4 py-2">{sub.assignmentTitle}</td>
                    <td className="px-4 py-2">{sub.courseTitle}</td>
                    <td className="px-4 py-2">{new Date(sub.submittedAt).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        📎 View File
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmittedAssignments;
