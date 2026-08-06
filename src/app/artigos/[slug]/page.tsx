import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCover } from "@/components/articles/article-cover";
import { ArticleMeta } from "@/components/articles/article-meta";
import { TagBadge } from "@/components/articles/tag-badge";
import { ArticleCard } from "@/components/articles/article-card";
import { MdxContent } from "@/components/articles/mdx-content";
import {
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "@/lib/mdx/articles";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/artigos/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticleBySlug(slug);

  if (!article) return {};

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function ArticlePage(
  props: PageProps<"/artigos/[slug]">
) {
  const { slug } = await props.params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const related = getRelatedArticles(slug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {article.title}
        </h1>
        <p className="text-lg text-muted-foreground">{article.summary}</p>
        <ArticleMeta
          author={article.author}
          publishedAt={article.publishedAt}
          readingTimeMinutes={article.readingTimeMinutes}
        />
      </header>

      <ArticleCover slug={article.slug} className="mb-10" />

      <MdxContent source={article.content} />

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
    </article>
  );
}
