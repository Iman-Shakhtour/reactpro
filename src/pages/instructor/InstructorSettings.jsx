import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import "./Settings.css";
// Helper to unwrap HATEOAS-style responses
const unwrap = (model) => model.content ?? model;

const InstructorSettings = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    specialty: "",
    photoUrl: "",
  });
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1) load current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/api/instructors/me");
        const data = unwrap(res.data);
        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          specialty: data.specialty || "",
          photoUrl: data.photoUrl || "",
        });
      } catch {
        toast.error("❌ Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2) file-upload handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("photo", file);

    try {
      const res = await axiosInstance.post(
        "/api/instructors/me/photo",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // assume backend responds with { photoUrl: "…" }
      setProfile((p) => ({ ...p, photoUrl: res.data.photoUrl }));
      toast.success("✅ Photo uploaded!");
      window.dispatchEvent(new Event("profileUpdated"));
    } catch {
      toast.error("❌ Upload failed.");
    }
  };

  // 3) field-change & submit
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/api/instructors/me", profile);
      toast.success("✅ Profile updated!");
    } catch {
      toast.error("❌ Update failed.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <section className="profile-wrapper">
      {/* Avatar & Upload */}
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

        {/* hidden file input */}
        <input
          type="file"
          id="photoUpload"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="photoUpload" className="profile-upload-label">
          Upload picture
        </label>
      </div>

      {/* Editable Details */}
      <form className="profile-card" onSubmit={handleSubmit}>
        <h4 className="profile-title">Edit Details</h4>
        <div className="profile-grid">
          {[
            {
              label: "Email",
              name: "email",
              type: "email",
              value: profile.email,
            },
            {
              label: "Phone Number",
              name: "phoneNumber",
              type: "text",
              value: profile.phoneNumber,
            },
            {
              label: "Specialty",
              name: "specialty",
              type: "text",
              value: profile.specialty,
            },
          ].map((item) => (
            <div key={item.name}>
              <label className="profile-label">{item.label}</label>
              <input
                className="profile-value"
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
                type={item.type}
                name={item.name}
                value={item.value}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        <button type="submit" className="profile-button">
          💾 Save Changes
        </button>
      </form>

      {/* Image Modal */}
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

export default InstructorSettings;
