import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 toggle-transition flex items-center justify-center z-50 border-2 border-gray-200 dark:border-gray-800"
      style={{
        transition: 'all 0.5s ease 0.2s, transform 0.2s ease, box-shadow 0.2s ease'
      }}
      aria-label="Toggle dark mode"
    >
      <div 
        className="transition-all duration-500 ease-in-out"
        style={{ 
          transform: isDarkMode ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.5s ease 0.1s'
        }}
      >
        {isDarkMode ? (
          // Sun icon for light mode
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 9a3 3 0 100 6 3 3 0 000-6zm12 3a1 1 0 01-1 1h-3a1 1 0 110-2h3a1 1 0 011 1zM4 12a1 1 0 01-1 1H1a1 1 0 110-2h2a1 1 0 011 1zm13.36-7.36a1 1 0 011.41 0l2.12 2.12a1 1 0 11-1.41 1.41L17.36 5.05a1 1 0 010-1.41zM4.64 19.36a1 1 0 001.41 0l2.12-2.12a1 1 0 10-1.41-1.41L4.64 17.95a1 1 0 000 1.41zM17.36 19.36a1 1 0 001.41-1.41l2.12-2.12a1 1 0 10-1.41-1.41l-2.12 2.12a1 1 0 000 1.41zM6.05 6.05a1 1 0 00-1.41-1.41L2.52 6.76a1 1 0 101.41 1.41L6.05 6.05zM12 1a1 1 0 011 1v3a1 1 0 11-2 0V2a1 1 0 011-1zm0 18a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z"/>
          </svg>
        ) : (
          // Moon icon for dark mode
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        )}
      </div>
    </button>
  );
};

export default DarkModeToggle;
