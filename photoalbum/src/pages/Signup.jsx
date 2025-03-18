import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (!response.ok) {
        throw new Error("Signup failed! Please try again.");
      }

      alert("Signup successful! Redirecting to login...");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Signup</h2>
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "blue", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Signup
        </button>
      </form>
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account? <a href="/login" style={{ color: "blue", textDecoration: "none" }}>Login</a>
      </p>
    </div>
  );
};

export default Signup;
