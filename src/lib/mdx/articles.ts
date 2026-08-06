import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  articleFrontmatterSchema,
  type ArticleFrontmatter,
} from "@/lib/validations/article.schema";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const WORDS_PER_MINUTE = 200;

export type ArticleMeta = ArticleFrontmatter & {
  slug: string;
  readingTimeMinutes: number;
};

export type Article = ArticleMeta & {
  content: string;
};

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function parseArticleFile(filename: string): Article {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const frontmatter = articleFrontmatterSchema.parse(data);

  return {
    ...frontmatter,
    slug,
    content,
    readingTimeMinutes: readingTime(content),
  };
}

let cache: Article[] | null = null;

function getAllArticlesInternal(): Article[] {
  if (cache) return cache;

  const filenames = fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".mdx"));

  const articles = filenames
    .map(parseArticleFile)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  cache = articles;
  return articles;
}

export function getAllArticles(): ArticleMeta[] {
  return getAllArticlesInternal().map(({ content: _content, ...meta }) => meta);
}

export function getArticleSlugs(): string[] {
  return getAllArticlesInternal().map((article) => article.slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticlesInternal().find((article) => article.slug === slug);
}

export function getFeaturedArticles(): ArticleMeta[] {
  return getAllArticles().filter((article) => article.featured);
}

export function getRecentArticles(limit?: number): ArticleMeta[] {
  const articles = getAllArticles();
  return typeof limit === "number" ? articles.slice(0, limit) : articles;
}

export function getRelatedArticles(slug: string, limit = 3): ArticleMeta[] {
  const current = getArticleBySlug(slug);
  if (!current) return [];

  return getAllArticles()
    .filter((article) => article.slug !== slug)
    .map((article) => ({
      article,
      sharedTags: article.tags.filter((tag) => current.tags.includes(tag))
        .length,
    }))
    .filter(({ sharedTags }) => sharedTags > 0)
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .slice(0, limit)
    .map(({ article }) => article);
}

export type TagCount = { tag: string; count: number };

export function getAllTags(): TagCount[] {
  const counts = new Map<string, number>();

  for (const article of getAllArticlesInternal()) {
    for (const tag of article.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getArticlesByTag(tag: string): ArticleMeta[] {
  return getAllArticles().filter((article) => article.tags.includes(tag));
}
