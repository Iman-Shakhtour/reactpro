import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./SignUpPage.css"; // ✨ ملف الستايل الجديد

const SignUpPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

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
        role,
      });

      toast.success("✅ Registered successfully!");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      toast.error("❌ Registration failed. Please check your data.");
    }
  };

  return (
    <div className="page-signup">
      <div className="ring">
        <i style={{ "--clr": "#A9BA9D" }}></i>
        <i style={{ "--clr": "#E9DCAA" }}></i>
        <i style={{ "--clr": "#CCE3C0" }}></i>

        <form className="signup-box" onSubmit={handleSignUp}>
          <h2>Sign Up</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="DONOR">Donor</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button type="submit">Sign Up</button>

          <p>
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
