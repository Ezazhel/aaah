import React from "react";
import type { Author } from "../types";

type AuthorCardProps = {
  author: Pick<Author, "name" | "avatarUrl" | "role">;
};

export const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  const { name, avatarUrl, role } = author;

  // Optionally, you can map role to a more user-friendly label if needed
  const roleLabels: Record<Author["role"], string> = {
    member: "Membre",
    desk: "Membre du bureau",
    "honorific member": "Membre d'honneur",
  };

  return (
    <div
      className="
        bg-white rounded-xl border border-gray-200 shadow
        hover:shadow-lg hover:-translate-y-1 transition
        duration-200 ease-in-out
        flex flex-col items-center
        p-6
        w-full max-w-xs mx-auto
        text-center
      "
    >
      <div className="mb-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="
              w-[120px] h-[120px] rounded-full object-cover
              border-4 border-[oklch(69%_0.19_41)]
              mx-auto
              bg-gray-100
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
        <span>{roleLabels[role] ?? role}</span>
      </div>
      <div className="mt-auto w-full">
        <button
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
            hover:bg-[oklch(69%_0.19_41)]/80
            focus:outline-none
            focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:ring-offset-2
            shadow
          "
          type="button"
        >
          Voir le profil
        </button>
      </div>
    </div>
  );
};
