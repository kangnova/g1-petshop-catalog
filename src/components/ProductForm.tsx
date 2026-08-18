"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProductAction } from "@/actions/admin";
import { uploadProductImageAction } from "@/actions/upload";
import { isSupabaseConfigured } from "@/lib/env";
import type { Category, ProductWithCategory, StockStatus } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

interface ProductFormProps {
  categories: Category[];
  initial?: ProductWithCategory;
}

export function ProductForm({ categories, initial }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    category_id: initial?.category_id ?? "",
    base_price: initial ? String(initial.base_price) : "",
    stock_status: (initial?.stock_status ?? "IN_STOCK") as StockStatus,
    description: initial?.description ?? "",
    image_url: initial?.image_url ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const result = await uploadProductImageAction(file);
    if (result.url) {
      setForm((prev) => ({ ...prev, image_url: result.url ?? "" }));
    } else if (result.error) {
      setError(result.error);
    }
    setUploading(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const result = await saveProductAction({
      id: initial?.id,
      title: form.title,
      category_id: form.category_id || null,
      base_price: Number(form.base_price),
      stock_status: form.stock_status,
      description: form.description,
      image_url: form.image_url,
    });

    if (result?.error) {
      setError(result.error);
      setSaving(false);
      return;
    }
    router.push("/dashboard/produk");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Nama Produk
          </label>
          <input
            id="title"
            required
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className={inputClass}
            placeholder="Royal Food Kucing Dewasa 1.2kg"
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium">
            Kategori
          </label>
          <select
            id="category"
            value={form.category_id}
            onChange={(e) =>
              setForm((p) => ({ ...p, category_id: e.target.value }))
            }
            className={inputClass}
          >
            <option value="">Tanpa Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="base_price" className="mb-1 block text-sm font-medium">
            Harga Dasar (Rp)
          </label>
          <input
            id="base_price"
            type="number"
            min={0}
            required
            value={form.base_price}
            onChange={(e) =>
              setForm((p) => ({ ...p, base_price: e.target.value }))
            }
            className={inputClass}
            placeholder="85000"
          />
        </div>

        <div>
          <label htmlFor="stock_status" className="mb-1 block text-sm font-medium">
            Status Stok
          </label>
          <select
            id="stock_status"
            value={form.stock_status}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                stock_status: e.target.value as StockStatus,
              }))
            }
            className={inputClass}
          >
            <option value="IN_STOCK">Stok Tersedia</option>
            <option value="LOW_STOCK">Stok Menipis</option>
            <option value="OUT_OF_STOCK">Stok Habis</option>
          </select>
        </div>

        <div>
          <label htmlFor="image_url" className="mb-1 block text-sm font-medium">
            URL Gambar
          </label>
          <input
            id="image_url"
            type="url"
            value={form.image_url}
            onChange={(e) =>
              setForm((p) => ({ ...p, image_url: e.target.value }))
            }
            className={inputClass}
            placeholder="https://..."
          />
          {isSupabaseConfigured && (
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-orange-500 hover:underline">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploading ? "Mengunggah..." : "atau upload ke Supabase Storage"}
            </label>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Deskripsi &amp; Spesifikasi
          </label>
          <textarea
            id="description"
            rows={6}
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            className={inputClass}
            placeholder="Deskripsi lengkap, spesifikasi, dan cara pemakaian..."
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Tambah Produk"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
