import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useRequestPasswordReset, useConfirmPasswordReset } from '../api/reset-password';

interface ResetPasswordFormProps {
  token?: string; // If provided, show confirm form, otherwise show request form
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token,
  onSuccess,
  onBackToLogin
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const requestMutation = useRequestPasswordReset();
  const confirmMutation = useConfirmPasswordReset();

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await requestMutation.mutateAsync({ email });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Une erreur est survenue. Veuillez réessayer.'
      );
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    try {
      await confirmMutation.mutateAsync({ token: token!, newPassword: password });
      setSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Le lien de réinitialisation est invalide ou expiré.'
      );
    }
  };

  if (success && !token) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Email envoyé !</h3>
            <p className="text-sm">
              Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation dans quelques instants.
            </p>
          </div>
        </div>

        <button
          onClick={onBackToLogin}
          className="w-full text-[oklch(69%_0.19_41)] hover:underline font-medium flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </button>
      </div>
    );
  }

  if (success && token) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Mot de passe réinitialisé !</h3>
            <p className="text-sm">
              Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.
            </p>
          </div>
        </div>

        <button
          onClick={onBackToLogin}
          className="w-full bg-[oklch(69%_0.19_41)] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[oklch(65%_0.19_41)] transition"
        >
          Se connecter
        </button>
      </div>
    );
  }

  // Request form (no token)
  if (!token) {
    return (
      <form onSubmit={handleRequestSubmit} className="space-y-6">
        <p className="text-gray-600 text-sm">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

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
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={requestMutation.isPending}
          className="w-full bg-[oklch(69%_0.19_41)] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[oklch(65%_0.19_41)] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {requestMutation.isPending ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full text-[oklch(69%_0.19_41)] hover:underline font-medium flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </button>
      </form>
    );
  }

  // Confirm form (with token)
  return (
    <form onSubmit={handleConfirmSubmit} className="space-y-6">
      <p className="text-gray-600 text-sm">
        Choisissez un nouveau mot de passe pour votre compte.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Nouveau mot de passe
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
        disabled={confirmMutation.isPending}
        className="w-full bg-[oklch(69%_0.19_41)] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[oklch(65%_0.19_41)] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {confirmMutation.isPending ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
      </button>
    </form>
  );
};
