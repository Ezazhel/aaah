/**
 * Centralized routing configuration
 * Contains all application routes and routing logic
 * Replaces individual route definitions scattered throughout the app
 */
import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Feature routes with lazy loading
import { Games, GameDetails } from '@/features/games/routes';
import { Authors, AuthorDetail } from '@/features/authors/routes';
import { Events } from '@/features/events/routes';
import { Home } from '@/features/home/routes';

// Layout components
import { Navigation } from '@/components/navigation';

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-gray-500">Chargement...</div>
  </div>
);

// 404 component
const NotFound = () => (
  <div className="text-center py-20 text-gray-500 text-xl">
    404 Page not found
  </div>
);

export const AppRoutes = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[oklch(96%_0.01_250)] to-[oklch(94%_0.04_250)]">
      <Navigation />
      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auteurs" element={<Authors />} />
            <Route path="/auteurs/:id" element={<AuthorDetail />} />
            <Route path="/prototypes" element={<Games />} />
            <Route path="/prototypes/:id" element={<GameDetails />} />
            <Route path="/evenements" element={<Events />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-100 mt-8">
        &copy; {new Date().getFullYear()} Association des Auteurs de Jeux de Société d'Auvergne. Tous droits réservés.
      </footer>
    </div>
  );
};