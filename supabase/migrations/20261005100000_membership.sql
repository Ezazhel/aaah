-- =========================================================
-- Membership: admins promote authors and enable / disable them
-- =========================================================

-- Requires the roles migration (public.is_admin(), public.user_roles).
--
-- A member is active when authors.member_ship_expired_at is null (no end date)
-- or in the future. Admins are always active.
-- A membership period always goes from a start date to the same date the next year minus one day
-- (e.g. 01/09/2026 -> 31/08/2027). The start date is stored in membership_settings.

-- =========================================================
-- Settings: start of the membership period
-- =========================================================

-- One row only (id is always true).
create table public.membership_settings (
  id boolean primary key default true check (id),
  start_month integer not null default 1 check (start_month between 1 and 12),
  start_day integer not null default 1,
  updated_at timestamptz not null default now(),
  -- A date that exists every year: no 29/02, no 31/04...
  constraint membership_settings_valid_day check (
    start_day between 1 and case
      when start_month = 2 then 28
      when start_month in (4, 6, 9, 11) then 30
      else 31
    end
  )
);

insert into public.membership_settings default values;

alter table public.membership_settings enable row level security;

create policy "Logged-in users can read the membership settings"
  on public.membership_settings for select
  to authenticated
  using (true);

create policy "Admins can update the membership settings"
  on public.membership_settings for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- No insert / delete: the row is created above.

-- =========================================================
-- Functions
-- =========================================================

-- Current membership period, in the association's time zone.
-- Start 01/09, today 04/10/2026 -> 01/09/2026 - 31/08/2027.
create function public.current_membership_period()
returns table (starts_on date, ends_on date)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  today date := (now() at time zone 'Europe/Paris')::date;
  settings public.membership_settings;
begin
  select * into settings from public.membership_settings;

  starts_on := make_date(extract(year from today)::integer, settings.start_month, settings.start_day);
  -- This year's start date is not reached yet: the period started last year.
  if starts_on > today then
    starts_on := make_date(extract(year from today)::integer - 1, settings.start_month, settings.start_day);
  end if;

  ends_on := (starts_on + interval '1 year' - interval '1 day')::date;
  return next;
end;
$$;

-- True if the user can use the member pages (create / edit games...).
create function public.is_active_member(member_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = member_id and role = 'admin'
  ) or exists (
    select 1 from public.authors
    where id = member_id
      and (member_ship_expired_at is null or member_ship_expired_at > now())
  );
$$;

-- Admin only: enable (end of the current period) or disable (end of the previous period) an author.
-- Returns the new expiration date.
create function public.admin_set_membership(target uuid, active boolean)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  period record;
  last_day date;
  expires_at timestamptz;
begin
  if not public.is_admin() then
    raise exception 'Only admins can change a membership' using errcode = '42501';
  end if;
  if target = auth.uid() then
    raise exception 'You cannot change your own membership' using errcode = '42501';
  end if;
  if exists (select 1 from public.user_roles where user_id = target and role = 'admin') then
    raise exception 'Admins are always active: remove the admin role first' using errcode = '42501';
  end if;

  select * into period from public.current_membership_period();
  last_day := case when active then period.ends_on else period.starts_on - 1 end;
  -- Last second of that day in the association's time zone.
  expires_at := ((last_day + 1)::timestamp at time zone 'Europe/Paris') - interval '1 second';

  update public.authors
  set member_ship_expired_at = expires_at
  where id = target;

  if not found then
    raise exception 'Author not found' using errcode = 'P0002';
  end if;

  return expires_at;
end;
$$;

-- Admin only: every user with their email (not readable from auth.users by the client).
create function public.admin_list_authors()
returns table (
  id uuid,
  email text,
  first_name text,
  last_name text,
  slug text,
  is_admin boolean,
  member_ship_expired_at timestamptz,
  last_sign_in_at timestamptz,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can list the authors' using errcode = '42501';
  end if;

  return query
    select
      users.id,
      users.email::text,
      authors.first_name,
      authors.last_name,
      authors.slug,
      exists (
        select 1 from public.user_roles
        where user_roles.user_id = users.id and user_roles.role = 'admin'
      ),
      authors.member_ship_expired_at,
      users.last_sign_in_at,
      users.created_at
    from auth.users
    left join public.authors on authors.id = users.id
    order by authors.last_name nulls last, authors.first_name, users.email;
end;
$$;

revoke execute on function public.admin_set_membership(uuid, boolean) from public, anon;
revoke execute on function public.admin_list_authors() from public, anon;
grant execute on function public.admin_set_membership(uuid, boolean) to authenticated;
grant execute on function public.admin_list_authors() to authenticated;

-- =========================================================
-- Trigger: only admins change the membership date
-- =========================================================

-- Authors can update their own row (profile), but not their membership.
-- No user (SQL editor, service role) and admins can.
create function public.protect_author_membership()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select auth.uid()) is not null and not public.is_admin() then
    new.member_ship_expired_at := old.member_ship_expired_at;
  end if;
  return new;
end;
$$;

create trigger on_author_protect_membership
  before update on public.authors
  for each row
  execute function public.protect_author_membership();

-- =========================================================
-- Row Level Security
-- =========================================================

-- Admins can promote a user. No delete policy: the role is removed in SQL only.
create policy "Admins can give roles"
  on public.user_roles for insert
  to authenticated
  with check ((select public.is_admin()));

-- Only active members can create or edit games.
drop policy "Users can create games as themselves" on public.games;
create policy "Active members can create games as themselves"
  on public.games for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and (select public.is_active_member())
  );

drop policy "Any author of the game can update it" on public.games;
create policy "Active authors of the game can update it"
  on public.games for update
  to authenticated
  using (
    (select public.is_active_member())
    and exists (
      select 1 from public.game_authors
      where game_authors.game_id = games.id
        and game_authors.author_id = (select auth.uid())
    )
  );
