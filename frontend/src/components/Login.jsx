import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const Login = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { login, getRememberedUsername, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    // Auto-fill remembered username
    const rememberedUsername = getRememberedUsername();
    if (rememberedUsername) {
      setValue('username', rememberedUsername);
      setRememberMe(true);
    }
  }, [setValue, getRememberedUsername]);

  // Handle navigation after successful login
  useEffect(() => {
    if (loginSuccess && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [loginSuccess, isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');
    setLockoutInfo(null);
    setLoginSuccess(false);

    try {
      const response = await authAPI.login({
        ...data,
        rememberMe
      });
      
      const { accessToken, refreshToken, username } = response.data;
      
      // Update authentication state
      login(accessToken, refreshToken, username, rememberMe);
      
      // Set success flag to trigger navigation
      setLoginSuccess(true);
      
    } catch (error) {
      const errorData = error.response?.data;
      setApiError(errorData?.message || 'Login failed');
      
      // Handle account lockout
      if (error.response?.status === 423) {
        setLockoutInfo({
          lockUntil: errorData.lockUntil,
          message: errorData.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeRemaining = () => {
    if (!lockoutInfo?.lockUntil) return '';
    const remaining = Math.max(0, Math.ceil((lockoutInfo.lockUntil - Date.now()) / (1000 * 60)));
    return remaining > 0 ? `${remaining} minutes` : 'Account unlocked';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black page-transition flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-ultralight text-gray-900 heading-transition mb-2 tracking-wide">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-transition font-light text-sm">
            Sign in to continue
          </p>
        </div>

        {/* Card */}
        <div className="bg-white card-transition border border-gray-200 dark:border-gray-800 rounded-none shadow-sm p-8">
          {apiError && (
            <div className={`mb-6 p-3 bg-gray-50 dark:bg-gray-900 card-transition border-l-2 ${lockoutInfo ? 'border-red-500' : 'border-gray-900 dark:border-white'} text-gray-800 text-transition text-sm font-light`}>
              {apiError}
              {lockoutInfo && (
                <div className="mt-2 text-xs text-red-600">
                  Time remaining: {formatTimeRemaining()}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-light text-gray-600 dark:text-gray-400 text-transition mb-2 uppercase tracking-wider">
                Username
              </label>
              <input
                {...register('username', { required: 'Username is required' })}
                type="text"
                autoComplete="username"
                className="w-full px-0 py-3 border-0 border-b border-gray-200 input-transition bg-transparent focus:outline-none focus:border-gray-900 dark:focus:border-white font-light text-gray-900 placeholder-gray-400 dark:placeholder-gray-600"
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="mt-2 text-xs font-light text-gray-600 dark:text-gray-400 text-transition">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-light text-gray-600 dark:text-gray-400 text-transition mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full px-0 py-3 pr-10 border-0 border-b border-gray-200 input-transition bg-transparent focus:outline-none focus:border-gray-900 dark:focus:border-white font-light text-gray-900 placeholder-gray-400 dark:placeholder-gray-600"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-transition focus:outline-none"
                  style={{ transition: 'color 0.3s ease' }}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs font-light text-gray-600 dark:text-gray-400 text-transition">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-gray-900 bg-transparent border border-gray-300 rounded focus:ring-gray-900 dark:focus:ring-white dark:ring-offset-gray-800 focus:ring-2 dark:bg-transparent dark:border-gray-600"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm font-light text-gray-600 dark:text-gray-400 text-transition">
                Remember me
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || lockoutInfo}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 button-transition font-light text-sm tracking-wide uppercase hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  transition: 'background-color 0.5s ease 0.2s, color 0.5s ease 0.2s, opacity 0.2s ease'
                }}
              >
                {isLoading ? 'Signing In...' : lockoutInfo ? 'Account Locked' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-transition">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-gray-900 dark:text-white text-transition hover:text-gray-700 dark:hover:text-gray-300 border-b border-gray-900 dark:border-white pb-0.5"
              style={{ 
                transition: 'color 0.5s ease 0.3s, border-color 0.5s ease 0.3s' 
              }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
