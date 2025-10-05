import { lazy } from 'react';

// Lazy load the event routes
const Events = lazy(() => import('./events'));

export { Events };
