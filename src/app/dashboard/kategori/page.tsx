import type { Metadata } from "next";
import { CategoryManager } from "@/components/CategoryManager";
import { requireAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = { title: "Kelola Kategori" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getCategories();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900">Kategori Produk</h1>
        <p className="text-sm text-zinc-500">
          Kelompokkan katalog: Makanan, Vitamin, Aksesori, dan lainnya.
        </p>
      </header>
      <CategoryManager categories={categories} />
    </div>
  );
}
