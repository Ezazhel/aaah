import { lazy } from 'react';

// Lazy load the author routes
const Authors = lazy(() => import('./authors'));
const AuthorDetail = lazy(() => import('./author-detail'));

export { Authors, AuthorDetail };
