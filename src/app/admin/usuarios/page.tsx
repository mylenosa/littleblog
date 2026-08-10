import type { Metadata } from "next";
import { UsersManager, type AdminUser } from "@/components/admin/users-manager";
import { createClient } from "@/lib/supabase/server";
import { getAuthState } from "@/lib/supabase/auth-state";

export const metadata: Metadata = {
  title: "Usuários",
};

export default async function UsuariosPage() {
  const { user } = await getAuthState();
  const supabase = await createClient();
  const { data } = await supabase.rpc("admin_list_users");

  const users: AdminUser[] = (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    isEditor: row.is_editor,
    canComment: row.can_comment,
    createdAt: row.created_at,
  }));

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Usuários</h1>
      <p className="mb-8 text-muted-foreground">
        Busque, conceda acesso de editor ou bloqueie comentários de outras contas.
      </p>
      <UsersManager users={users} currentUserId={user!.id} />
    </div>
  );
}
