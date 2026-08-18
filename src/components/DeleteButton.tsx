"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@/components/icons";

interface DeleteButtonProps {
  action: () => Promise<void>;
  label?: string;
  confirmText?: string;
  iconOnly?: boolean;
}

export function DeleteButton({
  action,
  label = "Hapus",
  confirmText = "Yakin ingin menghapus? Tindakan ini tidak bisa dibatalkan.",
  iconOnly = false,
}: DeleteButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(confirmText)) return;
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:opacity-50 ${
        iconOnly ? "p-2" : "px-3 py-1.5 text-sm font-medium"
      }`}
    >
      <TrashIcon className="h-4 w-4" />
      {!iconOnly && (pending ? "Menghapus..." : label)}
    </button>
  );
}
