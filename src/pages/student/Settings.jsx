import React, { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
import { toast } from "react-toastify";
import "./Settings.css";

export default function Settings() {
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    major: "",
    photoUrl: "",
  });

  const [avatar, setAvatar] = useState(null); // للمعاينة فقط

  // تحميل البيانات عند mount
  useEffect(() => {
    studentApi
      .getProfile()
      .then(({ data }) => {
        const d = data.content ?? data;
        const [first = "", ...rest] = (d.fullName || "").split(" ");
        setStudent({
          firstName: first,
          lastName: rest.join(" "),
          email: d.email || "",
          phoneNumber: d.phoneNumber || "",
          city: d.city || "",
          major: d.major || "",
          photoUrl: d.photoUrl || "",
        });

        // تحديث Sidebar مبدئيًا
        localStorage.setItem("profileImage", d.photoUrl || "");
        localStorage.setItem("username", d.fullName || "");
        window.dispatchEvent(new Event("storage")); // ✅ إشعار أولي
        window.dispatchEvent(new Event("profileUpdated")); // ✅ مخصص
      })
      .catch(() => toast.error("❌ Failed to load profile."));
  }, []);

  // رفع الصورة
  const uploadAvatar = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);

    try {
      const { data } = await studentApi.uploadPhoto(fd);
      const url = data.imageUrl;

      // تحديث Sidebar مباشرة
      localStorage.setItem("profileImage", url);
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("profileUpdated"));

      setStudent((prev) => ({ ...prev, photoUrl: url }));
      toast.success("✅ Photo updated!");
    } catch {
      toast.error("❌ Failed to upload photo.");
    }
  };

  // حفظ البيانات
  const handleSave = async () => {
    const fullName = `${student.firstName} ${student.lastName}`.trim();
    try {
      await studentApi.updateProfile({
        fullName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        city: student.city,
        major: student.major,
      });

      // ✅ تحديث localStorage بالبيانات الجديدة
      localStorage.setItem("username", fullName);
      localStorage.setItem("profileImage", student.photoUrl || "");

      // ✅ إشعار لتحديث الـ Sidebar
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("profileUpdated"));

      toast.success("✅ Profile updated!");
    } catch {
      toast.error("❌ Failed to update profile.");
    }
  };

  const handleChange = (e) =>
    setStudent({ ...student, [e.target.name]: e.target.value });

  return (
    <section className="settings-wrapper">
      {/* صورة البروفايل */}
      <aside className="settings-profile-card">
        <img
          src={
            avatar
              ? URL.createObjectURL(avatar)
              : student.photoUrl ||
                `https://api.dicebear.com/6.x/initials/svg?seed=${student.firstName}${student.lastName}`
          }
          alt="avatar"
          className="settings-avatar"
        />
        <label htmlFor="avatar" className="settings-upload">
          Upload picture
        </label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setAvatar(f);
              uploadAvatar(f);
            }
          }}
        />
      </aside>

      {/* النموذج */}
      <div className="settings-form-card">
        <form
          style={{ padding: 24, flex: 1 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="settings-grid">
            {[ 
              { name: "firstName", label: "First name*", value: student.firstName },
              { name: "lastName", label: "Last name*", value: student.lastName },
              { name: "email", label: "Email*", value: student.email, type: "email" },
              { name: "phoneNumber", label: "Phone number", value: student.phoneNumber },
              { name: "city", label: "City", value: student.city },
              { name: "major", label: "Major", value: student.major },
            ].map((f) => (
              <div key={f.name}>
                <label className="settings-label">{f.label}</label>
                <input
                  className="settings-input"
                  type={f.type || "text"}
                  name={f.name}
                  value={f.value}
                  onChange={handleChange}
                  required={f.label.includes("*")}
                />
              </div>
            ))}
          </div>
          <button type="submit" className="settings-save-btn">
            Save details
          </button>
        </form>
      </div>
    </section>
  );
}
