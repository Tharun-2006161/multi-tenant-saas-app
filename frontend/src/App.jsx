import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <div style={styles.app}>
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <div style={styles.home}>
                <h2>Home Page</h2>
                <p>Welcome to the Application</p>
                <div style={styles.links}>
                  <Link to="/login">Login</Link>
                  <span> | </span>
                  <Link to="/register">Register</Link>
                </div>
              </div>
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Route */}
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
};

export default App;

// ================= Styles =================

const styles = {
  app: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
  },
  home: {
    padding: "40px",
    textAlign: "center",
  },
  links: {
    marginTop: "20px",
    fontSize: "16px",
  },
};
