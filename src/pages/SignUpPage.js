import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STUDENT"); // 🟰 الافتراضي Student

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }

    try {
        await axios.post("http://localhost:8080/auth/register", {
        username,
        password,
        email,
        role, // ✨ الآن نرسل الرول اللي اختاره المستخدم
      });

      toast.success("✅ Registered successfully!");
      navigate("/"); // رجوع للـ Login بعد نجاح التسجيل
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      toast.error("❌ Registration failed. Please check your data.");
    }
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSignUp} style={formStyle}>
        <h2>📝 Sign Up</h2>
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {/* 🟰 اختيار الرول */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={inputStyle}
        >
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="DONOR">Donor</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit" style={buttonStyle}>
          Sign Up
        </button>

        <p style={{ marginTop: "10px" }}>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </form>
    </div>
  );
};

// ✨ CSS Styling
const pageStyle = {
  backgroundColor: "#f2f2f2",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formStyle = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  width: "350px",
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  marginBottom: "12px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default SignUpPage;
