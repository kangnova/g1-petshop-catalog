import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import type { Category, ProductFilters } from "@/lib/types";

interface CatalogFiltersProps {
  categories: Category[];
  active: ProductFilters;
}

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

export function CatalogFilters({ categories, active }: CatalogFiltersProps) {
  return (
    <form
      action="/"
      method="GET"
      className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]"
    >
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          name="q"
          defaultValue={active.search ?? ""}
          placeholder="Cari nama produk..."
          className={`${inputClass} pl-9`}
        />
      </div>

      <select name="kategori" defaultValue={active.category ?? ""} className={inputClass}>
        <option value="">Semua Kategori</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>

      <select name="stok" defaultValue={active.stock ?? ""} className={inputClass}>
        <option value="">Semua Stok</option>
        <option value="IN_STOCK">Stok Tersedia</option>
        <option value="LOW_STOCK">Stok Menipis</option>
        <option value="OUT_OF_STOCK">Stok Habis</option>
      </select>

      <input
        type="number"
        name="min"
        min={0}
        defaultValue={active.minPrice ?? ""}
        placeholder="Harga min"
        className={inputClass}
      />
      <input
        type="number"
        name="max"
        min={0}
        defaultValue={active.maxPrice ?? ""}
        placeholder="Harga max"
        className={inputClass}
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Cari
        </button>
        <Link
          href="/"
          className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
