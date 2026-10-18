-- =========================================================
-- Game rules: a YouTube/Vimeo video link and a PDF
-- game-rules/{game_id}/rules.pdf, a new version overwrites the previous one
-- =========================================================

-- Public read. Server-side safety net: PDF only, 10 MB max.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('game-rules', 'game-rules', true, 10485760, array['application/pdf']);

-- ---------------------------------------------------------
-- Same rule as the covers: an active member who is an author of the game
-- named by the first folder of the path (can_edit_game_files).
-- ---------------------------------------------------------

-- Needed by upsert (it reads the existing file before overwriting it).
create policy "Game authors can read their game rules files" on storage.objects
  for select to authenticated
  using (bucket_id = 'game-rules' and public.can_edit_game_files(name));

create policy "Game authors can upload rules" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'game-rules' and public.can_edit_game_files(name));

create policy "Game authors can replace rules" on storage.objects
  for update to authenticated
  using (bucket_id = 'game-rules' and public.can_edit_game_files(name))
  with check (bucket_id = 'game-rules' and public.can_edit_game_files(name));

create policy "Game authors can delete rules" on storage.objects
  for delete to authenticated
  using (bucket_id = 'game-rules' and public.can_edit_game_files(name));

-- ---------------------------------------------------------
-- games: the video link (checked in the app: YouTube or Vimeo),
-- and the version of the PDF (null = no PDF), like cover_updated_at
-- ---------------------------------------------------------

alter table public.games
  add column rules_video_url text check (rules_video_url ~ '^https://' and length(rules_video_url) <= 300),
  add column rules_updated_at timestamptz;
