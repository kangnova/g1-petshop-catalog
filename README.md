# G1 Petshop — Katalog Digital & Portal Agen

Platform katalog digital untuk **G1 Petshop** berbasis **Next.js (App Router) + Supabase**, dibangun sesuai [prd.md](./prd.md):

- **Pusat informasi produk** — stok & harga real-time untuk pelanggan umum.
- **Portal B2B** — agen/sub-agen punya etalase sendiri dengan harga kustom dan link unik (`/agen/nama-toko`).
- **Broadcast otomatis** — produk baru & perubahan harga dasar otomatis jadi pengumuman untuk semua agen.

## Fitur

| Modul | Fitur |
| :--- | :--- |
| Admin Pusat | CRUD produk + kategori, kelola status stok (`IN_STOCK`/`LOW_STOCK`/`OUT_OF_STOCK`), upload gambar ke Supabase Storage, broadcast pengumuman |
| Agen | Dashboard, custom pricing engine (markup tanpa mengubah harga dasar), toggle tampil/sembunyikan produk, link etalase unik + tombol salin |
| Pengunjung | Pencarian & filter (nama, kategori, stok, rentang harga), halaman detail produk, click-to-WhatsApp |
| Real-time | Supabase Realtime: perubahan stok/harga di pusat otomatis menyegarkan katalog & semua etalase agen |

## Menjalankan (Mode Demo, tanpa Supabase)

```bash
npm install
npm run dev
```

Tanpa konfigurasi apa pun, aplikasi berjalan dengan **data contoh**:

| Akun | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| Juragan G1 | `admin@g1petshop.com` | `admin123` | Admin Pusat |
| Budi Santoso | `budi@g1petshop.com` | `agen123` | Agen (`/agen/budi-petshop`) |
| Siti Rahma | `siti@g1petshop.com` | `agen123` | Agen (`/agen/siti-pet-care`) |

> Catatan: di mode demo, perubahan data hilang saat server restart dan upload gambar dinonaktifkan.

## Setup Produksi (Supabase)

1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan isi `supabase/migrations/0001_init.sql` (tabel, RLS, trigger, realtime, storage bucket).
3. Jalankan `supabase/seed.sql` untuk data contoh + akun demo.
4. Salin `.env.local.example` menjadi `.env.local`, isi:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_WHATSAPP_PUSAT=081234567890
   ```

5. `npm run dev` — login dengan akun demo di atas.

Tips:

- Untuk menjadikan akunmu sendiri sebagai admin:
  `update public.profiles set role = 'admin' where id = '<user-id-kamu>';`
- Jika pendaftaran agen meminta konfirmasi email, matikan **Auth > Sign In / Up > Email > Confirm email** saat development.

## Struktur Penting

```
src/
├── actions/        # Server actions: auth, admin (CRUD + auto-broadcast), agen, upload
├── app/
│   ├── page.tsx                # Katalog publik + search/filter
│   ├── produk/[id]/            # Detail produk (support harga agen via ?agen=slug)
│   ├── agen/[slug]/            # Storefront publik agen
│   ├── login/ & daftar/        # Auth
│   └── dashboard/              # Admin: produk/kategori/pengumuman, Agen: etalase
├── components/     # UI: kartu produk, filter, form, manager etalase, dll.
└── lib/            # types, data layer (Supabase + fallback demo), auth, utils
supabase/
├── migrations/0001_init.sql    # Skema + RLS + realtime + storage
└── seed.sql                    # Data contoh + akun demo
```

## Deployment (Vercel)

1. Push repo ini ke GitHub.
2. Import project di [vercel.com](https://vercel.com/new).
3. Tambahkan environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_WHATSAPP_PUSAT`.
4. Deploy — setiap push ke `main` otomatis ter-deploy.
