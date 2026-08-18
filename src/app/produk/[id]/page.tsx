import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  ChatIcon,
  PackageIcon,
} from "@/components/icons";
import { StockBadge } from "@/components/StockBadge";
import {
  getProductById,
  getProfileBySlug,
  getStorefrontItem,
} from "@/lib/data";
import { centerWhatsApp } from "@/lib/env";
import { formatDate, formatRp, parseStringParam, waLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return { title: product?.title ?? "Produk tidak ditemukan" };
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const agentSlug = parseStringParam(sp.agen);

  const product = await getProductById(id);
  if (!product) notFound();

  const agent = agentSlug ? await getProfileBySlug(agentSlug) : null;
  const agentItem =
    agent && agent.role !== "admin"
      ? await getStorefrontItem(agent.id, product.id)
      : null;

  const price = agentItem ? Number(agentItem.custom_price) : Number(product.base_price);
  const waNumber = agent?.phone_number ?? centerWhatsApp;
  const waText = `Halo, saya ingin memesan "${product.title}" (${formatRp(price)}). Apakah stoknya tersedia?`;
  const outOfStock = product.stock_status === "OUT_OF_STOCK";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Link
        href={agent ? `/agen/${agent.store_slug}` : "/"}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        {agent ? `Kembali ke ${agent.store_name}` : "Kembali ke Katalog"}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-300">
              <PackageIcon className="h-24 w-24" />
            </div>
          )}
        </div>

        <div className="space-y-5">
          {agent && agentItem && (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
              Kamu sedang melihat harga etalase{" "}
              <strong>{agent.store_name}</strong>. Stok tetap mengikuti data
              pusat secara real-time.
            </div>
          )}

          <div>
            {product.categories && (
              <p className="text-sm font-medium uppercase tracking-wide text-orange-500">
                {product.categories.name}
              </p>
            )}
            <h1 className="mt-1 text-3xl font-bold text-zinc-900">
              {product.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <StockBadge status={product.stock_status} />
            <span className="text-xs text-zinc-400">
              Diperbarui {formatDate(product.updated_at)}
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">
              {agent && agentItem ? "Harga etalase agen" : "Harga pusat"}
            </p>
            <p className="text-3xl font-bold text-zinc-900">
              {formatRp(price)}
            </p>
            {agentItem && (
              <p className="mt-1 text-xs text-zinc-400">
                Harga pusat: {formatRp(Number(product.base_price))}
              </p>
            )}
          </div>

          <a
            href={waLink(waNumber, waText)}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={outOfStock}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition sm:w-auto ${
              outOfStock
                ? "cursor-not-allowed bg-zinc-300"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            <ChatIcon className="h-5 w-5" />
            {outOfStock
              ? "Stok Habis"
              : `Pesan via WhatsApp ${agent ? agent.store_name : "Pusat"}`}
          </a>

          {product.description && (
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-zinc-900">
                Deskripsi &amp; Spesifikasi
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-zinc-600">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
