import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading if auth state is still being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black page-transition flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-light text-gray-600 dark:text-gray-400 text-transition tracking-wide">Loading...</div>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
