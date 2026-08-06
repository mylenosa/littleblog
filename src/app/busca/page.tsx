import type { Metadata } from "next";
import { SearchResults } from "@/components/search/search-results";
import { getAllArticles } from "@/lib/mdx/articles";

export const metadata: Metadata = {
  title: "Busca",
  description: "Busque artigos por título, resumo ou tag.",
};

export default async function BuscaPage(props: PageProps<"/busca">) {
  const searchParams = await props.searchParams;
  const initialQuery =
    typeof searchParams.q === "string" ? searchParams.q : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Busca</h1>
      <SearchResults articles={getAllArticles()} initialQuery={initialQuery} />
    </div>
  );
}
