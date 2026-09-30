import { createClient } from "@/lib/supabase/server";
import { getArticleBySlug, type Article } from "@/lib/queries/articles";
import type { BackgroundStyle, ButtonStyle, LinkPlatform } from "@/lib/constants/profile-themes";

export type PublicProfileLink = {
  id: string;
  platform: LinkPlatform;
  url: string;
};

export type PublicProfile = {
  id: string;
  username: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  isPublic: boolean;
  backgroundStyle: BackgroundStyle;
  accentColor: string;
  buttonStyle: ButtonStyle;
  backgroundImageUrl: string | null;
  viewCount: number;
  updatedAt: string;
  links: PublicProfileLink[];
};

export async function getPublicProfileByUsername(
  username: string
): Promise<PublicProfile | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, username, full_name, bio, avatar_url, is_public, background_style, accent_color, button_style, background_image_url, profile_view_count, updated_at"
    )
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (!profile) return null;

  const { data: links } = await supabase
    .from("profile_links")
    .select("id, platform, url")
    .eq("profile_id", profile.id)
    .order("position", { ascending: true });

  return {
    id: profile.id,
    username: profile.username!,
    fullName: profile.full_name ?? "Sem nome",
    bio: profile.bio,
    avatarUrl: profile.avatar_url,
    isPublic: profile.is_public,
    backgroundStyle: profile.background_style as BackgroundStyle,
    accentColor: profile.accent_color,
    buttonStyle: profile.button_style as ButtonStyle,
    backgroundImageUrl: profile.background_image_url,
    viewCount: profile.profile_view_count,
    updatedAt: profile.updated_at,
    links: (links ?? []) as PublicProfileLink[],
  };
}

export async function incrementProfileViews(username: string): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("increment_profile_views", { profile_username: username });
}

const TOP_FAVORITES_LIMIT = 8;

export async function getTopFavoriteArticles(
  profileId: string
): Promise<Article[]> {
  const supabase = await createClient();

  const { data: favorites } = await supabase
    .from("favorites")
    .select("article_slug")
    .eq("user_id", profileId)
    .order("created_at", { ascending: false })
    .limit(TOP_FAVORITES_LIMIT);

  const articles = await Promise.all(
    (favorites ?? []).map((f) => getArticleBySlug(f.article_slug))
  );

  return articles.filter((article): article is Article => !!article);
}
