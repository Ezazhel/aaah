import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  backLink?: {
    to: string;
    label: string;
  };
  fullScreen?: boolean;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Erreur de chargement',
  message = 'Une erreur est survenue lors du chargement.',
  onRetry,
  retryLabel = 'Réessayer',
  backLink,
  fullScreen = false,
  className = ''
}) => {
  const containerClass = fullScreen 
    ? 'bg-gradient-to-br from-[oklch(96%_0.01_250)] to-[oklch(94%_0.04_250)] min-h-screen py-12 px-4'
    : '';

  const content = (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">{title}</h1>
      <p className="mb-6 text-gray-600">{message}</p>
      
      <div className="flex gap-4 justify-center flex-wrap">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-block px-5 py-2 rounded bg-[oklch(69%_0.19_41)] text-white font-semibold hover:bg-[oklch(64%_0.19_41)] transition"
          >
            {retryLabel}
          </button>
        )}
        
        {backLink && (
          <Link
            to={backLink.to}
            className="inline-block px-5 py-2 rounded border border-[oklch(69%_0.19_41)] text-[oklch(69%_0.19_41)] font-semibold hover:bg-[oklch(69%_0.19_41)]/10 transition"
          >
            {backLink.label}
          </Link>
        )}
      </div>
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
