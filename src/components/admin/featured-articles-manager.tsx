"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagBadge } from "@/components/articles/tag-badge";
import { setFeatured, updateFeaturedPosition } from "@/lib/actions/admin";
import type { ArticleMeta } from "@/lib/queries/articles";

type FeaturedState = Record<string, number>;

export function FeaturedArticlesManager({
  articles,
  initialFeatured,
}: {
  articles: ArticleMeta[];
  initialFeatured: FeaturedState;
}) {
  const [featured, setFeaturedState] = useState<FeaturedState>(initialFeatured);
  const [isPending, startTransition] = useTransition();

  function handleToggle(slug: string) {
    const isFeatured = slug in featured;
    const nextPosition = isFeatured
      ? 0
      : Object.keys(featured).length
        ? Math.max(...Object.values(featured)) + 1
        : 0;

    setFeaturedState((prev) => {
      const next = { ...prev };
      if (isFeatured) delete next[slug];
      else next[slug] = nextPosition;
      return next;
    });

    startTransition(async () => {
      const result = await setFeatured(slug, !isFeatured, nextPosition);
      if (!result.success) toast.error(result.message);
    });
  }

  function handlePositionChange(slug: string, value: string) {
    const position = Number(value);
    if (Number.isNaN(position)) return;

    setFeaturedState((prev) => ({ ...prev, [slug]: position }));
    startTransition(async () => {
      const result = await updateFeaturedPosition(slug, position);
      if (!result.success) toast.error(result.message);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {articles.map((article) => {
        const isFeatured = article.slug in featured;
        return (
          <div
            key={article.slug}
            className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-1">
              <Link
                href={`/admin/artigos/${article.slug}`}
                className="font-medium hover:text-primary hover:underline"
              >
                {article.title}
              </Link>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.slice(0, 3).map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isFeatured && (
                <Input
                  type="number"
                  className="w-20"
                  aria-label={`Posição de destaque para ${article.title}`}
                  value={featured[article.slug]}
                  onChange={(event) =>
                    handlePositionChange(article.slug, event.target.value)
                  }
                />
              )}
              <Button
                type="button"
                variant={isFeatured ? "outline" : "default"}
                size="sm"
                disabled={isPending}
                onClick={() => handleToggle(article.slug)}
              >
                {isFeatured ? "Remover destaque" : "Destacar"}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
