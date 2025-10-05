import { lazy } from 'react';

// Lazy load the game routes
const Games = lazy(() => import('./games'));
const GameDetails = lazy(() => import('./game-details'));

export { Games, GameDetails };
