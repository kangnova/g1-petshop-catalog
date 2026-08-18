import Image from "next/image";
import Link from "next/link";
import { StockBadge } from "@/components/StockBadge";
import { PackageIcon } from "@/components/icons";
import { formatRp } from "@/lib/utils";
import type { ProductWithCategory } from "@/lib/types";

interface ProductCardProps {
  product: ProductWithCategory;
  price?: number;
  priceNote?: string;
  href: string;
}

export function ProductCard({
  product,
  price,
  priceNote,
  href,
}: ProductCardProps) {
  const displayPrice = price ?? Number(product.base_price);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300">
            <PackageIcon className="h-16 w-16" />
          </div>
        )}
        <div className="absolute left-2 top-2">
          <StockBadge status={product.stock_status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.categories && (
          <span className="text-xs font-medium uppercase tracking-wide text-orange-500">
            {product.categories.name}
          </span>
        )}
        <h3 className="line-clamp-2 font-semibold text-zinc-900">
          {product.title}
        </h3>
        <div className="mt-auto pt-2">
          <p className="text-lg font-bold text-zinc-900">
            {formatRp(displayPrice)}
          </p>
          {priceNote && <p className="text-xs text-zinc-500">{priceNote}</p>}
        </div>
      </div>
    </Link>
  );
}
