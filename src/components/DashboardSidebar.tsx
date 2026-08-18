"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import {
  HomeIcon,
  LogOutIcon,
  MegaphoneIcon,
  PackageIcon,
  StoreIcon,
  TagIcon,
} from "@/components/icons";
import type { Role } from "@/lib/types";

interface DashboardSidebarProps {
  role: Role;
  displayName: string;
  storeSlug: string | null;
}

export function DashboardSidebar({
  role,
  displayName,
  storeSlug,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const items =
    role === "admin"
      ? [
          { href: "/dashboard", label: "Ringkasan", icon: HomeIcon },
          { href: "/dashboard/produk", label: "Produk", icon: PackageIcon },
          { href: "/dashboard/kategori", label: "Kategori", icon: TagIcon },
          {
            href: "/dashboard/pengumuman",
            label: "Pengumuman",
            icon: MegaphoneIcon,
          },
        ]
      : [
          { href: "/dashboard", label: "Ringkasan", icon: HomeIcon },
          { href: "/dashboard/etalase", label: "Etalase Saya", icon: StoreIcon },
        ];

  return (
    <aside className="w-full shrink-0 lg:w-60">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="mb-4 border-b border-zinc-100 pb-4">
          <p className="font-semibold text-zinc-900">{displayName}</p>
          <p className="text-xs capitalize text-zinc-500">
            {role === "admin" ? "Admin Pusat" : "Agen"}
          </p>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-orange-50 text-orange-600"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          {role !== "admin" && storeSlug && (
            <a
              href={`/agen/${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
            >
              <StoreIcon className="h-4 w-4" />
              Lihat Etalase Publik
            </a>
          )}
        </nav>

        <form action={logoutAction} className="mt-4 border-t border-zinc-100 pt-4">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOutIcon className="h-4 w-4" />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
