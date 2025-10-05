import type { Author } from '@/types';

export const mockAuthors: Author[] = [
  {
    id: "camille-lefevre",
    name: "Camille Lefèvre",
    region: "Île-de-France",
    photoUrl: "https://i.pravatar.cc/300?img=12",
    role: "president",
    bio: "Présidente de l'association, Camille conçoit des jeux familiaux et anime des ateliers ludiques à Paris.",
    fullBio: `Camille Lefèvre a découvert sa passion pour les jeux de société dès son plus jeune âge, en jouant avec sa famille lors de longues soirées d'hiver. Après des études en communication, elle s'est lancée dans la création de jeux pour rassembler petits et grands autour de la table.

Depuis 2018, Camille anime des ateliers de création et participe à de nombreux festivals ludiques en France. Elle aime particulièrement inventer des mécaniques accessibles et innovantes, favorisant l'interaction et la convivialité.

En tant que présidente de l'association, elle encourage l'entraide entre auteurs et la promotion du jeu de société comme vecteur de lien social.`,
    joinedDate: "2020-03-15",
    specialties: ["Jeux familiaux", "Jeux d'ambiance", "Mécaniques de draft"],
    website: "https://camillelefevre.fr",
    socialLinks: {
      twitter: "https://twitter.com/camillelefevre",
      instagram: "https://instagram.com/camillelefevre",
    },
    achievements: [
      "Prix du meilleur prototype 2021",
      "Animatrice du festival Paris Ludique",
      "2 jeux publiés chez Ludikids"
    ],
    contactEmail: "camille.lefevre@example.com",
  },
  {
    id: "thomas-roux",
    name: "Thomas Roux",
    region: "Auvergne-Rhône-Alpes",
    photoUrl: "https://i.pravatar.cc/300?img=23",
    role: "member",
    bio: "Jeune auteur passionné de jeux de stratégie, Thomas aime relever les défis ludiques.",
    fullBio: `Thomas Roux a commencé à créer ses propres jeux pendant ses études d'ingénieur. Fasciné par les mécaniques complexes et l'équilibre des règles, il s'est spécialisé dans les jeux de stratégie pour joueurs avertis.

Il participe régulièrement à des concours de prototypes et apprécie les retours des testeurs pour améliorer ses créations. Thomas rêve de voir un jour l'un de ses jeux édité par une grande maison française.

En dehors du jeu, il pratique l'escalade et s'inspire souvent de ses aventures en montagne pour ses thèmes de jeux.`,
    joinedDate: "2022-09-10",
    specialties: ["Jeux de stratégie", "Mécaniques de gestion de ressources"],
    website: "#",
    socialLinks: {
      bgg: "https://boardgamegeek.com/user/thomasroux",
    },
    achievements: [
      "Finaliste du concours Protolab 2023",
      "Organisateur de soirées jeux à Lyon"
    ],
    contactEmail: "thomas.roux@example.com",
  },
  {
    id: "marie-dubois",
    name: "Marie Dubois",
    region: "Nouvelle-Aquitaine",
    photoUrl: "https://i.pravatar.cc/300?img=34",
    role: "honorific",
    bio: "Auteure honorifique, Marie a publié plusieurs jeux coopératifs à succès.",
    fullBio: `Marie Dubois a débuté sa carrière dans l'enseignement avant de se consacrer à la création de jeux de société. Elle privilégie les jeux coopératifs, convaincue que le jeu peut renforcer l'esprit d'équipe et la solidarité.

Ses jeux sont reconnus pour leur originalité et leur accessibilité, séduisant aussi bien les familles que les joueurs expérimentés. Marie intervient régulièrement dans des écoles pour promouvoir le jeu comme outil pédagogique.

Elle a reçu plusieurs distinctions pour ses créations et continue d'innover avec de nouveaux concepts chaque année.`,
    joinedDate: "2021-06-22",
    specialties: ["Jeux coopératifs", "Jeux familiaux", "Narration"],
    website: "https://mariedubois-jeux.fr",
    socialLinks: {
      twitter: "https://twitter.com/mariedubois",
    },
    achievements: [
      "3 jeux publiés chez FunPlay",
      "Lauréate du prix CréaLudique 2022",
      "Intervenante en milieu scolaire"
    ],
    contactEmail: "marie.dubois@example.com",
  },
  {
    id: "lucas-martin",
    name: "Lucas Martin",
    region: "Bretagne",
    photoUrl: "https://i.pravatar.cc/300?img=45",
    role: "admin",
    bio: "Administrateur de l'association, Lucas est passionné par les jeux d'enquête et d'énigmes.",
    fullBio: `Lucas Martin a rejoint l'association en 2020, apportant son expertise en organisation et en gestion de projets. Il adore concevoir des jeux d'enquête immersifs, où chaque détail compte.

Lucas anime régulièrement des escape games et des soirées murder party, partageant sa passion pour les énigmes et les scénarios complexes. Il s'investit aussi dans la gestion des événements de l'association.

Toujours à l'écoute des membres, Lucas veille à la bonne ambiance et au dynamisme du groupe.`,
    joinedDate: "2020-11-05",
    specialties: ["Jeux d'enquête", "Escape games", "Scénarisation"],
    website: "https://lucasmartin-jeux.fr",
    socialLinks: {
      instagram: "https://instagram.com/lucas.martin",
    },
    achievements: [
      "Organisateur du festival Enigmes & Jeux 2022",
      "Créateur de 2 escape games éphémères"
    ],
    contactEmail: "lucas.martin@example.com",
  },
  {
    id: "sophie-leblanc",
    name: "Sophie Leblanc",
    region: "Occitanie",
    photoUrl: "https://i.pravatar.cc/300?img=56",
    role: "member",
    bio: "Sophie crée des jeux éducatifs pour enfants, inspirés de son expérience en psychologie.",
    fullBio: `Psychologue de formation, Sophie Leblanc a toujours été fascinée par le développement de l'enfant. Elle conçoit des jeux éducatifs qui favorisent l'apprentissage par le jeu.

Sophie travaille en collaboration avec des écoles et des orthophonistes pour adapter ses jeux aux besoins spécifiques des enfants. Elle anime aussi des ateliers pour les familles et les professionnels de l'éducation.

Son objectif : rendre l'apprentissage ludique et accessible à tous.`,
    joinedDate: "2023-02-18",
    specialties: ["Jeux éducatifs", "Jeux pour enfants", "Coopération"],
    website: "#",
    achievements: [
      "Gagnante du concours régional 2023",
      "2 jeux utilisés en milieu scolaire"
    ],
    contactEmail: "sophie.leblanc@example.com",
  },
  {
    id: "antoine-girard",
    name: "Antoine Girard",
    region: "Grand Est",
    photoUrl: "https://i.pravatar.cc/300?img=67",
    role: "member",
    bio: "Historien passionné, Antoine développe des jeux à thématique historique riches en détails.",
    fullBio: `Antoine Girard, diplômé en histoire, s'est spécialisé dans la création de jeux de société à forte dimension historique. Il aime retranscrire des périodes méconnues à travers des mécaniques originales.

Ses jeux sont appréciés pour leur rigueur documentaire et leur capacité à immerger les joueurs dans le passé. Antoine intervient aussi lors de conférences sur l'histoire et le jeu.

Il travaille actuellement sur un projet de jeu sur la Révolution française.`,
    joinedDate: "2021-10-30",
    specialties: ["Jeux historiques", "Narration", "Mécaniques de gestion"],
    website: "https://antoinegirard.fr",
    achievements: [
      "Finaliste du prix HistoriaLudique 2022",
      "Conférencier sur l'histoire ludique"
    ],
    contactEmail: "antoine.girard@example.com",
  },
  {
    id: "julie-bernard",
    name: "Julie Bernard",
    region: "Provence-Alpes-Côte d'Azur",
    photoUrl: "https://i.pravatar.cc/300?img=8",
    role: "honorific",
    bio: "Game designer expérimentée, Julie partage son expertise avec la communauté.",
    fullBio: `Julie Bernard a plus de dix ans d'expérience dans le monde du jeu de société. Elle a travaillé avec plusieurs éditeurs et accompagne de jeunes auteurs dans leurs premiers pas.

Julie aime explorer de nouvelles mécaniques et tester des concepts innovants. Elle anime des masterclass et participe à des jurys de concours ludiques.

Toujours curieuse, elle voyage à travers l'Europe pour découvrir les tendances du jeu.`,
    joinedDate: "2020-01-12",
    specialties: ["Mécaniques de deck-building", "Jeux de cartes", "Prototypage"],
    website: "https://juliebernard.com",
    socialLinks: {
      twitter: "https://twitter.com/juliebernard",
      bgg: "https://boardgamegeek.com/user/juliebernard",
    },
    achievements: [
      "4 jeux publiés chez différents éditeurs",
      "Jury du concours Protoludique 2022",
      "Formatrice en game design"
    ],
    contactEmail: "julie.bernard@example.com",
  },
  {
    id: "paul-renard",
    name: "Paul Renard",
    region: "Pays de la Loire",
    photoUrl: "https://i.pravatar.cc/300?img=19",
    role: "member",
    bio: "Paul est un nouvel auteur, passionné par les jeux d'ambiance et les soirées entre amis.",
    fullBio: `Après avoir découvert le monde du jeu de société lors d'une soirée entre amis, Paul Renard s'est lancé dans la création de jeux d'ambiance. Il aime inventer des règles simples et des thèmes décalés.

Paul participe activement aux rencontres de l'association et teste régulièrement ses prototypes auprès de différents publics.

Il espère bientôt éditer son premier jeu et partager sa passion avec un public plus large.`,
    joinedDate: "2024-01-05",
    specialties: ["Jeux d'ambiance", "Jeux rapides"],
    website: "#",
    achievements: [
      "Participation au festival Ludinantes 2024"
    ],
    contactEmail: "paul.renard@example.com",
  },
  {
    id: "claire-petit",
    name: "Claire Petit",
    region: "Bourgogne-Franche-Comté",
    photoUrl: "https://i.pravatar.cc/300?img=27",
    role: "member",
    bio: "Claire insuffle des narrations captivantes dans ses créations ludiques.",
    fullBio: `Écrivaine et conteuse, Claire Petit aime intégrer des histoires riches et immersives dans ses jeux de société. Elle s'inspire de contes traditionnels et de légendes locales pour créer des univers originaux.

Claire anime des ateliers d'écriture ludique et accompagne les auteurs dans la création de scénarios pour leurs jeux.

Elle travaille actuellement sur une série de jeux narratifs pour enfants.`,
    joinedDate: "2022-05-20",
    specialties: ["Narration", "Jeux pour enfants", "Jeux coopératifs"],
    website: "https://clairepetit.fr",
    achievements: [
      "Lauréate du prix Conte & Jeux 2023",
      "Animatrice d'ateliers d'écriture"
    ],
    contactEmail: "claire.petit@example.com",
  },
  {
    id: "hugo-moreau",
    name: "Hugo Moreau",
    region: "Normandie",
    photoUrl: "https://i.pravatar.cc/300?img=61",
    role: "member",
    bio: "Hugo explore les nouvelles technologies dans le monde du jeu de société.",
    fullBio: `Ingénieur et maker, Hugo Moreau aime intégrer l'électronique et le numérique dans ses prototypes de jeux. Il expérimente avec des applications mobiles et des objets connectés pour enrichir l'expérience ludique.

Hugo partage ses connaissances lors d'ateliers de fabrication et encourage l'innovation au sein de l'association.

Il a récemment présenté un jeu hybride lors d'un salon spécialisé.`,
    joinedDate: "2023-07-14",
    specialties: ["Jeux hybrides", "Technologies ludiques", "Prototypage"],
    website: "#",
    achievements: [
      "Présentateur au salon Tech&Play 2023"
    ],
    contactEmail: "hugo.moreau@example.com",
  },
];
