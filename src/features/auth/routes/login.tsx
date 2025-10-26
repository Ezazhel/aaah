import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/login-form';
import { useAuth } from '@/lib/auth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
          <p className="text-gray-600">
            Connectez-vous pour gérer vos prototypes
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <LoginForm onSuccess={handleSuccess} />

          <div className="mt-6 text-center text-sm text-gray-600">
            Vous avez reçu une invitation ?{' '}
            <Link to="/auth/register" className="text-[oklch(69%_0.19_41)] hover:underline font-medium">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
