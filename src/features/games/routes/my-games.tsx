import React from 'react';
import { Link } from 'react-router-dom';
import { useMyGames } from '../api/get-my-games';
import { useDeleteGame } from '../api/delete-game';
import { Plus, Edit, Trash2, FileText, Eye } from 'lucide-react';
import type { Game } from '@/types';

export const MyGames: React.FC = () => {
  const { data, isLoading } = useMyGames();
  const deleteMutation = useDeleteGame();

  const handleDelete = async (gameId: string, gameName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${gameName}" ?`)) {
      try {
        await deleteMutation.mutateAsync(gameId);
      } catch (err) {
        alert('Erreur lors de la suppression du jeu');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[oklch(69%_0.19_41)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const games = data?.data || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes prototypes</h1>
          <p className="text-gray-600">Gérez vos prototypes de jeux</p>
        </div>
        <Link
          to="/prototypes/nouveau"
          className="bg-[oklch(69%_0.19_41)] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[oklch(65%_0.19_41)] transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouveau prototype
        </Link>
      </div>

      {games.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun prototype</h3>
          <p className="text-gray-600 mb-6">Commencez par créer votre premier prototype de jeu</p>
          <Link
            to="/prototypes/nouveau"
            className="inline-flex items-center gap-2 bg-[oklch(69%_0.19_41)] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[oklch(65%_0.19_41)] transition"
          >
            <Plus className="w-5 h-5" />
            Créer un prototype
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game: Game) => (
            <div
              key={game.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative h-48 bg-gray-200">
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
                {game.isDraft && (
                  <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Brouillon
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{game.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{game.description}</p>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/prototypes/${game.id}`}
                    className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Voir
                  </Link>
                  <Link
                    to={`/mes-prototypes/${game.id}/modifier`}
                    className="flex-1 text-center px-4 py-2 bg-[oklch(69%_0.19_41)] text-white rounded-lg text-sm font-medium hover:bg-[oklch(65%_0.19_41)] transition flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Éditer
                  </Link>
                  <button
                    onClick={() => handleDelete(game.id, game.name)}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
