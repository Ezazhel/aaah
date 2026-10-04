-- =========================================================
-- Game reviews: history of the admins' decisions (approve / reject with a reason)
-- =========================================================

-- Requires the game status migration.
-- games.status is the current status; each review row updates it (trigger below).

create table public.game_reviews (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  -- The admin who decided. Filled in automatically with the logged-in user.
  reviewer_id uuid not null default auth.uid() references auth.users(id),
  decision public.game_status not null check (decision <> 'pending'),
  reason text,
  created_at timestamptz not null default now(),
  -- A rejection must say why.
  constraint game_reviews_reason_required check (decision <> 'rejected' or nullif(trim(reason), '') is not null)
);

create index game_reviews_game_id_idx on public.game_reviews (game_id, created_at desc);

-- =========================================================
-- Trigger: a review sets the status of the game
-- =========================================================

-- security definer: admins have no update policy on games.
-- auth.uid() is still the admin, so protect_game_status() lets the change through.
create function public.apply_game_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.games
  set status = new.decision
  where id = new.game_id;
  return new;
end;
$$;

create trigger on_game_review_created
  after insert on public.game_reviews
  for each row
  execute function public.apply_game_review();

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.game_reviews enable row level security;

-- Admins see every review, authors see the reviews of their games (rejection reason).
create policy "Admins and game authors can read reviews"
  on public.game_reviews for select
  to authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1 from public.game_authors
      where game_authors.game_id = game_reviews.game_id
        and game_authors.author_id = (select auth.uid())
    )
  );

-- Only admins review, in their own name.
create policy "Admins can review games"
  on public.game_reviews for insert
  to authenticated
  with check (
    (select public.is_admin())
    and reviewer_id = (select auth.uid())
  );

-- No update / delete: the history cannot be changed.
