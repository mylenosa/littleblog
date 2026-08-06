import { createClient } from "@/lib/supabase/server";

export type CommentNode = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string;
  replies: CommentNode[];
};

export async function getCommentsForArticle(
  articleSlug: string
): Promise<CommentNode[]> {
  const supabase = await createClient();

  const { data: comments } = await supabase
    .from("comments")
    .select("id, content, created_at, updated_at, user_id, parent_id")
    .eq("article_slug", articleSlug)
    .order("created_at", { ascending: true });

  if (!comments || comments.length === 0) return [];

  const userIds = Array.from(new Set(comments.map((c) => c.user_id)));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  const nameByUserId = new Map(
    (profiles ?? []).map((p) => [p.id, p.full_name || "Usuário"])
  );

  const nodeById = new Map<string, CommentNode>();
  for (const comment of comments) {
    nodeById.set(comment.id, {
      id: comment.id,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      userId: comment.user_id,
      authorName: nameByUserId.get(comment.user_id) ?? "Usuário",
      replies: [],
    });
  }

  const roots: CommentNode[] = [];
  for (const comment of comments) {
    const node = nodeById.get(comment.id)!;
    if (comment.parent_id && nodeById.has(comment.parent_id)) {
      nodeById.get(comment.parent_id)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
