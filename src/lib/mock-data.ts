import type {
  AgentCatalogItem,
  Announcement,
  Category,
  Product,
  Profile,
} from "@/lib/types";

export const DEMO_ADMIN_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1";
export const DEMO_BUDI_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2";
export const DEMO_SITI_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3";

export interface DemoUser {
  id: string;
  email: string;
  password: string;
}

export const demoUsers: DemoUser[] = [
  { id: DEMO_ADMIN_ID, email: "admin@g1petshop.com", password: "admin123" },
  { id: DEMO_BUDI_ID, email: "budi@g1petshop.com", password: "agen123" },
  { id: DEMO_SITI_ID, email: "siti@g1petshop.com", password: "agen123" },
];

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

export const demoDb = {
  profiles: [
    {
      id: DEMO_ADMIN_ID,
      role: "admin",
      full_name: "Juragan G1",
      store_name: null,
      store_slug: null,
      phone_number: "081234567890",
    },
    {
      id: DEMO_BUDI_ID,
      role: "agent",
      full_name: "Budi Santoso",
      store_name: "Budi Petshop",
      store_slug: "budi-petshop",
      phone_number: "081298765432",
    },
    {
      id: DEMO_SITI_ID,
      role: "agent",
      full_name: "Siti Rahma",
      store_name: "Siti Pet Care",
      store_slug: "siti-pet-care",
      phone_number: "081311223344",
    },
  ] as Profile[],

  categories: [
    {
      id: "9c000000-0000-4000-8000-000000000001",
      name: "Makanan",
      slug: "makanan",
    },
    {
      id: "9c000000-0000-4000-8000-000000000002",
      name: "Vitamin",
      slug: "vitamin",
    },
    {
      id: "9c000000-0000-4000-8000-000000000003",
      name: "Aksesori",
      slug: "aksesori",
    },
    {
      id: "9c000000-0000-4000-8000-000000000004",
      name: "Perawatan",
      slug: "perawatan",
    },
  ] as Category[],

  products: [
    {
      id: "90000000-0000-4000-8000-000000000001",
      category_id: "9c000000-0000-4000-8000-000000000001",
      title: "Royal Food Kucing Dewasa 1.2kg",
      description:
        "Makanan kering premium untuk kucing dewasa usia 1-7 tahun.\n\nSpesifikasi:\n- Protein 32%, lemak 15%\n- Omega 3 & 6 untuk bulu sehat\n- Tanpa pewarna buatan\n\nCara pemakaian: berikan 40-60 gram per hari, sesuaikan dengan aktivitas kucing.",
      base_price: 85000,
      stock_status: "IN_STOCK",
      image_url: "https://picsum.photos/seed/g1-product-1/800/800",
      updated_at: daysAgo(1),
    },
    {
      id: "90000000-0000-4000-8000-000000000002",
      category_id: "9c000000-0000-4000-8000-000000000001",
      title: "Whiskas Junior Ocean Fish 1.1kg",
      description:
        "Makanan kering anak kucing rasa ikan laut, kaya DHA untuk tumbuh kembang optimal usia 2-12 bulan.",
      base_price: 48000,
      stock_status: "IN_STOCK",
      image_url: "https://picsum.photos/seed/g1-product-2/800/800",
      updated_at: daysAgo(2),
    },
    {
      id: "90000000-0000-4000-8000-000000000003",
      category_id: "9c000000-0000-4000-8000-000000000002",
      title: "Vitamin Bulu & Kulit Kucing 30ml",
      description:
        "Suplemen minyak ikan untuk bulu lebat dan kulit sehat. Dosis: 1-2 tetes dicampur makanan, sekali sehari.",
      base_price: 35000,
      stock_status: "LOW_STOCK",
      image_url: "https://picsum.photos/seed/g1-product-3/800/800",
      updated_at: daysAgo(3),
    },
    {
      id: "90000000-0000-4000-8000-000000000004",
      category_id: "9c000000-0000-4000-8000-000000000002",
      title: "Obat Tetes Kutu 10ml",
      description:
        "Obat tetes tengkuk untuk membasmi kutu dan pinjal pada kucing. Efektif hingga 30 hari. Jangan dipakai pada anak kucing di bawah 8 minggu.",
      base_price: 62000,
      stock_status: "IN_STOCK",
      image_url: "https://picsum.photos/seed/g1-product-4/800/800",
      updated_at: daysAgo(4),
    },
    {
      id: "90000000-0000-4000-8000-000000000005",
      category_id: "9c000000-0000-4000-8000-000000000003",
      title: "Kalung Kucing G1 Premium",
      description:
        "Kalung kucing bahan nilon lembut dengan lonceng dan gesper pengaman (breakaway). Tersedia berbagai warna.",
      base_price: 25000,
      stock_status: "IN_STOCK",
      image_url: "https://picsum.photos/seed/g1-product-5/800/800",
      updated_at: daysAgo(1),
    },
    {
      id: "90000000-0000-4000-8000-000000000006",
      category_id: "9c000000-0000-4000-8000-000000000003",
      title: "Mangkuk Makan Stainless Anti Slip",
      description:
        "Mangkuk makan stainless steel dengan alas karet anti slip. Mudah dibersihkan, aman untuk mesin pencuci piring.",
      base_price: 32000,
      stock_status: "IN_STOCK",
      image_url: "https://picsum.photos/seed/g1-product-6/800/800",
      updated_at: daysAgo(6),
    },
    {
      id: "90000000-0000-4000-8000-000000000007",
      category_id: "9c000000-0000-4000-8000-000000000004",
      title: "Pasir Kucing Tofu 6L",
      description:
        "Pasir kucing berbahan tofu, menggumpal cepat, rendah debu, dan bisa dibuang ke toilet. Aroma green tea.",
      base_price: 55000,
      stock_status: "LOW_STOCK",
      image_url: "https://picsum.photos/seed/g1-product-7/800/800",
      updated_at: daysAgo(2),
    },
    {
      id: "90000000-0000-4000-8000-000000000008",
      category_id: "9c000000-0000-4000-8000-000000000004",
      title: "Shampoo Kucing Lembut 250ml",
      description:
        "Shampoo khusus kucing dengan pH seimbang, aroma lembut, dan tidak pedih di mata. Cocok untuk pemakaian mingguan.",
      base_price: 28000,
      stock_status: "IN_STOCK",
      image_url: "https://picsum.photos/seed/g1-product-8/800/800",
      updated_at: daysAgo(8),
    },
    {
      id: "90000000-0000-4000-8000-000000000009",
      category_id: "9c000000-0000-4000-8000-000000000003",
      title: "Mainan Tongkat Bulu Warna-warni",
      description:
        "Mainan interaktif tongkat dengan ujung bulu sintetis. Melatih insting berburu dan menjaga kucing tetap aktif.",
      base_price: 18000,
      stock_status: "OUT_OF_STOCK",
      image_url: "https://picsum.photos/seed/g1-product-9/800/800",
      updated_at: daysAgo(10),
    },
    {
      id: "90000000-0000-4000-8000-000000000010",
      category_id: "9c000000-0000-4000-8000-000000000003",
      title: "Dog Leash Reflektif 1.5m",
      description:
        "Tali jalan anjing dengan jahitan reflektif, nyaman digenggam, cocok untuk jalan sore maupun malam hari.",
      base_price: 45000,
      stock_status: "IN_STOCK",
      image_url: "https://picsum.photos/seed/g1-product-10/800/800",
      updated_at: daysAgo(5),
    },
  ] as Product[],

  agentCatalogs: [
    {
      id: "91000000-0000-4000-8000-000000000001",
      agent_id: DEMO_BUDI_ID,
      product_id: "90000000-0000-4000-8000-000000000001",
      custom_price: 95000,
      is_active: true,
    },
    {
      id: "91000000-0000-4000-8000-000000000002",
      agent_id: DEMO_BUDI_ID,
      product_id: "90000000-0000-4000-8000-000000000002",
      custom_price: 55000,
      is_active: true,
    },
    {
      id: "91000000-0000-4000-8000-000000000003",
      agent_id: DEMO_BUDI_ID,
      product_id: "90000000-0000-4000-8000-000000000003",
      custom_price: 42000,
      is_active: true,
    },
    {
      id: "91000000-0000-4000-8000-000000000004",
      agent_id: DEMO_BUDI_ID,
      product_id: "90000000-0000-4000-8000-000000000005",
      custom_price: 32000,
      is_active: true,
    },
    {
      id: "91000000-0000-4000-8000-000000000005",
      agent_id: DEMO_BUDI_ID,
      product_id: "90000000-0000-4000-8000-000000000007",
      custom_price: 63000,
      is_active: true,
    },
    {
      id: "91000000-0000-4000-8000-000000000006",
      agent_id: DEMO_SITI_ID,
      product_id: "90000000-0000-4000-8000-000000000001",
      custom_price: 92000,
      is_active: true,
    },
    {
      id: "91000000-0000-4000-8000-000000000007",
      agent_id: DEMO_SITI_ID,
      product_id: "90000000-0000-4000-8000-000000000004",
      custom_price: 70000,
      is_active: true,
    },
    {
      id: "91000000-0000-4000-8000-000000000008",
      agent_id: DEMO_SITI_ID,
      product_id: "90000000-0000-4000-8000-000000000006",
      custom_price: 40000,
      is_active: true,
    },
    {
      id: "91000000-0000-4000-8000-000000000009",
      agent_id: DEMO_SITI_ID,
      product_id: "90000000-0000-4000-8000-000000000008",
      custom_price: 35000,
      is_active: true,
    },
    {
      id: "91000000-0000-4000-8000-000000000010",
      agent_id: DEMO_SITI_ID,
      product_id: "90000000-0000-4000-8000-000000000009",
      custom_price: 25000,
      is_active: false,
    },
  ] as AgentCatalogItem[],

  announcements: [
    {
      id: "92000000-0000-4000-8000-000000000001",
      product_id: "90000000-0000-4000-8000-000000000005",
      title: "Stok Kalung Kucing G1 Masuk!",
      message:
        "Restock kalung kucing G1 premium sudah tiba di gudang pusat. Silakan perbarui etalase kalian dan kabari pelanggan setia.",
      created_at: daysAgo(1),
    },
    {
      id: "92000000-0000-4000-8000-000000000002",
      product_id: "90000000-0000-4000-8000-000000000001",
      title: "Penyesuaian Harga Dasar Makanan Kucing",
      message:
        "Mulai minggu ini harga dasar Royal Food Kucing Dewasa 1.2kg disesuaikan menjadi Rp85.000. Mohon cek kembali margin etalase masing-masing.",
      created_at: daysAgo(3),
    },
  ] as Announcement[],
};
