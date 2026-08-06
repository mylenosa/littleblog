import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getAllTags } from "@/lib/queries/articles";

export const metadata: Metadata = {
  title: "Tags",
  description: "Explore os artigos do blog por tag.",
};

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Tags</h1>
      <p className="mb-8 text-muted-foreground">
        Navegue pelo conteúdo do blog a partir de artistas, gêneros e temas.
      </p>

      <ul className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 text-sm font-normal text-foreground hover:border-primary hover:text-primary"
              render={<Link href={`/tags/${encodeURIComponent(tag)}`} />}
            >
              #{tag}
              <span className="text-muted-foreground">{count}</span>
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
