import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const StudentSettings = () => {
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    state: "",
    city: "",
    major: "",
    photoUrl: "", // جديد
  });

  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axiosInstance
      .get("/api/students/me")
      .then((res) => {
        const d = res.data.content ?? res.data;
        const [first = "", ...rest] = (d.fullName || "").split(" ");
        setStudent({
          firstName: first,
          lastName: rest.join(" "),
          email: d.email || "",
          phoneNumber: d.phoneNumber || "",
          state: d.state || "",
          city: d.city || "",
          major: d.major || "",
          photoUrl: d.photoUrl || "", // جديد
        });
      })
      .catch(() => toast.error("❌ Failed to load profile."));
  }, []);

  const handleSave = () => {
    const fullName = `${student.firstName} ${student.lastName}`.trim();
    axiosInstance
      .put("/api/students/me", {
        fullName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        state: student.state,
        city: student.city,
        major: student.major,
        photoUrl: student.photoUrl, // جديد
      })
      .then(() => toast.success("✅ Profile updated successfully!"))
      .catch(() => toast.error("❌ Failed to update profile."));
  };

  const handleUpload = async () => {
    if (!avatar) return;
    const formData = new FormData();
    formData.append("file", avatar);
    try {
      const res = await axiosInstance.post("/api/students/upload-photo", formData);
      const imageUrl = res.data.imageUrl;

      localStorage.setItem("profileImage", imageUrl); // لتحديث فوري في الشريط الجانبي

      // 👇 نحدث الصورة في قاعدة البيانات أيضاً
      await axiosInstance.put("/api/students/me", {
        photoUrl: imageUrl,
      });

      setStudent((prev) => ({ ...prev, photoUrl: imageUrl }));
      toast.success("✅ Profile picture updated!");
    } catch {
      toast.error("❌ Failed to upload picture.");
    }
  };

  const styles = {
    wrapper: { display: "flex", gap: "24px", padding: "24px", flexWrap: "wrap" },
    profileCard: {
      width: 320, background: "#fff", borderRadius: 12,
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)", textAlign: "center",
      padding: 24, flexShrink: 0,
    },
    avatar: {
      width: 96, height: 96, borderRadius: "50%",
      objectFit: "cover", marginBottom: 16,
    },
    name: { fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 4 },
    subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 2 },
    uploadLabel: {
      display: "inline-block", color: "#6366f1",
      fontWeight: 500, cursor: "pointer", marginTop: 12,
    },
    hiddenFile: { display: "none" },
    settingsCard: {
      flex: "1 1 380px", background: "#fff", borderRadius: 12,
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)", display: "flex",
      flexDirection: "column",
    },
    header: { borderBottom: "1px solid #e5e7eb", padding: 24 },
    headerTitle: { fontSize: 16, fontWeight: 600, color: "#111827" },
    headerDesc: { fontSize: 14, color: "#6b7280", marginTop: 4 },
    form: { padding: 24, flex: 1 },
    grid: {
      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16,
    },
    label: { display: "block", fontSize: 12, color: "#6b7280", marginBottom: 4 },
    input: {
      width: "100%", padding: "8px 12px", border: "1px solid #d1d5db",
      borderRadius: 8, fontSize: 14,
    },
    select: {
      width: "100%", padding: "8px 12px", border: "1px solid #d1d5db",
      borderRadius: 8, fontSize: 14, background: "#fff",
    },
    actions: { marginTop: 24, textAlign: "right" },
    saveBtn: {
      background: "#6366f1", color: "#fff", padding: "8px 24px",
      border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer",
    },
  };

  return (
    <section style={styles.wrapper}>
      <aside style={styles.profileCard}>
        <img
          src={
            avatar
              ? URL.createObjectURL(avatar)
              : student.photoUrl ||
                `https://api.dicebear.com/6.x/initials/svg?seed=${student.firstName}${student.lastName}`
          }
          alt="avatar"
          style={styles.avatar}
        />
        <h3 style={styles.name}>
          {`${student.firstName} ${student.lastName}`.trim() || ""}
        </h3>

        <label htmlFor="avatar" style={styles.uploadLabel}>Upload picture</label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          style={styles.hiddenFile}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setAvatar(file);
              handleUpload();
            }
          }}
        />
      </aside>

      <div style={styles.settingsCard}>
        <header style={styles.header}>
          <h4 style={styles.headerTitle}>Profile</h4>
          <p style={styles.headerDesc}>The information can be edited</p>
        </header>

        <form
          style={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>First name*</label>
              <input
                style={styles.input}
                type="text"
                name="firstName"
                value={student.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Last name*</label>
              <input
                style={styles.input}
                type="text"
                name="lastName"
                value={student.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Email address*</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                value={student.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Phone number</label>
              <input
                style={styles.input}
                type="text"
                name="phoneNumber"
                value={student.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={styles.label}>State</label>
              <select
                name="state"
                value={student.state}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Choose...</option>
                <option value="Amman">Amman</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>City</label>
              <input
                style={styles.input}
                type="text"
                name="city"
                value={student.city}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={styles.actions}>
            <button type="submit" style={styles.saveBtn}>Save details</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default StudentSettings;
