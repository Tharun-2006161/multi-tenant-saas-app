import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ full_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // FIXED: Using backticks and environment variable
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", textAlign: "center" }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input name="full_name" placeholder="Full Name" onChange={(e) => setFormData({...formData, full_name: e.target.value})} required style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
        <input name="email" type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
        <input name="password" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "#fff" }}>
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};
export default Register;