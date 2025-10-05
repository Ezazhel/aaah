import { lazy } from 'react';

// Lazy load the home routes
const Home = lazy(() => import('./home'));

export { Home };
