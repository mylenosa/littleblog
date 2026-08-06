"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getArticleBySlug } from "@/lib/queries/articles";
import { commentSchema } from "@/lib/validations/comment.schema";

export type CommentActionResult =
  | { success: true }
  | { success: false; message: string };

export async function createComment(input: {
  articleSlug: string;
  content: string;
  parentId?: string | null;
}): Promise<CommentActionResult> {
  const parsed = commentSchema.safeParse({ content: input.content });
  if (!parsed.success) {
    return { success: false, message: "Comentário inválido." };
  }

  if (!(await getArticleBySlug(input.articleSlug))) {
    return { success: false, message: "Artigo não encontrado." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Faça login para comentar." };
  }

  const { error } = await supabase.from("comments").insert({
    article_slug: input.articleSlug,
    user_id: user.id,
    parent_id: input.parentId ?? null,
    content: parsed.data.content,
  });

  if (error) {
    return { success: false, message: "Não foi possível publicar o comentário." };
  }

  revalidatePath(`/artigos/${input.articleSlug}`);
  return { success: true };
}

export async function updateComment(input: {
  id: string;
  articleSlug: string;
  content: string;
}): Promise<CommentActionResult> {
  const parsed = commentSchema.safeParse({ content: input.content });
  if (!parsed.success) {
    return { success: false, message: "Comentário inválido." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .update({ content: parsed.data.content })
    .eq("id", input.id);

  if (error) {
    return { success: false, message: "Não foi possível atualizar o comentário." };
  }

  revalidatePath(`/artigos/${input.articleSlug}`);
  return { success: true };
}

export async function deleteComment(input: {
  id: string;
  articleSlug: string;
}): Promise<CommentActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("comments").delete().eq("id", input.id);

  if (error) {
    return { success: false, message: "Não foi possível excluir o comentário." };
  }

  revalidatePath(`/artigos/${input.articleSlug}`);
  return { success: true };
}
