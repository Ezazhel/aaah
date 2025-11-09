import React from "react";
import { Link } from "react-router-dom";

export const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-[oklch(36%_0.13_250)] to-[oklch(54%_0.12_225)] text-white text-center py-16 px-4 md:py-20">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Créateurs de Jeux Passionnés
        </h1>
        <p className="text-lg md:text-2xl font-medium mb-8">
          Nous imaginons, créons et testons les jeux de société de demain
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/prototypes"
            className="bg-[oklch(69%_0.19_41)] hover:bg-[oklch(69%_0.19_41)]/80 text-white font-semibold py-3 px-7 rounded shadow transition duration-150 text-base"
          >
            Découvrir nos créations
          </Link>
          <a
            href="https://www.helloasso.com/associations/association-des-auteur-rice-s-autour-et-en-herault"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white text-white font-semibold py-3 px-7 rounded shadow transition duration-150 text-base bg-transparent hover:bg-white hover:text-[oklch(36%_0.13_250)]"
          >
            Rejoindre l'association
          </a>
        </div>
      </div>
    </section>
  );
};
