import type { MetadataRoute } from "next";
import { getAllArticles, getAllTags } from "@/lib/queries/articles";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const [articles, tags] = await Promise.all([getAllArticles(), getAllTags()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/tags`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/busca`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/sobre`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/contato`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/artigos/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map(({ tag }) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...articleRoutes, ...tagRoutes];
}
