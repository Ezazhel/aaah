import React, { useState } from 'react';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useChangePassword } from '../api/change-password';
import type { ChangePasswordData } from '@/types';

export const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const changeMutation = useChangePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    const data: ChangePasswordData = {
      currentPassword,
      newPassword,
    };

    try {
      await changeMutation.mutateAsync(data);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Mot de passe actuel incorrect ou erreur serveur.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">Mot de passe modifié avec succès !</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe actuel
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Nouveau mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          Confirmer le nouveau mot de passe
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
        disabled={changeMutation.isPending}
        className="w-full bg-[oklch(69%_0.19_41)] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[oklch(65%_0.19_41)] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {changeMutation.isPending ? 'Modification...' : 'Modifier le mot de passe'}
      </button>
    </form>
  );
};
