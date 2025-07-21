import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUsername = localStorage.getItem('username');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (storedToken && storedUsername) {
      // Check if token is expired
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        const isExpired = Date.now() >= payload.exp * 1000;
        
        if (!isExpired) {
          setToken(storedToken);
          setUser({ username: storedUsername });
        } else if (storedRefreshToken && rememberMe) {
          // Try to refresh the token
          refreshAccessToken(storedRefreshToken);
        } else {
          // Clear expired tokens
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('username');
          localStorage.removeItem('rememberMe');
        }
      } catch (error) {
        // Invalid token, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        localStorage.removeItem('rememberMe');
      }
    }
    setLoading(false);
  }, []);

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch('http://localhost:5000/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.accessToken);
        setToken(data.accessToken);
        const storedUsername = localStorage.getItem('username');
        setUser({ username: storedUsername });
      } else {
        // Refresh failed, clear everything
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  const login = (accessToken, refreshToken, username, rememberMe = false) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username);
    localStorage.setItem('rememberMe', rememberMe.toString());
    
    if (rememberMe) {
      localStorage.setItem('rememberedUsername', username);
    }
    
    setToken(accessToken);
    setUser({ username });
  };

  const logout = async () => {
    const currentToken = localStorage.getItem('token');
    const currentRefreshToken = localStorage.getItem('refreshToken');
    
    // Call backend logout
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ refreshToken: currentRefreshToken })
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    }

    // Clear all tokens but keep remembered username if it exists
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('rememberMe');
    
    setToken(null);
    setUser(null);
  };

  const getRememberedUsername = () => {
    return localStorage.getItem('rememberedUsername') || '';
  };

  const value = {
    user,
    token,
    login,
    logout,
    getRememberedUsername,
    isAuthenticated: !!token,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black page-transition flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-light text-gray-600 dark:text-gray-400 text-transition tracking-wide">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
