-- =========================================================
-- Inventory: material (boxes, dice...) stored in several places and lent to authors
-- - stock managers (role location_manager) create their places and manage their stock
--   (one account manages a place; an account can manage several places);
-- - stock managers and admins add items to a shared catalog;
-- - an active author asks to borrow (request) or declares a direct take;
-- - material is lent with no due date: the manager records when it comes back.
-- Requires 20261104100100_members.sql.
-- =========================================================

create type public.loan_status as enum ('pending', 'approved', 'rejected', 'cancelled', 'borrowed', 'returned');
create type public.movement_reason as enum ('adjustment', 'loan', 'return');

-- ---------------------------------------------------------
-- Tables
-- ---------------------------------------------------------

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 120),
  category text check (category is null or length(category) <= 60),
  description text check (description is null or length(description) <= 2000),
  created_by uuid references public.members(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create table public.inventory_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 120),
  address text check (address is null or length(address) <= 300),
  description text check (description is null or length(description) <= 2000),
  -- The only account managing this place. Restrict: hand the place over (admin) before deleting the account.
  manager_id uuid not null references public.members(id) on delete restrict default auth.uid(),
  created_at timestamptz not null default now()
);

create index inventory_locations_manager_id_idx on public.inventory_locations (manager_id);

-- reserved: quantity promised to approved loans not picked up yet.
create table public.inventory_stock (
  location_id uuid not null references public.inventory_locations(id) on delete cascade,
  item_id uuid not null references public.inventory_items(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  available integer generated always as (quantity - reserved) stored,
  updated_at timestamptz not null default now(),
  primary key (location_id, item_id),
  check (reserved <= quantity)
);

create index inventory_stock_item_id_idx on public.inventory_stock (item_id);

create table public.inventory_loans (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.inventory_items(id) on delete restrict,
  location_id uuid not null references public.inventory_locations(id) on delete restrict,
  borrower_id uuid not null references public.members(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  message text check (message is null or length(message) <= 1000),
  status public.loan_status not null,
  decision_note text check (decision_note is null or length(decision_note) <= 1000),
  decided_by uuid references public.members(id) on delete set null,
  decided_at timestamptz,
  borrowed_at timestamptz,
  returned_at timestamptz,
  created_at timestamptz not null default now()
);

create index inventory_loans_location_status_idx on public.inventory_loans (location_id, status);
create index inventory_loans_borrower_id_idx on public.inventory_loans (borrower_id);

create table public.inventory_movements (
  id bigint generated always as identity primary key,
  location_id uuid not null references public.inventory_locations(id) on delete cascade,
  item_id uuid not null references public.inventory_items(id) on delete cascade,
  delta integer not null,
  reason public.movement_reason not null,
  loan_id uuid references public.inventory_loans(id) on delete set null,
  actor_id uuid references public.members(id) on delete set null,
  created_at timestamptz not null default now()
);

create index inventory_movements_location_idx on public.inventory_movements (location_id, created_at desc);

-- ---------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------

create function public.is_location_manager(loc uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.inventory_locations
    where id = loc and manager_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------

alter table public.inventory_items enable row level security;
alter table public.inventory_locations enable row level security;
alter table public.inventory_stock enable row level security;
alter table public.inventory_loans enable row level security;
alter table public.inventory_movements enable row level security;

-- Catalog, places, stock: every member who can sign in.
create policy "Members can read the catalog"
  on public.inventory_items for select
  to authenticated
  using ((select public.can_sign_in()));

create policy "Stock managers and admins add items"
  on public.inventory_items for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and ((select public.has_role('location_manager')) or (select public.is_admin()))
  );

create policy "Item creator and admins update items"
  on public.inventory_items for update
  to authenticated
  using (created_by = (select auth.uid()) or (select public.is_admin()))
  with check (created_by = (select auth.uid()) or (select public.is_admin()));

create policy "Admins delete items"
  on public.inventory_items for delete
  to authenticated
  using ((select public.is_admin()));

create policy "Members can read the places"
  on public.inventory_locations for select
  to authenticated
  using ((select public.can_sign_in()));

-- No admin validation: a stock manager creates their own places, which they manage.
create policy "Stock managers create places"
  on public.inventory_locations for insert
  to authenticated
  with check (
    manager_id = (select auth.uid())
    and (select public.has_role('location_manager'))
  );

-- The manager edits their place but cannot hand it to someone else: only an admin changes manager_id.
create policy "Place managers and admins update places"
  on public.inventory_locations for update
  to authenticated
  using (manager_id = (select auth.uid()) or (select public.is_admin()))
  with check (manager_id = (select auth.uid()) or (select public.is_admin()));

-- Fails while loans reference the place (on delete restrict).
create policy "Place managers and admins delete places"
  on public.inventory_locations for delete
  to authenticated
  using (manager_id = (select auth.uid()) or (select public.is_admin()));

create policy "Members can read the stock"
  on public.inventory_stock for select
  to authenticated
  using ((select public.can_sign_in()));

create policy "Borrowers, place managers and admins read loans"
  on public.inventory_loans for select
  to authenticated
  using (
    borrower_id = (select auth.uid())
    or (select public.is_location_manager(location_id))
    or (select public.is_admin())
  );

create policy "Place managers and admins read movements"
  on public.inventory_movements for select
  to authenticated
  using ((select public.is_location_manager(location_id)) or (select public.is_admin()));

-- Stock, loans and movements are only written by the functions below.

-- ---------------------------------------------------------
-- Functions (security definer: they check the caller themselves)
-- Errors: 42501 = not allowed, P0002 = not found,
--         P0001 with message 'not_enough_stock' / 'invalid_status' / 'reserved_above_quantity'.
-- ---------------------------------------------------------

create function public.inventory_set_stock(p_location uuid, p_item uuid, p_quantity integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_row public.inventory_stock;
begin
  if not (public.is_location_manager(p_location) or public.is_admin()) then
    raise exception 'Only the manager of this place can change its stock' using errcode = '42501';
  end if;
  if p_quantity is null or p_quantity < 0 then
    raise exception 'Quantity must be zero or more' using errcode = '22023';
  end if;

  insert into public.inventory_stock (location_id, item_id)
  values (p_location, p_item)
  on conflict do nothing;

  select * into current_row from public.inventory_stock
  where location_id = p_location and item_id = p_item
  for update;

  if p_quantity < current_row.reserved then
    raise exception 'reserved_above_quantity' using errcode = 'P0001';
  end if;
  if p_quantity = current_row.quantity then
    return;
  end if;

  update public.inventory_stock
  set quantity = p_quantity, updated_at = now()
  where location_id = p_location and item_id = p_item;

  insert into public.inventory_movements (location_id, item_id, delta, reason, actor_id)
  values (p_location, p_item, p_quantity - current_row.quantity, 'adjustment', auth.uid());
end;
$$;

-- Locks the stock row and checks the available quantity.
create function public.inventory_lock_available(p_location uuid, p_item uuid, p_quantity integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_available integer;
begin
  select available into current_available from public.inventory_stock
  where location_id = p_location and item_id = p_item
  for update;

  if current_available is null or current_available < p_quantity then
    raise exception 'not_enough_stock' using errcode = 'P0001';
  end if;
end;
$$;

create function public.inventory_request_loan(p_item uuid, p_location uuid, p_quantity integer, p_message text default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  loan_id uuid;
begin
  if not public.is_active_author() then
    raise exception 'Only active authors can borrow material' using errcode = '42501';
  end if;
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Quantity must be positive' using errcode = '22023';
  end if;

  perform public.inventory_lock_available(p_location, p_item, p_quantity);

  insert into public.inventory_loans (item_id, location_id, borrower_id, quantity, message, status)
  values (p_item, p_location, auth.uid(), p_quantity, nullif(trim(p_message), ''), 'pending')
  returning id into loan_id;

  return loan_id;
end;
$$;

-- Direct take: the author already has the material.
create function public.inventory_declare_borrow(p_item uuid, p_location uuid, p_quantity integer, p_message text default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  loan_id uuid;
begin
  if not public.is_active_author() then
    raise exception 'Only active authors can borrow material' using errcode = '42501';
  end if;
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Quantity must be positive' using errcode = '22023';
  end if;

  perform public.inventory_lock_available(p_location, p_item, p_quantity);

  update public.inventory_stock
  set quantity = quantity - p_quantity, updated_at = now()
  where location_id = p_location and item_id = p_item;

  insert into public.inventory_loans (item_id, location_id, borrower_id, quantity, message, status, borrowed_at)
  values (p_item, p_location, auth.uid(), p_quantity, nullif(trim(p_message), ''), 'borrowed', now())
  returning id into loan_id;

  insert into public.inventory_movements (location_id, item_id, delta, reason, loan_id, actor_id)
  values (p_location, p_item, -p_quantity, 'loan', loan_id, auth.uid());

  return loan_id;
end;
$$;

-- Locks a loan and checks the caller manages its place.
create function public.inventory_lock_managed_loan(p_loan uuid)
returns public.inventory_loans
language plpgsql
security definer
set search_path = ''
as $$
declare
  loan public.inventory_loans;
begin
  select * into loan from public.inventory_loans where id = p_loan for update;
  if not found then
    raise exception 'Loan not found' using errcode = 'P0002';
  end if;
  if not (public.is_location_manager(loan.location_id) or public.is_admin()) then
    raise exception 'Only the manager of this place can handle this loan' using errcode = '42501';
  end if;
  return loan;
end;
$$;

create function public.inventory_decide_loan(p_loan uuid, p_approve boolean, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  loan public.inventory_loans;
begin
  loan := public.inventory_lock_managed_loan(p_loan);
  if loan.status <> 'pending' then
    raise exception 'invalid_status' using errcode = 'P0001';
  end if;

  if p_approve then
    perform public.inventory_lock_available(loan.location_id, loan.item_id, loan.quantity);
    update public.inventory_stock
    set reserved = reserved + loan.quantity, updated_at = now()
    where location_id = loan.location_id and item_id = loan.item_id;
  end if;

  update public.inventory_loans
  set status = case when p_approve then 'approved'::public.loan_status else 'rejected'::public.loan_status end,
      decision_note = nullif(trim(p_note), ''),
      decided_by = auth.uid(),
      decided_at = now()
  where id = p_loan;
end;
$$;

-- The author picked up the approved material.
create function public.inventory_mark_borrowed(p_loan uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  loan public.inventory_loans;
begin
  loan := public.inventory_lock_managed_loan(p_loan);
  if loan.status <> 'approved' then
    raise exception 'invalid_status' using errcode = 'P0001';
  end if;

  update public.inventory_stock
  set reserved = reserved - loan.quantity,
      quantity = quantity - loan.quantity,
      updated_at = now()
  where location_id = loan.location_id and item_id = loan.item_id;

  update public.inventory_loans
  set status = 'borrowed', borrowed_at = now()
  where id = p_loan;

  insert into public.inventory_movements (location_id, item_id, delta, reason, loan_id, actor_id)
  values (loan.location_id, loan.item_id, -loan.quantity, 'loan', p_loan, auth.uid());
end;
$$;

-- The material came back.
create function public.inventory_mark_returned(p_loan uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  loan public.inventory_loans;
begin
  loan := public.inventory_lock_managed_loan(p_loan);
  if loan.status <> 'borrowed' then
    raise exception 'invalid_status' using errcode = 'P0001';
  end if;

  insert into public.inventory_stock (location_id, item_id)
  values (loan.location_id, loan.item_id)
  on conflict do nothing;

  update public.inventory_stock
  set quantity = quantity + loan.quantity, updated_at = now()
  where location_id = loan.location_id and item_id = loan.item_id;

  update public.inventory_loans
  set status = 'returned', returned_at = now()
  where id = p_loan;

  insert into public.inventory_movements (location_id, item_id, delta, reason, loan_id, actor_id)
  values (loan.location_id, loan.item_id, loan.quantity, 'return', p_loan, auth.uid());
end;
$$;

-- The borrower cancels a request that is not picked up yet.
create function public.inventory_cancel_loan(p_loan uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  loan public.inventory_loans;
begin
  select * into loan from public.inventory_loans where id = p_loan for update;
  if not found or loan.borrower_id <> auth.uid() then
    raise exception 'Loan not found' using errcode = 'P0002';
  end if;
  if loan.status not in ('pending', 'approved') then
    raise exception 'invalid_status' using errcode = 'P0001';
  end if;

  if loan.status = 'approved' then
    update public.inventory_stock
    set reserved = reserved - loan.quantity, updated_at = now()
    where location_id = loan.location_id and item_id = loan.item_id;
  end if;

  update public.inventory_loans set status = 'cancelled' where id = p_loan;
end;
$$;

-- Service role only (emails): who to notify about a loan.
create function public.inventory_notify_targets(p_loan uuid)
returns table (target text, email text)
language sql
stable
security definer
set search_path = ''
as $$
  select 'manager', users.email::text
  from public.inventory_loans
  join public.inventory_locations on inventory_locations.id = inventory_loans.location_id
  join auth.users on users.id = inventory_locations.manager_id
  where inventory_loans.id = p_loan
  union all
  select 'borrower', users.email::text
  from public.inventory_loans
  join auth.users on users.id = inventory_loans.borrower_id
  where inventory_loans.id = p_loan;
$$;

-- ---------------------------------------------------------
-- Grants
-- ---------------------------------------------------------

revoke execute on function public.inventory_lock_available(uuid, uuid, integer) from public, anon, authenticated;
revoke execute on function public.inventory_lock_managed_loan(uuid) from public, anon, authenticated;
revoke execute on function public.inventory_notify_targets(uuid) from public, anon, authenticated;
grant execute on function public.inventory_notify_targets(uuid) to service_role;

revoke execute on function public.inventory_set_stock(uuid, uuid, integer) from public, anon;
revoke execute on function public.inventory_request_loan(uuid, uuid, integer, text) from public, anon;
revoke execute on function public.inventory_declare_borrow(uuid, uuid, integer, text) from public, anon;
revoke execute on function public.inventory_decide_loan(uuid, boolean, text) from public, anon;
revoke execute on function public.inventory_mark_borrowed(uuid) from public, anon;
revoke execute on function public.inventory_mark_returned(uuid) from public, anon;
revoke execute on function public.inventory_cancel_loan(uuid) from public, anon;
