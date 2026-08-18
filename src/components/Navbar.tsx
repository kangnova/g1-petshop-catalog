import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { PawIcon } from "@/components/icons";

export async function Navbar() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <PawIcon className="h-7 w-7 text-orange-500" />
          <span>
            G1 <span className="text-orange-500">Petshop</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            Katalog
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/daftar"
                className="hidden rounded-full px-4 py-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 sm:block"
              >
                Daftar Agen
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-zinc-900 px-4 py-2 text-white transition hover:bg-zinc-700"
              >
                Masuk
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
