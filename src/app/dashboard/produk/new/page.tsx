import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/ProductForm";
import { ArrowLeftIcon } from "@/components/icons";
import { requireAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = { title: "Tambah Produk" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getCategories();

  return (
    <div className="space-y-4">
      <header>
        <Link
          href="/dashboard/produk"
          className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali ke daftar produk
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900">Tambah Produk Baru</h1>
        <p className="text-sm text-zinc-500">
          Produk baru otomatis diumumkan ke semua agen.
        </p>
      </header>
      <ProductForm categories={categories} />
    </div>
  );
}
