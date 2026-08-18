"use client";

import { useState } from "react";
import { deleteCategoryAction, saveCategoryAction } from "@/actions/admin";
import { DeleteButton } from "@/components/DeleteButton";
import { PlusIcon, TagIcon } from "@/components/icons";
import type { Category } from "@/lib/types";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    const result = await saveCategoryAction(name.trim());
    if (result?.error) {
      setError(result.error);
    } else {
      setName("");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-4"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kategori baru, misal: Mainan"
          required
          className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          <PlusIcon className="h-4 w-4" />
          {saving ? "Menyimpan..." : "Tambah"}
        </button>
      </form>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-zinc-400">
            <TagIcon className="h-8 w-8" />
            <p className="text-sm">Belum ada kategori</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="font-medium text-zinc-900">{category.name}</p>
                  <p className="font-mono text-xs text-zinc-400">
                    /{category.slug}
                  </p>
                </div>
                <DeleteButton
                  action={deleteCategoryAction.bind(null, category.id)}
                  iconOnly
                  confirmText={`Hapus kategori "${category.name}"? Produk di dalamnya tetap ada tanpa kategori.`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
