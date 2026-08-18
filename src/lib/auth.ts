import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { demoDb } from "@/lib/mock-data";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const DEMO_SESSION_COOKIE = "g1_demo_uid";

export async function getSessionUser(): Promise<Profile | null> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    return (
      (profile as Profile | null) ?? {
        id: user.id,
        role: "agent",
        full_name: user.email ?? null,
        store_name: null,
        store_slug: null,
        phone_number: null,
      }
    );
  }

  const cookieStore = await cookies();
  const uid = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  if (!uid) return null;
  return demoDb.profiles.find((p) => p.id === uid) ?? null;
}

export async function requireUser(): Promise<Profile> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export function isAdmin(profile: Profile): boolean {
  return profile.role === "admin";
}

export function isAgent(profile: Profile): boolean {
  return profile.role === "agent" || profile.role === "sub-agent";
}

export async function requireAdmin(): Promise<Profile> {
  const user = await requireUser();
  if (!isAdmin(user)) redirect("/dashboard");
  return user;
}

export async function requireAgent(): Promise<Profile> {
  const user = await requireUser();
  if (!isAgent(user)) redirect("/dashboard");
  return user;
}
