import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../Supabase/supabase";
import { FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";

const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("users")
      .select("id, email, password, role")
      .eq("email", formData.email)
      .single();

    if (error || !data) {
      alert("User not found");
      return;
    }

    if (formData.password === data.password) {
      alert("Login successful");
      localStorage.setItem("user", JSON.stringify(data));
      switch (data.role) {
        case "admin":
          navigate("/admin");
          break;
        case "student":
          navigate("/students");
          break;
        case "user":
          navigate("/users");
          break;
        default:
          alert("Unknown role");
          navigate("/");
      }
    } else {
      alert("Invalid password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f2fe, #f0fdf4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
        }}
      >
        <FaUserShield size={50} color="#1e3a8a" style={{ marginBottom: "20px" }} />
        <h2 style={{ marginBottom: "25px", color: "#1e3a8a" }}>
          Government Scheme Portal Login
        </h2>

        <div style={{ position: "relative", marginBottom: "20px" }}>
          <FaEnvelope
            style={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              color: "#6b7280",
            }}
          />
          
         <input
  type="email"
  name="email"
  placeholder="Enter your email"
  value={formData.email}
  onChange={handleChange}
  required
  style={{
    padding: "12px 12px 12px 40px",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "16px",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  }}
  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
/>
        </div>

        <div style={{ position: "relative", marginBottom: "25px" }}>
          <FaLock
            style={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              color: "#6b7280",
            }}
          />
         <input
  type="password"
  name="password"
  placeholder="Enter your password"
  value={formData.password}
  onChange={handleChange}
  required
  style={{
    padding: "12px 12px 12px 40px",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "16px",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  }}
  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
/>

        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s",
            marginBottom: "15px",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1e40af")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={() => navigate("/signup")}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#059669",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#047857")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#059669")}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Signin;