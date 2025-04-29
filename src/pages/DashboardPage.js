import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const role = localStorage.getItem("role"); // إذا خزنت الرول
  const username = localStorage.getItem("username");

  return (
    <>
      <Navbar />
      <div style={{ padding: "30px" }}>
        <h1 style={{ marginBottom: "20px" }}>
          {role === "ROLE_ADMIN" ? "👑 Admin Dashboard" : "👤 User Dashboard"}
        </h1>

        <p style={{ marginBottom: "20px" }}>
          Welcome {username}! Manage users, courses, donations, and system settings.
        </p>

        {role === "ROLE_ADMIN" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <Link to="/dashboard/manage-users" style={linkStyle}>
              👥 Manage Users
            </Link>
            <Link to="/dashboard/manage-courses" style={linkStyle}>
              🎓 Manage Courses
            </Link>
            <Link to="/dashboard/manage-scholarships" style={linkStyle}>
              🎯 Manage Scholarships
            </Link>
            <Link to="/dashboard/stats" style={linkStyle}>
              📊 View Donation Statistics
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

const linkStyle = {
  textDecoration: "none",
  padding: "10px 15px",
  backgroundColor: "#6a0dad",
  color: "white",
  borderRadius: "8px",
  width: "fit-content",
};

export default DashboardPage;
