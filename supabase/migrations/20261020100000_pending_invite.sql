-- =========================================================
-- Login page: resend the invitation to an invited user who never clicked the link
-- =========================================================

-- With sign-ups disabled, a magic link for an unconfirmed (invited) user is
-- refused ("Signups not allowed"). The login action then resends the invitation,
-- but only if the user really exists: inviting an unknown address would create an account.
-- Service role only: true if an unconfirmed user has this email.
create function public.is_pending_invite(p_email text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from auth.users
    where lower(email) = lower(trim(p_email))
      and email_confirmed_at is null
  );
$$;

revoke execute on function public.is_pending_invite(text) from public, anon, authenticated;
grant execute on function public.is_pending_invite(text) to service_role;
