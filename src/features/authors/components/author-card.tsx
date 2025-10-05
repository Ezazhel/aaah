import React from "react";
import { Link } from "react-router-dom";
import type { Author } from "@/types";
import { MEMBER_ROLES } from "@/constants/labels";
import { getLabel } from "@/lib/getLabel";

type AuthorCardProps = {
  author: Pick<Author, "id" | "name" | "photoUrl" | "role">;
};

export const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  const { id, name, photoUrl, role } = author;

  return (
    <Link
      to={`/auteurs/${id}`}
      className={`
        bg-white rounded-xl border border-gray-200 shadow
        hover:shadow-2xl hover:-translate-y-2 hover:border-[oklch(69%_0.19_41)] hover:ring-2 hover:ring-[oklch(69%_0.19_41)]/30
        transition
        duration-200 ease-in-out
        flex flex-col items-center
        p-6
        w-full max-w-xs mx-auto
        text-center
        cursor-pointer
        group
        no-underline
        focus:outline-none
        focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:ring-offset-2
      `}
      tabIndex={0}
      aria-label={`Voir le profil de ${name}`}
    >
      <div className="mb-4">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="
              w-[120px] h-[120px] rounded-full object-cover
              border-4 border-[oklch(69%_0.19_41)]
              mx-auto
              bg-gray-100
              transition
              duration-200
              group-hover:scale-105
              group-hover:shadow-lg
            "
          />
        ) : (
          <div
            className="
              w-[120px] h-[120px] rounded-full
              flex items-center justify-center
              bg-gray-100
              border-4 border-[oklch(69%_0.19_41)]
              mx-auto
              text-5xl text-gray-400
              select-none
              transition
              duration-200
              group-hover:scale-105
              group-hover:shadow-lg
            "
            aria-label="Photo de l'auteur manquante"
          >
            <span>👤</span>
          </div>
        )}
      </div>
      <div className="mb-1 font-bold text-lg text-[oklch(36%_0.13_250)]">{name}</div>
      <div className="mb-4 flex items-center justify-center text-[oklch(69%_0.19_41)] text-sm gap-1">
        <span role="img" aria-label="Rôle">🧑‍💼</span>
        <span>{getLabel(MEMBER_ROLES, role) ?? role}</span>
      </div>
      <div className="mt-auto w-full">
        <div
          className="
            w-full
            bg-[oklch(69%_0.19_41)]
            text-white
            rounded
            py-2 px-4
            font-semibold
            text-sm
            transition
            duration-150
            opacity-0
            group-hover:opacity-100
            group-focus:opacity-100
            pointer-events-none
            shadow
          "
        >
          Voir le profil
        </div>
      </div>
    </Link>
  );
};
