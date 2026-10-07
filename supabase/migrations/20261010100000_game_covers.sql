-- =========================================================
-- Game covers: public "game-covers" bucket, one folder per game
-- game-covers/{game_id}/sm (800px) and lg (1200px), resized in the browser, never cropped
-- =========================================================

-- Public read. Server-side safety net: WebP (JPEG when the browser cannot encode WebP), 2 MB max.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('game-covers', 'game-covers', true, 2097152, array['image/webp', 'image/jpeg']);

-- ---------------------------------------------------------
-- Same rule as the games update policy: an active member who is an author of the game
-- named by the first folder of the path.
-- ---------------------------------------------------------

create function public.can_edit_game_files(object_name text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select public.is_active_member()
    and exists (
      select 1 from public.game_authors
      where game_authors.game_id::text = (storage.foldername(object_name))[1]
        and game_authors.author_id = auth.uid()
    );
$$;

-- Needed by upsert (it reads the existing file before overwriting it).
create policy "Game authors can read their game cover files" on storage.objects
  for select to authenticated
  using (bucket_id = 'game-covers' and public.can_edit_game_files(name));

create policy "Game authors can upload a cover" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'game-covers' and public.can_edit_game_files(name));

create policy "Game authors can replace a cover" on storage.objects
  for update to authenticated
  using (bucket_id = 'game-covers' and public.can_edit_game_files(name))
  with check (bucket_id = 'game-covers' and public.can_edit_game_files(name));

create policy "Game authors can delete a cover" on storage.objects
  for delete to authenticated
  using (bucket_id = 'game-covers' and public.can_edit_game_files(name));

-- ---------------------------------------------------------
-- games: the file paths never change, only the version does (null = no cover)
-- ---------------------------------------------------------

alter table public.games
  add column cover_updated_at timestamptz;
