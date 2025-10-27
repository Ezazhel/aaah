import { useNavigate, Link } from "react-router-dom";
import { GameForm } from "../components/game-form";
import { useCreateGame } from "../api/create-game";
import { type GameInput } from "@/types";

export default function CreateGame() {
  const navigate = useNavigate();
  const createGameMutation = useCreateGame();

  const handleSubmit = async (data: GameInput) => {
    try {
      const game = await createGameMutation.mutateAsync(data);
      // Navigate to the created game's detail page
      navigate(`/prototypes/${game.id}`);
    } catch (error) {
      console.error("Error creating game:", error);
      // You could add error toast/notification here
    }
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 px-4 pt-6 max-w-5xl mx-auto">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:underline text-[oklch(69%_0.19_41)]/90 font-semibold">
              Accueil
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/prototypes" className="hover:underline text-[oklch(69%_0.19_41)]/90 font-semibold">
              Prototypes
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 font-bold">Nouveau prototype</li>
        </ol>
      </nav>

      {/* Back Button */}
      <div className="max-w-5xl mx-auto px-4 mt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[oklch(69%_0.19_41)]/90 hover:text-[oklch(69%_0.19_41)]/80 font-semibold mb-4 transition"
        >
          <span className="mr-2 text-xl">←</span> Retour
        </button>
      </div>

      {/* Title */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <h1 className="text-4xl font-extrabold text-[oklch(36%_0.13_250)]">
          Ajouter un nouveau prototype
        </h1>
        <p className="text-gray-600 mt-2">
          Remplissez les informations ci-dessous pour ajouter votre prototype à la galerie.
        </p>
      </div>

      {/* Form */}
      <GameForm
        onSubmit={handleSubmit}
        isSubmitting={createGameMutation.isPending}
      />

      {/* Error Message */}
      {createGameMutation.isError && (
        <div className="max-w-5xl mx-auto px-4 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <strong>Erreur :</strong> Impossible de créer le prototype. Veuillez réessayer.
          </div>
        </div>
      )}
    </div>
  );
}
