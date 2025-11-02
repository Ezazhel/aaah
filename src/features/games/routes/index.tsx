import { lazy } from 'react';

// Lazy load the game routes
const Games = lazy(() => import('./games'));
const GameDetails = lazy(() => import('./game-details'));
const CreateGame = lazy(() => import('./create-game'));
const EditGame = lazy(() => import('./edit-game'));

export { Games, GameDetails, CreateGame, EditGame };
