import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await authAPI.getProtected();
        setDashboardData(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/login');
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-black page-transition">
      {/* Header */}
      <header className="bg-white card-transition border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-thin text-gray-900 heading-transition tracking-wide">Dashboard</h1>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-transition mt-1">Welcome back, {user?.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-light text-gray-600 dark:text-gray-400 text-transition hover:text-gray-900 dark:hover:text-white border-b border-transparent hover:border-gray-900 dark:hover:border-white"
              style={{
                transition: 'color 0.5s ease 0.3s, border-color 0.2s ease'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {error ? (
          <div className="bg-white card-transition border border-gray-200 dark:border-gray-800 p-8 text-center">
            <p className="text-sm font-light text-gray-600 dark:text-gray-400 text-transition">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Welcome Message */}
            {dashboardData && (
              <div className="bg-white card-transition border border-gray-200 dark:border-gray-800 p-8">
                <h2 className="text-lg font-light text-gray-900 heading-transition mb-4 tracking-wide">Protected Content</h2>
                <div className="bg-gray-50 dark:bg-gray-900 card-transition border-l-2 border-gray-900 dark:border-white p-4">
                  <p className="text-sm font-light text-gray-800 text-transition">{dashboardData.message}</p>
                </div>
              </div>
            )}

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white card-transition border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-sm font-light text-gray-600 dark:text-gray-400 text-transition uppercase tracking-wider mb-4">User Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm font-light text-gray-500 dark:text-gray-400 text-transition">Username</span>
                    <span className="text-sm font-light text-gray-900 text-transition">{user?.username}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm font-light text-gray-500 dark:text-gray-400 text-transition">Status</span>
                    <span className="text-sm font-light text-gray-900 text-transition">Authenticated</span>
                  </div>
                </div>
              </div>

              <div className="bg-white card-transition border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-sm font-light text-gray-600 dark:text-gray-400 text-transition uppercase tracking-wider mb-4">Session Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm font-light text-gray-500 dark:text-gray-400 text-transition">Token</span>
                    <span className="text-sm font-light text-gray-900 text-transition">Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm font-light text-gray-500 dark:text-gray-400 text-transition">Expires</span>
                    <span className="text-sm font-light text-gray-900 text-transition">1 hour</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-white card-transition border border-gray-200 dark:border-gray-800 p-8">
              <h3 className="text-sm font-light text-gray-600 dark:text-gray-400 text-transition uppercase tracking-wider mb-6">Available Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 py-2">
                  <div 
                    className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"
                    style={{ transition: 'background-color 0.5s ease 0.3s' }}
                  ></div>
                  <span className="text-sm font-light text-gray-700 text-transition">Protected route access</span>
                </div>
                <div className="flex items-center space-x-3 py-2">
                  <div 
                    className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"
                    style={{ transition: 'background-color 0.5s ease 0.3s' }}
                  ></div>
                  <span className="text-sm font-light text-gray-700 text-transition">Authenticated API calls</span>
                </div>
                <div className="flex items-center space-x-3 py-2">
                  <div 
                    className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"
                    style={{ transition: 'background-color 0.5s ease 0.3s' }}
                  ></div>
                  <span className="text-sm font-light text-gray-700 text-transition">Token-based security</span>
                </div>
                <div className="flex items-center space-x-3 py-2">
                  <div 
                    className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"
                    style={{ transition: 'background-color 0.5s ease 0.3s' }}
                  ></div>
                  <span className="text-sm font-light text-gray-700 text-transition">Automatic session management</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
