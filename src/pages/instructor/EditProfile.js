import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { FaUserEdit } from "react-icons/fa";

const EditProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    specialty: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorProfile();
  }, []);

  const fetchInstructorProfile = async () => {
    try {
      const response = await axiosInstance.get("/api/instructors/me");
      const data = response.data.content;
      setProfile({
        fullName: data.fullName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        specialty: data.specialty || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Unable to load profile info.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/api/instructors/me", profile);
      toast.success("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("❌ Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
          <FaUserEdit /> Edit Profile
        </h2>

        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={profile.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={profile.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />

            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={profile.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />

            <input
              type="text"
              name="specialty"
              placeholder="Specialty"
              value={profile.specialty}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              💾 Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
