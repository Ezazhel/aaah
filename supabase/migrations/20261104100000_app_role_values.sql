-- =========================================================
-- Roles: a member can be an author, an admin, a stock manager (or several)
-- =========================================================

-- Alone in its migration: a new enum value can only be used once its transaction is committed.
alter type public.app_role add value if not exists 'author';
alter type public.app_role add value if not exists 'location_manager';
