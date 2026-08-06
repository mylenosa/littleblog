import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import { getArticlesByTag } from "@/lib/queries/articles";

export async function generateMetadata(
  props: PageProps<"/tags/[tag]">
): Promise<Metadata> {
  const { tag } = await props.params;
  return { title: `#${decodeURIComponent(tag)}` };
}

export default async function TagPage(props: PageProps<"/tags/[tag]">) {
  const { tag: rawTag } = await props.params;
  const tag = decodeURIComponent(rawTag);
  const articles = await getArticlesByTag(tag);

  if (articles.length === 0) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">#{tag}</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
