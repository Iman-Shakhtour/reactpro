import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // ✨ ستايل جديد للإبداع

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* ✅ فقاعات ديكور خلفية */}
      <div className="bubbles">
        {[...Array(10)].map((_, i) => (
          <span key={i} style={{ "--i": Math.random() * 20 + 10 }}></span>
        ))}
      </div>

      <div className="landing-content">
        <h1>🚀 Start Your Learning Journey Today</h1>
        <p>
          Explore interactive courses, scholarships, and expert instructors — all in one place.
        </p>
        <div className="btn-group">
          <button onClick={() => navigate("/login")}>Login</button>
          <button className="outline" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
