-- =========================================================
-- Add a slug to games: "Les Aventuriers du Rail !" -> "les-aventuriers-du-rail"
-- =========================================================

-- Requires the author slug migration, which creates the unaccent extension
-- and the shared public.slugify() function.

-- ---------------------------------------------------------
-- Column (no unique yet: existing rows must be filled first)
-- ---------------------------------------------------------

-- The default only makes the column optional when inserting; the trigger always sets it.
alter table public.games
  add column slug text not null default '';

-- ---------------------------------------------------------
-- Functions
-- ---------------------------------------------------------

-- Builds the slug when a game is created or renamed.
-- If the slug is taken, adds -2, -3, ... ("chess", "chess-2").
create function public.set_game_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  base text;
  candidate text;
  counter integer := 1;
begin
  -- Name unchanged: keep the current slug (and ignore any slug sent by the client).
  if tg_op = 'UPDATE' and new.name = old.name then
    new.slug := old.slug;
    return new;
  end if;

  base := public.slugify(new.name);
  if base = '' then
    base := 'game';
  end if;

  candidate := base;
  while exists (
    select 1 from public.games
    where slug = candidate and id <> new.id
  ) loop
    counter := counter + 1;
    candidate := base || '-' || counter;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

-- ---------------------------------------------------------
-- Fill the slug of games that already exist
-- ---------------------------------------------------------

-- Games with the same name get -2, -3, ... in a stable order.
with slugs as (
  select
    id,
    coalesce(nullif(public.slugify(name), ''), 'game') as base,
    row_number() over (
      partition by coalesce(nullif(public.slugify(name), ''), 'game')
      order by id
    ) as position
  from public.games
)
update public.games
set slug = case
  when slugs.position = 1 then slugs.base
  else slugs.base || '-' || slugs.position
end
from slugs
where games.id = slugs.id;

-- ---------------------------------------------------------
-- Now every row has a slug: make it unique and keep it up to date
-- ---------------------------------------------------------

alter table public.games
  add constraint games_slug_unique unique (slug);

create trigger on_game_set_slug
  before insert or update on public.games
  for each row
  execute function public.set_game_slug();