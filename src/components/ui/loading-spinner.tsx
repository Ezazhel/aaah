import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-16 w-16'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Chargement…',
  size = 'md',
  fullScreen = false,
  className = ''
}) => {
  const containerClass = fullScreen 
    ? 'bg-gradient-to-br from-[oklch(96%_0.01_250)] to-[oklch(94%_0.04_250)] min-h-screen py-12 px-4'
    : 'flex justify-center items-center min-h-[40vh]';
    
  const spinnerClass = `animate-spin rounded-full border-t-4 border-[oklch(69%_0.19_41)] border-opacity-30 ${sizeClasses[size]}`;

  const content = (
    <div className="flex justify-center items-center min-h-[40vh]">
      <div className={spinnerClass}></div>
      {message && (
        <span className="ml-4 text-[oklch(36%_0.13_250)] font-medium">
          {message}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={containerClass}>
        <div className="max-w-6xl mx-auto">
          {content}
        </div>
      </div>
    );
  }

  return <div className={className}>{content}</div>;
};
