import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import UserProfilePage from './pages/UserProfilePage';
import UserFeedbackPage from './pages/UserFeedbackPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProfile from './pages/AdminProfile';
import EventCreation from './pages/EventCreation';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected User Routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute>
              <UserFeedbackPage />
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute>
              <EventCreation />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          } />
          <Route path="/admin/profile" element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;