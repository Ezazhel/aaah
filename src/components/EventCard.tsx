import React from "react";
import type { Event } from "../types";
import { EVENT_TYPES, EVENT_STATUS } from "@/constants/labels";

type EventCardProps = {
  event: Event;
};

const TYPE_BADGE_STYLES: Record<keyof typeof EVENT_TYPES, string> = {
  association: "bg-[oklch(69%_0.19_41)] text-white",
  external: "bg-[oklch(54%_0.12_225)] text-white",
};

function formatEventDate(startDate: string, endDate?: string) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const shortOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const fr = "fr-FR";

  if (end && (start.getMonth() !== end.getMonth() || start.getFullYear() !== end.getFullYear())) {
    // Different month or year: "15 mars - 2 avril 2025"
    return (
      <>
        <span className="capitalize">{start.toLocaleDateString(fr, shortOptions)}</span>
        {" - "}
        <span className="capitalize">{end.toLocaleDateString(fr, options)}</span>
      </>
    );
  } else if (end) {
    // Same month/year: "15-17 mars 2025"
    return (
      <>
        <span className="capitalize">
          {start.getDate()}-{end.getDate()} {start.toLocaleDateString(fr, { month: "long", year: "numeric" })}
        </span>
      </>
    );
  } else {
    // Single date: "Samedi 15 mars 2025"
    return <span className="capitalize">{start.toLocaleDateString(fr, options)}</span>;
  }
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const {
    name,
    imageUrl,
    type,
    status,
    startDate,
    endDate,
    location,
    region,
    description,
    tags,
    isFree,
    price,
  } = event;

  const showTags = tags && tags.length > 0;
  const displayedTags = showTags ? tags.slice(0, 3) : [];

  return (
    <div
      className="
        bg-white rounded-xl border border-gray-200 shadow
        hover:shadow-2xl hover:-translate-y-2 transition
        duration-200 ease-in-out
        flex flex-col
        w-full
        max-w-sm
        mx-auto
        cursor-default
        focus:outline-none
      "
      tabIndex={0}
      aria-label={`Carte de l'événement ${name}`}
    >
      <div className="relative w-full h-[200px] rounded-t-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-[oklch(78%_0.13_55)] to-[oklch(54%_0.12_225)]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-5xl text-white font-bold opacity-60 select-none">
            🎉
          </div>
        )}
        {/* Type badge */}
        <div
          className={`
            absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow
            ${TYPE_BADGE_STYLES[type]}
          `}
        >
          {EVENT_TYPES[type]}
        </div>
        {/* Status badge */}
        {status === "ongoing" && (
          <div className="absolute top-3 right-3 flex items-center">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow relative animate-pulse">
              {EVENT_STATUS.ongoing.label}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h2 className="font-bold text-lg md:text-xl text-[oklch(36%_0.13_250)] mb-1 truncate">
          {name}
        </h2>
        <div className="font-bold text-[oklch(69%_0.19_41)] mb-1 text-sm">
          {formatEventDate(startDate, endDate)}
        </div>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <span className="mr-1">📍</span>
          <span className="truncate">{location}{region ? `, ${region}` : ""}</span>
        </div>
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{description}</p>
        {showTags && (
          <div className="flex flex-wrap gap-2 mt-auto mb-2">
            {displayedTags.map((tag) => (
              <span
                key={tag}
                className="bg-[oklch(96%_0.01_250)] text-[oklch(36%_0.13_250)] text-xs font-medium px-2 py-0.5 rounded-full border border-[oklch(69%_0.19_41)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {(typeof isFree === "boolean" || typeof price === "number") && (
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center">
            {isFree ? (
              <span className="text-green-600 font-semibold text-sm">Gratuit</span>
            ) : (
              typeof price === "number" && (
                <span className="text-[oklch(36%_0.13_250)] font-semibold text-sm">
                  {price.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 0 })}
                </span>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
