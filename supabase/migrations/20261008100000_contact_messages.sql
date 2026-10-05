-- =========================================================
-- Contact form: history of the messages, used for rate limiting
-- =========================================================

-- Written by the contact server action with the secret key only.
-- The IP is not stored: only a salted hash, to count the messages per sender.
create table public.contact_messages (
  id bigint generated always as identity primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index contact_messages_ip_hash_created_at on public.contact_messages (ip_hash, created_at desc);

-- RLS without policy: no access with the anon / authenticated keys.
alter table public.contact_messages enable row level security;
