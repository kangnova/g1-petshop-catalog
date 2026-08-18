import { isSupabaseConfigured } from "@/lib/env";

export function DemoBanner() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-800">
      Mode demo aktif (belum terhubung Supabase) — memakai data contoh, dan
      perubahan hilang saat server restart. Isi{" "}
      <code className="rounded bg-amber-100 px-1 font-mono">.env.local</code>{" "}
      dengan kredensial Supabase untuk mode produksi.
    </div>
  );
}
