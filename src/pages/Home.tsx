import { Hero } from "../components/Hero";
import { Stats } from "../components/Stats";
import { GameCard } from "../components/GameCard";
import { EventCard } from "../components/EventCard";
import { Link } from "react-router-dom";
import { mockEvents } from "../mocks/data/mock-events";

export default function Home() {
  // Dummy data for Stats
  const statsData = {
    authors: 42,
    prototypes: 87,
    publishedGames: 15,
  };

  // Dummy data for articles
  const articles = [
    {
      title: "Créer un prototype efficace : nos conseils",
      excerpt:
        "Découvrez les meilleures pratiques pour concevoir un prototype de jeu de société qui capte l’attention des testeurs et des éditeurs.",
      date: "2024-05-12",
      author: "Marie Dupont",
    },
    {
      title: "Retour sur le festival du jeu 2024",
      excerpt:
        "L’association était présente au festival du jeu : rencontres, tests, et de belles découvertes au programme !",
      date: "2024-04-28",
      author: "Jean Martin",
    },
  ];

  // Filter, sort, and select 3 upcoming events
  const upcomingEvents = mockEvents
    .filter((event) => event.status === "upcoming")
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-[oklch(96%_0.01_250)] to-[oklch(94%_0.04_250)]">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Qui sommes-nous ? */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[oklch(36%_0.13_250)] mb-12">
            Qui sommes-nous ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                Notre association rassemble des passionnés de jeux de société, qu’ils soient auteurs débutants ou confirmés, pour partager, créer et s’entraider.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-xs aspect-square bg-gray-200 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-6xl text-gray-400">🎲</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats */}
      <div className="py-10">
        <Stats {...statsData} />
      </div>

      {/* 4. Prototypes récents */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[oklch(36%_0.13_250)] mb-12">
            Prototypes récents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GameCard
            game={{
              id: "1",
              name: "Le Royaume Oublié",
              authorIds: ["1"],
              authorNames: ["Marie Dubois"],
              description: "Enquêtez dans un château hanté pour découvrir le secret du fantôme avant les autres joueurs.",
              minPlayers: 2,
              maxPlayers: 5,
              duration: 45,
              category: "familial",
              mechanics: ["Déduction", "Bluff"],
              categories: ["Mystery", "Familial"],
              imageUrl: "",
            }}
            />
            <GameCard
              game={{
                id: "2",
                name: "Mystère à Minuit",
                authorIds: ["2"],
                authorNames: ["Jean Martin"],
                description: "Enquêtez dans un château hanté pour découvrir le secret du fantôme avant les autres joueurs.",
                minPlayers: 2,
                maxPlayers: 5,
                duration: 45,
                category: "familial",
                mechanics: ["Déduction", "Bluff"],
                categories: ["Mystery", "Familial"],
                imageUrl: "",
              }}
            />
            <GameCard
              game={{
                id: "3",
                name: "Les Sentiers Perdus",
                authorIds: ["3"],
                authorNames: ["Sophie Laurent"],
                description: "Enquêtez dans un château hanté pour découvrir le secret du fantôme avant les autres joueurs.",
                minPlayers: 2,
                maxPlayers: 5,
                duration: 45,
                category: "familial",
                mechanics: ["Déduction", "Bluff"],
                categories: ["Mystery", "Familial"],
                imageUrl: "",
              }}
            />
          </div>
        </div>
      </section>

      {/* 4.5. Prochains événements */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[oklch(36%_0.13_250)] mb-4">
            Prochains événements
          </h2>
          <p className="text-center text-lg text-gray-700 mb-12">
            Rejoignez-nous lors de nos prochaines rencontres
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.eventId} event={event} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link
              to="/evenements"
              className="bg-[oklch(69%_0.19_41)] text-white px-8 py-3 rounded font-semibold hover:bg-[oklch(69%_0.19_41)]/80 transition-colors text-lg shadow"
            >
              Voir tous les événements
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Derniers articles */}
      <section className="py-16 bg-[oklch(96%_0.01_250)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[oklch(36%_0.13_250)] mb-12">
            Derniers articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[oklch(36%_0.13_250)]">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
                  <span>{article.date}</span>
                  <span>par {article.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
