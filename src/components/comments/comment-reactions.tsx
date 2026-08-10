"use client";

import { ReactionBar } from "@/components/common/reaction-bar";
import { toggleCommentReaction } from "@/lib/actions/reactions";
import type { ReactionSummary } from "@/lib/queries/reactions";

export function CommentReactions({
  commentId,
  articleSlug,
  initialReactions,
  isLoggedIn,
}: {
  commentId: string;
  articleSlug: string;
  initialReactions: ReactionSummary[];
  isLoggedIn: boolean;
}) {
  return (
    <ReactionBar
      initialReactions={initialReactions}
      isLoggedIn={isLoggedIn}
      onToggle={(emoji) => toggleCommentReaction({ commentId, articleSlug, emoji })}
    />
  );
}
