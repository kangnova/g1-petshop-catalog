"use client";

import { useState } from "react";
import Link from "next/link";
import { registerAgentAction } from "@/actions/auth";

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

export function RegisterForm() {
  const [form, setForm] = useState({
    full_name: "",
    store_name: "",
    phone_number: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (
      event: React.ChangeEvent<HTMLInputElement>
    ) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const result = await registerAgentAction(form);
    if (result?.error) setError(result.error);
    if (result?.info) setInfo(result.info);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="full_name" className="mb-1 block text-sm font-medium">
          Nama Lengkap
        </label>
        <input
          id="full_name"
          required
          value={form.full_name}
          onChange={update("full_name")}
          className={inputClass}
          placeholder="Budi Santoso"
        />
      </div>
      <div>
        <label htmlFor="store_name" className="mb-1 block text-sm font-medium">
          Nama Toko
        </label>
        <input
          id="store_name"
          required
          value={form.store_name}
          onChange={update("store_name")}
          className={inputClass}
          placeholder="Budi Petshop"
        />
        <p className="mt-1 text-xs text-zinc-400">
          Link etalase kamu akan dibuat otomatis dari nama toko, contoh:{" "}
          <span className="font-mono">/agen/budi-petshop</span>
        </p>
      </div>
      <div>
        <label htmlFor="phone_number" className="mb-1 block text-sm font-medium">
          Nomor WhatsApp
        </label>
        <input
          id="phone_number"
          required
          value={form.phone_number}
          onChange={update("phone_number")}
          className={inputClass}
          placeholder="0812xxxxxxxx"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={update("email")}
          className={inputClass}
          placeholder="kamu@email.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={update("password")}
          className={inputClass}
          placeholder="Minimal 6 karakter"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {info && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? "Memproses..." : "Daftar sebagai Agen"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-orange-500 hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}
