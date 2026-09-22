import Link from "next/link";
import { ArticleCard } from "@/components/articles/article-card";
import { ArticleCover } from "@/components/articles/article-cover";
import { TagBadge } from "@/components/articles/tag-badge";
import { ArticleMeta } from "@/components/articles/article-meta";
import {
  getAllTags,
  getFeaturedArticlesForHome,
  getRecentArticles,
} from "@/lib/queries/articles";

export default async function Home() {
  const [featured, allRecent, allTags] = await Promise.all([
    getFeaturedArticlesForHome(),
    getRecentArticles(),
    getAllTags(),
  ]);
  const [hero, ...restFeatured] = featured;
  const recent = allRecent.filter((article) => article.slug !== hero?.slug);
  const tags = allTags.slice(0, 10);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {hero && (
        <section aria-labelledby="destaque-principal" className="mb-14">
          <h2 id="destaque-principal" className="sr-only">
            Destaque principal
          </h2>
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <Link
              href={`/artigos/${hero.slug}`}
              className="group -rotate-2 rounded-sm border-8 border-photo-border p-0 shadow-lg transition-transform hover:rotate-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ArticleCover
                slug={hero.slug}
                src={hero.coverImageUrl}
                alt={hero.title}
                className="aspect-[4/3] md:aspect-square"
              />
            </Link>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                {hero.tags.slice(0, 3).map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
              <h1 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl">
                <Link
                  href={`/artigos/${hero.slug}`}
                  className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {hero.title}
                </Link>
              </h1>
              <p className="text-muted-foreground">{hero.summary}</p>
              <ArticleMeta
                authorName={hero.authorName}
                publishedAt={hero.publishedAt}
                readingTimeMinutes={hero.readingTimeMinutes}
              />
            </div>
          </div>
        </section>
      )}

      {restFeatured.length > 0 && (
        <section aria-labelledby="destaques" className="mb-14">
          <h2 id="destaques" className="mb-5 font-heading text-3xl tracking-tight">
            Também em destaque
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {restFeatured.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {tags.length > 0 && (
        <section aria-labelledby="tags-em-alta" className="mb-14">
          <h2
            id="tags-em-alta"
            className="mb-4 font-heading text-3xl tracking-tight"
          >
            Explorar por tag
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag }) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="recentes">
        <h2 id="recentes" className="mb-5 font-heading text-3xl tracking-tight">
          Publicações recentes
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
