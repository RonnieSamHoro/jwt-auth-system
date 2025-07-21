import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useSessionTimeout = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const { logout, token } = useAuth();

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
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    if (!token) return;

    const expiry = getTokenExpiry();
    if (!expiry) return;

    const checkSession = () => {
      const now = Date.now();
      const remaining = expiry - now;

      if (remaining <= 0) {
        logout();
        return;
      }

      if (remaining <= 2 * 60 * 1000 && !showWarning) { // 2 minutes warning
        setShowWarning(true);
        setTimeRemaining(Math.floor(remaining / 1000));
      }

      if (showWarning && remaining > 2 * 60 * 1000) {
        setShowWarning(false);
        setTimeRemaining(null);
      }

      if (showWarning) {
        setTimeRemaining(Math.floor(remaining / 1000));
      }
    };

    const interval = setInterval(checkSession, 1000);
    checkSession(); // Initial check

    return () => clearInterval(interval);
  }, [token, showWarning, logout, getTokenExpiry]);

  return {
    showWarning,
    timeRemaining,
    extendSession,
    dismissWarning: () => setShowWarning(false)
  };
};
