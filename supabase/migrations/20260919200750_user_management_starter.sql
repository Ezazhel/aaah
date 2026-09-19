create table authors (
  id uuid not null references auth.users(id),
  avatar_url text,
  description text,
  instagram_url text,
  first_name text,
  last_name text,
  updated_at timestamptz default now(),
  created_at timestamptz default now(),
  member_ship_expired_at timestamptz
);

GRANT SELECT ON public.authors TO anon;
GRANT SELECT, INSERT, UPDATE ON public.authors to authenticated;

alter table authors
  enable row level security;

create policy "Public authors are viewable by everyone." on authors
  for select using (true);

create policy "Users can insert their own authors" on authors
  for insert 
  with check ((select auth.uid()) = id);

create policy "Users can update own profile" on authors
  for update using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Authors can update their own profile" on public.authors
  for update to authenticated using (id = auth.uid());

create function public.handle_new_author()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
    insert into public.authors (id)
    values (new.id);
    return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_author();