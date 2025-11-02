import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { User, LogOut, Shield, FileText, LogIn, UserCircle } from "lucide-react";

// MVP: Events and Articles links disabled for now
const navLinks = [
  { name: "Accueil", to: "/" },
  { name: "Auteurs", to: "/auteurs" },
  { name: "Prototypes", to: "/prototypes" },
  // { name: "Événements", to: "/evenements" },
  // { name: "Articles", to: "/articles" },
  { name: "Contact", to: "/contact" },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-30 bg-[oklch(36%_0.13_250)] text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center text-lg font-bold gap-2">
            <img
              src="/aaah_logo.png"
              alt="AAAH Logo"
              className="h-10 w-10 object-contain"
              style={{ minWidth: 96, minHeight: 96 }}
            />
            <span className="hidden sm:inline">Association Auteurs Autrices de Jeux</span>
            <span className="sm:hidden">AAAH</span>
          </Link>
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

            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[oklch(40%_0.13_250)] transition"
                >
                  <div className="w-8 h-8 bg-white text-[oklch(36%_0.13_250)] rounded-full flex items-center justify-center text-sm font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      {user?.authorId && (
                        <Link
                          to={`/auteurs/${user.authorId}`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <UserCircle className="w-4 h-4" />
                          Mon profil public
                        </Link>
                      )}
                      <Link
                        to="/mes-prototypes"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FileText className="w-4 h-4" />
                        Mes prototypes
                      </Link>
                      <Link
                        to="/compte"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" />
                        Mon compte
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                        >
                          <Shield className="w-4 h-4" />
                          Administration
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="flex items-center gap-2 px-4 py-2 bg-white text-[oklch(36%_0.13_250)] rounded-lg hover:bg-gray-100 transition font-medium"
              >
                <LogIn className="w-4 h-4" />
                Connexion
              </Link>
            )}
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
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[oklch(36%_0.13_250)] px-4 pb-4 pt-2 space-y-2 border-t border-[oklch(40%_0.13_250)]">
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

          {/* Mobile Auth Links */}
          {isAuthenticated ? (
            <>
              <div className="border-t border-[oklch(40%_0.13_250)] pt-3 mt-3">
                <div className="px-2 py-2 mb-2">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-300">{user?.email}</p>
                </div>
                {user?.authorId && (
                  <Link
                    to={`/auteurs/${user.authorId}`}
                    className="flex items-center gap-3 py-2 px-2 rounded hover:bg-[oklch(40%_0.13_250)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    <UserCircle className="w-4 h-4" />
                    Mon profil public
                  </Link>
                )}
                <Link
                  to="/mes-prototypes"
                  className="flex items-center gap-3 py-2 px-2 rounded hover:bg-[oklch(40%_0.13_250)]"
                  onClick={() => setMenuOpen(false)}
                >
                  <FileText className="w-4 h-4" />
                  Mes prototypes
                </Link>
                <Link
                  to="/compte"
                  className="flex items-center gap-3 py-2 px-2 rounded hover:bg-[oklch(40%_0.13_250)]"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Mon compte
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 py-2 px-2 rounded hover:bg-[oklch(40%_0.13_250)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4" />
                    Administration
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 py-2 px-2 rounded hover:bg-red-900 text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth/login"
              className="flex items-center gap-3 py-2 px-2 rounded bg-white text-[oklch(36%_0.13_250)] font-medium hover:bg-gray-100 mt-3"
              onClick={() => setMenuOpen(false)}
            >
              <LogIn className="w-4 h-4" />
              Connexion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
