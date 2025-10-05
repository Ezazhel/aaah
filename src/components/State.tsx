import React from "react";

interface StatsProps {
  authors: number;
  prototypes: number;
  publishedGames: number;
}

export const Stats: React.FC<StatsProps> = ({
  authors,
  prototypes,
  publishedGames,
}) => {
  const stats = [
    {
      value: authors,
      label: "Auteurs membres",
    },
    {
      value: prototypes,
      label: "Prototypes",
    },
    {
      value: publishedGames,
      label: "Jeux publiés",
    },
  ];

  return (
    <section className="bg-[oklch(96%_0.01_250)] rounded-xl px-6 py-8 md:py-10 md:px-12 max-w-4xl mx-auto">
      <div className="flex flex-col gap-8 md:flex-row md:gap-0 md:justify-between">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex-1 flex flex-col items-center text-center"
          >
            <span className="text-[48px] font-bold text-[oklch(69%_0.19_41)] leading-none">
              {stat.value}
            </span>
            <span className="mt-2 text-gray-500 text-base font-medium">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
