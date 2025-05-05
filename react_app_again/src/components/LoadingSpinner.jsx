import React from 'react';

const LoadingSpinner = ({ darkMode }) => {
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
    </div>
  );
};

export default LoadingSpinner;