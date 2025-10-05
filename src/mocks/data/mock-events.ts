import type { Event } from '@/types';

export const mockEvents: Event[] = [
  // 1. Past event (2024)
  {
    eventId: "evt1",
    name: "Soirée découverte de prototypes",
    type: "association",
    status: "past",
    startDate: "2024-02-15T18:30:00.000Z",
    endDate: "2024-02-15T22:30:00.000Z",
    location: "Paris",
    region: "Île-de-France",
    description:
      "Venez découvrir les dernières créations ludiques de nos membres lors d'une soirée conviviale. Testez des prototypes inédits et échangez avec les auteurs.",
    fullDescription:
      "Cette soirée est l'occasion parfaite pour rencontrer des auteurs passionnés et découvrir des jeux en avant-première. Les participants pourront donner leur avis et contribuer à l'amélioration des prototypes présentés.\n\nL'événement est ouvert à tous, que vous soyez joueur aguerri ou simple curieux. Un buffet convivial sera proposé pour favoriser les échanges entre les participants.",
    imageUrl: "https://picsum.photos/id/1011/400/250",
    tags: ["Playtesting", "Networking", "Convention"],
    isFree: true,
    price: 0,
    registrationUrl: "https://inscription-aaaj-protos.fr/evt1",
    attendees: ["auth1", "auth2", "auth3"],
  },
  // 2. Past event (2024)
  {
    eventId: "evt2",
    name: "Festival International des Jeux - Cannes",
    type: "external",
    status: "past",
    startDate: "2024-02-23T09:00:00.000Z",
    endDate: "2024-02-25T19:00:00.000Z",
    location: "Cannes",
    region: "Provence-Alpes-Côte d'Azur",
    description:
      "Le rendez-vous incontournable du jeu de société en France ! Trois jours de découvertes, de tournois et de rencontres avec les éditeurs et auteurs.",
    fullDescription:
      "Le Festival International des Jeux de Cannes rassemble chaque année des milliers de passionnés autour des nouveautés ludiques, des tournois et des animations. C'est l'occasion de tester les jeux de demain et de rencontrer les créateurs.\n\nDes espaces dédiés aux familles, aux experts et aux professionnels sont proposés. L'AAAJ y tiendra un stand pour présenter les prototypes de ses membres.",
    imageUrl: "https://picsum.photos/id/1025/400/250",
    tags: ["Festival", "Convention", "Family", "Expert"],
    isFree: false,
    price: 15,
    registrationUrl: "https://festivaldesjeux-cannes.com/billetterie",
    attendees: ["auth4", "auth5", "auth6", "auth7"],
  },
  // 3. Past event (2024)
  {
    eventId: "evt3",
    name: "Session de playtesting",
    type: "association",
    status: "past",
    startDate: "2024-03-10T14:00:00.000Z",
    endDate: "2024-03-10T18:00:00.000Z",
    location: "Bordeaux",
    region: "Nouvelle-Aquitaine",
    description:
      "Testez des prototypes de jeux de société et partagez vos retours avec les auteurs. Ambiance détendue et échanges garantis.",
    fullDescription:
      "Lors de cette session, plusieurs auteurs présenteront leurs dernières créations. Les participants pourront jouer, donner leur avis et participer à l'évolution des jeux.\n\nUn goûter sera offert à la pause. L'événement est ouvert à tous, sur inscription.",
    imageUrl: "https://picsum.photos/id/1040/400/250",
    tags: ["Playtesting", "Workshop"],
    isFree: true,
    price: 0,
    registrationUrl: "https://aaaj-bordeaux.fr/inscription",
    attendees: ["auth2", "auth8"],
  },
  // 4. Past event (2024)
  {
    eventId: "evt4",
    name: "Salon du jeu de Parthenay",
    type: "external",
    status: "past",
    startDate: "2024-07-10T10:00:00.000Z",
    endDate: "2024-07-21T19:00:00.000Z",
    location: "Parthenay",
    region: "Nouvelle-Aquitaine",
    description:
      "Le FLIP, festival ludique international de Parthenay, propose 12 jours de jeux pour tous les âges. Animations, tournois et découvertes au programme.",
    fullDescription:
      "Le FLIP est l'un des plus grands festivals de jeux de société en plein air d'Europe. Des centaines d'animations, de stands et de tournois sont proposés dans toute la ville.\n\nL'AAAJ anime un espace dédié aux prototypes et à la rencontre entre auteurs et joueurs. Un rendez-vous à ne pas manquer pour les passionnés.",
    imageUrl: "https://picsum.photos/id/1050/400/250",
    tags: ["Festival", "Family", "Convention"],
    isFree: true,
    price: 0,
    registrationUrl: "https://flip-parthenay.fr/inscription",
    attendees: ["auth1", "auth9", "auth10"],
  },
  // 5. Past event (2024)
  {
    eventId: "evt5",
    name: "Atelier game design",
    type: "association",
    status: "past",
    startDate: "2024-09-14T10:00:00.000Z",
    endDate: "2024-09-14T17:00:00.000Z",
    location: "Lille",
    region: "Hauts-de-France",
    description:
      "Participez à un atelier de création de jeux animé par des auteurs expérimentés. Apprenez à concevoir vos propres mécaniques et à structurer vos idées.",
    fullDescription:
      "Cet atelier s'adresse à tous ceux qui souhaitent s'initier ou se perfectionner dans la création de jeux de société. Au programme : brainstorming, prototypage rapide et retours collectifs.\n\nLes participants repartiront avec des outils concrets pour avancer sur leurs projets. Matériel fourni, places limitées.",
    imageUrl: "https://picsum.photos/id/1062/400/250",
    tags: ["Workshop", "Networking"],
    isFree: false,
    price: 20,
    registrationUrl: "https://aaaj-lille.fr/atelier",
    attendees: ["auth3", "auth11"],
  },
  // 6. Past event (2024)
  {
    eventId: "evt6",
    name: "Rencontre mensuelle des auteurs",
    type: "association",
    status: "past",
    startDate: "2024-10-05T19:00:00.000Z",
    endDate: "2024-10-05T22:00:00.000Z",
    location: "Strasbourg",
    region: "Grand Est",
    description:
      "Chaque mois, les auteurs de la région se retrouvent pour échanger sur leurs projets et tester de nouveaux jeux. Ouvert à tous les créateurs.",
    fullDescription:
      "La rencontre mensuelle est un moment privilégié pour partager ses avancées, poser des questions et bénéficier de l'expérience du groupe. Chacun peut présenter un prototype ou simplement venir jouer.\n\nUn espace convivial est réservé dans un café partenaire. Boissons offertes aux participants.",
    imageUrl: "https://picsum.photos/id/1074/400/250",
    tags: ["Networking", "Playtesting"],
    isFree: true,
    price: 0,
    registrationUrl: "https://aaaj-strasbourg.fr/rencontre",
    attendees: ["auth4", "auth12", "auth13"],
  },
  // 7. Past event (2024)
  {
    eventId: "evt7",
    name: "Ludinord",
    type: "external",
    status: "past",
    startDate: "2024-03-23T10:00:00.000Z",
    endDate: "2024-03-24T19:00:00.000Z",
    location: "Mons-en-Barœul",
    region: "Hauts-de-France",
    description:
      "Festival du jeu de société pour toute la famille, avec de nombreux espaces de découverte, tournois et animations.",
    fullDescription:
      "Ludinord accueille chaque année des milliers de visiteurs autour de jeux pour tous les âges. Les auteurs et éditeurs présentent leurs nouveautés et prototypes.\n\nDes espaces enfants, familles et experts sont proposés. L'AAAJ anime un stand de présentation de prototypes.",
    imageUrl: "https://picsum.photos/id/1080/400/250",
    tags: ["Festival", "Family", "Playtesting"],
    isFree: false,
    price: 8,
    registrationUrl: "https://ludinord.fr/billetterie",
    attendees: ["auth5", "auth14"],
  },
  // 8. Ongoing event (current month)
  {
    eventId: "evt8",
    name: "Pitch de prototypes",
    type: "association",
    status: "ongoing",
    startDate: (() => {
      const now = new Date();
      now.setDate(now.getDate() - 1);
      now.setHours(18, 0, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setDate(now.getDate() + 1);
      now.setHours(22, 0, 0, 0);
      return now.toISOString();
    })(),
    location: "Toulouse",
    region: "Occitanie",
    description:
      "Présentez votre prototype devant un panel d'éditeurs et d'auteurs. Conseils, retours et networking au programme.",
    fullDescription:
      "Cet événement permet aux auteurs de présenter leurs prototypes en 10 minutes chrono devant un public de professionnels et d'amateurs. Un temps d'échange est prévu après chaque pitch pour recueillir des retours constructifs.\n\nDes éditeurs seront présents pour repérer les projets prometteurs. Un apéritif convivial clôturera la soirée.",
    imageUrl: "https://picsum.photos/id/109/400/250",
    tags: ["Pitch", "Networking", "Workshop"],
    isFree: true,
    price: 0,
    registrationUrl: "https://aaaj-toulouse.fr/pitch",
    attendees: ["auth6", "auth15", "auth16"],
  },
  // 9. Ongoing event (current month)
  {
    eventId: "evt9",
    name: "Paris Est Ludique",
    type: "external",
    status: "ongoing",
    startDate: (() => {
      const now = new Date();
      now.setDate(now.getDate() - 2);
      now.setHours(10, 0, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setDate(now.getDate() + 2);
      now.setHours(19, 0, 0, 0);
      return now.toISOString();
    })(),
    location: "Paris",
    region: "Île-de-France",
    description:
      "Le festival de jeux en plein air de la capitale ! Des centaines de jeux à découvrir, des tournois et des animations pour tous.",
    fullDescription:
      "Paris Est Ludique transforme la pelouse de Reuilly en un immense terrain de jeux. Les visiteurs peuvent tester les nouveautés, rencontrer les auteurs et participer à des tournois.\n\nDes espaces thématiques sont proposés : enfants, familles, experts. L'AAAJ y présente les prototypes de ses membres.",
    imageUrl: "https://picsum.photos/id/110/400/250",
    tags: ["Festival", "Family", "Convention"],
    isFree: false,
    price: 10,
    registrationUrl: "https://parisestludique.fr/billets",
    attendees: ["auth7", "auth17", "auth18"],
  },
  // 10. Ongoing event (current month)
  {
    eventId: "evt10",
    name: "Atelier game design express",
    type: "association",
    status: "ongoing",
    startDate: (() => {
      const now = new Date();
      now.setDate(now.getDate() - 1);
      now.setHours(14, 0, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setDate(now.getDate() + 1);
      now.setHours(18, 0, 0, 0);
      return now.toISOString();
    })(),
    location: "Rennes",
    region: "Bretagne",
    description:
      "Un atelier intensif pour créer un jeu en 48h ! Encadrement par des auteurs confirmés, matériel fourni.",
    fullDescription:
      "Relevez le défi de concevoir un jeu de société en deux jours, seul ou en équipe. Les participants seront accompagnés par des auteurs expérimentés pour structurer leurs idées et prototyper rapidement.\n\nPrésentation des créations en fin d'atelier devant un jury amical. Ambiance créative et bienveillante garantie.",
    imageUrl: "https://picsum.photos/id/111/400/250",
    tags: ["Workshop", "Networking"],
    isFree: false,
    price: 25,
    registrationUrl: "https://aaaj-rennes.fr/atelier-express",
    attendees: ["auth8", "auth19"],
  },
  // 11. Upcoming event (next 6 months)
  {
    eventId: "evt11",
    name: "Rencontre mensuelle des auteurs",
    type: "association",
    status: "upcoming",
    startDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 1);
      now.setDate(7);
      now.setHours(19, 0, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 1);
      now.setDate(7);
      now.setHours(22, 0, 0, 0);
      return now.toISOString();
    })(),
    location: "Lyon",
    region: "Auvergne-Rhône-Alpes",
    description:
      "La rencontre mensuelle des auteurs lyonnais pour échanger, tester et avancer sur vos projets ludiques.",
    fullDescription:
      "Chaque mois, les auteurs de la région lyonnaise se retrouvent pour partager leurs prototypes, échanger des conseils et s'entraider. L'ambiance est conviviale et propice à la créativité.\n\nN'hésitez pas à venir avec vos idées, même à l'état d'ébauche. L'événement est gratuit et ouvert à tous.",
    imageUrl: "https://picsum.photos/id/112/400/250",
    tags: ["Networking", "Playtesting"],
    isFree: true,
    price: 0,
    registrationUrl: "https://aaaj-lyon.fr/rencontre",
    attendees: ["auth9", "auth20"],
  },
  // 12. Upcoming event (next 6 months)
  {
    eventId: "evt12",
    name: "Essen Spiel",
    type: "external",
    status: "upcoming",
    startDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 2);
      now.setDate(3);
      now.setHours(9, 0, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 2);
      now.setDate(6);
      now.setHours(18, 0, 0, 0);
      return now.toISOString();
    })(),
    location: "Essen",
    region: "Allemagne",
    description:
      "Le plus grand salon du jeu de société au monde ! Découvrez les nouveautés internationales et rencontrez les éditeurs.",
    fullDescription:
      "Essen Spiel est le rendez-vous annuel des passionnés de jeux de société du monde entier. Des milliers de jeux à tester, des rencontres avec les auteurs et des avant-premières exclusives.\n\nL'AAAJ organise un déplacement groupé pour ses membres. Inscription obligatoire.",
    imageUrl: "https://picsum.photos/id/113/400/250",
    tags: ["Festival", "Expert", "Convention"],
    isFree: false,
    price: 50,
    registrationUrl: "https://spiel-essen.de/fr/billets",
    attendees: ["auth10", "auth1", "auth2"],
  },
  // 13. Upcoming event (next 6 months)
  {
    eventId: "evt13",
    name: "Soirée découverte de prototypes",
    type: "association",
    status: "upcoming",
    startDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 2);
      now.setDate(15);
      now.setHours(18, 30, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 2);
      now.setDate(15);
      now.setHours(22, 30, 0, 0);
      return now.toISOString();
    })(),
    location: "Nantes",
    region: "Pays de la Loire",
    description:
      "Une soirée pour tester les prototypes des auteurs locaux et échanger autour de la création ludique.",
    fullDescription:
      "Les auteurs nantais vous invitent à découvrir leurs dernières créations. Venez jouer, donner votre avis et rencontrer la communauté ludique de la région.\n\nL'événement est gratuit et ouvert à tous, dans la limite des places disponibles. Inscription recommandée.",
    imageUrl: "https://picsum.photos/id/114/400/250",
    tags: ["Playtesting", "Networking"],
    isFree: true,
    price: 0,
    registrationUrl: "https://aaaj-nantes.fr/soiree-protos",
    attendees: ["auth11", "auth3"],
  },
  // 14. Upcoming event (next 6 months)
  {
    eventId: "evt14",
    name: "Lyon Game Show",
    type: "external",
    status: "upcoming",
    startDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 3);
      now.setDate(12);
      now.setHours(10, 0, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 3);
      now.setDate(13);
      now.setHours(19, 0, 0, 0);
      return now.toISOString();
    })(),
    location: "Lyon",
    region: "Auvergne-Rhône-Alpes",
    description:
      "Le salon du jeu et de la pop culture à Lyon ! Jeux de société, tournois, cosplay et animations.",
    fullDescription:
      "Le Lyon Game Show réunit les passionnés de jeux de société, de jeux vidéo et de culture geek. De nombreux éditeurs et auteurs seront présents pour présenter leurs nouveautés.\n\nDes espaces dédiés aux familles et aux experts sont proposés. L'AAAJ animera un atelier de création de prototypes.",
    imageUrl: "https://picsum.photos/id/115/400/250",
    tags: ["Festival", "Family", "Expert"],
    isFree: false,
    price: 18,
    registrationUrl: "https://lyongameshow.fr/billetterie",
    attendees: ["auth12", "auth4"],
  },
  // 15. Upcoming event (next 6 months)
  {
    eventId: "evt15",
    name: "Session de playtesting",
    type: "association",
    status: "upcoming",
    startDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 3);
      now.setDate(20);
      now.setHours(14, 0, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 3);
      now.setDate(20);
      now.setHours(18, 0, 0, 0);
      return now.toISOString();
    })(),
    location: "Strasbourg",
    region: "Grand Est",
    description:
      "Testez les prototypes des auteurs de la région et partagez vos retours dans une ambiance conviviale.",
    fullDescription:
      "Cette session de playtesting est ouverte à tous, joueurs comme auteurs. Venez découvrir des jeux en développement et contribuer à leur amélioration.\n\nUn goûter sera offert à la pause. Inscription gratuite mais obligatoire.",
    imageUrl: "https://picsum.photos/id/116/400/250",
    tags: ["Playtesting", "Workshop"],
    isFree: true,
    price: 0,
    registrationUrl: "https://aaaj-strasbourg.fr/playtest",
    attendees: ["auth13", "auth5"],
  },
  // 16. Upcoming event (next 6 months)
  {
    eventId: "evt16",
    name: "Atelier game design",
    type: "association",
    status: "upcoming",
    startDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 4);
      now.setDate(5);
      now.setHours(10, 0, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 4);
      now.setDate(5);
      now.setHours(17, 0, 0, 0);
      return now.toISOString();
    })(),
    location: "Brest",
    region: "Bretagne",
    description:
      "Un atelier pour apprendre à concevoir un jeu de société, animé par des auteurs bretons.",
    fullDescription:
      "Au cours de cette journée, vous découvrirez les bases du game design, du concept à la réalisation d'un prototype. Des exercices pratiques et des échanges sont prévus tout au long de l'atelier.\n\nMatériel fourni, places limitées. Inscription obligatoire.",
    imageUrl: "https://picsum.photos/id/117/400/250",
    tags: ["Workshop", "Networking"],
    isFree: false,
    price: 12,
    registrationUrl: "https://aaaj-brest.fr/atelier",
    attendees: ["auth14", "auth6"],
  },
  // 17. Upcoming event (next 6 months)
  {
    eventId: "evt17",
    name: "Festival International des Jeux - Cannes",
    type: "external",
    status: "upcoming",
    startDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 5);
      now.setDate(21);
      now.setHours(9, 0, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 5);
      now.setDate(23);
      now.setHours(19, 0, 0, 0);
      return now.toISOString();
    })(),
    location: "Cannes",
    region: "Provence-Alpes-Côte d'Azur",
    description:
      "Le grand rendez-vous annuel du jeu de société revient à Cannes ! Nouveautés, tournois et animations.",
    fullDescription:
      "Le Festival International des Jeux de Cannes est l'événement phare du monde ludique en France. Venez découvrir les dernières sorties, rencontrer les auteurs et participer à des tournois.\n\nL'AAAJ tiendra un stand pour présenter les prototypes de ses membres. Billetterie en ligne.",
    imageUrl: "https://picsum.photos/id/118/400/250",
    tags: ["Festival", "Convention", "Expert"],
    isFree: false,
    price: 20,
    registrationUrl: "https://festivaldesjeux-cannes.com/billetterie",
    attendees: ["auth15", "auth7"],
  },
  // 18. Upcoming event (next 6 months)
  {
    eventId: "evt18",
    name: "Soirée découverte de prototypes",
    type: "association",
    status: "upcoming",
    startDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 5);
      now.setDate(28);
      now.setHours(18, 30, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 5);
      now.setDate(28);
      now.setHours(22, 30, 0, 0);
      return now.toISOString();
    })(),
    location: "Montpellier",
    region: "Occitanie",
    description:
      "Une soirée pour tester les prototypes des auteurs montpelliérains et échanger autour de la création ludique.",
    fullDescription:
      "Les auteurs de Montpellier vous invitent à découvrir leurs dernières créations. Venez jouer, donner votre avis et rencontrer la communauté ludique locale.\n\nL'événement est gratuit et ouvert à tous, dans la limite des places disponibles. Inscription recommandée.",
    imageUrl: "https://picsum.photos/id/119/400/250",
    tags: ["Playtesting", "Networking"],
    isFree: true,
    price: 0,
    registrationUrl: "https://aaaj-montpellier.fr/soiree-protos",
    attendees: ["auth16", "auth8"],
  },
  // 19. Upcoming event (next 6 months)
  {
    eventId: "evt19",
    name: "Session de playtesting",
    type: "association",
    status: "upcoming",
    startDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 6);
      now.setDate(10);
      now.setHours(14, 0, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 6);
      now.setDate(10);
      now.setHours(18, 0, 0, 0);
      return now.toISOString();
    })(),
    location: "Nancy",
    region: "Grand Est",
    description:
      "Testez les prototypes des auteurs de la région et partagez vos retours dans une ambiance conviviale.",
    fullDescription:
      "Cette session de playtesting est ouverte à tous, joueurs comme auteurs. Venez découvrir des jeux en développement et contribuer à leur amélioration.\n\nUn goûter sera offert à la pause. Inscription gratuite mais obligatoire.",
    imageUrl: "https://picsum.photos/id/120/400/250",
    tags: ["Playtesting", "Workshop"],
    isFree: true,
    price: 0,
    registrationUrl: "https://aaaj-nancy.fr/playtest",
    attendees: ["auth17", "auth9"],
  },
  // 20. Upcoming event (next 6 months)
  {
    eventId: "evt20",
    name: "Atelier game design",
    type: "association",
    status: "upcoming",
    startDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 6);
      now.setDate(18);
      now.setHours(10, 0, 0, 0);
      return now.toISOString();
    })(),
    endDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() + 6);
      now.setDate(18);
      now.setHours(17, 0, 0, 0);
      return now.toISOString();
    })(),
    location: "Marseille",
    region: "Provence-Alpes-Côte d'Azur",
    description:
      "Un atelier pour apprendre à concevoir un jeu de société, animé par des auteurs marseillais.",
    fullDescription:
      "Au cours de cette journée, vous découvrirez les bases du game design, du concept à la réalisation d'un prototype. Des exercices pratiques et des échanges sont prévus tout au long de l'atelier.\n\nMatériel fourni, places limitées. Inscription obligatoire.",
    imageUrl: "https://picsum.photos/id/121/400/250",
    tags: ["Workshop", "Networking"],
    isFree: false,
    price: 15,
    registrationUrl: "https://aaaj-marseille.fr/atelier",
    attendees: ["auth18", "auth10"],
  },
];
