import Link from "next/link";
import { PawIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <PawIcon className="h-12 w-12 text-orange-500" />
      <h1 className="text-2xl font-bold text-zinc-900">Halaman tidak ditemukan</h1>
      <p className="text-sm text-zinc-500">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
      >
        Kembali ke Katalog
      </Link>
    </div>
  );
}
