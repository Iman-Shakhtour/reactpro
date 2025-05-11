import React, { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
import { toast } from "react-toastify";
import "./MyProfile.css";

const MyProfile = () => {
  const [student, setStudent] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    major: "",
    city: "",
    photoUrl: "",
  });

  const [showImage, setShowImage] = useState(false); // ✅ حالة عرض الصورة

  useEffect(() => {
    studentApi
      .getProfile()
      .then((res) => {
        const data = res.data.content ?? res.data;
        setStudent({
          fullName: data.fullName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          major: data.major || "",
          city: data.city || "",
          photoUrl: data.photoUrl || "",
        });
      })
      .catch(() => toast.error("❌ Failed to load profile."));
  }, []);

  return (
    <section className="profile-wrapper">
      {/* صورة الطالب */}
      <div className="profile-card profile-center">
        <img
          src={
            student.photoUrl ||
            `https://api.dicebear.com/6.x/initials/svg?seed=${student.fullName}`
          }
          alt="avatar"
          className="profile-avatar"
          onClick={() => setShowImage(true)} // ✅ نفتح المودال
          style={{ cursor: "pointer" }}
        />
        <h3 className="profile-value">{student.fullName || "Name"}</h3>
      </div>

      {/* تفاصيل الطالب */}
      <div className="profile-card">
        <h4 className="profile-title">Profile Details</h4>
        <div className="profile-grid">
          {[
            { label: "Email", value: student.email },
            { label: "Phone Number", value: student.phoneNumber },
            { label: "Major", value: student.major },
            { label: "City", value: student.city },
          ].map((item) => (
            <div key={item.label}>
              <label className="profile-label">{item.label}</label>
              <div className="profile-value">{item.value || "-"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ نافذة الصورة المكبرة */}
      {showImage && (
        <div className="profile-modal" onClick={() => setShowImage(false)}>
          <img
            src={student.photoUrl}
            alt="avatar enlarged"
            className="profile-modal-img"
          />
        </div>
      )}
    </section>
  );
};

export default MyProfile;
