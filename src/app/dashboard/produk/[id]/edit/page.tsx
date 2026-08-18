import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/ProductForm";
import { ArrowLeftIcon } from "@/components/icons";
import { requireAdmin } from "@/lib/auth";
import { getCategories, getProductById } from "@/lib/data";

export const metadata: Metadata = { title: "Edit Produk" };
export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAdmin();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);
  if (!product) notFound();

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
        <h1 className="text-2xl font-bold text-zinc-900">Edit Produk</h1>
        <p className="text-sm text-zinc-500">
          Perubahan harga dasar otomatis diumumkan ke semua agen.
        </p>
      </header>
      <ProductForm categories={categories} initial={product} />
    </div>
  );
}
