"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ReactionActionResult =
  | { success: true }
  | { success: false; message: string };

export async function toggleCommentReaction(input: {
  commentId: string;
  articleSlug: string;
  emoji: string;
}): Promise<ReactionActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Faça login para reagir." };
  }

  const { data: existing } = await supabase
    .from("comment_reactions")
    .select("id")
    .eq("comment_id", input.commentId)
    .eq("user_id", user.id)
    .eq("emoji", input.emoji)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("comment_reactions").delete().eq("id", existing.id)
    : await supabase.from("comment_reactions").insert({
        comment_id: input.commentId,
        user_id: user.id,
        emoji: input.emoji,
      });

  if (error) {
    return { success: false, message: "Não foi possível reagir." };
  }

  revalidatePath(`/artigos/${input.articleSlug}`);
  return { success: true };
}

export async function toggleArticleReaction(input: {
  articleSlug: string;
  emoji: string;
}): Promise<ReactionActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Faça login para reagir." };
  }

  const { data: existing } = await supabase
    .from("article_reactions")
    .select("id")
    .eq("article_slug", input.articleSlug)
    .eq("user_id", user.id)
    .eq("emoji", input.emoji)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("article_reactions").delete().eq("id", existing.id)
    : await supabase.from("article_reactions").insert({
        article_slug: input.articleSlug,
        user_id: user.id,
        emoji: input.emoji,
      });

  if (error) {
    return { success: false, message: "Não foi possível reagir." };
  }

  revalidatePath(`/artigos/${input.articleSlug}`);
  return { success: true };
}
