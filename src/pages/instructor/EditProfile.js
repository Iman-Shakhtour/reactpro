// src/pages/instructor/EditProfile.js
import React, { useEffect, useState } from "react";
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
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/api/instructors/me");
        const data = res.data.content;
        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          specialty: data.specialty || "",
        });
      } catch (error) {
        toast.error("❌ Unable to load profile info.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/api/instructors/me", profile);
      toast.success("✅ Profile updated!");
    } catch (error) {
      toast.error("❌ Update failed.");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>
        <FaUserEdit style={{ marginRight: 10 }} />
        Edit Profile
      </h2>
      <p style={styles.subtext}>Update your instructor profile information below.</p>

      <div style={styles.card}>
        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <form onSubmit={handleUpdate} style={styles.form}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={profile.fullName}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={profile.email}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={profile.phoneNumber}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="text"
              name="specialty"
              placeholder="Specialty"
              value={profile.specialty}
              onChange={handleChange}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              💾 Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "30px 60px",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#001943",
    display: "flex",
    alignItems: "center",
  },
  subtext: {
    color: "#666",
    marginBottom: 24,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 30,
    maxWidth: 600,
    boxShadow: "0 0 0 2px #d6ecff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  input: {
    padding: "12px",
    fontSize: 15,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    background: "#001943",
    color: "white",
    padding: "12px 20px",
    borderRadius: 50,
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
  },
};

export default EditProfile;
