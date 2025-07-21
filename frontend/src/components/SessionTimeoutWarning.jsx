import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SessionTimeoutWarning = () => {
  const { logout, token } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  const getTokenExpiry = useCallback(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch {
      return null;
    }
  }, [token]);

  const extendSession = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        logout();
        return;
      }

      const response = await fetch('http://localhost:5000/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.accessToken);
        setShowWarning(false);
        setTimeRemaining(null);
        setDismissed(false);
        // Force a page refresh to update the token in React state
        window.location.reload();
      } else {
        logout();
      }
    } catch (error) {
      console.error('Session extension failed:', error);
      logout();
    }
  };

  const dismissWarning = () => {
    setShowWarning(false);
    setDismissed(true);
  };

  useEffect(() => {
    if (!token || dismissed) return;

    const expiry = getTokenExpiry();
    if (!expiry) return;

    const checkSession = () => {
      const now = Date.now();
      const remaining = expiry - now;

      // If token expired, logout immediately
      if (remaining <= 0) {
        logout();
        return;
      }

      // Show warning 2 minutes before expiry
      const warningTime = 2 * 60 * 1000; // 2 minutes in milliseconds
      
      if (remaining <= warningTime && !showWarning && !dismissed) {
        setShowWarning(true);
        setTimeRemaining(Math.floor(remaining / 1000));
      }

      // Update remaining time if warning is shown
      if (showWarning && !dismissed) {
        setTimeRemaining(Math.floor(remaining / 1000));
      }
    };

    // Check immediately
    checkSession();

    // Set up interval to check every 30 seconds
    const interval = setInterval(checkSession, 30000);

    return () => clearInterval(interval);
  }, [token, showWarning, dismissed, logout, getTokenExpiry]);

  // Don't render if no warning to show
  if (!showWarning || !timeRemaining) {
    return null;
  }

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 card-transition p-6 rounded-lg shadow-xl max-w-md mx-4">
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-12 h-12 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-light text-gray-900 dark:text-white heading-transition mb-2">
            Session Expiring Soon
          </h3>
          
          <p className="text-sm font-light text-gray-600 dark:text-gray-400 text-transition mb-4">
            Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')}
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={extendSession}
              className="flex-1 py-2 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 button-transition font-light text-sm tracking-wide uppercase hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none"
              style={{
                transition: 'background-color 0.3s ease, color 0.3s ease'
              }}
            >
              Extend Session
            </button>
            
            <button
              onClick={dismissWarning}
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-transition font-light text-sm tracking-wide uppercase hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
              style={{
                transition: 'background-color 0.3s ease, color 0.3s ease'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;
