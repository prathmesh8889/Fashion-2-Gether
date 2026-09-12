create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price integer not null check (price >= 0),
  old_price integer check (old_price is null or old_price >= 0),
  image text not null,
  badge text,
  description text,
  sizes text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.reels (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  cover text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  size text,
  note text,
  product_id text,
  product_name text not null,
  amount integer,
  status text not null default 'New' check (status in ('New','Contacted','Confirmed','Closed')),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.reels enable row level security;
alter table public.orders enable row level security;

create or replace function public.is_f2g_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

revoke all on function public.is_f2g_admin() from public;
grant execute on function public.is_f2g_admin() to authenticated;

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products
for select to anon, authenticated
using (active = true);

drop policy if exists "admin manage products" on public.products;
create policy "admin manage products" on public.products
for all to authenticated
using (public.is_f2g_admin())
with check (public.is_f2g_admin());

drop policy if exists "public read active reels" on public.reels;
create policy "public read active reels" on public.reels
for select to anon, authenticated
using (active = true);

drop policy if exists "admin manage reels" on public.reels;
create policy "admin manage reels" on public.reels
for all to authenticated
using (public.is_f2g_admin())
with check (public.is_f2g_admin());

drop policy if exists "public create enquiry" on public.orders;
create policy "public create enquiry" on public.orders
for insert to anon, authenticated
with check (status = 'New');

drop policy if exists "admin read enquiries" on public.orders;
create policy "admin read enquiries" on public.orders
for select to authenticated
using (public.is_f2g_admin());

drop policy if exists "admin update enquiries" on public.orders;
create policy "admin update enquiries" on public.orders
for update to authenticated
using (public.is_f2g_admin())
with check (public.is_f2g_admin());

grant select on public.products, public.reels to anon, authenticated;
grant insert on public.orders to anon, authenticated;
grant select, insert, update, delete on public.products, public.reels to authenticated;
grant select, update on public.orders to authenticated;

-- After creating the admin Auth user, set app_metadata.role = 'admin'
-- using a trusted server/Admin API or the Supabase dashboard. Never expose service-role keys in the browser.
