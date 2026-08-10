"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { SmilePlus } from "lucide-react";
import { EmojiPicker } from "@/components/comments/emoji-picker";
import type { ReactionSummary } from "@/lib/queries/reactions";
import type { ReactionActionResult } from "@/lib/actions/reactions";

export function ReactionBar({
  initialReactions,
  isLoggedIn,
  onToggle,
  size = "sm",
}: {
  initialReactions: ReactionSummary[];
  isLoggedIn: boolean;
  onToggle: (emoji: string) => Promise<ReactionActionResult>;
  size?: "sm" | "default";
}) {
  const [reactions, setReactions] = useState(initialReactions);
  const [isPending, startTransition] = useTransition();

  function applyToggle(emoji: string) {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        if (existing.reactedByMe) {
          const count = existing.count - 1;
          return count > 0
            ? prev.map((r) => (r.emoji === emoji ? { ...r, count, reactedByMe: false } : r))
            : prev.filter((r) => r.emoji !== emoji);
        }
        return prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1, reactedByMe: true } : r
        );
      }
      return [...prev, { emoji, count: 1, reactedByMe: true }];
    });
  }

  function handleToggle(emoji: string) {
    if (!isLoggedIn) {
      toast.error("Faça login para reagir.");
      return;
    }

    applyToggle(emoji);
    startTransition(async () => {
      const result = await onToggle(emoji);
      if (!result.success) {
        applyToggle(emoji);
        toast.error(result.message);
      }
    });
  }

  const chipPadding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          type="button"
          disabled={isPending}
          onClick={() => handleToggle(reaction.emoji)}
          aria-pressed={reaction.reactedByMe}
          aria-label={`Reagir com ${reaction.emoji}, ${reaction.count} ${
            reaction.count === 1 ? "pessoa reagiu" : "pessoas reagiram"
          }`}
          className={`inline-flex items-center gap-1 rounded-full border transition-colors ${chipPadding} ${
            reaction.reactedByMe
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          <span aria-hidden="true">{reaction.emoji}</span>
          <span aria-hidden="true">{reaction.count}</span>
        </button>
      ))}
      <EmojiPicker
        onSelect={handleToggle}
        label="Adicionar reação"
        variant="ghost"
        size="icon-xs"
        className="rounded-full border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary"
      >
        <SmilePlus />
      </EmojiPicker>
    </div>
  );
}
