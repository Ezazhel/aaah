import React from "react";
import { useParams, Link } from "react-router-dom";
import type { Game } from "@/types";
import { useAuthor } from "../api/get-author";
import { useAuthorGames } from "../api/get-author-games";
import { MEMBER_ROLES } from "@/constants/labels";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getLabel } from "@/lib/getLabel";
import { formatAuthorName } from "@/lib/utils";
import { GameCard } from "@/features/games/components/game-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

// If Breadcrumb component exists, import it. Otherwise, fallback to inline.
let Breadcrumb: React.FC<{ items: { label: string; to?: string }[] }> | null =
  null;
try {
  // @ts-ignore
  Breadcrumb = require("@/components/Breadcrumb").Breadcrumb;
} catch {
  Breadcrumb = null;
}

// Helper: Format date in French
function formatDateFr(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return format(new Date(dateStr), "d MMMM yyyy", { locale: fr });
  } catch {
    return dateStr;
  }
}

// Helper: Get most used mechanics
function getMostUsedMechanics(games: Game[], count = 3): string[] {
  const freq: Record<string, number> = {};
  games.forEach((g) => {
    g.mechanics?.forEach((m) => {
      const mechanicName = typeof m === 'string' ? m : m.name;
      freq[mechanicName] = (freq[mechanicName] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([m]) => m);
}

// Social icon buttons
const SocialIcon: React.FC<{
  type: "twitter" | "instagram" | "bgg";
  url: string;
}> = ({ type, url }) => {
  const icons: Record<string, React.ReactNode> = {
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.46 5.92c-.8.36-1.66.6-2.56.71a4.48 4.48 0 001.97-2.48 8.93 8.93 0 01-2.83 1.08A4.48 4.48 0 0012 9.54c0 .35.04.7.11 1.03A12.7 12.7 0 013 5.16a4.48 4.48 0 001.39 5.98c-.7-.02-1.36-.21-1.94-.53v.05a4.48 4.48 0 003.6 4.4c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.48 4.48 0 004.18 3.11A9 9 0 012 19.54a12.7 12.7 0 006.88 2.02c8.26 0 12.78-6.84 12.78-12.78 0-.2 0-.41-.01-.61A9.1 9.1 0 0024 4.59a8.93 8.93 0 01-2.54.7z" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="6" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17" cy="7" r="1.5" />
      </svg>
    ),
    bgg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="10"
          fill="white"
          fontFamily="sans-serif"
        >
          BGG
        </text>
      </svg>
    ),
  };
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-surface-light hover:bg-brand-primary/10 text-brand-primary border border-brand-primary/20 w-9 h-9 transition"
      aria-label={type}
    >
      {icons[type]}
    </a>
  );
};

const AuthorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Get author data
  const {
    data: authorData,
    isLoading: authorLoading,
    error: authorError,
  } = useAuthor({
    authorId: id || "",
    queryConfig: { enabled: !!id },
  });

  // Get author's games
  const {
    data: gamesData,
    isLoading: gamesLoading,
    error: gamesError,
  } = useAuthorGames({
    authorId: id || "",
    queryConfig: { enabled: !!id },
  });
  const author = authorData;
  const games = gamesData || [];

  // Combined loading state
  const loading = authorLoading || gamesLoading;
  const error = authorError || gamesError;

  // Stats
  const totalPlaytime = games.reduce((sum, g) => sum + (g.duration || 0), 0);
  const mostUsedMechanics = getMostUsedMechanics(games);

  // Handle error or not found
  if (error) {
    return (
      <ErrorMessage
        title="Erreur de chargement"
        message="Impossible de charger les informations de l'auteur."
        onRetry={() => window.location.reload()}
        backLink={{ to: "/auteurs", label: "← Retour aux auteurs" }}
      />
    );
  }

  // Handle not found (only after loading is complete)
  if (!loading && !author) {
    return (
      <ErrorMessage
        title="Auteur introuvable"
        message="L'auteur demandé n'existe pas ou a été supprimé."
        backLink={{ to: "/auteurs", label: "← Retour aux auteurs" }}
      />
    );
  }

  // Loading state
  if (loading) {
    const message = authorLoading
      ? "Chargement de l'auteur…"
      : "Chargement des jeux…";
    return <LoadingSpinner message={message} />;
  }

  // Compute author name
  const authorName = author ? formatAuthorName(author) : "Auteur";

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Accueil", to: "/" },
    { label: "Auteurs", to: "/auteurs" },
    { label: authorName },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4">
        {Breadcrumb ? (
          <Breadcrumb items={breadcrumbItems} />
        ) : (
          <nav className="text-sm text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:underline">
              Accueil
            </Link>
            <span>/</span>
            <Link to="/auteurs" className="hover:underline">
              Auteurs
            </Link>
            <span>/</span>
            <span className="text-brand-dark font-semibold">
              {authorName}
            </span>
          </nav>
        )}
      </div>

      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/auteurs"
          className="inline-flex items-center text-brand-primary hover:underline font-medium"
        >
          <span className="mr-1.5 text-lg">←</span> Retour aux auteurs
        </Link>
      </div>

      {/* Hero/Header */}
      <section
        className="
          flex flex-col md:flex-row gap-8 md:gap-12 items-start bg-surface-light rounded-xl shadow p-6 md:p-10 mb-10
        "
      >
        {/* Profile photo */}
        <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
          {author?.photoUrl ? (
            <img
              src={author.photoUrl}
              alt={authorName}
              className="w-[200px] h-[200px] rounded-full border-4 border-brand-primary object-cover shadow"
            />
          ) : (
            <div className="w-[200px] h-[200px] rounded-full border-4 border-brand-primary bg-gradient-to-br from-[oklch(98%_0.01_250)] to-[oklch(80%_0.19_41)] flex items-center justify-center text-[oklch(36%_0.13_250)] text-6xl font-bold shadow">
              {author?.firstname?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>
        {/* Info card */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-extrabold text-brand-primary break-words">
                {authorName}
              </h1>
              {author?.role && (
                <span className="inline-block px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold border border-brand-primary/20">
                  {getLabel(MEMBER_ROLES, author.role) || author.role}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 flex-wrap text-gray-700">
              {author?.region && (
                <span className="flex items-center gap-1 text-sm">
                  <span role="img" aria-label="Région">
                    📍
                  </span>
                  {author.region}
                </span>
              )}
              {author?.joinedDate && (
                <span className="flex items-center gap-1 text-sm">
                  <span role="img" aria-label="Membre depuis">
                    🗓️
                  </span>
                  Membre depuis {formatDateFr(author.joinedDate)}
                </span>
              )}
            </div>
            {author?.specialties && author.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {author.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="inline-block px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-medium border border-brand-primary/20"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}
            {/* Social links */}
            {(author?.twitterUrl || author?.instagramUrl || author?.bggUrl) && (
              <div className="flex gap-2 mt-4">
                {author.twitterUrl && (
                  <SocialIcon type="twitter" url={author.twitterUrl} />
                )}
                {author.instagramUrl && (
                  <SocialIcon type="instagram" url={author.instagramUrl} />
                )}
                {author.bggUrl && (
                  <SocialIcon type="bgg" url={author.bggUrl} />
                )}
              </div>
            )}
            {/* Contact button */}
            {author?.contactEmail && (
              <div className="mt-5">
                <a
                  href={`mailto:${author.contactEmail}`}
                  className="inline-block px-6 py-2 rounded-lg bg-brand-primary text-white font-semibold shadow hover:bg-brand-primary/90 transition"
                >
                  Contacter
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Biography */}
      {(author?.fullBio || author?.bio) && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-brand-dark mb-3">À propos</h2>
          <div className="prose max-w-none text-gray-800">
            {author?.fullBio || author?.bio}
          </div>
        </section>
      )}

      {/* Achievements */}
      {author?.achievements && author.achievements.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-brand-dark mb-3">
            Réalisations
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {author.achievements.map((ach, idx) => (
              <li
                key={idx}
                className="bg-white rounded-lg shadow px-4 py-3 flex items-center gap-2 text-gray-800"
              >
                <span className="text-lg">🏆</span>
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Stats (optional, only if games exist) */}
      {games.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-brand-dark mb-3">
            Statistiques
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white rounded-lg shadow px-5 py-4 flex flex-col items-center min-w-[120px]">
              <span className="text-2xl font-bold text-brand-primary">
                {games.length}
              </span>
              <span className="text-xs text-gray-500 mt-1">Jeux créés</span>
            </div>
            <div className="bg-white rounded-lg shadow px-5 py-4 flex flex-col items-center min-w-[120px]">
              <span className="text-2xl font-bold text-brand-primary">
                {totalPlaytime}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                Minutes de jeu total
              </span>
            </div>
            {mostUsedMechanics.length > 0 && (
              <div className="bg-white rounded-lg shadow px-5 py-4 flex flex-col items-center min-w-[120px]">
                <span className="text-lg font-semibold text-brand-primary">
                  {mostUsedMechanics.join(", ")}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Mécaniques favorites
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Games */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xl font-bold text-brand-dark">Jeux créés</h2>
          <span className="inline-block px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold border border-brand-primary/20">
            {games.length}
          </span>
        </div>
        {games.length === 0 ? (
          <div className="text-gray-500 italic">
            Aucun jeu publié pour le moment
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {games.map((game) => (
              <GameCard key={game.id} game={game} hideAuthor />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AuthorDetail;
