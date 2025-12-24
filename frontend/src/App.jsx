import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; 
import Dashboard from './components/Dashboard'; // 1. IMPORT the Dashboard

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>SaaS Management System</h1>
        <hr />
        <Routes>
          <Route path="/" element={<h2>Home Page - Welcome!</h2>} />
          <Route path="/login" element={<Login />} /> 
          {/* 2. ADD the Dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;