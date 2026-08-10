import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedArticlesManager } from "@/components/admin/featured-articles-manager";
import { getAllArticles } from "@/lib/queries/articles";

export const metadata: Metadata = {
  title: "Artigos",
};

export default async function AdminArtigosPage() {
  const articles = await getAllArticles();

  const initialFeatured = Object.fromEntries(
    articles
      .filter((article) => article.featured)
      .map((article) => [article.slug, article.featuredPosition])
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Artigos</h1>
          <p className="text-muted-foreground">
            Gerencie artigos e escolha os destaques da home.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/artigos/novo" />}>
          Novo artigo
        </Button>
      </div>

      <FeaturedArticlesManager articles={articles} initialFeatured={initialFeatured} />
    </div>
  );
}
