import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResetPasswordForm } from '../components/reset-password-form';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/auth/login');
    }, 2000);
  };

  const handleBackToLogin = () => {
    navigate('/auth/login');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {token ? 'Nouveau mot de passe' : 'Mot de passe oublié'}
          </h1>
          <p className="text-gray-600">
            {token
              ? 'Choisissez un nouveau mot de passe sécurisé'
              : 'Nous vous enverrons un lien de réinitialisation'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <ResetPasswordForm
            token={token || undefined}
            onSuccess={handleSuccess}
            onBackToLogin={handleBackToLogin}
          />
        </div>
      </div>
    </div>
  );
};
