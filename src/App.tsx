import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import Home from "./pages/Home";
import Authors from "./pages/Authors";
import AuthorDetail from "./pages/AuthorDetail";
import Games from "./pages/Games";
import GameDetail from "./pages/GameDetails";
import Events from "./pages/Events";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[oklch(96%_0.01_250)] to-[oklch(94%_0.04_250)]">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auteurs" element={<Authors />} />
            <Route path="/auteurs/:id" element={<AuthorDetail />} />
            <Route path="/prototypes" element={<Games />} />
            <Route path="/prototypes/:id" element={<GameDetail />} />
            <Route path="/evenements" element={<Events />} />
            <Route path="*" element={<div className="text-center py-20 text-gray-500 text-xl">404 Page not found</div>} />
          </Routes>
        </main>
        <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-100 mt-8">
          &copy; {new Date().getFullYear()} Association des Auteurs de Jeux de Société d'Auvergne. Tous droits réservés.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
