# 📄 Product Requirements Document (PRD): G1 Petshop Digital Catalog

---

## 1. Ringkasan Proyek

Membangun platform katalog digital terintegrasi untuk **G1 Petshop**. Platform ini berfungsi sebagai:
1. **Pusat Informasi Produk**: Menyediakan informasi stok, harga, dan detail produk untuk pelanggan umum.
2. **Portal B2B (Business-to-Business)**: Memungkinkan agen/sub-agen menerima update stok secara *real-time* dan membuat etalase (*storefront*) mereka sendiri dengan harga yang sudah dikustomisasi.

---

## 2. User Roles & Persona

* **Admin Pusat (Juragan)**:
  * Mengelola katalog utama (*Master Data*).
  * Memperbarui stok dan menambah produk baru.
  * Memberikan pengumuman/broadcast ke seluruh agen.
* **Agen / Sub-Agen**:
  * Mengakses katalog utama pusat.
  * Mendapatkan notifikasi pembaruan produk.
  * Mengatur margin / harga jual khusus untuk pelanggan mereka sendiri.
* **Pengunjung / Pembeli**:
  * Mencari dan memfilter produk.
  * Melihat informasi detail produk dan ketersediaan stok secara *real-time*.
  * Melihat harga (baik harga standar pusat maupun harga dari etalase agen tertentu).

---

## 3. Fitur Utama (Key Features)

### A. Modul Admin Pusat
* **Master Catalog Management**:
  * CRUD (*Create, Read, Update, Delete*) produk, kategori, dan gambar.
  * Hosting gambar produk via **Supabase Storage**.
* **Real-time Inventory**:
  * Mengubah status stok (`IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`).
  * Perubahan status stok otomatis tersinkronisasi ke seluruh etalase agen.
* **Broadcast Updates**:
  * Sistem notifikasi / pengumuman otomatis kepada agen saat ada produk baru atau perubahan harga dasar.

### B. Modul Agen & Sub-Agen (Reseller Portal)
* **Agent Dashboard**:
  * Halaman khusus setelah login untuk memantau katalog utama pusat.
* **Custom Pricing Engine**:
  * Agen dapat memilih produk dari katalog pusat untuk dimasukkan ke "Etalase Saya".
  * Menentukan nominal harga jual khusus (tanpa mengubah harga asli/dasar dari pusat).
* **Unique Storefront Link**:
  * Agen mendapatkan link khusus (contoh: `g1petshop.com/agen/nama-toko-agen` atau `g1petshop.com/agen-budi`) untuk dibagikan ke pelanggan.
  * Pelanggan yang mengakses link ini melihat harga kustom agen, namun ketersediaan stok tetap merujuk ke data pusat secara *real-time*.

### C. Modul Pengunjung / Pembeli
* **Global Search & Filter**:
  * Pencarian cepat berdasarkan nama produk, kategori (makanan, aksesori, vitamin), ketersediaan stok, dan rentang harga.
* **Product Detail Page**:
  * Menampilkan deskripsi lengkap, spesifikasi, cara pemakaian/perawatan, dan galeri foto produk.

---

## 4. Arsitektur & Tech Stack

* **Frontend & API**:
  * **Next.js (App Router)** — Performa rendering cepat (SSR/SSG/ISR) dan SEO optimal untuk katalog produk.
* **Backend, Auth & Database**:
  * **Supabase**:
    * **PostgreSQL** untuk manajemen relasi data yang kuat.
    * **Supabase Auth** untuk autentikasi dan manajemen sesi Admin/Agen.
    * **Supabase Storage** untuk penyimpanan aset logo dan foto produk.
* **Deployment & Hosting**:
  * **Vercel** — Integrasi CI/CD otomatis dengan Git repository untuk deployment instan dan optimal.

---

## 5. 🗄️ Struktur Database (PostgreSQL / Supabase)

Untuk mengakomodasi fitur *custom price* bagi agen dan manajemen stok terpusat, berikut adalah rancangan skema tabel relasional:

### 1. Table: `profiles`
> Berelasi dengan `auth.users` Supabase untuk menyimpan data tambahan pengguna.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Terhubung ke `auth.users.id` |
| `role` | `VARCHAR` | `admin`, `agent`, atau `sub-agent` |
| `full_name` | `VARCHAR` | Nama lengkap pengguna |
| `store_name` | `VARCHAR` | Nama toko agen (jika role adalah agen) |
| `store_slug` | `VARCHAR` | URL unik untuk etalase agen (misal: `agen-budi`) |
| `phone_number` | `VARCHAR` | Kontak WhatsApp / Telepon |

---

### 2. Table: `categories`
> Menyimpan kategori produk.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | ID unik kategori |
| `name` | `VARCHAR` | Nama kategori (Aksesori, Makanan, Vitamin, dll) |
| `slug` | `VARCHAR` | URL friendly kategori |

---

### 3. Table: `products` (Master Catalog)
> Katalog utama yang dikelola langsung oleh Admin Pusat.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | ID unik produk |
| `category_id` | `UUID` (FK) | Relasi ke tabel `categories.id` |
| `title` | `VARCHAR` | Nama produk |
| `description` | `TEXT` | Deskripsi dan spesifikasi produk |
| `base_price` | `DECIMAL / INT` | Harga dasar / standar dari pusat |
| `stock_status` | `VARCHAR` | `IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK` |
| `image_url` | `TEXT` | URL link gambar dari Supabase Storage |
| `updated_at` | `TIMESTAMP` | Waktu terakhir pembaruan produk |

---

### 4. Table: `agent_catalogs` (Custom Pricing Engine)
> Menyimpan harga kustom yang diatur oleh masing-masing agen.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | ID unik entri |
| `agent_id` | `UUID` (FK) | Relasi ke tabel `profiles.id` (milik agen) |
| `product_id` | `UUID` (FK) | Relasi ke tabel `products.id` |
| `custom_price` | `DECIMAL / INT` | Harga jual yang sudah di-*markup* oleh agen |
| `is_active` | `BOOLEAN` | `true` jika agen ingin menampilkan produk ini di etalasenya |

---

### 5. Table: `product_announcements`
> Memberikan notifikasi pembaruan produk ke agen / sub-agen.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | ID unik pengumuman |
| `product_id` | `UUID` (FK) | Relasi ke produk terkait (opsional) |
| `title` | `VARCHAR` | Judul update (Contoh: *"Stok Kalung Kucing G1 Masuk!"*) |
| `message` | `TEXT` | Pesan detail untuk para agen |
| `created_at` | `TIMESTAMP` | Waktu pengumuman dibuat |

---

## 6. Alur Kerja Sistem (System Workflow)

1. **Sinkronisasi Katalog & Harga Agen**:
   * Saat pembeli mengakses URL agen (contoh: `g1petshop.com/agen-budi`), sistem Next.js melakukan query ke Supabase untuk mengambil data dari tabel `products`.
   * Harga dasar (`base_price`) digantikan dengan `custom_price` dari tabel `agent_catalogs` milik agen Budi.
   * Ketersediaan stok tetap mengambil data *real-time* dari tabel `products` pusat.

---

## 7. Catatan Pengembangan & Next Steps

* **Interaksi Pelanggan / Checkout**:
  * Opsi 1: Integrasi **Click-to-WhatsApp** langsung ke nomor WhatsApp agen/pusat untuk konfirmasi pesanan & pembayaran.
  * Opsi 2: Integrasi **Payment Gateway** & sistem keranjang belanja (cart) pada fase lanjutan.