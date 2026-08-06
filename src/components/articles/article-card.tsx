import Link from "next/link";
import type { ArticleMeta as ArticleMetaType } from "@/lib/queries/articles";
import { ArticleCover } from "@/components/articles/article-cover";
import { TagBadge } from "@/components/articles/tag-badge";
import { ArticleMeta } from "@/components/articles/article-meta";

export function ArticleCard({ article }: { article: ArticleMetaType }) {
  return (
    <article className="group flex flex-col gap-3">
      <Link
        href={`/artigos/${article.slug}`}
        className="rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArticleCover
          slug={article.slug}
          src={article.coverImageUrl}
          alt={article.title}
        />
      </Link>

      <div className="flex flex-wrap gap-1.5">
        {article.tags.slice(0, 2).map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      <h3 className="text-lg font-semibold leading-snug tracking-tight">
        <Link
          href={`/artigos/${article.slug}`}
          className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {article.title}
        </Link>
      </h3>

      <p className="line-clamp-2 text-sm text-muted-foreground">
        {article.summary}
      </p>

      <ArticleMeta
        authorName={article.authorName}
        publishedAt={article.publishedAt}
        readingTimeMinutes={article.readingTimeMinutes}
      />
    </article>
  );
}
