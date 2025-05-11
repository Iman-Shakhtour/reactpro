import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import studentApi from "../api/studentApi";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", { username, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === "ROLE_STUDENT") {
        try {
          const { data } = await studentApi.getProfile(); // ✅ هنا التعديل
          const p = data.content ?? data;

          // ✅ تحديث الصورة والاسم مباشرة
          localStorage.setItem("username", p.fullName || username);
          localStorage.setItem("profileImage", p.photoUrl || "");

          // ✅ إطلاق حدث لتحديث الـ Sidebar إذا كان مفتوح
          window.dispatchEvent(new Event("profileUpdated"));
        } catch {
          localStorage.setItem("username", username);
          localStorage.setItem("profileImage", "");
        }
      } else {
        localStorage.setItem("username", username);
        localStorage.setItem("profileImage", "");
      }

      toast.success("✅ Login successful!");

      if (role === "ROLE_ADMIN") navigate("/dashboard/admin");
      else if (role === "ROLE_INSTRUCTOR") navigate("/dashboard/instructor");
      else if (role === "ROLE_STUDENT") navigate("/dashboard/student");
      else if (role === "ROLE_DONOR") navigate("/dashboard/donor");
      else navigate("/");

    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-login">
      <div className="ring">
        <i style={{ "--clr": "#A9BA9D" }}></i>
        <i style={{ "--clr": "#E9DCAA" }}></i>
        <i style={{ "--clr": "#CCE3C0" }}></i>

        <form className="login-box" onSubmit={handleLogin}>
          <h2>Login</h2>

          <div className="inputBox">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="inputBox">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="inputBox">
            <input type="submit" value={loading ? "Logging in..." : "Sign in"} disabled={loading} />
          </div>

          <div className="login-links">
            <Link to="#">Forgot Password</Link>
            <Link to="/signup">Signup</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
