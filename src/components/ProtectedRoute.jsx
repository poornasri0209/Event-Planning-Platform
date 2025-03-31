import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"

// For regular authenticated users
export const ProtectedRoute = ({ children }) => {
  const { currentUser, needsMultiFactor } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (needsMultiFactor) {
    // Redirect to 2FA page if multifactor authentication is needed
    return <Navigate to="/2fa" state={{ from: location }} replace />;
  }

  return children;
};

// For admin users only
export const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Check if the user is authenticated and is an admin
  const isAdmin = currentUser && currentUser.email === 'admin@admin.com';

  if (!currentUser || !isAdmin) {
    // Redirect to login if not authenticated or not an admin
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// For users who need to complete multifactor authentication
export const MultiFacRoute = ({ children }) => {
  const { currentUser, needsMultiFactor } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!needsMultiFactor) {
    // Redirect to home if multifactor authentication is not needed
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
};