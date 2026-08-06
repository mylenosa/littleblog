"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  articleFormSchema,
  parseTags,
  type ArticleFormInput,
} from "@/lib/validations/article-form.schema";

export type AdminActionResult =
  | { success: true }
  | { success: false; message: string };

async function requireEditor() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, ok: false as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_editor")
    .eq("id", user.id)
    .single();

  if (!profile?.is_editor) return { supabase, user, ok: false as const };

  return { supabase, user, ok: true as const };
}

function revalidateArticlePaths(slug: string) {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/tags");
  revalidatePath("/busca");
  revalidatePath(`/artigos/${slug}`);
}

export async function createArticle(input: ArticleFormInput): Promise<AdminActionResult> {
  const parsed = articleFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Verifique os campos e tente novamente." };
  }

  const { supabase, user, ok } = await requireEditor();
  if (!ok || !user) {
    return { success: false, message: "Apenas editores podem fazer isso." };
  }

  const { error } = await supabase.from("articles").insert({
    slug: parsed.data.slug,
    title: parsed.data.title,
    summary: parsed.data.summary,
    content: parsed.data.content,
    tags: parseTags(parsed.data.tags),
    author_name: parsed.data.authorName,
    cover_image_url: parsed.data.coverImageUrl || null,
    published_at: parsed.data.publishedAt,
    created_by: user.id,
  });

  if (error) {
    return {
      success: false,
      message:
        error.code === "23505"
          ? "Já existe um artigo com esse slug."
          : "Não foi possível criar o artigo.",
    };
  }

  revalidateArticlePaths(parsed.data.slug);
  return { success: true };
}

export async function updateArticle(
  originalSlug: string,
  input: ArticleFormInput
): Promise<AdminActionResult> {
  const parsed = articleFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Verifique os campos e tente novamente." };
  }

  const { supabase, ok } = await requireEditor();
  if (!ok) {
    return { success: false, message: "Apenas editores podem fazer isso." };
  }

  const { error } = await supabase
    .from("articles")
    .update({
      slug: parsed.data.slug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      content: parsed.data.content,
      tags: parseTags(parsed.data.tags),
      author_name: parsed.data.authorName,
      cover_image_url: parsed.data.coverImageUrl || null,
      published_at: parsed.data.publishedAt,
    })
    .eq("slug", originalSlug);

  if (error) {
    return {
      success: false,
      message:
        error.code === "23505"
          ? "Já existe um artigo com esse slug."
          : "Não foi possível salvar o artigo.",
    };
  }

  revalidateArticlePaths(originalSlug);
  revalidateArticlePaths(parsed.data.slug);
  return { success: true };
}

export async function deleteArticle(slug: string): Promise<AdminActionResult> {
  const { supabase, ok } = await requireEditor();
  if (!ok) {
    return { success: false, message: "Apenas editores podem fazer isso." };
  }

  const { error } = await supabase.from("articles").delete().eq("slug", slug);

  if (error) {
    return { success: false, message: "Não foi possível excluir o artigo." };
  }

  revalidateArticlePaths(slug);
  return { success: true };
}

export async function setFeatured(
  slug: string,
  featured: boolean,
  position: number
): Promise<AdminActionResult> {
  const { supabase, ok } = await requireEditor();
  if (!ok) {
    return { success: false, message: "Apenas editores podem fazer isso." };
  }

  const { error } = await supabase
    .from("articles")
    .update({ featured, featured_position: position })
    .eq("slug", slug);

  if (error) {
    return { success: false, message: "Não foi possível salvar." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function setEditorStatus(
  targetUserId: string,
  newIsEditor: boolean
): Promise<AdminActionResult> {
  const { supabase, ok } = await requireEditor();
  if (!ok) {
    return { success: false, message: "Apenas editores podem fazer isso." };
  }

  const { error } = await supabase.rpc("admin_set_editor", {
    target_user_id: targetUserId,
    new_is_editor: newIsEditor,
  });

  if (error) {
    return { success: false, message: "Não foi possível atualizar o usuário." };
  }

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function updateFeaturedPosition(
  slug: string,
  position: number
): Promise<AdminActionResult> {
  const { supabase, ok } = await requireEditor();
  if (!ok) {
    return { success: false, message: "Apenas editores podem fazer isso." };
  }

  const { error } = await supabase
    .from("articles")
    .update({ featured_position: position })
    .eq("slug", slug);

  if (error) {
    return { success: false, message: "Não foi possível salvar." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}
