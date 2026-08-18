import type { Metadata } from "next";
import { StorefrontManager } from "@/components/StorefrontManager";
import { requireAgent } from "@/lib/auth";
import { getAgentCatalogItems, getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Etalase Saya" };
export const dynamic = "force-dynamic";

export default async function AgentStorefrontPage() {
  const agent = await requireAgent();

  const [products, items] = await Promise.all([
    getProducts(),
    getAgentCatalogItems(agent.id),
  ]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900">Etalase Saya</h1>
        <p className="text-sm text-zinc-500">
          Pilih produk dari katalog pusat, atur harga jualmu sendiri. Stok
          tetap mengikuti data pusat secara real-time.
        </p>
      </header>
      <StorefrontManager
        products={products}
        items={items}
        storeSlug={agent.store_slug}
      />
    </div>
  );
}
