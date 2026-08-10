import { createClient } from "@/lib/supabase/server";

export type ReactionSummary = {
  emoji: string;
  count: number;
  reactedByMe: boolean;
};

export function summarizeReactions(
  rows: { emoji: string; user_id: string }[],
  currentUserId: string | null
): ReactionSummary[] {
  const map = new Map<string, ReactionSummary>();

  for (const row of rows) {
    const entry = map.get(row.emoji) ?? { emoji: row.emoji, count: 0, reactedByMe: false };
    entry.count += 1;
    if (currentUserId && row.user_id === currentUserId) entry.reactedByMe = true;
    map.set(row.emoji, entry);
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export async function getArticleReactions(
  articleSlug: string,
  currentUserId: string | null
): Promise<ReactionSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("article_reactions")
    .select("emoji, user_id")
    .eq("article_slug", articleSlug);

  return summarizeReactions(data ?? [], currentUserId);
}
