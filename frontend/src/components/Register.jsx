import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      alert('Registration Successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration Failed: ' + (err.response?.data?.error || 'Server Error'));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2>Create an Account</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, full_name: e.target.value})} required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }} />
        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }} />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Sign Up</button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;