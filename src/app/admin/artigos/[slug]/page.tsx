import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { getArticleBySlug } from "@/lib/queries/articles";

export async function generateMetadata(
  props: PageProps<"/admin/artigos/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  return { title: article ? `Editar: ${article.title}` : "Artigo não encontrado" };
}

export default async function EditarArtigoPage(
  props: PageProps<"/admin/artigos/[slug]">
) {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <div>
      <AdminBreadcrumb
        items={[{ label: "Artigos", href: "/admin/artigos" }, { label: article.title }]}
      />
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Editar artigo</h1>
      <ArticleForm
        mode="edit"
        originalSlug={article.slug}
        defaultValues={{
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          content: article.content,
          tags: article.tags.join(", "),
          authorName: article.authorName,
          coverImageUrl: article.coverImageUrl ?? "",
          publishedAt: article.publishedAt,
        }}
      />
    </div>
  );
}
