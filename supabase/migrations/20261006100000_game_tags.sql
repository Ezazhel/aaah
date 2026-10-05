-- =========================================================
-- Game tags: one category (audience, with a color) and several mechanics.
-- Mechanics can be suggested by authors, then approved (or deleted) by an admin.
-- =========================================================

-- Requires the roles (is_admin()), membership (is_active_member()) and games migrations.
-- Categories and mechanics have different rules (one category per game, admin only;
-- several mechanics, suggestions), so they live in two tables.

-- =========================================================
-- Categories
-- =========================================================

create table public.categories (
  id bigint generated always as identity primary key,
  name text not null,
  -- Hex color, e.g. "#3f9a4f": badges and the border of the game cards.
  color text not null check (color ~ '^#[0-9a-f]{6}$'),
  -- Display order (select, admin list).
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Same name can't exist twice, whatever the capitalization.
create unique index categories_name_unique on public.categories (lower(name));

-- Same hues as the --color-category-* tokens of globals.css.
insert into public.categories (name, color, position) values
  ('Enfants', '#2b8fd6', 1),
  ('Familial', '#3f9a4f', 2),
  ('Initié', '#c27c1a', 3),
  ('Expert', '#a23d93', 4);

-- One category per game. Nullable: games created before this migration have none yet.
alter table public.games
  add column category_id bigint references public.categories(id) on delete set null;

create index games_category_id_idx on public.games (category_id);

alter table public.categories enable row level security;

create policy "Anyone can read categories"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Admins can create categories"
  on public.categories for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update categories"
  on public.categories for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete categories"
  on public.categories for delete
  to authenticated
  using ((select public.is_admin()));

-- =========================================================
-- Mechanics
-- =========================================================

-- No "rejected": rejecting a suggestion deletes it (and removes it from the games).
create type public.mechanic_status as enum ('pending', 'approved');

create table public.mechanics (
  id bigint generated always as identity primary key,
  name text not null,
  status public.mechanic_status not null default 'pending',
  -- Who suggested the mechanic. Null for the seed, admin creations or a deleted author.
  suggested_by uuid default auth.uid() references public.authors(id) on delete set null,
  -- BoardGameGeek mechanic id (seed), null for suggestions.
  bgg_id integer unique,
  created_at timestamptz not null default now()
);

create unique index mechanics_name_unique on public.mechanics (lower(name));
create index mechanics_status_idx on public.mechanics (status);
create index mechanics_suggested_by_idx on public.mechanics (suggested_by);

create table public.game_mechanics (
  game_id uuid not null references public.games(id) on delete cascade,
  mechanic_id bigint not null references public.mechanics(id) on delete cascade,
  primary key (game_id, mechanic_id)
);

create index game_mechanics_mechanic_id_idx on public.game_mechanics (mechanic_id);

alter table public.mechanics enable row level security;
alter table public.game_mechanics enable row level security;

-- ---------------------------------------------------------
-- mechanics
-- ---------------------------------------------------------

-- Everyone sees approved mechanics. Users also see their own suggestions. Admins see everything.
-- Pending mechanics linked to a game are therefore hidden from the public.
create policy "Read approved mechanics, own suggestions, or all if admin"
  on public.mechanics for select
  to anon, authenticated
  using (
    status = 'approved'
    or suggested_by = (select auth.uid())
    or (select public.is_admin())
  );

-- Active members suggest mechanics (pending, in their own name). Admins create them directly.
create policy "Active members can suggest mechanics"
  on public.mechanics for insert
  to authenticated
  with check (
    (status = 'pending' and suggested_by = (select auth.uid()) and (select public.is_active_member()))
    or (select public.is_admin())
  );

-- Only admins approve, rename (fix a typo) or delete (reject) mechanics.
create policy "Admins can update mechanics"
  on public.mechanics for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete mechanics"
  on public.mechanics for delete
  to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------
-- game_mechanics
-- ---------------------------------------------------------

create policy "Anyone can read game_mechanics"
  on public.game_mechanics for select
  to anon, authenticated
  using (true);

-- An active author of the game adds an approved mechanic, or one they suggested.
create policy "Active authors can add mechanics to their games"
  on public.game_mechanics for insert
  to authenticated
  with check (
    (select public.is_active_member())
    and exists (
      select 1 from public.game_authors
      where game_authors.game_id = game_mechanics.game_id
        and game_authors.author_id = (select auth.uid())
    )
    and exists (
      select 1 from public.mechanics
      where mechanics.id = game_mechanics.mechanic_id
        and (mechanics.status = 'approved' or mechanics.suggested_by = (select auth.uid()))
    )
  );

create policy "Authors or admins can remove mechanics from games"
  on public.game_mechanics for delete
  to authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1 from public.game_authors
      where game_authors.game_id = game_mechanics.game_id
        and game_authors.author_id = (select auth.uid())
    )
  );

-- ---------------------------------------------------------
-- Replace the mechanics of a game in one call
-- ---------------------------------------------------------

-- security invoker: the policies above still apply.
-- Pending mechanics suggested by someone else (co-author) are invisible to the caller:
-- they are kept, so editing the game doesn't remove them.
create function public.set_game_mechanics(game uuid, mechanic_ids bigint[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.game_mechanics
  where game_id = game
    and mechanic_id <> all (mechanic_ids)
    and mechanic_id in (select id from public.mechanics);

  insert into public.game_mechanics (game_id, mechanic_id)
  select game, unnest(mechanic_ids)
  on conflict do nothing;
end;
$$;
