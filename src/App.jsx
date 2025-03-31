import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute, AdminRoute, MultiFacRoute } from "./components/ProtectedRoute"

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MultiFacPage from './pages/MultiFacPage';
import LandingPage from './pages/LandingPage';
import UserProfilePage from './pages/UserProfilePage';
import UserFeedbackPage from './pages/UserFeedbackPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProfile from './pages/AdminProfile';
import EventCreation from './pages/EventCreation';

const App = () => {
  return (
    
      <AuthProvider>
        <div>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Multi-factor Authentication Route */}
            <Route path="/2fa" element={
              <MultiFacRoute>
                <MultiFacPage />
              </MultiFacRoute>
            } />
            
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
            <Route path="/event/create" element={
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
            <Route path="/admin-profile" element={
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
  );
};

export default App;