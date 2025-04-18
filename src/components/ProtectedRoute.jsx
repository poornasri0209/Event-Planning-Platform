import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

// For regular authenticated users
export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth state to be determined
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  // Show nothing while checking authentication
  if (isChecking || loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// For admin users only
export const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth state to be determined
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  // Show nothing while checking authentication
  if (isChecking || loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Check if the user is authenticated and is an admin
  if (!currentUser || !isAdmin) {
    // Redirect to login if not authenticated or not an admin
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};