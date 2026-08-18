"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  createAnnouncement,
  createCategory,
  createProduct,
  deleteAnnouncement,
  deleteCategory,
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/data";
import { formatRp } from "@/lib/utils";
import type { ProductInput } from "@/lib/types";

export interface ActionResult {
  error?: string;
}

function revalidateCatalogPaths(productId?: string): void {
  revalidatePath("/");
  revalidatePath("/agen/[slug]", "page");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/produk");
  revalidatePath("/dashboard/etalase");
  if (productId) revalidatePath(`/produk/${productId}`);
}

export async function saveProductAction(
  input: ProductInput & { id?: string }
): Promise<ActionResult | undefined> {
  await requireAdmin();

  try {
    if (input.id) {
      const old = await getProductById(input.id);
      await updateProduct(input.id, input);

      if (old && Number(old.base_price) !== Number(input.base_price)) {
        await createAnnouncement({
          title: `Perubahan harga dasar: ${input.title}`,
          message: `Harga dasar "${input.title}" berubah dari ${formatRp(
            Number(old.base_price)
          )} menjadi ${formatRp(
            Number(input.base_price)
          )}. Silakan sesuaikan margin etalase kalian.`,
          product_id: input.id,
        });
        revalidatePath("/dashboard/pengumuman");
      }
      revalidateCatalogPaths(input.id);
      return;
    }

    const created = await createProduct(input);
    await createAnnouncement({
      title: `Produk baru: ${input.title}`,
      message: `Produk "${input.title}" resmi masuk katalog pusat dengan harga dasar ${formatRp(
        Number(input.base_price)
      )}. Tambahkan ke etalase kalian sekarang.`,
      product_id: created.id,
    });
    revalidateCatalogPaths(created.id);
    revalidatePath("/dashboard/pengumuman");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal menyimpan produk" };
  }
}

export async function deleteProductAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteProduct(id);
  revalidateCatalogPaths(id);
}

export async function saveCategoryAction(
  name: string
): Promise<ActionResult | undefined> {
  await requireAdmin();
  try {
    await createCategory(name);
    revalidatePath("/");
    revalidatePath("/dashboard/kategori");
    revalidatePath("/dashboard/produk");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal menyimpan kategori" };
  }
}

export async function deleteCategoryAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteCategory(id);
  revalidatePath("/");
  revalidatePath("/dashboard/kategori");
  revalidatePath("/dashboard/produk");
}

export async function createAnnouncementAction(input: {
  title: string;
  message: string;
}): Promise<ActionResult | undefined> {
  await requireAdmin();
  try {
    await createAnnouncement({ title: input.title, message: input.message });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/pengumuman");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal mengirim pengumuman" };
  }
}

export async function deleteAnnouncementAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteAnnouncement(id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pengumuman");
}
