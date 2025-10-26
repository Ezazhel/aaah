import React, { useState } from 'react';
import { Mail, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { useCreateInvitation } from '../api/invitations';
import type { CreateInvitationData } from '../api/invitations';

interface InvitationFormProps {
  onSuccess?: () => void;
}

export const InvitationForm: React.FC<InvitationFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const createMutation = useCreateInvitation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const data: CreateInvitationData = { email };

    try {
      await createMutation.mutateAsync(data);
      setSuccess(true);
      setEmail('');
      onSuccess?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Une erreur est survenue lors de l\'envoi de l\'invitation.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">Invitation envoyée avec succès !</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
            placeholder="email@exemple.com"
          />
        </div>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-[oklch(69%_0.19_41)] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[oklch(65%_0.19_41)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
        >
          <Send className="w-4 h-4" />
          {createMutation.isPending ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
};
