import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { PawIcon } from "@/components/icons";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <PawIcon className="h-10 w-10 text-orange-500" />
        <h1 className="text-2xl font-bold text-zinc-900">Masuk ke G1 Petshop</h1>
        <p className="text-sm text-zinc-500">
          Portal Admin Pusat &amp; Agen G1 Petshop
        </p>
      </div>
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}
