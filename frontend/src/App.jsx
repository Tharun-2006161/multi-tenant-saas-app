import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login'; 
import Dashboard from './components/Dashboard'; 
import ProtectedRoute from './components/ProtectedRoute';
import Register from './components/Register'; // 1. Import Register

function App() {
  return (
    <Router>
      <div style={{ padding: '0', margin: '0', fontFamily: 'Arial' }}>
        <Routes>
          <Route path="/" element={
            <div style={{padding: '20px'}}>
              <h2>Home Page - Welcome!</h2>
              <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
            </div>
          } />
          
          <Route path="/login" element={<Login />} /> 
          
          {/* 2. Add the Register Route */}
          <Route path="/register" element={<Register />} /> 

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