// src/pages/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Learn New Skills Online with Top Educators 🎓</h1>
        <p style={subtitleStyle}>
          Build skills with courses, certifications, and degrees online from top universities and companies.
        </p>
        <div style={buttonContainer}>
        <button style={loginButtonStyle} onClick={() => navigate("/login")}>
  Login
</button>
<button style={signupButtonStyle} onClick={() => navigate("/signup")}>
  Sign Up
</button>

        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(to right, #6a11cb, #2575fc)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const contentStyle = {
  textAlign: "center",
  color: "white",
  animation: "fadeIn 1.5s ease",
};

const titleStyle = {
  fontSize: "48px",
  marginBottom: "20px",
};

const subtitleStyle = {
  fontSize: "18px",
  marginBottom: "40px",
  maxWidth: "600px",
  margin: "0 auto 40px auto",
};

const buttonContainer = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
};

const loginButtonStyle = {
  backgroundColor: "white",
  color: "#6a11cb",
  padding: "12px 30px",
  fontSize: "18px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const signupButtonStyle = {
  backgroundColor: "transparent",
  color: "white",
  padding: "12px 30px",
  fontSize: "18px",
  border: "2px solid white",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default LandingPage;
