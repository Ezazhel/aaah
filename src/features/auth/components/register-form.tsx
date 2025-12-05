import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useRegister } from '../api/register';
import { useVerifyInvitation } from '../api/verify-invitation';
import { useAuth } from '@/lib/auth';
import type { RegisterData } from '@/types';

interface RegisterFormProps {
  invitationToken: string;
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ invitationToken, onSuccess }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { setUser } = useAuth();
  const registerMutation = useRegister();
  const { data: invitationData, isLoading: isVerifying, error: verificationError } = useVerifyInvitation({ token: invitationToken });

  // Pre-fill email from invitation
  useEffect(() => {
    if (invitationData?.email) {
      setEmail(invitationData.email);
    }
    // Pre-fill firstname/lastname if author is linked to invitation
    if (invitationData?.authorFirstname) {
      setFirstname(invitationData.authorFirstname);
    }
    if (invitationData?.authorLastname) {
      setLastname(invitationData.authorLastname);
    }
  }, [invitationData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    const data: RegisterData = {
      firstname,
      lastname,
      email,
      password,
      invitationToken,
      authorId: invitationData?.authorId,
    };

    try {
      const response = await registerMutation.mutateAsync(data);

      // Store token and user
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      setUser(response.user);

      // Call success callback
      onSuccess?.();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      );
    }
  };

  if (isVerifying) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[oklch(69%_0.19_41)] mx-auto"></div>
        <p className="mt-4 text-gray-600">Vérification de l'invitation...</p>
      </div>
    );
  }

  if (verificationError || !invitationData?.valid) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold mb-1">Invitation invalide ou expirée</h3>
          <p className="text-sm">
            Cette invitation n'est plus valide. Veuillez contacter un administrateur pour recevoir une nouvelle invitation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium mb-1">Invitation valide</p>
          <p>Vous pouvez créer votre compte pour {invitationData.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="firstname"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
                placeholder="Jean"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
                placeholder="Dupont"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              readOnly
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">L'email est défini par l'invitation</p>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Au moins 8 caractères</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-[oklch(69%_0.19_41)] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[oklch(65%_0.19_41)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          {registerMutation.isPending ? 'Création du compte...' : 'Créer mon compte'}
        </button>
      </form>
    </div>
  );
};
