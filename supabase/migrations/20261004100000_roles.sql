-- =========================================================
-- Roles: some users are administrators
-- =========================================================

-- Only "admin" for now. Add values here when new roles are needed.
create type public.app_role as enum ('admin');

-- ---------------------------------------------------------
-- Table
-- ---------------------------------------------------------

-- A separate table, not a column on authors: authors can update their own row,
-- so a role column there would let anyone make themselves admin.
create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- ---------------------------------------------------------
-- Function used by the policies and by the app (rpc('is_admin'))
-- ---------------------------------------------------------

-- security definer: reads user_roles without depending on its policies.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.user_roles enable row level security;

-- A user can see their own roles.
create policy "Users can read their own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = (select auth.uid()));

-- No insert / update / delete policy: roles are given with SQL (Studio) or the service role.
