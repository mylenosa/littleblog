"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile.schema";

export type ProfileActionResult =
  | { success: true }
  | { success: false; message: string };

export async function updateProfile(
  input: ProfileInput
): Promise<ProfileActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Verifique os campos e tente novamente." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Faça login para editar seu perfil." };
  }

  const username = parsed.data.username || null;

  if (username) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existing && existing.id !== user.id) {
      return { success: false, message: "Esse nome de usuário já está em uso." };
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      bio: parsed.data.bio || null,
      avatar_url: parsed.data.avatarUrl || null,
      username,
      is_public: parsed.data.isPublic,
      background_style: parsed.data.backgroundStyle,
      accent_color: parsed.data.accentColor,
      button_style: parsed.data.buttonStyle,
      background_image_url: parsed.data.backgroundImageUrl || null,
      top_artist: parsed.data.topArtist || null,
      top_artist_spotify_id: parsed.data.topArtistSpotifyId || null,
      top_track: parsed.data.topTrack || null,
      top_track_spotify_id: parsed.data.topTrackSpotifyId || null,
      status: parsed.data.status || null,
    })
    .eq("id", user.id);

  if (error) {
    const message =
      error.code === "23505"
        ? "Esse nome de usuário já está em uso."
        : "Não foi possível salvar seu perfil.";
    return { success: false, message };
  }

  await supabase.from("profile_links").delete().eq("profile_id", user.id);

  if (parsed.data.links.length > 0) {
    const { error: linksError } = await supabase.from("profile_links").insert(
      parsed.data.links.map((link, index) => ({
        profile_id: user.id,
        platform: link.platform,
        url: link.url,
        position: index,
      }))
    );

    if (linksError) {
      return { success: false, message: "Não foi possível salvar seus links." };
    }
  }

  revalidatePath("/", "layout");
  if (username) revalidatePath(`/${username}`);

  return { success: true };
}
