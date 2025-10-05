import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Insert "Événements" after "Prototypes"
const navLinks = [
  { name: "Accueil", to: "/" },
  { name: "Auteurs", to: "/auteurs" },
  { name: "Prototypes", to: "/prototypes" },
  { name: "Événements", to: "/evenements" },
  { name: "Articles", to: "/articles" },
  { name: "Contact", to: "/contact" },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 bg-[oklch(36%_0.13_250)] text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center text-lg font-bold gap-2">
            <span className="text-2xl">🎲</span>
            <span className="hidden sm:inline">Association Auteurs de Jeux</span>
            <span className="sm:hidden">AAJ</span>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors duration-150 hover:underline underline-offset-4 ${
                  location.pathname === link.to
                    ? "underline underline-offset-4"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Ouvrir le menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  className={menuOpen ? "hidden" : "inline-flex"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
                {/* X icon for close */}
                <path
                  className={menuOpen ? "inline-flex" : "hidden"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu (TODO: Animate/close on link click) */}
      {menuOpen && (
        <div className="md:hidden bg-[oklch(36%_0.13_250)] px-4 pb-4 pt-2 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block py-2 px-2 rounded transition-colors duration-150 hover:underline underline-offset-4 ${
                location.pathname === link.to
                  ? "underline underline-offset-4"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {/* TODO: Add animated menu, focus trap, etc. */}
        </div>
      )}
    </nav>
  );
};
