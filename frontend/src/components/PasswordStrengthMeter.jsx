import React from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const calculateStrength = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };

    Object.values(checks).forEach(check => {
      if (check) score += 1;
    });

    return { score, checks };
  };

  const { score, checks } = calculateStrength(password);
  const percentage = (score / 5) * 100;

  const getStrengthText = () => {
    if (score === 0) return { text: '', color: '' };
    if (score <= 2) return { text: 'Weak', color: 'text-red-500' };
    if (score <= 3) return { text: 'Fair', color: 'text-yellow-500' };
    if (score <= 4) return { text: 'Good', color: 'text-blue-500' };
    return { text: 'Strong', color: 'text-green-500' };
  };

  const getBarColor = () => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const strength = getStrengthText();
  const hasPassword = password && password.length > 0;

  return (
    <div 
      className={`overflow-hidden transition-all duration-500 ease-out ${
        hasPassword 
          ? 'max-h-96 opacity-100 translate-y-0' 
          : 'max-h-0 opacity-0 -translate-y-2'
      }`}
      style={{
        transformOrigin: 'top'
      }}
    >
      <div className="mt-4 space-y-3">
        {/* Strength Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all duration-300 ${getBarColor()}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Strength Text */}
        {strength.text && (
          <div className={`text-xs font-light ${strength.color} text-transition`}>
            Password strength: {strength.text}
          </div>
        )}

        {/* Requirements Checklist */}
        <div className="text-xs font-light text-gray-400 dark:text-gray-500 text-transition space-y-2">
          <div className="text-xs font-light text-gray-500 dark:text-gray-400 mb-2">
            Requirements:
          </div>
          <div className={`flex items-center space-x-2 transition-colors duration-300 ${checks.length ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
            <span className="text-xs">{checks.length ? '✓' : '○'}</span>
            <span>At least 8 characters</span>
          </div>
          <div className={`flex items-center space-x-2 transition-colors duration-300 ${checks.uppercase ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
            <span className="text-xs">{checks.uppercase ? '✓' : '○'}</span>
            <span>One uppercase letter</span>
          </div>
          <div className={`flex items-center space-x-2 transition-colors duration-300 ${checks.lowercase ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
            <span className="text-xs">{checks.lowercase ? '✓' : '○'}</span>
            <span>One lowercase letter</span>
          </div>
          <div className={`flex items-center space-x-2 transition-colors duration-300 ${checks.number ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
            <span className="text-xs">{checks.number ? '✓' : '○'}</span>
            <span>One number</span>
          </div>
          <div className={`flex items-center space-x-2 transition-colors duration-300 ${checks.special ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
            <span className="text-xs">{checks.special ? '✓' : '○'}</span>
            <span>One special character (@$!%*?&)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
