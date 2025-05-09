import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const MyProfile = () => {
  const [student, setStudent] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    major: "",
  });

  useEffect(() => {
    axiosInstance
      .get("/api/students/me")
      .then((res) => {
        // يدعم HATEOAS أو ردّ بسيط
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

  const styles = {
    wrapper: {
      display: "flex",
      gap: "24px",
      padding: "24px",
      flexWrap: "wrap",
    },
    card: {
      flex: 1,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      padding: 24,
      minWidth: 300,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 600,
      color: "#111827",
      marginBottom: 16,
    },
    infoGroup: {
      marginBottom: 16,
    },
    label: {
      display: "block",
      fontSize: 13,
      color: "#6b7280",
      marginBottom: 4,
    },
    value: {
      fontSize: 15,
      color: "#111827",
      fontWeight: 500,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: 16,
    },
    center: {
      textAlign: "center",
    },
  };

  return (
    <section style={styles.wrapper}>
      <div style={{ ...styles.card, ...styles.center }}>
        <img
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${student.fullName}`}
          alt="avatar"
          style={styles.avatar}
        />
        <h3 style={styles.value}>{student.fullName || "Name"}</h3>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Los Angeles USA</p>
        <p style={{ color: "#6b7280", fontSize: 14 }}>GTM-7</p>
      </div>

      <div style={styles.card}>
        <h4 style={styles.sectionTitle}>Profile Details</h4>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Full Name</label>
          <div style={styles.value}>{student.fullName}</div>
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Email</label>
          <div style={styles.value}>{student.email}</div>
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Phone Number</label>
          <div style={styles.value}>{student.phoneNumber || "-"}</div>
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Major</label>
          <div style={styles.value}>{student.major || "-"}</div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
