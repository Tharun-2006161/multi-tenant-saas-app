import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // FIXED: Using backticks and environment variable
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, formData);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "360px", margin: "80px auto", textAlign: "center" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input name="email" type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
        <input name="password" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};
export default Login;