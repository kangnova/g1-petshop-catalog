-- ============================================================
-- G1 Petshop Digital Catalog — Skema awal sesuai PRD
-- Jalankan di Supabase SQL Editor (urutan: migration ini, lalu seed.sql)
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1) profiles — data tambahan pengguna (terhubung auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'agent' check (role in ('admin', 'agent', 'sub-agent')),
  full_name text,
  store_name text,
  store_slug text unique,
  phone_number text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2) categories
-- ------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3) products — master katalog pusat
-- ------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  title text not null,
  description text,
  base_price numeric not null default 0 check (base_price >= 0),
  stock_status text not null default 'IN_STOCK' check (stock_status in ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK')),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_updated_at_idx on public.products (updated_at desc);

-- ------------------------------------------------------------
-- 4) agent_catalogs — custom pricing engine per agen
-- ------------------------------------------------------------
create table if not exists public.agent_catalogs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  custom_price numeric not null check (custom_price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (agent_id, product_id)
);

create index if not exists agent_catalogs_agent_id_idx on public.agent_catalogs (agent_id);

-- ------------------------------------------------------------
-- 5) product_announcements — broadcast ke agen
-- ------------------------------------------------------------
create table if not exists public.product_announcements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete set null,
  title text not null,
  message text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Trigger: updated_at otomatis
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Helper: cek role (security definer agar tembus RLS)
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_agent()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('agent', 'sub-agent'));
$$;

-- ------------------------------------------------------------
-- Trigger: buat profile otomatis saat user mendaftar
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, full_name, store_name, store_slug, phone_number)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'agent'),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'store_name',
    new.raw_user_meta_data ->> 'store_slug',
    new.raw_user_meta_data ->> 'phone_number'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.agent_catalogs enable row level security;
alter table public.product_announcements enable row level security;

-- profiles: dibaca publik (untuk halaman storefront), kelola milik sendiri
drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read" on public.profiles
  for select using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- categories: baca publik, tulis admin
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- products: baca publik, tulis admin
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- announcements: baca publik, tulis admin
drop policy if exists "announcements_public_read" on public.product_announcements;
create policy "announcements_public_read" on public.product_announcements
  for select using (true);

drop policy if exists "announcements_admin_write" on public.product_announcements;
create policy "announcements_admin_write" on public.product_announcements
  for all using (public.is_admin()) with check (public.is_admin());

-- agent_catalogs: baca publik (storefront), tulis hanya oleh agen pemilik
drop policy if exists "agent_catalogs_public_read" on public.agent_catalogs;
create policy "agent_catalogs_public_read" on public.agent_catalogs
  for select using (true);

drop policy if exists "agent_catalogs_insert_own" on public.agent_catalogs;
create policy "agent_catalogs_insert_own" on public.agent_catalogs
  for insert with check (auth.uid() = agent_id);

drop policy if exists "agent_catalogs_update_own" on public.agent_catalogs;
create policy "agent_catalogs_update_own" on public.agent_catalogs
  for update using (auth.uid() = agent_id) with check (auth.uid() = agent_id);

drop policy if exists "agent_catalogs_delete_own" on public.agent_catalogs;
create policy "agent_catalogs_delete_own" on public.agent_catalogs
  for delete using (auth.uid() = agent_id);

-- ------------------------------------------------------------
-- Realtime: stok & pengumuman tersinkron ke semua halaman
-- ------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.products;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.product_announcements;
exception when duplicate_object then null;
end $$;

-- ------------------------------------------------------------
-- Storage: bucket publik untuk gambar produk
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_insert" on storage.objects;
create policy "product_images_admin_insert" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_update" on storage.objects;
create policy "product_images_admin_update" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_delete" on storage.objects;
create policy "product_images_admin_delete" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());
