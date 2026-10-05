-- =========================================================
-- HelloAsso: a paid membership invites the member and activates their membership
-- =========================================================

-- Requires the membership migration (public.current_membership_period()).

-- Orders already processed by the webhook (HelloAsso can send the same notification twice).
-- RLS without policy: only the service role (webhook) reads and writes it.
create table public.helloasso_orders (
  order_id bigint primary key,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.helloasso_orders enable row level security;

-- Service role only: activate the membership of a user until the end of the current period.
-- Fills the first / last name if the author has none yet. Never shortens a later expiration date.
-- Returns the new expiration date, or null if no user has this email.
create function public.helloasso_grant_membership(p_email text, p_first_name text, p_last_name text)
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
  -- Last second of the period in the association's time zone.
  expires_at := ((period.ends_on + 1)::timestamp at time zone 'Europe/Paris') - interval '1 second';

  update public.authors
  set member_ship_expired_at = greatest(member_ship_expired_at, expires_at),
      first_name = coalesce(nullif(first_name, ''), nullif(trim(p_first_name), '')),
      last_name = coalesce(nullif(last_name, ''), nullif(trim(p_last_name), ''))
  where id = target
  returning member_ship_expired_at into expires_at;

  if not found then
    raise exception 'Author not found' using errcode = 'P0002';
  end if;

  return expires_at;
end;
$$;

revoke execute on function public.helloasso_grant_membership(text, text, text) from public, anon, authenticated;
grant execute on function public.helloasso_grant_membership(text, text, text) to service_role;
