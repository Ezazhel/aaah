-- =========================================================
-- Editing a rejected game resubmits it, whoever edits it
-- =========================================================

-- Before: admins could set any status, so an admin editing a rejected game
-- (e.g. as one of its authors) kept it rejected.
-- Now admins only change the status with an explicit decision (game_reviews trigger,
-- or an update that changes the status). Any other edit of a rejected game sets it back to pending.
create or replace function public.protect_game_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- No user (SQL editor, service role): no rule.
  if (select auth.uid()) is null then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if not public.is_admin() then
      new.status := 'pending';
    end if;
    return new;
  end if;

  -- Explicit decision of an admin.
  if new.status is distinct from old.status and public.is_admin() then
    return new;
  end if;

  -- Content edit: the status is kept, a rejected game is resubmitted.
  if old.status = 'rejected' then
    new.status := 'pending';
  else
    new.status := old.status;
  end if;

  return new;
end;
$$;
