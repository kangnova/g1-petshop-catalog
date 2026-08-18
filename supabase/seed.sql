-- ============================================================
-- G1 Petshop — Data contoh (seed)
-- Jalankan SETELAH 0001_init.sql di Supabase SQL Editor.
--
-- Akun demo:
--   admin@g1petshop.com / admin123  -> Admin Pusat (Juragan G1)
--   budi@g1petshop.com  / agen123   -> Agen "Budi Petshop"  (/agen/budi-petshop)
--   siti@g1petshop.com  / agen123   -> Agen "Siti Pet Care" (/agen/siti-pet-care)
-- ============================================================

-- ------------------------------------------------------------
-- 1) User auth (password di-hash dengan pgcrypto)
-- ------------------------------------------------------------
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
   confirmation_token, recovery_token)
select
  '00000000-0000-0000-0000-000000000000',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  'authenticated',
  'authenticated',
  'admin@g1petshop.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin","full_name":"Juragan G1"}',
  now(), now(), '', ''
where not exists (select 1 from auth.users where email = 'admin@g1petshop.com');

insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
   confirmation_token, recovery_token)
select
  '00000000-0000-0000-0000-000000000000',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
  'authenticated',
  'authenticated',
  'budi@g1petshop.com',
  crypt('agen123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"agent","full_name":"Budi Santoso","store_name":"Budi Petshop","store_slug":"budi-petshop","phone_number":"081298765432"}',
  now(), now(), '', ''
where not exists (select 1 from auth.users where email = 'budi@g1petshop.com');

insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
   confirmation_token, recovery_token)
select
  '00000000-0000-0000-0000-000000000000',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
  'authenticated',
  'authenticated',
  'siti@g1petshop.com',
  crypt('agen123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"agent","full_name":"Siti Rahma","store_name":"Siti Pet Care","store_slug":"siti-pet-care","phone_number":"081311223344"}',
  now(), now(), '', ''
where not exists (select 1 from auth.users where email = 'siti@g1petshop.com');

-- Identitas login email (dibutuhkan GoTrue sejak Supabase Auth v2)
insert into auth.identities
  (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), u.id,
       jsonb_build_object('sub', u.id::text, 'email', u.email),
       'email', u.id::text, now(), now(), now()
from auth.users u
where u.email in ('admin@g1petshop.com', 'budi@g1petshop.com', 'siti@g1petshop.com')
  and not exists (
    select 1 from auth.identities i
    where i.user_id = u.id and i.provider = 'email'
  );

-- ------------------------------------------------------------
-- 2) Profiles
-- ------------------------------------------------------------
insert into public.profiles (id, role, full_name, store_name, store_slug, phone_number) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'admin', 'Juragan G1', null, null, '081234567890'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'agent', 'Budi Santoso', 'Budi Petshop', 'budi-petshop', '081298765432'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'agent', 'Siti Rahma', 'Siti Pet Care', 'siti-pet-care', '081311223344')
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 3) Categories
-- ------------------------------------------------------------
insert into public.categories (id, name, slug) values
  ('9c000000-0000-4000-8000-000000000001', 'Makanan', 'makanan'),
  ('9c000000-0000-4000-8000-000000000002', 'Vitamin', 'vitamin'),
  ('9c000000-0000-4000-8000-000000000003', 'Aksesori', 'aksesori'),
  ('9c000000-0000-4000-8000-000000000004', 'Perawatan', 'perawatan')
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- 4) Products (master katalog pusat)
-- ------------------------------------------------------------
insert into public.products (id, category_id, title, description, base_price, stock_status, image_url, updated_at) values
  ('90000000-0000-4000-8000-000000000001',
   '9c000000-0000-4000-8000-000000000001',
   'Royal Food Kucing Dewasa 1.2kg',
   E'Makanan kering premium untuk kucing dewasa usia 1-7 tahun.\n\nSpesifikasi:\n- Protein 32%, lemak 15%\n- Omega 3 & 6 untuk bulu sehat\n- Tanpa pewarna buatan\n\nCara pemakaian: berikan 40-60 gram per hari, sesuaikan dengan aktivitas kucing.',
   85000, 'IN_STOCK', 'https://picsum.photos/seed/g1-product-1/800/800', now() - interval '1 day'),
  ('90000000-0000-4000-8000-000000000002',
   '9c000000-0000-4000-8000-000000000001',
   'Whiskas Junior Ocean Fish 1.1kg',
   'Makanan kering anak kucing rasa ikan laut, kaya DHA untuk tumbuh kembang optimal usia 2-12 bulan.',
   48000, 'IN_STOCK', 'https://picsum.photos/seed/g1-product-2/800/800', now() - interval '2 days'),
  ('90000000-0000-4000-8000-000000000003',
   '9c000000-0000-4000-8000-000000000002',
   'Vitamin Bulu & Kulit Kucing 30ml',
   'Suplemen minyak ikan untuk bulu lebat dan kulit sehat. Dosis: 1-2 tetes dicampur makanan, sekali sehari.',
   35000, 'LOW_STOCK', 'https://picsum.photos/seed/g1-product-3/800/800', now() - interval '3 days'),
  ('90000000-0000-4000-8000-000000000004',
   '9c000000-0000-4000-8000-000000000002',
   'Obat Tetes Kutu 10ml',
   'Obat tetes tengkuk untuk membasmi kutu dan pinjal pada kucing. Efektif hingga 30 hari. Jangan dipakai pada anak kucing di bawah 8 minggu.',
   62000, 'IN_STOCK', 'https://picsum.photos/seed/g1-product-4/800/800', now() - interval '4 days'),
  ('90000000-0000-4000-8000-000000000005',
   '9c000000-0000-4000-8000-000000000003',
   'Kalung Kucing G1 Premium',
   'Kalung kucing bahan nilon lembut dengan lonceng dan gesper pengaman (breakaway). Tersedia berbagai warna.',
   25000, 'IN_STOCK', 'https://picsum.photos/seed/g1-product-5/800/800', now() - interval '1 day'),
  ('90000000-0000-4000-8000-000000000006',
   '9c000000-0000-4000-8000-000000000003',
   'Mangkuk Makan Stainless Anti Slip',
   'Mangkuk makan stainless steel dengan alas karet anti slip. Mudah dibersihkan, aman untuk mesin pencuci piring.',
   32000, 'IN_STOCK', 'https://picsum.photos/seed/g1-product-6/800/800', now() - interval '6 days'),
  ('90000000-0000-4000-8000-000000000007',
   '9c000000-0000-4000-8000-000000000004',
   'Pasir Kucing Tofu 6L',
   'Pasir kucing berbahan tofu, menggumpal cepat, rendah debu, dan bisa dibuang ke toilet. Aroma green tea.',
   55000, 'LOW_STOCK', 'https://picsum.photos/seed/g1-product-7/800/800', now() - interval '2 days'),
  ('90000000-0000-4000-8000-000000000008',
   '9c000000-0000-4000-8000-000000000004',
   'Shampoo Kucing Lembut 250ml',
   'Shampoo khusus kucing dengan pH seimbang, aroma lembut, dan tidak pedih di mata. Cocok untuk pemakaian mingguan.',
   28000, 'IN_STOCK', 'https://picsum.photos/seed/g1-product-8/800/800', now() - interval '8 days'),
  ('90000000-0000-4000-8000-000000000009',
   '9c000000-0000-4000-8000-000000000003',
   'Mainan Tongkat Bulu Warna-warni',
   'Mainan interaktif tongkat dengan ujung bulu sintetis. Melatih insting berburu dan menjaga kucing tetap aktif.',
   18000, 'OUT_OF_STOCK', 'https://picsum.photos/seed/g1-product-9/800/800', now() - interval '10 days'),
  ('90000000-0000-4000-8000-000000000010',
   '9c000000-0000-4000-8000-000000000003',
   'Dog Leash Reflektif 1.5m',
   'Tali jalan anjing dengan jahitan reflektif, nyaman digenggam, cocok untuk jalan sore maupun malam hari.',
   45000, 'IN_STOCK', 'https://picsum.photos/seed/g1-product-10/800/800', now() - interval '5 days')
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 5) Agent catalogs (harga kustom tiap agen)
-- ------------------------------------------------------------
insert into public.agent_catalogs (id, agent_id, product_id, custom_price, is_active) values
  ('91000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '90000000-0000-4000-8000-000000000001', 95000, true),
  ('91000000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '90000000-0000-4000-8000-000000000002', 55000, true),
  ('91000000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '90000000-0000-4000-8000-000000000003', 42000, true),
  ('91000000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '90000000-0000-4000-8000-000000000005', 32000, true),
  ('91000000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '90000000-0000-4000-8000-000000000007', 63000, true),
  ('91000000-0000-4000-8000-000000000006', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', '90000000-0000-4000-8000-000000000001', 92000, true),
  ('91000000-0000-4000-8000-000000000007', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', '90000000-0000-4000-8000-000000000004', 70000, true),
  ('91000000-0000-4000-8000-000000000008', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', '90000000-0000-4000-8000-000000000006', 40000, true),
  ('91000000-0000-4000-8000-000000000009', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', '90000000-0000-4000-8000-000000000008', 35000, true),
  ('91000000-0000-4000-8000-000000000010', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', '90000000-0000-4000-8000-000000000009', 25000, false)
on conflict (agent_id, product_id) do nothing;

-- ------------------------------------------------------------
-- 6) Announcements
-- ------------------------------------------------------------
insert into public.product_announcements (id, product_id, title, message, created_at) values
  ('92000000-0000-4000-8000-000000000001',
   '90000000-0000-4000-8000-000000000005',
   'Stok Kalung Kucing G1 Masuk!',
   'Restock kalung kucing G1 premium sudah tiba di gudang pusat. Silakan perbarui etalase kalian dan kabari pelanggan setia.',
   now() - interval '1 day'),
  ('92000000-0000-4000-8000-000000000002',
   '90000000-0000-4000-8000-000000000001',
   'Penyesuaian Harga Dasar Makanan Kucing',
   'Mulai minggu ini harga dasar Royal Food Kucing Dewasa 1.2kg disesuaikan menjadi Rp85.000. Mohon cek kembali margin etalase masing-masing.',
   now() - interval '3 days')
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- (Opsional) Promosikan akun kamu sendiri jadi admin:
-- update public.profiles set role = 'admin' where id = '<user-id-kamu>';
-- ------------------------------------------------------------
