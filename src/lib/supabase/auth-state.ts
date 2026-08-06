import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  user: { id: string; email: string | null } | null;
  profile: { fullName: string | null; isEditor: boolean } | null;
};

export async function getAuthState(): Promise<AuthState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_editor")
    .eq("id", user.id)
    .single();

  return {
    user: { id: user.id, email: user.email ?? null },
    profile: profile
      ? { fullName: profile.full_name, isEditor: profile.is_editor }
      : null,
  };
}
