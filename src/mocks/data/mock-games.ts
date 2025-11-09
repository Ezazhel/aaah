import type { Game } from '../../types';
import { mockAuthors } from './mock-authors';

// Assign authors (example based on mockAuthors from context)
const camille = mockAuthors.find((a) => a.name === "Camille Lefèvre"); // president, experienced
const thomas = mockAuthors.find((a) => a.name === "Thomas Roux"); // member
const julie = mockAuthors.find((a) => a.name === "Julie Morel"); // honorific, experienced
const antoine = mockAuthors.find((a) => a.name === "Antoine Girard"); // member
const fatima = mockAuthors.find((a) => a.name === "Fatima Benali"); // member

// Mock mechanics (since we need Mechanic[] type)
const mockMechanics = {
  deduction: { id: 1, name: "Déduction", slug: "deduction", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  bluff: { id: 2, name: "Bluff", slug: "bluff", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  draft: { id: 3, name: "Draft", slug: "draft", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  handManagement: { id: 4, name: "Gestion de main", slug: "gestion-de-main", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  collection: { id: 5, name: "Collection", slug: "collection", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  majority: { id: 6, name: "Majorité", slug: "majorite", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  workerPlacement: { id: 7, name: "Placement d'ouvriers", slug: "placement-ouvriers", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  cooperative: { id: 8, name: "Coopératif", slug: "cooperatif", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  exploration: { id: 9, name: "Exploration", slug: "exploration", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  tilePlacement: { id: 10, name: "Placement de tuiles", slug: "placement-tuiles", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
};

export const GAMES: Game[] = [
  // Camille Lefèvre (president, 3 games)
  {
    id: 1,
    name: "Château Mystère",
    authors: camille ? [camille] : [],
    description: "Enquêtez dans un château hanté pour découvrir le secret du fantôme avant les autres joueurs.",
    minPlayers: 2,
    maxPlayers: 5,
    duration: 45,
    category: "familial",
    mechanics: [mockMechanics.deduction, mockMechanics.bluff],
    imageUrl: "",
  },
  {
    id: 2,
    name: "Potion Express",
    authors: camille ? [camille] : [],
    description: "Préparez des potions magiques plus vite que vos adversaires dans ce jeu effréné.",
    minPlayers: 2,
    maxPlayers: 6,
    duration: 30,
    category: "familial",
    mechanics: [mockMechanics.draft, mockMechanics.handManagement],
    imageUrl: "",
  },
  {
    id: 3,
    name: "Marchands de l'Ouest",
    authors: camille ? [camille] : [],
    description: "Devenez le marchand le plus prospère en gérant vos ressources et en négociant habilement.",
    minPlayers: 3,
    maxPlayers: 6,
    duration: 60,
    category: "initie",
    mechanics: [mockMechanics.handManagement, mockMechanics.collection],
    imageUrl: "",
  },

  // Julie Morel (honorific, 2 games)
  {
    id: 4,
    name: "Dynastie",
    authors: julie ? [julie] : [],
    description: "Bâtissez votre empire et dominez vos rivaux grâce à la stratégie et la majorité.",
    minPlayers: 3,
    maxPlayers: 5,
    duration: 75,
    category: "initie",
    mechanics: [mockMechanics.majority, mockMechanics.workerPlacement],
    imageUrl: "",
  },
  {
    id: 5,
    name: "Les Arcanes Perdus",
    authors: julie ? [julie] : [],
    description: "Maîtrisez les arcanes anciens pour triompher dans ce jeu de stratégie exigeant.",
    minPlayers: 2,
    maxPlayers: 4,
    duration: 120,
    category: "expert",
    mechanics: [mockMechanics.handManagement, mockMechanics.collection, mockMechanics.bluff],
    imageUrl: "",
  },

  // Thomas Roux (member, 2 games)
  {
    id: 6,
    name: "Expédition Arctique",
    authors: thomas ? [thomas] : [],
    description: "Collaborez pour survivre à une expédition périlleuse dans le Grand Nord.",
    minPlayers: 1,
    maxPlayers: 4,
    duration: 90,
    category: "expert",
    mechanics: [mockMechanics.cooperative, mockMechanics.workerPlacement],
    imageUrl: "",
  },
  {
    id: 7,
    name: "Les Mines de l'Oubli",
    authors: thomas ? [thomas] : [],
    description: "Explorez des mines mystérieuses et affrontez des dangers pour récolter des trésors.",
    minPlayers: 2,
    maxPlayers: 5,
    duration: 60,
    category: "initie",
    mechanics: [mockMechanics.handManagement, mockMechanics.exploration],
    imageUrl: "",
  },

  // Fatima Benali (member, 1 game)
  {
    id: 8,
    name: "Festival des Lanternes",
    authors: fatima ? [fatima] : [],
    description: "Créez le plus beau festival de lanternes en posant habilement vos tuiles.",
    minPlayers: 2,
    maxPlayers: 4,
    duration: 40,
    category: "familial",
    mechanics: [mockMechanics.tilePlacement, mockMechanics.collection],
    imageUrl: "",
  },

  // Antoine Girard (member, 1 game)
  {
    id: 9,
    name: "Safari Express",
    authors: antoine ? [antoine] : [],
    description: "Partez en safari et photographiez le plus d'animaux rares possible.",
    minPlayers: 2,
    maxPlayers: 6,
    duration: 35,
    category: "familial",
    mechanics: [mockMechanics.collection, mockMechanics.draft],
    imageUrl: "",
  },

  // Léo Dubreuil and Claire Petit (new members, 0 games)
];
