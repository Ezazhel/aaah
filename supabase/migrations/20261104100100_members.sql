-- =========================================================
-- Members + roles
-- "authors" becomes "members": every account has a profile row,
-- and what it can do comes from its roles (author, admin, location_manager).
-- Requires 20261104100000_app_role_values.sql.
-- =========================================================

-- ---------------------------------------------------------
-- Rename the table (policies, foreign keys and triggers follow it)
-- ---------------------------------------------------------

alter table public.authors rename to members;
alter table public.members rename constraint authors_slug_unique to members_slug_unique;
alter table public.members rename constraint authors_pkey to members_pkey;

alter policy "Public authors are viewable by everyone." on public.members
  rename to "Member profiles are viewable by everyone";
alter policy "Users can insert their own authors" on public.members
  rename to "Users can insert their own member row";
alter policy "Users can update own profile" on public.members
  rename to "Members can update their own profile";
-- Same rule as the policy above.
drop policy "Authors can update their own profile" on public.members;

alter trigger on_author_set_slug on public.members rename to on_member_set_slug;
alter trigger on_author_protect_membership on public.members rename to on_member_protect_membership;

-- ---------------------------------------------------------
-- Functions whose body names the table: recreated
-- ---------------------------------------------------------

drop trigger on_auth_user_created on auth.users;
drop function public.handle_new_author();

create function public.handle_new_member()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.members (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_member();

-- Same as before, on public.members.
create or replace function public.set_author_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  base text;
  candidate text;
  counter integer := 1;
begin
  if tg_op = 'UPDATE'
    and new.first_name is not distinct from old.first_name
    and new.last_name is not distinct from old.last_name
  then
    new.slug := old.slug;
    return new;
  end if;

  if new.first_name is null or new.last_name is null then
    if tg_op = 'UPDATE' then
      new.slug := old.slug;
    else
      new.slug := null;
    end if;
    return new;
  end if;

  base := public.slugify(new.first_name || ' ' || new.last_name);
  if base = '' then
    base := 'member';
  end if;

  candidate := base;
  while exists (
    select 1 from public.members
    where slug = candidate and id <> new.id
  ) loop
    counter := counter + 1;
    candidate := base || '-' || counter;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;
alter function public.set_author_slug() rename to set_member_slug;

alter function public.protect_author_membership() rename to protect_member_membership;

-- True if the membership (adhésion) is active. Admins always are.
create or replace function public.is_active_member(member_id uuid default auth.uid())
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
    select 1 from public.members
    where id = member_id
      and (member_ship_expired_at is null or member_ship_expired_at > now())
  );
$$;

create or replace function public.admin_set_membership(target uuid, active boolean)
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
  expires_at := ((last_day + 1)::timestamp at time zone 'Europe/Paris') - interval '1 second';

  update public.members
  set member_ship_expired_at = expires_at
  where id = target;

  if not found then
    raise exception 'Member not found' using errcode = 'P0002';
  end if;

  return expires_at;
end;
$$;

-- Admin only: every user with their email and roles.
drop function public.admin_list_authors();
create function public.admin_list_members()
returns table (
  id uuid,
  email text,
  first_name text,
  last_name text,
  slug text,
  roles public.app_role[],
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
    raise exception 'Only admins can list the members' using errcode = '42501';
  end if;

  return query
    select
      users.id,
      users.email::text,
      members.first_name,
      members.last_name,
      members.slug,
      coalesce(
        (select array_agg(user_roles.role order by user_roles.role)
         from public.user_roles where user_roles.user_id = users.id),
        '{}'::public.app_role[]
      ),
      members.member_ship_expired_at,
      users.last_sign_in_at,
      users.created_at
    from auth.users
    left join public.members on members.id = users.id
    order by members.last_name nulls last, members.first_name, users.email;
end;
$$;

revoke execute on function public.admin_list_members() from public, anon;
grant execute on function public.admin_list_members() to authenticated;

-- HelloAsso: a paid membership makes the member an author.
create or replace function public.helloasso_grant_membership(p_email text, p_first_name text, p_last_name text)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid;
  period record;
  expires_at timestamptz;
begin
  select id into target from auth.users where lower(email) = lower(trim(p_email));
  if target is null then
    return null;
  end if;

  select * into period from public.current_membership_period();
  expires_at := ((period.ends_on + 1)::timestamp at time zone 'Europe/Paris') - interval '1 second';

  update public.members
  set member_ship_expired_at = greatest(member_ship_expired_at, expires_at),
      first_name = coalesce(nullif(first_name, ''), nullif(trim(p_first_name), '')),
      last_name = coalesce(nullif(last_name, ''), nullif(trim(p_last_name), ''))
  where id = target
  returning member_ship_expired_at into expires_at;

  if not found then
    raise exception 'Member not found' using errcode = 'P0002';
  end if;

  insert into public.user_roles (user_id, role)
  values (target, 'author')
  on conflict do nothing;

  return expires_at;
end;
$$;

-- ---------------------------------------------------------
-- Role helpers
-- ---------------------------------------------------------

create function public.has_role(r public.app_role, uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = uid and role = r
  );
$$;

-- Can open a session: active membership (admins included), or stock manager (e.g. a game bar,
-- which is not a member of the association).
create function public.can_sign_in()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_active_member() or public.has_role('location_manager');
$$;

-- Can create / edit games and borrow material.
create function public.is_active_author()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.has_role('author') and public.is_active_member();
$$;

-- ---------------------------------------------------------
-- Every existing account was an author
-- ---------------------------------------------------------

-- Safety net: every user has a member row (the trigger exists since the first migration).
insert into public.members (id)
select id from auth.users
on conflict (id) do nothing;

insert into public.user_roles (user_id, role)
select id, 'author' from public.members
on conflict do nothing;

-- ---------------------------------------------------------
-- user_roles
-- ---------------------------------------------------------

-- Lets PostgREST join members and their roles (members.id = auth.users.id).
alter table public.user_roles
  add constraint user_roles_member_fkey
  foreign key (user_id) references public.members(id) on delete cascade;

-- Public list of authors: who is an author (or a stock manager) is not a secret.
create policy "Author and stock manager roles are public"
  on public.user_roles for select
  to anon, authenticated
  using (role in ('author', 'location_manager'));

-- Admins remove author / stock manager roles. The admin role is still removed in SQL only.
create policy "Admins can remove non-admin roles"
  on public.user_roles for delete
  to authenticated
  using ((select public.is_admin()) and role <> 'admin');

-- ---------------------------------------------------------
-- Games: active authors only (not every member)
-- ---------------------------------------------------------

drop policy "Active members can create games as themselves" on public.games;
create policy "Active authors can create games as themselves"
  on public.games for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and (select public.is_active_author())
  );

drop policy "Active authors of the game can update it" on public.games;
create policy "Active authors of the game can update it"
  on public.games for update
  to authenticated
  using (
    (select public.is_active_author())
    and exists (
      select 1 from public.game_authors
      where game_authors.game_id = games.id
        and game_authors.author_id = (select auth.uid())
    )
  );

drop policy "Active members can suggest mechanics" on public.mechanics;
create policy "Active authors can suggest mechanics"
  on public.mechanics for insert
  to authenticated
  with check (
    (status = 'pending' and suggested_by = (select auth.uid()) and (select public.is_active_author()))
    or (select public.is_admin())
  );

drop policy "Active authors can add mechanics to their games" on public.game_mechanics;
create policy "Active authors can add mechanics to their games"
  on public.game_mechanics for insert
  to authenticated
  with check (
    (select public.is_active_author())
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

create or replace function public.can_edit_game_files(object_name text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select public.is_active_author()
    and exists (
      select 1 from public.game_authors
      where game_authors.game_id::text = (storage.foldername(object_name))[1]
        and game_authors.author_id = auth.uid()
    );
$$;
