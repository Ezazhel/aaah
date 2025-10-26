import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useLogin } from '../api/login';
import { useAuth } from '@/lib/auth';
import type { LoginCredentials } from '@/types';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const { login: authLogin } = useAuth();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const credentials: LoginCredentials = {
      email,
      password,
      rememberMe,
    };

    try {
      const response = await loginMutation.mutateAsync(credentials);

      // Update auth context
      await authLogin(credentials);

      // Call success callback
      onSuccess?.();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Identifiants incorrects. Veuillez réessayer.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[oklch(69%_0.19_41)] focus:ring-[oklch(69%_0.19_41)]"
          />
          <span className="text-sm text-gray-600">Se souvenir de moi</span>
        </label>

        <Link
          to="/auth/reset-password"
          className="text-sm text-[oklch(69%_0.19_41)] hover:underline"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-[oklch(69%_0.19_41)] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[oklch(65%_0.19_41)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <LogIn className="w-5 h-5" />
        {loginMutation.isPending ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
};
