import { DashboardSidebar } from "@/components/DashboardSidebar";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const user = await requireUser();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 lg:flex-row">
      <DashboardSidebar
        role={user.role}
        displayName={user.store_name ?? user.full_name ?? "Pengguna"}
        storeSlug={user.store_slug}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
