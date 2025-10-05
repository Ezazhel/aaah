import React from "react";
import type { Game } from "../types";
import { CategoryBadge } from "./CategoryBadge";
import { Link } from "react-router-dom";

type GameCardProps = {
  game: Game;
};

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const {
    id,
    name,
    authorNames,
    description,
    minPlayers,
    maxPlayers,
    duration,
    category,
    imageUrl,
  } = game;

  // Get the first author name or join multiple authors
  const authorName =
    authorNames && authorNames.length > 0
      ? authorNames.join(", ")
      : "Unknown Author";

  return (
    <Link
      to={`/prototypes/${id}`}
      className="
        bg-white rounded-xl border border-gray-200 shadow
        hover:shadow-2xl hover:-translate-y-2 transition
        duration-200 ease-in-out
        flex flex-col
        w-full
        max-w-sm
        mx-auto
        cursor-pointer
        no-underline
        focus:outline-none
      "
      style={{ textDecoration: "none", color: "inherit" }}
      tabIndex={0}
      aria-label={`Voir la fiche du jeu ${name}`}
    >
      <div className="w-full h-[200px] rounded-t-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-[oklch(78%_0.13_55)] to-[oklch(54%_0.12_225)]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-5xl text-white font-bold opacity-60 select-none">
            🎲
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h2 className="font-bold text-lg md:text-xl text-[oklch(36%_0.13_250)] mb-1 truncate">
          {name}
        </h2>
        <div className="text-sm text-[oklch(69%_0.19_41)] mb-2 truncate">
          {authorName}
        </div>
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          <span className="flex items-center text-xs text-gray-600 bg-gray-100 rounded px-2 py-0.5">
            <span
              className="mr-1"
              aria-label="Nombre de joueurs"
              title="Nombre de joueurs"
            >
              🎲
            </span>
            {minPlayers === maxPlayers
              ? `${minPlayers} joueur${minPlayers > 1 ? "s" : ""}`
              : `${minPlayers}-${maxPlayers} joueurs`}
          </span>
          <span className="flex items-center text-xs text-gray-600 bg-gray-100 rounded px-2 py-0.5">
            <span className="mr-1" aria-label="Durée" title="Durée">
              ⏱️
            </span>
            {duration} min
          </span>
          <CategoryBadge category={category} />
        </div>
      </div>
    </Link>
  );
};
