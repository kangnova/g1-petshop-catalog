import type { Metadata } from "next";
import Link from "next/link";
import {
  MegaphoneIcon,
  PackageIcon,
  StoreIcon,
  TagIcon,
  UsersIcon,
} from "@/components/icons";
import { StatCard } from "@/components/StatCard";
import { isAdmin, requireUser } from "@/lib/auth";
import {
  getAgentCatalogItems,
  getAnnouncements,
  getDashboardStats,
} from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();

  if (isAdmin(user)) {
    const [stats, announcements] = await Promise.all([
      getDashboardStats(),
      getAnnouncements(5),
    ]);

    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-zinc-900">
            Halo, {user.full_name}
          </h1>
          <p className="text-sm text-zinc-500">
            Kelola katalog pusat, stok, dan pengumuman untuk semua agen.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Produk"
            value={stats.products}
            icon={<PackageIcon className="h-6 w-6" />}
          />
          <StatCard
            label="Kategori"
            value={stats.categories}
            icon={<TagIcon className="h-6 w-6" />}
          />
          <StatCard
            label="Agen Aktif"
            value={stats.agents}
            icon={<UsersIcon className="h-6 w-6" />}
          />
          <StatCard
            label="Pengumuman"
            value={stats.announcements}
            icon={<MegaphoneIcon className="h-6 w-6" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-zinc-900">Pengumuman Terbaru</h2>
              <Link
                href="/dashboard/pengumuman"
                className="text-sm font-medium text-orange-500 hover:underline"
              >
                Kelola
              </Link>
            </div>
            {announcements.length === 0 ? (
              <p className="py-6 text-center text-sm text-zinc-400">
                Belum ada pengumuman.
              </p>
            ) : (
              <ul className="space-y-3">
                {announcements.map((item) => (
                  <li key={item.id} className="rounded-xl bg-zinc-50 p-3">
                    <p className="text-sm font-semibold text-zinc-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                      {item.message}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {formatDateTime(item.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="mb-4 font-bold text-zinc-900">Aksi Cepat</h2>
            <div className="grid gap-3">
              <Link
                href="/dashboard/produk/new"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 transition hover:border-orange-300 hover:bg-orange-50"
              >
                <PackageIcon className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    Tambah Produk Baru
                  </p>
                  <p className="text-xs text-zinc-500">
                    Otomatis dibroadcast ke semua agen
                  </p>
                </div>
              </Link>
              <Link
                href="/dashboard/produk"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 transition hover:border-orange-300 hover:bg-orange-50"
              >
                <TagIcon className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    Kelola Stok &amp; Harga Dasar
                  </p>
                  <p className="text-xs text-zinc-500">
                    Perubahan tersinkron ke seluruh etalase agen
                  </p>
                </div>
              </Link>
              <Link
                href="/dashboard/pengumuman"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 transition hover:border-orange-300 hover:bg-orange-50"
              >
                <MegaphoneIcon className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    Kirim Pengumuman
                  </p>
                  <p className="text-xs text-zinc-500">
                    Broadcast manual ke seluruh agen
                  </p>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const [items, announcements] = await Promise.all([
    getAgentCatalogItems(user.id),
    getAnnouncements(),
  ]);
  const activeCount = items.filter((item) => item.is_active).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900">
          Halo, {user.full_name}
        </h1>
        <p className="text-sm text-zinc-500">
          Pantau katalog pusat dan kelola etalase {user.store_name}.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Produk di Etalase"
          value={`${activeCount} aktif / ${items.length} total`}
          icon={<StoreIcon className="h-6 w-6" />}
        />
        <div className="flex items-center justify-between rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              Link Etalase Kamu
            </p>
            <p className="font-mono text-sm text-orange-600">
              /agen/{user.store_slug}
            </p>
          </div>
          <Link
            href="/dashboard/etalase"
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Kelola
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <MegaphoneIcon className="h-5 w-5 text-orange-500" />
          <h2 className="font-bold text-zinc-900">
            Pengumuman dari Pusat ({announcements.length})
          </h2>
        </div>
        {announcements.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-400">
            Belum ada pengumuman.
          </p>
        ) : (
          <ul className="space-y-3">
            {announcements.map((item) => (
              <li key={item.id} className="rounded-xl bg-zinc-50 p-4">
                <p className="font-semibold text-zinc-900">{item.title}</p>
                <p className="mt-1 text-sm text-zinc-600">{item.message}</p>
                <p className="mt-2 text-xs text-zinc-400">
                  {formatDateTime(item.created_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
