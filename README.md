# AAAH — site de l'association d'auteur·ices de jeux de société

Site vitrine d'une association de créateur·ices de jeux de société.

- Tout le monde (sans connexion) peut consulter les **auteur·ices** de l'association et leurs **jeux**.
- Les auteur·ices peuvent **se connecter**, **ajouter des jeux** et **éditer** les jeux dont ils et elles sont auteur·ices.

> Projet au stade **MVP** : on se concentre sur les fonctionnalités et les données. Le design reprend celui de l'ancien site (old_aaah) via un petit design system (voir [UI](#ui)).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions) — attention, certaines API diffèrent des versions précédentes : voir `node_modules/next/dist/docs/`.
- [Supabase](https://supabase.com) : base Postgres, authentification (lien magique / invitation), Row Level Security.
- [react-hook-form](https://react-hook-form.com) + [zod](https://zod.dev) pour les formulaires et la validation.
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix) pour les composants UI.
- pnpm comme gestionnaire de paquets.

## Fonctionnalités

| Page | Route | Accès |
| --- | --- | --- |
| Accueil | `/` | public |
| Liste des auteur·ices | `/authors` | public |
| Détail d'un·e auteur·ice | `/authors/[slug]` (dossier `authors/[id]`, le paramètre est le slug) | public |
| Liste des jeux | `/games` | public |
| Détail d'un jeu | `/games/[slug]` | public (bouton « Éditer » visible seulement par ses auteur·ices) |
| Nouveau jeu | `/games/new` | connecté·e |
| Édition d'un jeu | `/games/edit/[slug]` | connecté·e **et** auteur·ice du jeu |
| Mon profil (prénom, nom, présentation) | `/account` | connecté·e |
| Connexion / invitation | `/auth/login`, `/auth/invite` | public |

Un·e utilisateur·ice connecté·e doit renseigner son prénom et son nom (`/account`) avant d'apparaître dans la liste des auteur·ices.

## Modèle de données

Migrations dans [`supabase/migrations`](supabase/migrations).

- **`authors`** : profil lié à `auth.users` (prénom, nom, `slug` généré automatiquement).
- **`games`** : nom, description, âge minimum, nombre de joueurs (min/max), durée en minutes (min/max), `slug` généré par trigger à partir du nom (suffixe `-2`, `-3`… en cas de doublon), `created_by`.
- **`game_authors`** : table de liaison **N–N** — un·e auteur·ice peut avoir plusieurs jeux, un jeu peut avoir plusieurs auteur·ices. Le créateur ou la créatrice d'un jeu est ajouté·e automatiquement comme premier·e auteur·ice (trigger).

Règles RLS principales :

- lecture des jeux et des auteur·ices : tout le monde ;
- création d'un jeu : utilisateur·ice connecté·e, en son nom ;
- modification / suppression d'un jeu : n'importe quel·le auteur·ice du jeu ;
- ajout / retrait de co-auteur·ices : le créateur ou la créatrice du jeu.

## Organisation du code

```
app/
  (nomenu)/            pages sans menu : auth (login, invite, confirm, sign-out), erreur
  (withMenu)/
    (public)/          pages publiques : accueil, authors, games (liste + détail)
    (member)/          pages réservées aux connecté·es (layout qui redirige vers /auth/login)
      account/
      games/new, games/edit/[slug], games/components (formulaire), games/lib (schéma zod, server actions)
components/
  ui/                  composants shadcn (button, card, input, label, textarea, dropdown-menu)
  layout/              Container (max 1440px), SiteHeader, NavLinks, UserMenu, SiteFooter
  page-header.tsx      bandeau titre en dégradé bleu
  section-card.tsx     bloc blanc avec titre
  author-avatar.tsx    photo ronde ou initiales, bordure orange
  form-field.tsx       label + champ + message d'erreur
  alert.tsx, breadcrumb.tsx, meta-chip.tsx
  typography.tsx       titres et textes (H1, H2, H3, P, Lead, Muted, Typography)
lib/
  supabase/            clients Supabase (server, client, proxy)
  route_requires.ts    helpers d'accès (utilisateur connecté, profil complété)
database.types.ts      types générés depuis le schéma Supabase
proxy.ts               rafraîchit la session Supabase à chaque requête
```

### UI

- Boutons : `Button` de `@/components/ui/button`. Pour afficher un lien comme un bouton :
  `<Link href="…" className={buttonVariants({ variant: "outline" })}>…</Link>`.
- Couleurs : palette **orange** (principale, `primary`) et **bleu** (`secondary`, `brand-dark` pour le navy) définie dans [`app/globals.css`](app/globals.css). Pas de thème sombre : les classes `dark:` ne s'appliquent que sous une classe `.dark`, jamais posée.
- Dégradés : `bg-hero` (navy → bleu, hero et bandeaux de titre), `bg-page` (fond bleu clair des pages), `bg-placeholder` (jeu sans image).
- Mise en page : chaque page enveloppe son contenu dans `Container` (centré, max 1440px, padding responsive) ; les fonds restent pleine largeur. Grilles responsives en `grid`, alignements en `flex`.
- Formulaires : `FormField` + `Input` / `Textarea` de shadcn, validation zod + react-hook-form, erreur serveur dans `Alert`.
- Cartes : `rounded-xl`, `shadow`, survol `hover:-translate-y-2 hover:shadow-2xl` pour les cartes cliquables.

## Démarrer en local

Prérequis : Node, pnpm, Docker (pour Supabase en local).

```bash
pnpm install
```

```bash
pnpm supa-run
```

Créer un fichier `.env.local` avec les valeurs affichées par `supabase start` :

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

```bash
pnpm dev
```

Le site est sur [http://localhost:3000](http://localhost:3000). Les mails (liens magiques) arrivent dans Mailpit : [http://127.0.0.1:54324](http://127.0.0.1:54324).

### Scripts

| Script | Rôle |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js |
| `pnpm supa-run` / `pnpm supa-stop` | démarre / arrête Supabase en local |
| `pnpm supa-reset` | recrée la base locale en rejouant toutes les migrations (**efface les données locales**) |
| `pnpm supa-gen` | régénère `database.types.ts` depuis la base locale (à lancer après chaque migration) |

## Roadmap

- [x] Auteur·ices : liste, détail, profil
- [x] Jeux : liste, détail, création, édition par les auteur·ices
- [ ] Gestion des co-auteur·ices d'un jeu
- [ ] Images des jeux
- [x] Design system et pages principales (header, accueil, auteur·ices, jeux, formulaires)
- [ ] Règles des jeux (PDF)
