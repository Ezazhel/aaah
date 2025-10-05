import { useState } from "react";
import { AuthorCard } from "../components/author-card";
import { mockAuthors } from "@/mocks/data/mock-authors";
import { MEMBER_ROLES } from "@/constants/labels";
import { getLabel } from "@/lib/getLabel";

const ROLES = [
  { value: "Tous rôles", label: "Tous rôles" },
  ...Object.keys(MEMBER_ROLES).map((role) => ({
    value: role,
    label: getLabel(MEMBER_ROLES, role),
  })),
];

export default function Authors() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("Tous rôles");

  const filteredAuthors = mockAuthors.filter((author) => {
    const matchesRole =
      role === "Tous rôles" || author.role === role;
    const matchesSearch =
      author.name.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="bg-gradient-to-br from-[oklch(96%_0.01_250)] to-[oklch(94%_0.04_250)] min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-center text-[oklch(36%_0.13_250)] mb-4">
          Nos Auteurs
        </h1>
        <p className="text-lg md:text-xl text-center text-gray-600 mb-10">
          Découvrez les créateurs passionnés qui composent notre association
        </p>

        {/* Search & Filters */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Rechercher un auteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)] text-base mb-4"
          />
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-150 ${
                  role === r.value
                    ? "bg-[oklch(69%_0.19_41)] text-white border-[oklch(69%_0.19_41)]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-[oklch(96%_0.01_250)]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAuthors.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              Aucun auteur trouvé.
            </div>
          ) : (
            filteredAuthors.map((author) => (
              <AuthorCard
                key={author.name}
                author={{
                  id: author.id,
                  name: author.name,
                  photoUrl: author.photoUrl,
                  role: author.role,
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
