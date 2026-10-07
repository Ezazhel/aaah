-- =========================================================
-- Author avatars: public "avatars" bucket, one folder per author
-- avatars/{author_id}/sm (256px) and lg (512px), resized in the browser
-- =========================================================

-- Public read. Server-side safety net: WebP (JPEG when the browser cannot encode WebP), 1 MB max.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 1048576, array['image/webp', 'image/jpeg']);

-- ---------------------------------------------------------
-- Policies: an author only writes in the folder named after their id
-- ---------------------------------------------------------

-- Needed by upsert (it reads the existing file before overwriting it).
create policy "Authors can read their own avatar files" on storage.objects
  for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Authors can upload their own avatar" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Authors can replace their own avatar" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Authors can delete their own avatar" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ---------------------------------------------------------
-- authors: the file paths never change, only the version does
-- ---------------------------------------------------------

-- avatar_url was never filled. The URL is now built from the author id,
-- and avatar_updated_at (null = no avatar) busts the browser cache when the picture changes.
alter table public.authors
  drop column avatar_url,
  add column avatar_updated_at timestamptz;
