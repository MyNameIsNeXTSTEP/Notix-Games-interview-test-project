import React from 'react';

interface ClearButtonProps {
  onClick: () => void;
  className?: string;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-4 bg-white text-gray-400 hover:text-gray-600 transition-colors ${className}`}
      type="button"
      aria-label="Очистить поиск"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M6 18L18 6M6 6l12 12" 
        />
      </svg>
    </button>
  );
};

