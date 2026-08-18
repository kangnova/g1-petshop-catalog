import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { deleteProductAction } from "@/actions/admin";
import { DeleteButton } from "@/components/DeleteButton";
import { PackageIcon, PencilIcon, PlusIcon } from "@/components/icons";
import { StockBadge } from "@/components/StockBadge";
import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/data";
import { formatDate, formatRp } from "@/lib/utils";

export const metadata: Metadata = { title: "Kelola Produk" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getProducts();

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Master Katalog</h1>
          <p className="text-sm text-zinc-500">
            {products.length} produk — perubahan stok &amp; harga dasar
            tersinkron ke semua etalase agen
          </p>
        </div>
        <Link
          href="/dashboard/produk/new"
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <PlusIcon className="h-4 w-4" />
          Tambah Produk
        </Link>
      </header>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-16 text-zinc-400">
            <PackageIcon className="h-10 w-10" />
            <p className="text-sm">Belum ada produk. Tambahkan yang pertama!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Produk</th>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 font-semibold">Harga Dasar</th>
                  <th className="px-4 py-3 font-semibold">Stok</th>
                  <th className="px-4 py-3 font-semibold">Diperbarui</th>
                  <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-zinc-300">
                              <PackageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <span className="max-w-[240px] truncate font-medium text-zinc-900">
                          {product.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {product.categories?.name ?? "-"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-900">
                      {formatRp(Number(product.base_price))}
                    </td>
                    <td className="px-4 py-3">
                      <StockBadge status={product.stock_status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {formatDate(product.updated_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/produk/${product.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </Link>
                        <DeleteButton
                          action={deleteProductAction.bind(null, product.id)}
                          iconOnly
                          confirmText={`Hapus produk "${product.title}" dari katalog pusat? Etalase agen untuk produk ini juga ikut terhapus.`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
