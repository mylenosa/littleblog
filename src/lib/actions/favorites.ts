"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getArticleBySlug } from "@/lib/queries/articles";

export type FavoriteActionResult =
  | { success: true; favorited: boolean }
  | { success: false; message: string };

export async function toggleFavorite(
  articleSlug: string,
  currentlyFavorited: boolean
): Promise<FavoriteActionResult> {
  if (!(await getArticleBySlug(articleSlug))) {
    return { success: false, message: "Artigo não encontrado." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Faça login para favoritar." };
  }

  if (currentlyFavorited) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("article_slug", articleSlug);

    if (error) {
      return { success: false, message: "Não foi possível desfavoritar." };
    }
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, article_slug: articleSlug });

    if (error) {
      return { success: false, message: "Não foi possível favoritar." };
    }
  }

  revalidatePath(`/artigos/${articleSlug}`);
  revalidatePath("/favoritos");

  return { success: true, favorited: !currentlyFavorited };
}
