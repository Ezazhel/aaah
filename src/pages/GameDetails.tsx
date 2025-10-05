import  { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { Game, Author } from "../types";
import { CATEGORY_LABELS } from "../types/filters";

// Dummy data for demonstration
const DUMMY_GAME: Game = {
  id: "1",
  name: "Château Mystère",
  authorIds: ["author1"],
  authorNames: ["Marie Dubois"],
  description:
    "Enquêtez dans un château hanté pour découvrir le secret du fantôme avant les autres joueurs.",
  minPlayers: 2,
  maxPlayers: 5,
  duration: 45,
  imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  category: "familial",
  mechanics: ["Déduction", "Bluff"],
  categories: ["Mystery", "Familial"],
  images: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  ],
  rulesUrl: "https://example.com/regles-chateau-mystere.pdf",
  videoRulesUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  contactEmail: "marie.dubois@email.com",
  fullDescription: `Bienvenue dans "Château Mystère", un jeu d'enquête et de bluff pour toute la famille !\n\nExplorez les différentes pièces du château, interrogez les suspects et rassemblez des indices pour résoudre le mystère du fantôme. Mais attention, tous les joueurs ne sont pas ce qu'ils semblent être...\n\nUn jeu rapide à prendre en main, parfait pour les soirées entre amis ou en famille.`,
  publishedDate: "2023-10-15",
  status: "prototype",
};

const DUMMY_AUTHOR: Author = {
  id: "author1",
  name: "Marie Dubois",
  avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  region: "Île-de-France",
  bio: "Passionnée de jeux de société et créatrice de mondes ludiques, Marie aime inventer des expériences immersives pour petits et grands.",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  prototype: { label: "Prototype", color: "bg-gray-300 text-gray-700" },
  playtesting: { label: "En test", color: "bg-yellow-200 text-yellow-800" },
  published: { label: "Publié", color: "bg-green-200 text-green-800" },
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

function pluralizePlayers(min: number, max: number) {
  return min === max ? `${min} joueur${min > 1 ? "s" : ""}` : `${min}–${max} joueurs`;
}

function formatDuration(duration: number) {
  return `${duration} min`;
}

function getStatusBadge(status?: string) {
  if (!status) return null;
  const s = STATUS_LABELS[status] || STATUS_LABELS["prototype"];
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${s.color} ml-2`}>
      {s.label}
    </span>
  );
}

function getCategoryBadge(category: string) {
  const label = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category;
  let color = "bg-blue-100 text-blue-800";
  if (category === "familial") color = "bg-blue-100 text-blue-800";
  if (category === "initie") color = "bg-purple-100 text-purple-800";
  if (category === "expert") color = "bg-red-100 text-red-800";
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
}

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x400/cccccc/222222?text=Image+indisponible";

export default function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Simulate loading and error states
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate async fetch
    setTimeout(() => {
      if (id === DUMMY_GAME.id) {
        setGame(DUMMY_GAME);
        setAuthor(DUMMY_AUTHOR);
      } else {
        setGame(null);
        setAuthor(null);
      }
      setLoading(false);
    }, 600);
  }, [id]);

  // Lightbox for gallery (optional)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Jeu introuvable</h2>
        <p className="mb-6 text-gray-600">Le prototype demandé n'existe pas ou a été supprimé.</p>
        <Link
          to="/prototypes"
          className="px-5 py-2 rounded-lg bg-[oklch(69%_0.19_41)] text-white font-semibold shadow hover:bg-[oklch(69%_0.19_41)]/80 transition"
        >
          ← Retour aux prototypes
        </Link>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="bg-gradient-to-br from-[oklch(96%_0.01_250)] to-[oklch(94%_0.04_250)] min-h-screen pb-12">
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
          <li className="text-gray-700 font-bold truncate max-w-[180px]">{game.name}</li>
        </ol>
      </nav>

      {/* Back Button */}
      <div className="max-w-5xl mx-auto px-4 mt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[oklch(69%_0.19_41)]/90 hover:text-[oklch(69%_0.19_41)]/80 font-semibold mb-4 transition"
        >
          <span className="mr-2 text-xl">←</span> Retour aux prototypes
        </button>
      </div>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-8 mt-2">
        {/* Image or Gallery */}
        <div className="md:w-1/2 w-full flex flex-col items-center">
          {game.images && game.images.length > 1 ? (
            <div className="w-full">
              <div className="grid grid-cols-2 gap-3">
                {game.images.slice(0, 2).map((img, idx) => (
                  <button
                    key={img}
                    className="focus:outline-none"
                    onClick={() => setLightboxImg(img)}
                  >
                    <img
                      src={img || PLACEHOLDER_IMAGE}
                      alt={`Image ${idx + 1} du jeu`}
                      className="rounded-xl shadow-md object-cover w-full h-48 md:h-64 transition-transform hover:scale-105"
                    />
                  </button>
                ))}
              </div>
              {game.images.length > 2 && (
                <div className="grid grid-cols-1 mt-3">
                  <button
                    className="focus:outline-none"
                    onClick={() => setLightboxImg(game.images[2])}
                  >
                    <img
                      src={game.images[2] || PLACEHOLDER_IMAGE}
                      alt="Image 3 du jeu"
                      className="rounded-xl shadow-md object-cover w-full h-32 md:h-40 transition-transform hover:scale-105"
                    />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <img
              src={game.imageUrl || PLACEHOLDER_IMAGE}
              alt={game.name}
              className="rounded-xl shadow-lg object-cover w-full h-64 md:h-80"
            />
          )}
        </div>
        {/* Info Card */}
        <div className="md:w-1/2 w-full flex flex-col justify-center">
          <div className="bg-white/80 rounded-xl shadow-lg p-6 mb-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[oklch(36%_0.13_250)] mb-2">
              {game.name}
            </h1>
            <div className="flex items-center mb-2">
              <span className="text-gray-600 mr-2">par</span>
              <Link
                to={`/auteurs/${author?.id}`}
                className="text-orange-600 font-semibold hover:underline"
              >
                {author?.name || game.authorNames[0]}
              </Link>
            </div>
            <div className="flex items-center gap-2 mb-3">
              {getCategoryBadge(game.category)}
              {getStatusBadge(game.status)}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
              <div className="flex items-center">
                <span className="mr-1">👥</span>
                {pluralizePlayers(game.minPlayers, game.maxPlayers)}
              </div>
              <div className="flex items-center">
                <span className="mr-1">⏱️</span>
                {formatDuration(game.duration)}
              </div>
              <div className="flex items-center">
                <span className="mr-1">📅</span>
                {formatDate(game.publishedDate)}
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-block bg-[oklch(96%_0.01_250)] text-[oklch(69%_0.19_41)]/90 px-3 py-1 rounded-full text-xs font-semibold shadow">
                #{game.categories[0] || "Jeu"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed/Sectioned Content */}
      <section className="max-w-5xl mx-auto px-4 mt-8 space-y-10">
        {/* Description */}
        <div className="bg-white/90 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-[oklch(36%_0.13_250)] mb-3">Description</h2>
          <div className="prose max-w-none text-gray-800">
            {game.fullDescription
              ? game.fullDescription.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))
              : <p>{game.description}</p>
            }
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="bg-white/90 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-[oklch(36%_0.13_250)] mb-3">Caractéristiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="flex items-center text-lg">
              <span className="mr-3 text-2xl">👥</span>
              <span>
                <span className="font-semibold">Nombre de joueurs :</span>{" "}
                {pluralizePlayers(game.minPlayers, game.maxPlayers)}
              </span>
            </div>
            <div className="flex items-center text-lg">
              <span className="mr-3 text-2xl">⏱️</span>
              <span>
                <span className="font-semibold">Durée :</span>{" "}
                {formatDuration(game.duration)}
              </span>
            </div>
            <div className="flex items-center text-lg">
              <span className="mr-3 text-2xl">📅</span>
              <span>
                <span className="font-semibold">Date de création :</span>{" "}
                {formatDate(game.publishedDate)}
              </span>
            </div>
            <div className="flex items-center text-lg">
              <span className="mr-3 text-2xl">🎯</span>
              <span>
                <span className="font-semibold">Catégorie :</span>{" "}
                {CATEGORY_LABELS[game.category as keyof typeof CATEGORY_LABELS] || game.category}
              </span>
            </div>
          </div>
          {/* Mechanics */}
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Mécaniques :</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {game.mechanics && game.mechanics.length > 0 ? (
                game.mechanics.map((mech) => (
                  <span
                    key={mech}
                    className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {mech}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">Aucune</span>
              )}
            </div>
          </div>
          {/* Categories */}
          <div>
            <span className="font-semibold text-gray-700">Catégories :</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {game.categories && game.categories.length > 0 ? (
                game.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-block bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {cat}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">Aucune</span>
              )}
            </div>
          </div>
        </div>

        {/* Galerie */}
        {(game.images && game.images.length > 0) && (
          <div className="bg-white/90 rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-[oklch(36%_0.13_250)] mb-3">Galerie</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {game.images.map((img, idx) => (
                <button
                  key={img}
                  className="focus:outline-none"
                  onClick={() => setLightboxImg(img)}
                >
                  <img
                    src={img || PLACEHOLDER_IMAGE}
                    alt={`Image ${idx + 1} du jeu`}
                    className="rounded-lg shadow object-cover w-full h-40 md:h-48 transition-transform hover:scale-105"
                  />
                </button>
              ))}
            </div>
            {/* Lightbox */}
            {lightboxImg && (
              <div
                className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
                onClick={() => setLightboxImg(null)}
              >
                <img
                  src={lightboxImg}
                  alt="Agrandissement"
                  className="max-w-[90vw] max-h-[80vh] rounded-xl shadow-2xl border-4 border-white"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  className="absolute top-6 right-8 text-white text-3xl font-bold"
                  onClick={() => setLightboxImg(null)}
                  aria-label="Fermer"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        )}

        {/* Règles et ressources */}
        <div className="bg-white/90 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-[oklch(36%_0.13_250)] mb-3">Règles et ressources</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {game.rulesUrl ? (
              <a
                href={game.rulesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center bg-blue-50 hover:bg-blue-100 transition rounded-lg shadow px-5 py-4 mb-2"
              >
                <span className="text-2xl mr-4">📄</span>
                <span className="font-semibold text-blue-800">
                  Télécharger les règles (PDF)
                </span>
              </a>
            ) : null}
            {game.videoRulesUrl ? (
              <div className="flex-1 flex flex-col items-start bg-orange-50 rounded-lg shadow px-5 py-4 mb-2">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-4">🎥</span>
                  <span className="font-semibold text-orange-800">
                    Regarder les règles (Vidéo)
                  </span>
                </div>
                {game.videoRulesUrl.includes("youtube.com") ||
                game.videoRulesUrl.includes("youtu.be") ? (
                  <iframe
                    src={game.videoRulesUrl}
                    title="Vidéo des règles"
                    className="w-full h-48 rounded-lg shadow"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <a
                    href={game.videoRulesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    Voir la vidéo
                  </a>
                )}
              </div>
            ) : null}
            {!game.rulesUrl && !game.videoRulesUrl && (
              <div className="flex-1 flex items-center bg-gray-50 rounded-lg shadow px-5 py-4 text-gray-500">
                <span className="text-2xl mr-4">ℹ️</span>
                <span>Aucune ressource disponible pour ce jeu.</span>
              </div>
            )}
          </div>
        </div>

        {/* Contacter l'auteur */}
        <div className="bg-white/90 rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <img
              src={author?.avatarUrl || "https://placehold.co/96x96/cccccc/222222?text=?"}
              alt={author?.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-[oklch(69%_0.19_41)] shadow"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[oklch(69%_0.19_41)]/90 mb-1">
              {author?.name || game.authorNames[0]}
            </h3>
            <p className="text-gray-700 mb-2">{author?.bio || "Auteur de jeux de société."}</p>
            <p className="text-gray-500 mb-3">
              Intéressé par ce jeu ? <span className="font-semibold">Contactez l'auteur !</span>
            </p>
            {game.contactEmail ? (
              <a
                href={`mailto:${game.contactEmail}`}
                className="inline-block px-5 py-2 rounded-lg bg-[oklch(69%_0.19_41)] text-white font-semibold shadow hover:bg-[oklch(69%_0.19_41)]/80 transition"
              >
                Contacter
              </a>
            ) : (
              <button
                className="inline-block px-5 py-2 rounded-lg bg-[oklch(69%_0.19_41)] text-white font-semibold shadow hover:bg-[oklch(69%_0.19_41)]/80 transition"
                onClick={() => setShowContactModal(true)}
              >
                Contacter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Contact Modal (if no email) */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
            <button
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700"
              onClick={() => setShowContactModal(false)}
              aria-label="Fermer"
            >
              &times;
            </button>
            <h4 className="text-xl font-bold mb-2 text-[oklch(69%_0.19_41)]/90">Contacter l'auteur</h4>
            <p className="mb-4 text-gray-600">
              Le formulaire de contact n'est pas encore disponible. Merci de revenir plus tard !
            </p>
            <button
              className="mt-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
              onClick={() => setShowContactModal(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
