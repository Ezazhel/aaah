import type { Game } from '../../types';
import { mockAuthors } from './mock-authors';

// Helper: Find author by role or name
const findAuthorByRole = (role: string) =>
  mockAuthors.find((a) => a.role === role);
const findAuthorByName = (name: string) =>
  mockAuthors.find((a) => a.name === name);

// Assign authors (example based on mockAuthors from context)
const camille = mockAuthors.find((a) => a.name === "Camille Lefèvre"); // president, experienced
const thomas = mockAuthors.find((a) => a.name === "Thomas Roux"); // member
const julie = mockAuthors.find((a) => a.name === "Julie Morel"); // honorific, experienced
const antoine = mockAuthors.find((a) => a.name === "Antoine Girard"); // member
const fatima = mockAuthors.find((a) => a.name === "Fatima Benali"); // member
const leo = mockAuthors.find((a) => a.name === "Léo Dubreuil"); // member, new (0 games)
const claire = mockAuthors.find((a) => a.name === "Claire Petit"); // member, new (0 games)

export const GAMES: Game[] = [
  // Camille Lefèvre (president, 3 games)
  {
    id: "game-1",
    name: "Château Mystère",
    authorIds: [camille?.id ?? "camille-lefevre"],
    authorNames: [camille?.name ?? "Camille Lefèvre"],
    description: "Enquêtez dans un château hanté pour découvrir le secret du fantôme avant les autres joueurs.",
    minPlayers: 2,
    maxPlayers: 5,
    duration: 45,
    category: "familial",
    mechanics: ["Déduction", "Bluff"],
    categories: ["Mystery", "Familial"],
    imageUrl: "",
  },
  {
    id: "game-2",
    name: "Potion Express",
    authorIds: [camille?.id ?? "camille-lefevre"],
    authorNames: [camille?.name ?? "Camille Lefèvre"],
    description: "Préparez des potions magiques plus vite que vos adversaires dans ce jeu effréné.",
    minPlayers: 2,
    maxPlayers: 6,
    duration: 30,
    category: "familial",
    mechanics: ["Draft", "Gestion de main"],
    categories: ["Fantasy", "Racing"],
    imageUrl: "",
  },
  {
    id: "game-3",
    name: "Marchands de l'Ouest",
    authorIds: [camille?.id ?? "camille-lefevre"],
    authorNames: [camille?.name ?? "Camille Lefèvre"],
    description: "Devenez le marchand le plus prospère en gérant vos ressources et en négociant habilement.",
    minPlayers: 3,
    maxPlayers: 6,
    duration: 60,
    category: "initie",
    mechanics: ["Gestion de main", "Collection"],
    categories: ["Trading", "Strategy"],
    imageUrl: "",
  },

  // Julie Morel (honorific, 2 games)
  {
    id: "game-4",
    name: "Dynastie",
    authorIds: [julie?.id ?? "julie-morel"],
    authorNames: [julie?.name ?? "Julie Morel"],
    description: "Bâtissez votre empire et dominez vos rivaux grâce à la stratégie et la majorité.",
    minPlayers: 3,
    maxPlayers: 5,
    duration: 75,
    category: "initie",
    mechanics: ["Majorité", "Placement d'ouvriers"],
    categories: ["Strategy", "Empire Building"],
    imageUrl: "",
  },
  {
    id: "game-5",
    name: "Les Arcanes Perdus",
    authorIds: [julie?.id ?? "julie-morel"],
    authorNames: [julie?.name ?? "Julie Morel"],
    description: "Maîtrisez les arcanes anciens pour triompher dans ce jeu de stratégie exigeant.",
    minPlayers: 2,
    maxPlayers: 4,
    duration: 120,
    category: "expert",
    mechanics: ["Gestion de main", "Collection", "Bluff"],
    categories: ["Fantasy", "Strategy"],
    imageUrl: "",
  },

  // Thomas Roux (member, 2 games)
  {
    id: "game-6",
    name: "Expédition Arctique",
    authorIds: [thomas?.id ?? "thomas-roux"],
    authorNames: [thomas?.name ?? "Thomas Roux"],
    description: "Collaborez pour survivre à une expédition périlleuse dans le Grand Nord.",
    minPlayers: 1,
    maxPlayers: 4,
    duration: 90,
    category: "expert",
    mechanics: ["Coopératif", "Placement d'ouvriers"],
    categories: ["Adventure", "Cooperative"],
    imageUrl: "",
  },
  {
    id: "game-7",
    name: "Les Mines de l'Oubli",
    authorIds: [thomas?.id ?? "thomas-roux"],
    authorNames: [thomas?.name ?? "Thomas Roux"],
    description: "Explorez des mines mystérieuses et affrontez des dangers pour récolter des trésors.",
    minPlayers: 2,
    maxPlayers: 5,
    duration: 60,
    category: "initie",
    mechanics: ["Gestion de main", "Exploration"],
    categories: ["Adventure", "Strategy"],
    imageUrl: "",
  },

  // Fatima Benali (member, 1 game)
  {
    id: "game-8",
    name: "Festival des Lanternes",
    authorIds: [fatima?.id ?? "fatima-benali"],
    authorNames: [fatima?.name ?? "Fatima Benali"],
    description: "Créez le plus beau festival de lanternes en posant habilement vos tuiles.",
    minPlayers: 2,
    maxPlayers: 4,
    duration: 40,
    category: "familial",
    mechanics: ["Placement de tuiles", "Collection"],
    categories: ["Family", "Puzzle"],
    imageUrl: "",
  },

  // Antoine Girard (member, 1 game)
  {
    id: "game-9",
    name: "Safari Express",
    authorIds: [antoine?.id ?? "antoine-girard"],
    authorNames: [antoine?.name ?? "Antoine Girard"],
    description: "Partez en safari et photographiez le plus d'animaux rares possible.",
    minPlayers: 2,
    maxPlayers: 6,
    duration: 35,
    category: "familial",
    mechanics: ["Collection", "Draft"],
    categories: ["Family", "Animals"],
    imageUrl: "",
  },

  // Léo Dubreuil and Claire Petit (new members, 0 games)
];
