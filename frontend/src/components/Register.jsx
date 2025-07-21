import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch('password', '');

  const validatePassword = (password) => {
  // Exact same regex as backend
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  if (!strongRegex.test(password)) {
    return "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.";
  }
  return true;
};

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      await authAPI.register({
        username: data.username,
        password: data.password
      });
      
      setSuccessMessage('Account created successfully');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black page-transition flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-ultralight text-gray-900 heading-transition mb-2 tracking-wide">
            Create Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-transition font-light text-sm">
            Join us today
          </p>
        </div>

        {/* Card */}
        <div className="bg-white card-transition border border-gray-200 dark:border-gray-800 rounded-none shadow-sm p-8">
          {apiError && (
            <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-900 card-transition border-l-2 border-gray-900 dark:border-white text-gray-800 text-transition text-sm font-light">
              {apiError}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-900 card-transition border-l-2 border-gray-900 dark:border-white text-gray-800 text-transition text-sm font-light">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-light text-gray-600 dark:text-gray-400 text-transition mb-2 uppercase tracking-wider">
                Username
              </label>
              <input
                {...register('username', { 
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Minimum 3 characters required' }
                })}
                type="text"
                autoComplete="username"
                className="w-full px-0 py-3 border-0 border-b border-gray-200 input-transition bg-transparent focus:outline-none focus:border-gray-900 dark:focus:border-white font-light text-gray-900 placeholder-gray-400 dark:placeholder-gray-600"
                placeholder="Choose username"
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
      {...register('password', { 
        required: 'Password is required',
        validate: validatePassword
      })}
      type={showPassword ? 'text' : 'password'}
      autoComplete="new-password"
      className="w-full px-0 py-3 pr-10 border-0 border-b border-gray-200 input-transition bg-transparent focus:outline-none focus:border-gray-900 dark:focus:border-white font-light text-gray-900 placeholder-gray-400 dark:placeholder-gray-600"
      placeholder="Create password"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-0 top-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-transition focus:outline-none z-10"
      style={{ transition: 'color 0.3s ease' }}
    >
      {showPassword ? (
        // Hide password icon (eye with slash)
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
        </svg>
      ) : (
        // Show password icon (open eye)
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  </div>
  {errors.password && (
    <p className="mt-2 text-xs font-light text-gray-600 dark:text-gray-400 text-transition">{errors.password.message}</p>
  )}
  
  <PasswordStrengthMeter password={password} />
</div>



            <div>
              <label className="block text-xs font-light text-gray-600 dark:text-gray-400 text-transition mb-2 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="w-full px-0 py-3 pr-10 border-0 border-b border-gray-200 input-transition bg-transparent focus:outline-none focus:border-gray-900 dark:focus:border-white font-light text-gray-900 placeholder-gray-400 dark:placeholder-gray-600"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-transition focus:outline-none"
                  style={{ transition: 'color 0.3s ease' }}
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p className="mt-2 text-xs font-light text-gray-600 dark:text-gray-400 text-transition">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 button-transition font-light text-sm tracking-wide uppercase hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  transition: 'background-color 0.5s ease 0.2s, color 0.5s ease 0.2s, opacity 0.2s ease'
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-transition">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-gray-900 dark:text-white text-transition hover:text-gray-700 dark:hover:text-gray-300 border-b border-gray-900 dark:border-white pb-0.5"
              style={{ 
                transition: 'color 0.5s ease 0.3s, border-color 0.5s ease 0.3s' 
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
