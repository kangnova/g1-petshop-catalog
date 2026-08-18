import type { StockStatus } from "@/lib/types";

const config: Record<StockStatus, { label: string; className: string }> = {
  IN_STOCK: {
    label: "Stok Tersedia",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  LOW_STOCK: {
    label: "Stok Menipis",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  OUT_OF_STOCK: {
    label: "Stok Habis",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
};

export function StockBadge({ status }: { status: StockStatus }) {
  const item = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${item.className}`}
    >
      {item.label}
    </span>
  );
}
