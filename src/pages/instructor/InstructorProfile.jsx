// src/pages/instructor/InstructorProfile.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import "./MyProfile.css";  // reuse the same styles

const unwrap = model => model.content ?? model;

const InstructorProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    specialty: "",
    city: "",
    photoUrl: "",
  });
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/api/instructors/me")
      .then(res => {
        const data = unwrap(res.data);
        setProfile({
          fullName:    data.fullName || "",
          email:       data.email || "",
          phoneNumber: data.phoneNumber || "",
          specialty:   data.specialty || "",
          city:        data.city || "",
          photoUrl:    data.photoUrl || "",
        });
      })
      .catch(() => toast.error("❌ Failed to load profile."));
  }, []);

  return (
    <section className="profile-wrapper">
      {/* Avatar + Name */}
      <div className="profile-card profile-center">
        <img
          src={
            profile.photoUrl ||
            `https://api.dicebear.com/6.x/initials/svg?seed=${profile.fullName}`
          }
          alt="avatar"
          className="profile-avatar"
          onClick={() => setShowImage(true)}
          style={{ cursor: "pointer" }}
        />
        <h3 className="profile-value">{profile.fullName || "Name"}</h3>
      </div>

      {/* Details */}
      <div className="profile-card">
        <h4 className="profile-title">Profile Details</h4>
        <div className="profile-grid">
          {[
            { label: "Email", value: profile.email },
            { label: "Phone Number", value: profile.phoneNumber },
            { label: "Specialty", value: profile.specialty },
            { label: "City", value: profile.city },
          ].map(item => (
            <div key={item.label}>
              <label className="profile-label">{item.label}</label>
              <div className="profile-value">{item.value || "-"}</div>
            </div>
          ))}
        </div>
      </div>

      {showImage && (
        <div className="profile-modal" onClick={() => setShowImage(false)}>
          <img
            src={profile.photoUrl}
            alt="avatar enlarged"
            className="profile-modal-img"
          />
        </div>
      )}
    </section>
  );
};

export default InstructorProfile;
