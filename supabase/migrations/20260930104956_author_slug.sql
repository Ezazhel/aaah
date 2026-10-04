-- =========================================================
-- Slugs: shared slugify() + author slug
-- "Éloïse Dupont-Martin" -> "eloise-dupont-martin"
-- =========================================================

-- Removes accents: "Éléphant" -> "Elephant". Supabase keeps extensions in the "extensions" schema.
create extension if not exists unaccent with schema extensions;

-- ---------------------------------------------------------
-- Shared function (also used by the games slug migration)
-- ---------------------------------------------------------

-- Lowercase, no accents, every group of other characters becomes one "-".
create function public.slugify(value text)
returns text
language sql
stable
set search_path = ''
as $$
  select trim(both '-' from regexp_replace(
    lower(extensions.unaccent('extensions.unaccent', value)),
    '[^a-z0-9]+', '-', 'g'
  ));
$$;

-- ---------------------------------------------------------
-- Column (nullable: an author has no slug until both names are set)
-- ---------------------------------------------------------

alter table public.authors
  add column slug text;

-- ---------------------------------------------------------
-- Trigger function
-- ---------------------------------------------------------

-- Builds the slug when an author is created or renamed.
-- If the slug is taken, adds -2, -3, ... ("marie-dupont", "marie-dupont-2").
create function public.set_author_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  base text;
  candidate text;
  counter integer := 1;
begin
  -- Names unchanged: keep the current slug (and ignore any slug sent by the client).
  if tg_op = 'UPDATE'
    and new.first_name is not distinct from old.first_name
    and new.last_name is not distinct from old.last_name
  then
    new.slug := old.slug;
    return new;
  end if;

  -- A name is missing: no slug on insert, keep the existing one on update.
  if new.first_name is null or new.last_name is null then
    if tg_op = 'UPDATE' then
      new.slug := old.slug;
    else
      new.slug := null;
    end if;
    return new;
  end if;

  base := public.slugify(new.first_name || ' ' || new.last_name);
  -- Names with no latin characters at all (e.g. "李 明") give an empty slug.
  if base = '' then
    base := 'author';
  end if;

  candidate := base;
  while exists (
    select 1 from public.authors
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
-- Fill the slug of authors that already exist
-- ---------------------------------------------------------

with slugs as (
  select
    id,
    coalesce(nullif(public.slugify(first_name || ' ' || last_name), ''), 'author') as base,
    row_number() over (
      partition by coalesce(nullif(public.slugify(first_name || ' ' || last_name), ''), 'author')
      order by id
    ) as position
  from public.authors
  where first_name is not null and last_name is not null
)
update public.authors
set slug = case
  when slugs.position = 1 then slugs.base
  else slugs.base || '-' || slugs.position
end
from slugs
where authors.id = slugs.id;

-- ---------------------------------------------------------
-- Unique + trigger
-- ---------------------------------------------------------

-- Several null slugs are allowed: unique ignores nulls.
alter table public.authors
  add constraint authors_slug_unique unique (slug);

create trigger on_author_set_slug
  before insert or update on public.authors
  for each row
  execute function public.set_author_slug();