import { createClient } from "@/lib/supabase/server";

const WORDS_PER_MINUTE = 200;

export type ArticleMeta = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  authorName: string;
  coverImageUrl: string | null;
  publishedAt: string;
  featured: boolean;
  featuredPosition: number;
  readingTimeMinutes: number;
};

export type Article = ArticleMeta & {
  content: string;
};

type ArticleRow = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  author_name: string;
  cover_image_url: string | null;
  published_at: string;
  featured: boolean;
  featured_position: number;
};

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function toArticle(row: ArticleRow): Article {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    tags: row.tags,
    authorName: row.author_name,
    coverImageUrl: row.cover_image_url,
    publishedAt: row.published_at.slice(0, 10),
    featured: row.featured,
    featuredPosition: row.featured_position,
    readingTimeMinutes: readingTime(row.content),
  };
}

export async function getAllArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(
      "slug, title, summary, content, tags, author_name, cover_image_url, published_at, featured, featured_position"
    )
    .order("published_at", { ascending: false });

  return (data ?? []).map(toArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(
      "slug, title, summary, content, tags, author_name, cover_image_url, published_at, featured, featured_position"
    )
    .eq("slug", slug)
    .maybeSingle();

  return data ? toArticle(data) : undefined;
}

export async function getFeaturedArticlesForHome(): Promise<ArticleMeta[]> {
  const articles = await getAllArticles();
  return articles
    .filter((article) => article.featured)
    .sort((a, b) => a.featuredPosition - b.featuredPosition);
}

export async function getRecentArticles(limit?: number): Promise<ArticleMeta[]> {
  const articles = await getAllArticles();
  return typeof limit === "number" ? articles.slice(0, limit) : articles;
}

export async function getRelatedArticles(
  slug: string,
  limit = 3
): Promise<ArticleMeta[]> {
  const articles = await getAllArticles();
  const current = articles.find((article) => article.slug === slug);
  if (!current) return [];

  return articles
    .filter((article) => article.slug !== slug)
    .map((article) => ({
      article,
      sharedTags: article.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .filter(({ sharedTags }) => sharedTags > 0)
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .slice(0, limit)
    .map(({ article }) => article);
}

export type TagCount = { tag: string; count: number };

export async function getAllTags(): Promise<TagCount[]> {
  const articles = await getAllArticles();
  const counts = new Map<string, number>();

  for (const article of articles) {
    for (const tag of article.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getArticlesByTag(tag: string): Promise<ArticleMeta[]> {
  const articles = await getAllArticles();
  return articles.filter((article) => article.tags.includes(tag));
}
