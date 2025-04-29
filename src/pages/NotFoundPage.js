import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#f2f2f2" }}>
      <h1 style={{ fontSize: "80px", marginBottom: "20px" }}>404</h1>
      <p style={{ fontSize: "24px", marginBottom: "20px" }}>Oops! Page Not Found.</p>
      <Link to="/" style={{ color: "#6a0dad", fontSize: "20px" }}>
        🔙 Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
