import React from "react";
import axios from "../../api/axiosInstance";

const EnrollTestButton = () => {
  const handleEnroll = async () => {
    try {
      const response = await axios.post("/api/enrollments", {
        studentId: 8, // 👈 ID الطالب
        courseId: 5,  // 👈 ID الدورة
      });
      alert("✅ Student enrolled successfully!");
      console.log("✅ Response:", response.data);
    } catch (error) {
      console.error("❌ Enrollment failed:", error);
      alert("❌ Enrollment failed!");
    }
  };

  return (
    <button
      onClick={handleEnroll}
      style={{
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        marginTop: "20px",
      }}
    >
      ➕ Enroll Student in Course
    </button>
  );
};

export default EnrollTestButton;
