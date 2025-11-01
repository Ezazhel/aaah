import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { EventCard } from "../components/event-card";
import type { Event } from "@/types";
import { mockEvents } from "../api/mock-data";

// --- Dummy Data ---

const REGIONS = [
  "Île-de-France",
  "Auvergne-Rhône-Alpes",
  "Provence-Alpes-Côte d'Azur",
  "Occitanie",
  "Nouvelle-Aquitaine",
  "Grand Est",
  "Bretagne",
  "Hauts-de-France",
  "Pays de la Loire",
  "Normandie",
  "Bourgogne-Franche-Comté",
  "Centre-Val de Loire",
  "Corse",
];

// --- Tabs and Filters ---

const TYPE_TABS = [
  { label: "Tous", value: "all" },
  { label: "Nos événements", value: "association" },
  { label: "Événements externes", value: "external" },
] as const;

const TIME_TABS = [
  { label: "À venir", value: "upcoming" },
  { label: "En cours", value: "ongoing" },
  { label: "Passés", value: "past" },
] as const;

// --- Helper Functions ---

function getEventStatus(event: Event): "upcoming" | "ongoing" | "past" {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : start;
  if (end < now) return "past";
  if (start > now) return "upcoming";
  return "ongoing";
}

// --- Main Component ---

const Events: React.FC = () => {
  // State for filters
  const [typeTab, setTypeTab] = useState<(typeof TYPE_TABS)[number]["value"]>("all");
  const [timeTab, setTimeTab] = useState<(typeof TIME_TABS)[number]["value"]>("upcoming");
  const [region, setRegion] = useState<string>("");

  // Compute filtered and sorted events
  const filteredEvents = useMemo(() => {
    let events = mockEvents.map((e) => ({
      ...e,
      computedStatus: getEventStatus(e),
    }));

    // Filter by type
    if (typeTab !== "all") {
      events = events.filter((e) => e.type === typeTab);
    }

    // Filter by time
    events = events.filter((e) => e.computedStatus === timeTab);

    // Filter by region
    if (region && region !== "") {
      events = events.filter((e) => e.region === region);
    }

    // Sort
    if (timeTab === "past") {
      // Most recent first
      events = events.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    } else {
      // Earliest first
      events = events.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    }

    return events;
  }, [typeTab, timeTab, region]);

  // --- UI ---

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[oklch(36%_0.13_250)] mb-1">
            Événements
          </h1>
          <p className="text-lg text-gray-700">
            Découvrez nos événements et rencontrez la communauté
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-block bg-[oklch(69%_0.19_41)] hover:bg-[oklch(54%_0.12_225)] text-white font-semibold px-6 py-3 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)]"
        >
          Proposer un événement
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex flex-col gap-2 w-full">
          {/* Type Tabs */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 pb-1">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                className={`px-4 py-2 font-semibold text-sm whitespace-nowrap border-b-2 transition
                  ${
                    typeTab === tab.value
                      ? "border-[oklch(69%_0.19_41)] text-[oklch(69%_0.19_41)]"
                      : "border-transparent text-gray-600 hover:text-[oklch(69%_0.19_41)]"
                  }
                `}
                onClick={() => setTypeTab(tab.value)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Time Tabs */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 pb-1">
            {TIME_TABS.map((tab) => (
              <button
                key={tab.value}
                className={`px-4 py-2 font-semibold text-sm whitespace-nowrap border-b-2 transition
                  ${
                    timeTab === tab.value
                      ? "border-[oklch(69%_0.19_41)] text-[oklch(69%_0.19_41)]"
                      : "border-transparent text-gray-600 hover:text-[oklch(69%_0.19_41)]"
                  }
                `}
                onClick={() => setTimeTab(tab.value)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Region Filter */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <label className="sr-only" htmlFor="region-select">
            Région
          </label>
          <select
            id="region-select"
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)]"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">Toutes les régions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div
          className="
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
            mb-12
          "
        >
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4 text-[oklch(69%_0.19_41)]">😕</div>
          <div className="text-xl font-semibold mb-2">
            Aucun événement ne correspond à vos critères
          </div>
          <div className="text-gray-500 mb-4">
            Essayez de modifier vos filtres ou revenez plus tard.
          </div>
          <Link
            to="/contact"
            className="inline-block bg-[oklch(69%_0.19_41)] hover:bg-[oklch(54%_0.12_225)] text-white font-semibold px-5 py-2.5 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)]"
          >
            Proposer un événement
          </Link>
        </div>
      )}
    </div>
  );
};

export default Events;
