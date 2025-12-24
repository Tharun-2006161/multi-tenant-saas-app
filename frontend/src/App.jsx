import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; 
import Dashboard from './components/Dashboard'; 
import ProtectedRoute from './components/ProtectedRoute'; // 1. Import the Protector

function App() {
  return (
    <Router>
      <div style={{ padding: '0', margin: '0', fontFamily: 'Arial' }}>
        {/* We moved the padding and H1 inside routes or components for a cleaner look */}
        <Routes>
          <Route path="/" element={<div style={{padding: '20px'}}><h2>Home Page - Welcome!</h2></div>} />
          <Route path="/login" element={<Login />} /> 
          
          {/* 2. Wrap the Dashboard in the ProtectedRoute */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;