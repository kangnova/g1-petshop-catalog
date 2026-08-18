"use server";

import { revalidatePath } from "next/cache";
import { requireAgent } from "@/lib/auth";
import {
  removeStorefrontItem,
  setStorefrontActive,
  updateStorefrontPrice,
  upsertStorefrontItem,
} from "@/lib/data";

export interface ActionResult {
  error?: string;
}

function revalidateAgentPaths(storeSlug: string | null): void {
  revalidatePath("/dashboard/etalase");
  revalidatePath("/dashboard");
  if (storeSlug) revalidatePath(`/agen/${storeSlug}`);
}

export async function addToStorefrontAction(
  productId: string,
  customPrice: number
): Promise<ActionResult | undefined> {
  const agent = await requireAgent();
  if (!Number.isFinite(customPrice) || customPrice <= 0) {
    return { error: "Harga jual tidak valid" };
  }
  await upsertStorefrontItem(agent.id, productId, customPrice);
  revalidateAgentPaths(agent.store_slug);
}

export async function updateStorefrontPriceAction(
  itemId: string,
  customPrice: number
): Promise<ActionResult | undefined> {
  const agent = await requireAgent();
  if (!Number.isFinite(customPrice) || customPrice <= 0) {
    return { error: "Harga jual tidak valid" };
  }
  await updateStorefrontPrice(itemId, customPrice);
  revalidateAgentPaths(agent.store_slug);
}

export async function toggleStorefrontAction(
  itemId: string,
  isActive: boolean
): Promise<void> {
  const agent = await requireAgent();
  await setStorefrontActive(itemId, isActive);
  revalidateAgentPaths(agent.store_slug);
}

export async function removeStorefrontAction(itemId: string): Promise<void> {
  const agent = await requireAgent();
  await removeStorefrontItem(itemId);
  revalidateAgentPaths(agent.store_slug);
}
