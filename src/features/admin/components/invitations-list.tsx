import React from 'react';
import { Mail, Trash2, RefreshCw, Clock, CheckCircle2, Copy } from 'lucide-react';
import { useInvitations, useDeleteInvitation, useResendInvitation } from '../api/invitations';
import type { Invitation } from '@/types';

export const InvitationsList: React.FC = () => {
  const { data, isLoading } = useInvitations();
  const deleteMutation = useDeleteInvitation();
  const resendMutation = useResendInvitation();

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette invitation ?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete invitation:', err);
      }
    }
  };

  const handleResend = async (id: string) => {
    try {
      await resendMutation.mutateAsync(id);
      alert('Invitation renvoyée avec succès !');
    } catch (err) {
      alert('Erreur lors du renvoi de l\'invitation');
    }
  };

  const copyInvitationLink = (token: string) => {
    const link = `${window.location.origin}/auth/register?token=${token}`;
    navigator.clipboard.writeText(link);
    alert('Lien copié dans le presse-papiers !');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[oklch(69%_0.19_41)] mx-auto"></div>
        <p className="mt-4 text-gray-600 text-sm">Chargement...</p>
      </div>
    );
  }

  const invitations = data?.data || [];

  if (invitations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Aucune invitation pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation: Invitation) => (
        <div
          key={invitation.id}
          className={`border rounded-lg p-4 ${
            invitation.usedAt
              ? 'bg-green-50 border-green-200'
              : isExpired(invitation.expiresAt)
              ? 'bg-gray-50 border-gray-200'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">{invitation.email}</span>
                {invitation.usedAt && (
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Utilisée
                  </span>
                )}
                {!invitation.usedAt && isExpired(invitation.expiresAt) && (
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-200 text-gray-600 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Expirée
                  </span>
                )}
                {!invitation.usedAt && !isExpired(invitation.expiresAt) && (
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    En attente
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Créée le {formatDate(invitation.createdAt)}</p>
                {invitation.usedAt && (
                  <p>Utilisée le {formatDate(invitation.usedAt)}</p>
                )}
                {!invitation.usedAt && (
                  <p>Expire le {formatDate(invitation.expiresAt)}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!invitation.usedAt && (
                <>
                  <button
                    onClick={() => copyInvitationLink(invitation.token)}
                    className="p-2 text-gray-600 hover:text-[oklch(69%_0.19_41)] hover:bg-gray-100 rounded-lg transition"
                    title="Copier le lien"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleResend(invitation.id)}
                    disabled={resendMutation.isPending}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                    title="Renvoyer l'invitation"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(invitation.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
