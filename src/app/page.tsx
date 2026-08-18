import { CatalogFilters } from "@/components/CatalogFilters";
import { PawIcon, SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { RealtimeRefresh } from "@/components/RealtimeRefresh";
import { getCategories, getProducts } from "@/lib/data";
import {
  parseNumberParam,
  parseStringParam,
} from "@/lib/utils";
import type { ProductFilters, StockStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STOCK_VALUES: StockStatus[] = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"];

function buildFilters(
  searchParams: Record<string, string | string[] | undefined>
): ProductFilters {
  const stock = parseStringParam(searchParams.stok);
  return {
    search: parseStringParam(searchParams.q),
    category: parseStringParam(searchParams.kategori),
    stock: STOCK_VALUES.includes(stock as StockStatus)
      ? (stock as StockStatus)
      : undefined,
    minPrice: parseNumberParam(searchParams.min),
    maxPrice: parseNumberParam(searchParams.max),
  };
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const filters = buildFilters(params);

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(filters),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <RealtimeRefresh table="products" />

      <section className="my-8 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 px-6 py-12 text-white sm:px-12">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-orange-100">
          <PawIcon className="h-5 w-5" />
          Katalog Resmi G1 Petshop
        </div>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          Semua kebutuhan hewan peliharaan, stok &amp; harga update real-time
        </h1>
        <p className="mt-3 max-w-xl text-orange-50">
          Jelajahi katalog pusat kami. Untuk harga khusus, kunjungi etalase
          agen resmi G1 Petshop terdekatmu.
        </p>
      </section>

      <CatalogFilters categories={categories} active={filters} />

      <section className="my-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900">
            {filters.search ? `Hasil pencarian "${filters.search}"` : "Semua Produk"}
          </h2>
          <p className="text-sm text-zinc-500">{products.length} produk</p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-zinc-400">
            <SearchIcon className="h-10 w-10" />
            <p className="font-medium">Tidak ada produk yang cocok</p>
            <p className="text-sm">Coba ubah kata kunci atau filternya.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                href={`/produk/${product.id}`}
                priceNote="Harga pusat"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
