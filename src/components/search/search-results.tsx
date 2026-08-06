"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ArticleCard } from "@/components/articles/article-card";
import type { ArticleMeta } from "@/lib/mdx/articles";
import { normalizeText } from "@/lib/normalize-text";

export function SearchResults({
  articles,
  initialQuery,
}: {
  articles: ArticleMeta[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const [, startTransition] = useTransition();

  const results = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    if (!normalizedQuery) return articles;

    return articles.filter((article) => {
      const haystack = normalizeText(
        [article.title, article.summary, ...article.tags].join(" ")
      );
      return haystack.includes(normalizedQuery);
    });
  }, [articles, query]);

  function handleChange(value: string) {
    setQuery(value);
    startTransition(() => {
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value);
      router.replace(`/busca${params.toString() ? `?${params}` : ""}`, {
        scroll: false,
      });
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="relative max-w-lg">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="Buscar por título, resumo ou tag..."
          aria-label="Buscar artigos"
          className="pl-9"
        />
      </div>

      <p className="text-sm text-muted-foreground" role="status">
        {results.length === 0
          ? "Nenhum artigo encontrado."
          : `${results.length} artigo${results.length === 1 ? "" : "s"} encontrado${
              results.length === 1 ? "" : "s"
            }.`}
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
