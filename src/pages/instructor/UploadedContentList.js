import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FaFileAlt, FaVideo } from "react-icons/fa";

const UploadedContentList = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axiosInstance.get("/api/content/my-uploads");
      setContentList(response.data);
    } catch (error) {
      console.error("Error fetching content:", error);
      alert("❌ Failed to load uploaded content.");
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (type) => {
    if (type === "VIDEO") return <FaVideo className="text-xl text-purple-600" />;
    return <FaFileAlt className="text-xl text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">
          📂 Uploaded Content
        </h2>

        {loading ? (
          <p>Loading content...</p>
        ) : contentList.length === 0 ? (
          <p>No uploaded content yet.</p>
        ) : (
          <div className="space-y-4">
            {contentList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {renderIcon(item.type)}
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.courseTitle}</p>
                  </div>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline font-medium"
                >
                  📥 View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadedContentList;
