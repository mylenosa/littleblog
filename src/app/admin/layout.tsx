import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/supabase/auth-state";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getAuthState();

  if (!user) redirect("/login");
  if (!profile?.isEditor) redirect("/");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <AdminNav />
      {children}
    </div>
  );
}
