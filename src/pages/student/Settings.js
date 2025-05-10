import React, { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
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
    photoUrl: "",
  });
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) =>
    setStudent({ ...student, [e.target.name]: e.target.value });

  /* ---------- Load profile ---------- */
  useEffect(() => {
    studentApi
      .getProfile()
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
          photoUrl: d.photoUrl || "",
        });
      })
      .catch(() => toast.error("❌ Failed to load profile."));
  }, []);

  /* ---------- Save edits ---------- */
  const handleSave = () => {
    const fullName = `${student.firstName} ${student.lastName}`.trim();
    studentApi
      .updateProfile({
        fullName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        state: student.state,
        city: student.city,
        major: student.major,
        photoUrl: student.photoUrl,
      })
      .then(() => toast.success("✅ Profile updated!"))
      .catch(() => toast.error("❌ Failed to update profile."));
  };

  /* ---------- Upload photo ---------- */
  const handleUpload = async () => {
    if (!avatar) return;
    const fd = new FormData();
    fd.append("file", avatar);
    try {
      const res = await studentApi.uploadPhoto(fd);
      const url = res.data.imageUrl;
      await studentApi.updateProfile({ photoUrl: url });
      setStudent((p) => ({ ...p, photoUrl: url }));
      toast.success("✅ Photo updated!");
    } catch {
      toast.error("❌ Failed to upload photo.");
    }
  };

  /* ---------- Styles ---------- */
  const st = {
    wrapper: { display: "flex", gap: 24, padding: 24, flexWrap: "wrap" },
    profileCard: {
      width: 320,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      textAlign: "center",
      padding: 24,
    },
    avatar: { width: 96, height: 96, borderRadius: "50%", objectFit: "cover" },
    upload: { color: "#6366f1", cursor: "pointer", display: "inline-block", marginTop: 12 },
    formCard: {
      flex: "1 1 380px",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
    },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 },
    label: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
    input: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: 8,
      fontSize: 14,
    },
    save: {
      marginTop: 24,
      background: "#6366f1",
      color: "#fff",
      border: "none",
      padding: "8px 24px",
      borderRadius: 8,
      cursor: "pointer",
    },
  };

  return (
    <section style={st.wrapper}>
      {/* كرت الصورة */}
      <aside style={st.profileCard}>
        <img
          src={
            avatar
              ? URL.createObjectURL(avatar)
              : student.photoUrl ||
                `https://api.dicebear.com/6.x/initials/svg?seed=${student.firstName}${student.lastName}`
          }
          alt="avatar"
          style={st.avatar}
        />
        <label htmlFor="avatar" style={st.upload}>
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
              handleUpload();
            }
          }}
        />
      </aside>

      {/* كرت الإعدادات */}
      <div style={st.formCard}>
        <form
          style={{ padding: 24, flex: 1 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div style={st.grid}>
            {[
              { name: "firstName", label: "First name*", value: student.firstName },
              { name: "lastName", label: "Last name*", value: student.lastName },
              { name: "email", label: "Email*", value: student.email, type: "email" },
              { name: "phoneNumber", label: "Phone number", value: student.phoneNumber },
              { name: "state", label: "State", value: student.state },
              { name: "city", label: "City", value: student.city },
            ].map((f) => (
              <div key={f.name}>
                <label style={st.label}>{f.label}</label>
                <input
                  style={st.input}
                  type={f.type || "text"}
                  name={f.name}
                  value={f.value}
                  onChange={handleChange}
                  required={f.label.includes("*")}
                />
              </div>
            ))}
          </div>
          <button type="submit" style={st.save}>
            Save details
          </button>
        </form>
      </div>
    </section>
  );
};

export default StudentSettings;
