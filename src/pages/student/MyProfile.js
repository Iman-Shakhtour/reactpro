import React, { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
import { toast } from "react-toastify";

const MyProfile = () => {
  const [student, setStudent] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    major: "",
  });

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
        });
      })
      .catch(() => toast.error("❌ Failed to load profile."));
  }, []);

  /* ---------- Styles ---------- */
  const st = {
    wrapper: { display: "flex", gap: 24, padding: 24, flexWrap: "wrap" },
    card: {
      flex: 1,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      padding: 24,
      minWidth: 300,
    },
    sectionTitle: { fontSize: 20, fontWeight: 600, marginBottom: 16 },
    label: { display: "block", fontSize: 13, color: "#6b7280", marginBottom: 4 },
    value: { fontSize: 15, fontWeight: 500 },
    center: { textAlign: "center" },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: 16,
    },
  };

  return (
    <section style={st.wrapper}>
      {/* كرت الصورة */}
      <div style={{ ...st.card, ...st.center }}>
        <img
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${student.fullName}`}
          alt="avatar"
          style={st.avatar}
        />
        <h3 style={st.value}>{student.fullName || "Name"}</h3>
      </div>

      {/* كرت التفاصيل */}
      <div style={st.card}>
        <h4 style={st.sectionTitle}>Profile Details</h4>
        <div>
          <label style={st.label}>Full Name</label>
          <div style={st.value}>{student.fullName}</div>
        </div>
        <div>
          <label style={st.label}>Email</label>
          <div style={st.value}>{student.email}</div>
        </div>
        <div>
          <label style={st.label}>Phone Number</label>
          <div style={st.value}>{student.phoneNumber || "-"}</div>
        </div>
        <div>
          <label style={st.label}>Major</label>
          <div style={st.value}>{student.major || "-"}</div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
