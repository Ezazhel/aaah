import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { ProfileForm } from '../components/profile-form';
import { ChangePasswordForm } from '../components/change-password-form';
import { User, Lock, Calendar, Shield } from 'lucide-react';

export const Account: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon compte</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et votre sécurité</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-[oklch(69%_0.19_41)] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{user?.role === 'admin' ? 'Administrateur' : 'Membre'}</span>
              </div>
              {user?.createdAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'text-[oklch(69%_0.19_41)] border-b-2 border-[oklch(69%_0.19_41)]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            Informations personnelles
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition flex items-center justify-center gap-2 ${
              activeTab === 'password'
                ? 'text-[oklch(69%_0.19_41)] border-b-2 border-[oklch(69%_0.19_41)]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            Sécurité
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'profile' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier mes informations</h3>
              <ProfileForm />
            </div>
          )}

          {activeTab === 'password' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier mon mot de passe</h3>
              <ChangePasswordForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
