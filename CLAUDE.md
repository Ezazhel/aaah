# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React website for the Board Game Authors Association (AAAH - Association des Auteurs de Jeux de Société d'Auvergne), built with Vite, TypeScript, React 19, and Tailwind CSS v4. The application uses pnpm as its package manager.

## Common Commands

### Development
```bash
pnpm dev              # Start dev server on http://localhost:3000
pnpm build            # Build for production (runs TypeScript check + Vite build)
pnpm preview          # Preview production build
pnpm check            # Run TypeScript type checking without emitting files
pnpm lint             # Run ESLint
```

### Package Management
```bash
pnpm install          # Install dependencies
pnpm clean            # Prune dependencies
pnpm package-check    # Check for outdated packages
```

## Architecture

### Feature-Based Structure (Bulletproof React Pattern)

The codebase follows a feature-based architecture where each major domain is self-contained:

```
src/
├── app/                 # Application setup
│   ├── index.tsx       # Main app component
│   ├── provider.tsx    # React providers (React Query, etc.)
│   └── routes.tsx      # Centralized routing configuration
├── features/           # Feature modules (domain-driven)
│   ├── authors/        # Author management feature
│   │   ├── api/        # API functions (get-authors.ts, get-author.ts)
│   │   ├── components/ # Feature-specific components
│   │   └── routes/     # Route components & exports
│   ├── games/          # Game/prototype management
│   ├── events/         # Event management
│   └── home/           # Homepage feature
├── components/         # Shared components across features
├── lib/                # Shared utilities
│   ├── api-client.ts   # Configured axios instance with interceptors
│   ├── react-query.ts  # React Query configuration & types
│   └── utils.ts        # General utilities
├── types/              # Shared TypeScript types
├── constants/          # Application constants (labels.ts for i18n-like mappings)
└── mocks/              # Mock data for development
```

### Key Architectural Patterns

**1. Feature Modules:**
Each feature follows this structure:
- `api/` - API layer with React Query hooks and query options
- `components/` - Feature-specific UI components
- `routes/` - Route components (imported directly, NO barrel exports)

**2. API Layer Pattern:**
API functions follow a consistent pattern using React Query:
- `getX()` - Raw API call function returning Promise
- `getXQueryOptions()` - Query configuration using `queryOptions()`
- `useX()` - Hook that wraps useQuery with the options

Example:
```typescript
export const getAuthors = (): Promise<{ data: Author[] }> => {
  return apiClient.get<Author[]>('/authors');
};

export const getAuthorsQueryOptions = () => {
  return queryOptions({
    queryKey: ['authors'],
    queryFn: () => getAuthors(),
  });
};

export const useAuthors = ({ queryConfig }: UseAuthorsOptions = {}) => {
  return useQuery({
    ...getAuthorsQueryOptions(),
    ...queryConfig,
  });
};
```

**3. Centralized Configuration:**
- `src/lib/api-client.ts` - Axios instance with auth interceptors and error handling
- `src/lib/react-query.ts` - React Query client with default options (5min stale time, no window refocus, no retry)
- `src/app/provider.tsx` - All React context providers
- `src/app/routes.tsx` - All route definitions with lazy loading via Suspense

**4. Type System:**
- Domain types in `src/types/index.ts` (Game, Author, Event, Article)
- Constants with TypeScript enums in `src/constants/labels.ts` for i18n-like mappings
- Type helpers in `react-query.ts` for extracting function return types

## Important Technical Details

### Path Aliases
Configured in `vite.config.ts`:
- `@/` → `src/`
- `@/components` → `src/components`
- `@/pages` → `src/pages`
- `@/types` → `src/types`
- `@/mocks` → `src/mocks`
- `@/assets` → `src/assets`

### Environment Variables
Required env var in `.env.local` (see `.env.example`):
- `VITE_API_URL` - Backend API base URL

### API Client Behavior
The axios instance (`src/lib/api-client.ts`):
- Automatically adds JWT token from localStorage to requests
- Intercepts responses to unwrap `.data`
- Handles auth errors (401) by clearing token
- Returns unwrapped data directly (response interceptor returns `response.data`)

### React Query Configuration
Default behavior (`src/lib/react-query.ts`):
- No refetch on window focus
- No automatic retries on failure
- 5 minute stale time
- Type helpers for extracting query/mutation types

### Internationalization
The app is in French. Label mappings are in `src/constants/labels.ts`:
- `MEMBER_ROLES` - Member role labels
- `GAME_CATEGORIES` - Game category labels and descriptions
- `EVENT_TYPES` - Event type labels
- `EVENT_STATUS` - Event status labels with colors

## Development Notes

- This project uses **pnpm** exclusively (not npm/yarn)
- Port 3000 is configured for dev server
- The codebase was rebased from PascalCase to kebab-case for file naming
- Mock data exists in `src/mocks/data/` for development without backend
- **Icons**: Use `lucide-react` for all icons in the project (installed and configured)

## Code Style Rules

### NO Barrel Exports
**IMPORTANT**: Do NOT use `index.ts` or `index.tsx` files for barrel exports (re-exporting modules).

- ❌ **BAD**: Creating `features/auth/routes/index.ts` that exports all routes
- ✅ **GOOD**: Import routes directly from their files: `import { Login } from '@/features/auth/routes/login'`

This applies to ALL directories:
- Features (`features/*`)
- Components (`components/*`)
- API layers (`features/*/api/*`)
- Utilities (`lib/*`)

**Why?** Direct imports improve:
- Code clarity and explicitness
- IDE navigation and refactoring
- Build performance
- Debugging experience
