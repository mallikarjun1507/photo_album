import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed! Please check your credentials.");
      }

      alert("Login successful! Redirecting...");
      navigate("/photo");

    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "black", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account? <a href="/signup" style={{ color: "blue", textDecoration: "none" }}>Sign up</a>
      </p>
    </div>
  );
};

export default Login;
