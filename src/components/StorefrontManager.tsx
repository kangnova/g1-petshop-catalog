"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addToStorefrontAction,
  removeStorefrontAction,
  toggleStorefrontAction,
  updateStorefrontPriceAction,
} from "@/actions/agent";
import { DeleteButton } from "@/components/DeleteButton";
import { CheckIcon, CopyIcon, PlusIcon, StoreIcon } from "@/components/icons";
import { StockBadge } from "@/components/StockBadge";
import { formatRp } from "@/lib/utils";
import type { ProductWithCategory, StorefrontItem } from "@/lib/types";

const inputClass =
  "rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

interface StorefrontManagerProps {
  products: ProductWithCategory[];
  items: StorefrontItem[];
  storeSlug: string | null;
}

export function StorefrontManager({
  products,
  items,
  storeSlug,
}: StorefrontManagerProps) {
  const [copied, setCopied] = useState(false);
  const addedIds = new Set(items.map((item) => item.product_id));
  const availableProducts = products.filter((p) => !addedIds.has(p.id));
  const storefrontUrl =
    typeof window !== "undefined" && storeSlug
      ? `${window.location.origin}/agen/${storeSlug}`
      : "";

  function copyLink() {
    if (!storefrontUrl) return;
    navigator.clipboard.writeText(storefrontUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {storeSlug && (
        <div className="flex flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <StoreIcon className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Link Etalase Kamu
              </p>
              <p className="font-mono text-sm text-orange-600">
                /agen/{storeSlug}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              {copied ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
              {copied ? "Tersalin!" : "Salin Link"}
            </button>
            <a
              href={`/agen/${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-orange-300 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-100"
            >
              Buka
            </a>
          </div>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-zinc-900">
          Etalase Saya ({items.length} produk)
        </h2>
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {items.length === 0 ? (
            <p className="p-8 text-center text-sm text-zinc-400">
              Etalase masih kosong. Tambahkan produk dari katalog pusat di
              bawah.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {items.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-zinc-900">
          Tambah dari Katalog Pusat
        </h2>
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {availableProducts.length === 0 ? (
            <p className="p-8 text-center text-sm text-zinc-400">
              Semua produk pusat sudah ada di etalase kamu.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {availableProducts.map((product) => (
                <AddRow key={product.id} product={product} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function ItemRow({ item }: { item: StorefrontItem }) {
  const router = useRouter();
  const [price, setPrice] = useState(String(item.custom_price));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = item.products;
  const basePrice = Number(product?.base_price ?? 0);
  const currentPrice = Number(price);
  const margin = currentPrice - basePrice;
  const dirty = currentPrice !== Number(item.custom_price);

  async function savePrice() {
    setSaving(true);
    setError(null);
    const result = await updateStorefrontPriceAction(item.id, currentPrice);
    if (result?.error) setError(result.error);
    setSaving(false);
    router.refresh();
  }

  async function handleToggle() {
    await toggleStorefrontAction(item.id, !item.is_active);
    router.refresh();
  }

  if (!product) return null;

  return (
    <li className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-zinc-900">{product.title}</p>
          <StockBadge status={product.stock_status} />
          {!item.is_active && (
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-500">
              Disembunyikan
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-zinc-500">
          Harga dasar pusat: {formatRp(basePrice)} · Margin:{" "}
          <span className={margin >= 0 ? "text-emerald-600" : "text-red-600"}>
            {formatRp(margin)}
          </span>
        </p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-zinc-400">Rp</span>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`${inputClass} w-32`}
          />
        </div>
        {dirty && (
          <button
            type="button"
            onClick={savePrice}
            disabled={saving}
            className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? "..." : "Simpan"}
          </button>
        )}
        <label className="flex cursor-pointer items-center gap-1.5 text-sm text-zinc-600">
          <input
            type="checkbox"
            checked={item.is_active}
            onChange={handleToggle}
            className="h-4 w-4 accent-orange-500"
          />
          Tampil
        </label>
        <DeleteButton
          action={removeStorefrontAction.bind(null, item.id)}
          iconOnly
          confirmText={`Hapus "${product.title}" dari etalase kamu?`}
        />
      </div>
    </li>
  );
}

function AddRow({ product }: { product: ProductWithCategory }) {
  const router = useRouter();
  const suggested = Math.ceil((Number(product.base_price) * 120) / 100) * 100;
  const [price, setPrice] = useState(String(suggested));
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    setAdding(true);
    setError(null);
    const result = await addToStorefrontAction(product.id, Number(price));
    if (result?.error) {
      setError(result.error);
      setAdding(false);
      return;
    }
    router.refresh();
  }

  return (
    <li className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-zinc-900">{product.title}</p>
        <p className="mt-0.5 text-xs text-zinc-500">
          Harga dasar: {formatRp(Number(product.base_price))}
          {product.categories ? ` · ${product.categories.name}` : ""}
        </p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400">Harga jual Rp</span>
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={`${inputClass} w-32`}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50"
        >
          <PlusIcon className="h-4 w-4" />
          {adding ? "..." : "Tambah"}
        </button>
      </div>
    </li>
  );
}
