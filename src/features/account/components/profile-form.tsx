import React, { useState } from 'react';
import { User, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useUpdateProfile } from '../api/update-profile';
import { useAuth } from '@/lib/auth';
import type { UpdateProfileData } from '../api/update-profile';

export const ProfileForm: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const updateMutation = useUpdateProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const data: UpdateProfileData = { name, email };

    try {
      await updateMutation.mutateAsync(data);
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Une erreur est survenue lors de la mise à jour.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">Profil mis à jour avec succès !</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nom complet
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
          />
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
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="w-full bg-[oklch(69%_0.19_41)] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[oklch(65%_0.19_41)] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </button>
    </form>
  );
};
