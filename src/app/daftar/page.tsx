import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/RegisterForm";
import { PawIcon } from "@/components/icons";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Daftar Agen" };

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <PawIcon className="h-10 w-10 text-orange-500" />
        <h1 className="text-2xl font-bold text-zinc-900">Daftar sebagai Agen</h1>
        <p className="text-sm text-zinc-500">
          Buat etalase sendiri dengan harga kustom dari katalog pusat G1
          Petshop.
        </p>
      </div>
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
