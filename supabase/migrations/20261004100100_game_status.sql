-- =========================================================
-- Game status: a game must be approved by an admin to be public
-- =========================================================

-- Requires the roles migration (public.is_admin()).

create type public.game_status as enum ('pending', 'approved', 'rejected');

-- ---------------------------------------------------------
-- Columns
-- ---------------------------------------------------------

-- created_at orders the games waiting for validation.
alter table public.games
  add column status public.game_status not null default 'pending',
  add column created_at timestamptz not null default now();

-- Games created before this migration stay visible.
update public.games set status = 'approved';

create index games_status_idx on public.games (status);

-- ---------------------------------------------------------
-- Read policy: approved games for everyone, the others for their authors and admins
-- ---------------------------------------------------------

drop policy "Anyone can read games" on public.games;

create policy "Approved games are public, others visible to their authors and admins"
  on public.games for select
  to anon, authenticated
  using (
    status = 'approved'
    -- The creator must see the row returned by its insert (game_authors is filled after).
    or created_by = (select auth.uid())
    or exists (
      select 1 from public.game_authors
      where game_authors.game_id = games.id
        and game_authors.author_id = (select auth.uid())
    )
    or (select public.is_admin())
  );

-- ---------------------------------------------------------
-- Trigger: only admins choose the status
-- ---------------------------------------------------------

-- Authors cannot change the status:
-- - a new game is always pending;
-- - an edited game keeps its status, except a rejected game that goes back to pending (resubmitted).
-- No user (SQL editor, service role) and admins can set any status.
create function public.protect_game_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select auth.uid()) is null or public.is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.status := 'pending';
  elsif old.status = 'rejected' then
    new.status := 'pending';
  else
    new.status := old.status;
  end if;

  return new;
end;
$$;

create trigger on_game_protect_status
  before insert or update on public.games
  for each row
  execute function public.protect_game_status();
