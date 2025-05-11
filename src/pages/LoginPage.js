import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import studentApi from "../api/studentApi"; // 🔹 تأكد من أنك أنشأت هذا الملف للتعامل مع /api/students
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const role = decoded.role;

      // 🔹 جلب بيانات الطالب في حال كان الطالب هو المستخدم
      if (role === "ROLE_STUDENT") {
        try {
          const { data } = await studentApi.get("/students/me");
          const p = data.content ?? data;
          localStorage.setItem("username", p.fullName || username);
          localStorage.setItem("profileImage", p.photoUrl || "");
        } catch (err) {
          console.error("Failed to fetch student profile:", err);
          localStorage.setItem("username", username);
          localStorage.setItem("profileImage", "");
        }
      } else {
        localStorage.setItem("username", username);
        localStorage.setItem("profileImage", "");
      }

      toast.success("✅ Login successful!");

      if (role === "ROLE_ADMIN") {
        navigate("/dashboard/admin");
      } else if (role === "ROLE_INSTRUCTOR") {
        navigate("/dashboard/instructor");
      } else if (role === "ROLE_STUDENT") {
        navigate("/dashboard/student");
      } else if (role === "ROLE_DONOR") {
        navigate("/dashboard/donor");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "❌ Login failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={titleStyle}>🔒 Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={linkTextStyle}>
          Don't have an account?{" "}
          <Link to="/signup" style={linkStyle}>
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
};

// 🔥 CSS Styles
const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f2f2f2",
};

const formStyle = {
  padding: "40px",
  borderRadius: "10px",
  background: "white",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  width: "300px",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#4CAF50",
  color: "white",
  fontSize: "16px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const linkTextStyle = {
  marginTop: "15px",
  textAlign: "center",
};

const linkStyle = {
  color: "#6c63ff",
  textDecoration: "none",
  fontWeight: "bold",
};

export default LoginPage;
