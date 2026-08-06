import type { Metadata } from "next";
import { ProfileForm } from "@/components/forms/profile-form";
import { createClient } from "@/lib/supabase/server";
import { getAuthState } from "@/lib/supabase/auth-state";

export const metadata: Metadata = {
  title: "Perfil",
};

export default async function PerfilPage() {
  const { user } = await getAuthState();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio, avatar_url")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Perfil</h1>
      <ProfileForm
        defaultValues={{
          fullName: profile?.full_name ?? "",
          bio: profile?.bio ?? "",
          avatarUrl: profile?.avatar_url ?? "",
        }}
      />
    </div>
  );
}
