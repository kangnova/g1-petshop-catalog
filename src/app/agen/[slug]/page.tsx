import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChatIcon, PawIcon, StoreIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { RealtimeRefresh } from "@/components/RealtimeRefresh";
import { getProfileBySlug, getStorefront } from "@/lib/data";
import { waLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface AgentStorefrontPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AgentStorefrontPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getProfileBySlug(slug);
  return {
    title: agent?.store_name
      ? `${agent.store_name} — Agen Resmi G1 Petshop`
      : "Etalase tidak ditemukan",
  };
}

export default async function AgentStorefrontPage({
  params,
}: AgentStorefrontPageProps) {
  const { slug } = await params;
  const agent = await getProfileBySlug(slug);

  if (!agent || agent.role === "admin" || !agent.store_slug) notFound();

  const items = await getStorefront(agent.id);

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <RealtimeRefresh table="products" />

      <section className="my-8 overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-700 px-6 py-10 text-white sm:px-12">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-orange-300">
          <PawIcon className="h-4 w-4" />
          Agen Resmi G1 Petshop
        </div>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{agent.store_name}</h1>
            <p className="mt-1 text-zinc-300">
              Dikelola oleh {agent.full_name} · Stok mengikuti katalog pusat
              secara real-time
            </p>
          </div>
          {agent.phone_number && (
            <a
              href={waLink(
                agent.phone_number,
                `Halo ${agent.store_name}, saya ingin bertanya tentang produk di etalase kalian.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <ChatIcon className="h-5 w-5" />
              Hubungi Agen
            </a>
          )}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <StoreIcon className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-bold text-zinc-900">
            Etalase {agent.store_name} ({items.length} produk)
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center text-zinc-400">
            Etalase ini belum memiliki produk.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) =>
              item.products ? (
                <ProductCard
                  key={item.id}
                  product={item.products}
                  price={Number(item.custom_price)}
                  priceNote={`Harga ${agent.store_name}`}
                  href={`/produk/${item.product_id}?agen=${agent.store_slug}`}
                />
              ) : null
            )}
          </div>
        )}
      </section>
    </div>
  );
}
