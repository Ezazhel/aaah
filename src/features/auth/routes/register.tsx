import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { RegisterForm } from '../components/register-form';
import { useAuth } from '@/lib/auth';
import { AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const invitationToken = searchParams.get('token');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSuccess = () => {
    navigate('/');
  };

  // No invitation token provided
  if (!invitationToken) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Invitation requise</h3>
                <p className="text-sm mb-4">
                  L'inscription nécessite une invitation. Si vous êtes membre de l'association, contactez un administrateur pour recevoir votre lien d'invitation.
                </p>
                <Link
                  to="/contact"
                  className="inline-block text-sm font-medium text-yellow-800 hover:underline"
                >
                  Nous contacter →
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/auth/login"
                className="text-[oklch(69%_0.19_41)] hover:underline font-medium"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer votre compte</h1>
          <p className="text-gray-600">
            Bienvenue dans l'association !
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <RegisterForm invitationToken={invitationToken} onSuccess={handleSuccess} />

          <div className="mt-6 text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link to="/auth/login" className="text-[oklch(69%_0.19_41)] hover:underline font-medium">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
