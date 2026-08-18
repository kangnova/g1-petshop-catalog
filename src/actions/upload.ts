"use server";

import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";

export interface UploadResult {
  url?: string;
  error?: string;
}

export async function uploadProductImageAction(file: File): Promise<UploadResult> {
  await requireAdmin();

  if (!isSupabaseConfigured) {
    return {
      error:
        "Upload gambar butuh Supabase. Di mode demo, tempel URL gambar secara manual.",
    };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File harus berupa gambar" };
  }

  const supabase = await createServerSupabase();
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { url: data.publicUrl };
}
