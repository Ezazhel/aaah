import { useNavigate, useParams, Link } from "react-router-dom";
import { GameForm } from "../components/game-form";
import { useGame } from "../api/get-game";
import { useUpdateGame } from "../api/update-game";
import { type GameInput } from "@/types";

export default function EditGame() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const gameId = id || "";

  const { data: game, isLoading, isError } = useGame({ gameId });
  const updateGameMutation = useUpdateGame();

  const handleSubmit = async (data: GameInput) => {
    try {
      const updatedGame = await updateGameMutation.mutateAsync({
        id: gameId,
        ...data,
      });
      // Navigate to the updated game's detail page
      navigate(`/prototypes/${updatedGame.id}`);
    } catch (error) {
      console.error("Error updating game:", error);
      // You could add error toast/notification here
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[oklch(69%_0.19_41)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-2">Erreur</h2>
          <p className="text-red-800">
            Impossible de charger le prototype. Veuillez réessayer.
          </p>
          <Link
            to="/mes-prototypes"
            className="inline-block mt-4 text-[oklch(69%_0.19_41)] hover:underline"
          >
            Retour à mes prototypes
          </Link>
        </div>
      </div>
    );
  }

  // Prepare initial data from the fetched game
  const initialData: Partial<GameInput> = {
    name: game.name,
    authorIds: game.authors?.map(a => a.id) || [],
    description: game.description,
    minPlayers: game.minPlayers,
    maxPlayers: game.maxPlayers,
    duration: game.duration,
    imageUrl: game.imageUrl,
    category: game.category,
    mechanics: game.mechanics || [],
    images: game.images || [],
    rulesUrl: game.rulesUrl || "",
    videoRulesUrl: game.videoRulesUrl || "",
    fullDescription: game.fullDescription || "",
    publishedDate: game.publishedDate || new Date().toISOString().split('T')[0],
    ...(game.status && { status: game.status }),
    isDraft: game.isDraft ?? true,
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
            <Link to="/mes-prototypes" className="hover:underline text-[oklch(69%_0.19_41)]/90 font-semibold">
              Mes prototypes
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 font-bold">Modifier</li>
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
          Modifier le prototype
        </h1>
        <p className="text-gray-600 mt-2">
          Modifiez les informations de votre prototype.
        </p>
      </div>

      {/* Form */}
      <GameForm
        onSubmit={handleSubmit}
        initialData={initialData}
        isSubmitting={updateGameMutation.isPending}
      />

      {/* Error Message */}
      {updateGameMutation.isError && (
        <div className="max-w-5xl mx-auto px-4 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <strong>Erreur :</strong> Impossible de modifier le prototype. Veuillez réessayer.
          </div>
        </div>
      )}
    </div>
  );
}
