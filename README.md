# AAAH — site de l'association d'auteur·ices de jeux de société

Site vitrine d'une association de créateur·ices de jeux de société.

- Tout le monde (sans connexion) peut consulter les **auteur·ices** de l'association et leurs **jeux**.
- Les auteur·ices peuvent **se connecter**, **proposer des jeux** et **éditer** les jeux dont ils et elles sont auteur·ices.
- Les **administrateur·ices** invitent de nouveaux auteur·ices, nomment d'autres admins, désactivent / réactivent les adhésions et **valident** (ou refusent, avec une raison) les jeux proposés : un jeu n'est public qu'une fois validé.

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
| Détail d'un jeu | `/games/[slug]` | public si validé ; sinon ses auteur·ices et les admins (bandeau « en attente » / « refusé » + raison) |
| Nouveau jeu | `/games/new` | connecté·e |
| Édition d'un jeu | `/games/edit/[slug]` | connecté·e **et** auteur·ice du jeu |
| Mon profil (prénom, nom, présentation) | `/account` | connecté·e |
| Connexion | `/auth/login` | public |
| Administration | `/admin` | connecté·e **et** admin |
| Gestion des auteur·ices (admins, adhésions, période d'adhésion) | `/admin/authors` | connecté·e **et** admin |
| Inviter un·e auteur·ice | `/admin/invite` | connecté·e **et** admin |
| Validation des jeux | `/admin/validation` | connecté·e **et** admin |

Un·e utilisateur·ice connecté·e doit renseigner son prénom et son nom (`/account`) avant d'apparaître dans la liste des auteur·ices.

### Adhésion

- Un·e auteur·ice est **actif·ve** si `authors.member_ship_expired_at` est vide (sans échéance) ou dans le futur. Les **admins sont toujours actif·ves**.
- La **période d'adhésion** va toujours d'une date de début à la même date l'année suivante moins un jour (ex. 01/09/2026 → 31/08/2027). La date de début (jour + mois) est dans `membership_settings`, modifiable dans `/admin/authors`.
- **Désactiver** : l'adhésion expire à la fin de la période précédente. **Réactiver** : elle est valable jusqu'à la fin de la période en cours (puis expire automatiquement sans renouvellement).
- Adhésion expirée : connexion refusée (déconnexion après le lien magique), pages membres inaccessibles, création / édition de jeux refusée (RLS), profil masqué de `/authors`. Ses jeux restent visibles, son nom y est affiché sans lien.
- Une session déjà ouverte est coupée à la prochaine visite d'une page membre.

## Modèle de données

Migrations dans [`supabase/migrations`](supabase/migrations).

- **`authors`** : profil lié à `auth.users` (prénom, nom, `slug` généré automatiquement).
- **`games`** : nom, description, âge minimum, nombre de joueurs (min/max), durée en minutes (min/max), `slug` généré par trigger à partir du nom (suffixe `-2`, `-3`… en cas de doublon), `created_by`.
- **`games.status`** (enum `game_status` : `pending` | `approved` | `rejected`) : un jeu créé est `pending`. Seule une décision d'admin change le statut ; toute modification d'un jeu `rejected` (même par un·e admin) le repasse en `pending` (nouvelle soumission), un jeu `approved` le reste (trigger `protect_game_status`).
- **`game_reviews`** : historique des décisions des admins (`decision`, `reason` obligatoire en cas de refus, `reviewer_id`). Insérer une review met à jour `games.status` (trigger).
- **`membership_settings`** : une seule ligne, début de la période d'adhésion (`start_month`, `start_day`).
- Fonctions SQL : `is_active_member()`, `current_membership_period()`, `admin_set_membership()` et `admin_list_authors()` (admins uniquement, lit l'email dans `auth.users`).
- **`user_roles`** (enum `app_role` : `admin`) : rôles des utilisateur·ices. Table séparée de `authors` pour qu'un·e auteur·ice ne puisse pas se donner un rôle. La fonction `public.is_admin()` est utilisée par les policies et par l'app (`rpc('is_admin')`).
- **`game_authors`** : table de liaison **N–N** — un·e auteur·ice peut avoir plusieurs jeux, un jeu peut avoir plusieurs auteur·ices. Le créateur ou la créatrice d'un jeu est ajouté·e automatiquement comme premier·e auteur·ice (trigger).

Règles RLS principales :

- lecture des auteur·ices et des jeux **validés** : tout le monde ; jeux non validés : leurs auteur·ices et les admins ;
- décisions (`game_reviews`) : création par les admins, lecture par les admins et les auteur·ices du jeu ;
- rôles : les admins peuvent **donner** le rôle admin ; le **retirer** se fait uniquement en SQL ;
- création d'un jeu : utilisateur·ice connecté·e **à l'adhésion active**, en son nom ;
- modification d'un jeu : auteur·ice du jeu à l'adhésion active ; suppression : n'importe quel·le auteur·ice du jeu ;
- date d'adhésion : modifiable par les admins seulement (trigger) ;
- ajout / retrait de co-auteur·ices : le créateur ou la créatrice du jeu.

## Organisation du code

```
app/
  (nomenu)/            pages sans menu : auth (login, confirm, sign-out), erreur
  (admin)/             layout admin (bandeau Inviter / Validation + badge), réservé aux admins
    admin/             tableau de bord, invite/, validation/
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
  route_requires.ts    helpers d'accès (utilisateur connecté, profil complété, admin)
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
SUPABASE_SECRET_KEY=<secret key>   # envoi des invitations, serveur uniquement
NEXT_PUBLIC_URL=http://localhost:3000
```

```bash
pnpm dev
```

Le site est sur [http://localhost:3000](http://localhost:3000). Les mails (liens magiques) arrivent dans Mailpit : [http://127.0.0.1:54324](http://127.0.0.1:54324).

### Nommer un·e administrateur·ice

Un·e admin peut nommer d'autres admins depuis `/admin/authors`. Le **premier** admin se nomme en SQL (Studio : [http://127.0.0.1:54323](http://127.0.0.1:54323), SQL editor) :

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'admin@exemple.fr';
```

Retirer le rôle (uniquement en SQL) :

```sql
delete from public.user_roles
where role = 'admin' and user_id = (select id from auth.users where email = 'admin@exemple.fr');
```

L'accès à `/admin/*` est vérifié dans le proxy (connecté·e **et** admin), le layout `(admin)`, chaque page et chaque server action, et par les policies RLS.

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
- [x] Rôle admin, invitation d'auteur·ices, validation des jeux
- [x] Design system et pages principales (header, accueil, auteur·ices, jeux, formulaires)
- [ ] Règles des jeux (PDF)
