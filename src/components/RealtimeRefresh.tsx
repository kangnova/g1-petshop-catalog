"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createBrowserSupabase } from "@/lib/supabase/client";

export function RealtimeRefresh({ table }: { table: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = createBrowserSupabase();
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => router.refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, table]);

  return null;
}
