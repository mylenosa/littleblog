"use client";

import { ReactionBar } from "@/components/common/reaction-bar";
import { toggleArticleReaction } from "@/lib/actions/reactions";
import type { ReactionSummary } from "@/lib/queries/reactions";

export function ArticleReactions({
  articleSlug,
  initialReactions,
  isLoggedIn,
}: {
  articleSlug: string;
  initialReactions: ReactionSummary[];
  isLoggedIn: boolean;
}) {
  return (
    <ReactionBar
      initialReactions={initialReactions}
      isLoggedIn={isLoggedIn}
      onToggle={(emoji) => toggleArticleReaction({ articleSlug, emoji })}
      size="default"
    />
  );
}
