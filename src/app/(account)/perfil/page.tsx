import type { Metadata } from "next";
import { ProfileForm } from "@/components/forms/profile-form";
import { createClient } from "@/lib/supabase/server";
import { getAuthState } from "@/lib/supabase/auth-state";
import type {
  BackgroundStyle,
  ButtonStyle,
  LinkPlatform,
} from "@/lib/constants/profile-themes";

export const metadata: Metadata = {
  title: "Perfil",
};

export default async function PerfilPage() {
  const { user } = await getAuthState();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, bio, avatar_url, username, is_public, background_style, accent_color, button_style, background_image_url"
    )
    .eq("id", user!.id)
    .single();

  const { data: links } = await supabase
    .from("profile_links")
    .select("platform, url")
    .eq("profile_id", user!.id)
    .order("position", { ascending: true });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Perfil</h1>
      <ProfileForm
        defaultValues={{
          fullName: profile?.full_name ?? "",
          bio: profile?.bio ?? "",
          avatarUrl: profile?.avatar_url ?? "",
          username: profile?.username ?? "",
          isPublic: profile?.is_public ?? true,
          backgroundStyle: (profile?.background_style ??
            "gradiente_azul") as BackgroundStyle,
          accentColor: profile?.accent_color ?? "#3b82f6",
          buttonStyle: (profile?.button_style ?? "bevel") as ButtonStyle,
          backgroundImageUrl: profile?.background_image_url ?? "",
          links: (links ?? []).map((link) => ({
            platform: link.platform as LinkPlatform,
            url: link.url,
          })),
        }}
      />
    </div>
  );
}
