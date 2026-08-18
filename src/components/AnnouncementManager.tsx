"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createAnnouncementAction,
  deleteAnnouncementAction,
} from "@/actions/admin";
import { DeleteButton } from "@/components/DeleteButton";
import { MegaphoneIcon } from "@/components/icons";
import { formatDateTime } from "@/lib/utils";
import type { Announcement } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

export function AnnouncementManager({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setError(null);
    const result = await createAnnouncementAction({ title, message });
    if (result?.error) {
      setError(result.error);
    } else {
      setTitle("");
      setMessage("");
      router.refresh();
    }
    setSending(false);
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul pengumuman, misal: Restock Kalung Kucing G1!"
          required
          className={inputClass}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Pesan detail untuk para agen..."
          required
          rows={3}
          className={inputClass}
        />
        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          <MegaphoneIcon className="h-4 w-4" />
          {sending ? "Mengirim..." : "Broadcast ke Semua Agen"}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-zinc-400">
            <MegaphoneIcon className="h-8 w-8" />
            <p className="text-sm">Belum ada pengumuman</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {announcements.map((item) => (
              <li key={item.id} className="flex gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900">{item.title}</p>
                  <p className="mt-0.5 text-sm text-zinc-600">{item.message}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {formatDateTime(item.created_at)}
                  </p>
                </div>
                <DeleteButton
                  action={deleteAnnouncementAction.bind(null, item.id)}
                  iconOnly
                  confirmText={`Hapus pengumuman "${item.title}"?`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
