import Link from "next/link";
import { PawIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <PawIcon className="h-5 w-5 text-orange-500" />
          <span>
            G1 Petshop — katalog digital &amp; portal agen. Dibangun dengan
            Next.js + Supabase.
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-zinc-900">
            Katalog
          </Link>
          <Link href="/daftar" className="hover:text-zinc-900">
            Daftar Agen
          </Link>
          <Link href="/login" className="hover:text-zinc-900">
            Masuk
          </Link>
        </div>
      </div>
    </footer>
  );
}
