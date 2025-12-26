import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
// Remove the .jsx extension to let Vite handle it naturally
import Dashboard from "./components/Dashboard"; 
import ProtectedRoute from "./components/ProtectedRoute";

const styles = {
  app: { fontFamily: "Arial, sans-serif", margin: 0, padding: 0 },
  home: { padding: "40px", textAlign: "center" },
  links: { marginTop: "20px", fontSize: "16px" },
};

const App = () => {
  // HERO TEST: This will tell us if the variable exists in the browser console
  console.log("Checking Dashboard import:", Dashboard);

  return (
    <Router>
      <div style={styles.app}>
        <Routes>
          <Route path="/" element={
              <div style={styles.home}>
                <h2>Home Page</h2>
                <div style={styles.links}>
                  <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                </div>
              </div>
          } />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* TEMPORARY HERO TEST: Remove ProtectedRoute just to see if Dashboard loads */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;