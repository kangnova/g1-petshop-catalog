"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createDemoAgent,
  ensureUniqueAgentSlug,
} from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { DEMO_SESSION_COOKIE } from "@/lib/auth";
import { demoUsers } from "@/lib/mock-data";
import { createServerSupabase } from "@/lib/supabase/server";

export interface AuthResult {
  error?: string;
  info?: string;
}

export async function loginAction(
  email: string,
  password: string
): Promise<AuthResult | undefined> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: "Email atau password salah" };
    redirect("/dashboard");
  }

  const user = demoUsers.find(
    (u) => u.email === email.toLowerCase().trim() && u.password === password
  );
  if (!user) return { error: "Email atau password salah" };

  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  redirect("/dashboard");
}

export interface RegisterAgentInput {
  full_name: string;
  store_name: string;
  phone_number: string;
  email: string;
  password: string;
}

export async function registerAgentAction(
  input: RegisterAgentInput
): Promise<AuthResult | undefined> {
  const storeSlug = await ensureUniqueAgentSlug(input.store_name);

  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          role: "agent",
          full_name: input.full_name,
          store_name: input.store_name,
          store_slug: storeSlug,
          phone_number: input.phone_number,
        },
      },
    });
    if (error) return { error: error.message };
    if (!data.session) {
      return {
        info: "Pendaftaran berhasil! Cek email kamu untuk konfirmasi, lalu login.",
      };
    }
    redirect("/dashboard");
  }

  if (demoUsers.some((u) => u.email === input.email.toLowerCase().trim())) {
    return { error: "Email sudah terdaftar" };
  }

  const id = crypto.randomUUID();
  demoUsers.push({ id, email: input.email.toLowerCase().trim(), password: input.password });
  await createDemoAgent({
    id,
    full_name: input.full_name,
    store_name: input.store_name,
    store_slug: storeSlug,
    phone_number: input.phone_number,
  });

  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  } else {
    const cookieStore = await cookies();
    cookieStore.delete(DEMO_SESSION_COOKIE);
  }
  redirect("/");
}
