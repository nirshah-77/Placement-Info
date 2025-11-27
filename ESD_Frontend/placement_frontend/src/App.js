import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import StudentList from "./components/StudentList";
import PlacementHistory from "./components/PlacementHistory";
import Navbar from "./components/Navbar";
import MainDashboard from "./components/MainDashboard";
import PlacementDashboard from "./components/PlacementDashboard";



// Component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  // Check for OAuth callback token in URL first
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get('token');

  if (tokenFromUrl) {
    // Save token from OAuth callback
    localStorage.setItem('user', tokenFromUrl);
    // Remove token from URL and redirect to clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const token = localStorage.getItem("user"); // Check if token exists

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <div className="app-container">
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route for Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Route for Main Dashboard (ERP Modules) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainDashboard />
            </PrivateRoute>
          }
        />

        {/* Protected Route for Placement Module (Stats) */}
        <Route
          path="/placement"
          element={
            <PrivateRoute>
              <PlacementDashboard />
            </PrivateRoute>
          }
        />

        {/* Protected Route for Student List */}
        <Route
          path="/students"
          element={
            <PrivateRoute>
              <StudentList />
            </PrivateRoute>
          }
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Redirect unknown paths to dashboard if logged in, else login */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
