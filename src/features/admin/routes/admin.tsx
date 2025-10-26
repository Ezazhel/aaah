import React from 'react';
import { InvitationForm } from '../components/invitation-form';
import { InvitationsList } from '../components/invitations-list';
import { UserPlus } from 'lucide-react';

export const Admin: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
        <p className="text-gray-600">Gérer les invitations des membres</p>
      </div>

      {/* Invitation Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <UserPlus className="w-6 h-6 text-[oklch(69%_0.19_41)]" />
          <h2 className="text-xl font-semibold text-gray-900">Inviter un nouveau membre</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Envoyez une invitation par email. Le destinataire recevra un lien unique pour créer son compte.
        </p>
        <InvitationForm />
      </div>

      {/* Invitations List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Invitations envoyées</h2>
        <InvitationsList />
      </div>
    </div>
  );
};
