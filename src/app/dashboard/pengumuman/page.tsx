import type { Metadata } from "next";
import { AnnouncementManager } from "@/components/AnnouncementManager";
import { requireAdmin } from "@/lib/auth";
import { getAnnouncements } from "@/lib/data";

export const metadata: Metadata = { title: "Pengumuman" };
export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  await requireAdmin();
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900">
          Broadcast Pengumuman
        </h1>
        <p className="text-sm text-zinc-500">
          Pengumuman produk baru &amp; perubahan harga dibuat otomatis. Di sini
          kamu bisa menambah broadcast manual.
        </p>
      </header>
      <AnnouncementManager announcements={announcements} />
    </div>
  );
}
