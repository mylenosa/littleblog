import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleCover } from "@/components/articles/article-cover";
import { ArticleMeta } from "@/components/articles/article-meta";
import { TagBadge } from "@/components/articles/tag-badge";
import { ArticleCard } from "@/components/articles/article-card";
import { MdxContent } from "@/components/articles/mdx-content";
import { FavoriteButton } from "@/components/articles/favorite-button";
import { ArticleReactions } from "@/components/articles/article-reactions";
import { CommentThread } from "@/components/comments/comment-thread";
import { getArticleBySlug, getRelatedArticles } from "@/lib/queries/articles";
import { getArticleReactions } from "@/lib/queries/reactions";
import { getAuthState } from "@/lib/supabase/auth-state";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(
  props: PageProps<"/artigos/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);

  if (!article) return {};

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.summary,
      publishedTime: article.publishedAt,
      authors: [article.authorName],
      tags: article.tags,
      images: article.coverImageUrl ? [article.coverImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: article.coverImageUrl ? [article.coverImageUrl] : undefined,
    },
  };
}

export default async function ArticlePage(
  props: PageProps<"/artigos/[slug]">
) {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const related = await getRelatedArticles(slug);
  const { user, profile } = await getAuthState();

  const supabase = await createClient();
  await supabase.rpc("increment_article_views", { article_slug_input: slug });
  const articleReactions = await getArticleReactions(slug, user?.id ?? null);

  let isFavorited = false;
  if (user) {
    const { data } = await supabase
      .from("favorites")
      .select("article_slug")
      .eq("user_id", user.id)
      .eq("article_slug", slug)
      .maybeSingle();
    isFavorited = !!data;
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          {profile?.isEditor && (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href={`/admin/artigos/${article.slug}`} />}
            >
              <Pencil /> Editar artigo
            </Button>
          )}
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {article.title}
        </h1>
        <p className="text-lg text-muted-foreground">{article.summary}</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ArticleMeta
            authorName={article.authorName}
            publishedAt={article.publishedAt}
            readingTimeMinutes={article.readingTimeMinutes}
            viewCount={article.viewCount + 1}
          />
          <FavoriteButton
            articleSlug={article.slug}
            initialFavorited={isFavorited}
            isLoggedIn={!!user}
          />
        </div>
      </header>

      <ArticleCover
        slug={article.slug}
        src={article.coverImageUrl}
        alt={article.title}
        className="mb-10"
      />

      <MdxContent source={article.content} />

      <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
        <span className="text-sm font-medium text-muted-foreground">Reagir:</span>
        <ArticleReactions
          articleSlug={article.slug}
          initialReactions={articleReactions}
          isLoggedIn={!!user}
        />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mt-16 border-t border-border pt-10">
          <h2 id="relacionados" className="mb-5 text-lg font-semibold tracking-tight">
            Você também pode gostar
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.slug} article={relatedArticle} />
            ))}
          </div>
        </section>
      )}

      <CommentThread articleSlug={article.slug} />
    </article>
  );
}
