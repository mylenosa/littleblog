import type { Metadata } from "next";
import { ArticleCard } from "@/components/articles/article-card";
import { FavoriteButton } from "@/components/articles/favorite-button";
import { getArticleBySlug } from "@/lib/queries/articles";
import { createClient } from "@/lib/supabase/server";
import { getAuthState } from "@/lib/supabase/auth-state";

export const metadata: Metadata = {
  title: "Favoritos",
};

export default async function FavoritosPage() {
  const { user } = await getAuthState();
  const supabase = await createClient();

  const { data: favorites } = await supabase
    .from("favorites")
    .select("article_slug")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const articles = (
    await Promise.all(
      (favorites ?? []).map((f) => getArticleBySlug(f.article_slug))
    )
  ).filter((article) => !!article);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Favoritos</h1>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">
          Você ainda não favoritou nenhum artigo.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {articles.map((article) => (
            <div key={article.slug} className="flex flex-col gap-3">
              <ArticleCard article={article} />
              <FavoriteButton
                articleSlug={article.slug}
                initialFavorited
                isLoggedIn
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
