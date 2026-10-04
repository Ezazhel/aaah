-- =========================================================
-- Tables
-- =========================================================

create table public.games (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  description text not null,
  age_threshold integer not null,
  min_players integer not null check (min_players > 0),
  max_players integer not null,
  min_time_minutes integer not null check (min_time_minutes > 0),
  max_time_minutes integer not null,
  -- The author who created the game. Filled in automatically with the logged-in user.
  created_by uuid not null default auth.uid() references public.authors(id),
  constraint games_players_range check (max_players >= min_players),
  constraint games_time_range check (max_time_minutes >= min_time_minutes)
);

create index games_created_by_idx on public.games (created_by);

-- Join table (many-to-many)

create table public.game_authors (
  game_id uuid not null references public.games(id) on delete cascade,
  author_id uuid not null references public.authors(id) on delete cascade,
  primary key (game_id, author_id)
);

create index game_authors_author_id_idx on public.game_authors (author_id);

-- =========================================================
-- Trigger: when a game is created, add its creator as its first author
-- =========================================================

create function public.add_creator_as_author()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  insert into public.game_authors (game_id, author_id)
  values (new.id, new.created_by);
  return new;
end;
$$;

create trigger on_game_created
  after insert on public.games
  for each row
  execute function public.add_creator_as_author();

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.games enable row level security;
alter table public.game_authors enable row level security;

-- ---------------------------------------------------------
-- games
-- ---------------------------------------------------------

create policy "Anyone can read games"
  on public.games for select
  to anon, authenticated
  using (true);

-- A logged-in user can create a game, but only as themselves.
create policy "Users can create games as themselves"
  on public.games for insert
  to authenticated
  with check (created_by = (select auth.uid()));

-- Any author of the game can edit it.
create policy "Any author of the game can update it"
  on public.games for update
  to authenticated
  using (exists (
    select 1 from public.game_authors
    where game_authors.game_id = games.id
      and game_authors.author_id = (select auth.uid())
  ));

-- Any author of the game can delete it.
create policy "Authors can delete their games"
  on public.games for delete
  to authenticated
  using (exists (
    select 1 from public.game_authors
    where game_authors.game_id = games.id
      and game_authors.author_id = (select auth.uid())
  ));

-- ---------------------------------------------------------
-- game_authors
-- ---------------------------------------------------------

create policy "Anyone can read game_authors"
  on public.game_authors for select
  to anon, authenticated
  using (true);

-- Only the creator of a game can add authors to it
-- (the trigger adds the creator, then they can add a co-author).
create policy "Game creator can add authors"
  on public.game_authors for insert
  to authenticated
  with check (exists (
    select 1 from public.games
    where games.id = game_authors.game_id
      and games.created_by = (select auth.uid())
  ));

-- Only the creator of a game can remove authors from it.
create policy "Game creator can remove authors"
  on public.game_authors for delete
  to authenticated
  using (exists (
    select 1 from public.games
    where games.id = game_authors.game_id
      and games.created_by = (select auth.uid())
  ));